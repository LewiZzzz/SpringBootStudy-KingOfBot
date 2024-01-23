import { GameObject } from "./GameObject";
import { Wall } from './Wall';
import { Snake } from "./Snake";

export class GameMap extends GameObject { 
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent; // 父元素，通常是 HTML 中的 canvas 元素
        this.L = 0;

        this.rows = 13;
        this.cols = 14;

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#A63B00", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#00A0C9", r: 1, c: this.cols - 2}, this),
        ]
    }

    check_connectivity(g, sx, st, tx, ty) {
        // 检查地图的连通性
        // 使用Floyd算法实现
        if (sx === tx && st === ty) return true;
        g[tx][ty] = true;
        
        let dx = [-1, 0, 1, 0];
        let dy = [0, -1, 0, 1];

        for (let i = 0; i < 4; i++) {
            let x = tx + dx[i];
            let y = ty + dy[i];
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && g[x][y] === false) {
                if (this.check_connectivity(g, sx, st, x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    check_valid(cell) {
        //检测目标位置是否合法：蛇的下一个目标不是两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) { // 当蛇尾会前进时，蛇尾不要判断
                k--;
            }

            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
        }

        return true;
    }

    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r++) {
            g[r] = [];
            for (let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r++) {
            g[r][0] = true;
            g[r][this.cols - 1] = true;
        }

        for (let c = 0; c < this.cols; c++) {
            g[0][c] = true;
            g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for (let i = 0; i < this.inner_walls_count; i++) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);
            if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c] ||  r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) {
                i--;
                continue;
            }
            g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
        }

        // 保证从起点到终点是连通的
        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;

        // 渲染墙体
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    let wall = new Wall(r, c, this);
                    this.walls.push(wall);
                }
            }
        }

        return true;
    }

    add_listening_events() {
        this.ctx.canvas.focus(); // 使canvas获得焦点，以便能够接收到键盘事件。
        
        // 监听键盘按下事件
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", function (e) {
            if (e.key === "w") { // 用户按下了w键，则将蛇0的指令设为向上
                console.log('按下w');
                snake0.set_direction(0);
            }
            else if (e.key === 'd') {
                snake0.set_direction(1);
            }
            else if (e.key === 's') {
                snake0.set_direction(2);
            }
            else if (e.key === 'a') {
                snake0.set_direction(3);
            }
            else if (e.key === 'ArrowUp') { // 用户按下了上方向键
                snake1.set_direction(0);
            }
            else if (e.key === 'ArrowRight') {
                snake1.set_direction(1);
            }
            else if (e.key === 'ArrowDown') {
                snake1.set_direction(2);
            }
            else if (e.key === 'ArrowLeft') {
                snake1.set_direction(3);
            }
        });
    }

    start() {
        for (let i = 0; i < 1000; i++) {
            if (this.create_walls()) break;
        }

        console.log('开始监听');
        this.add_listening_events();
    }


    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {
        // 判断两条蛇是否都准备好下一回合了
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;                                                                                                             
    }

    next_step() { 
        // 让两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        // 绘制游戏地图的逻辑
        const color_even = "#59C8CE", color_odd = "#BEFCFF";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 === 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}