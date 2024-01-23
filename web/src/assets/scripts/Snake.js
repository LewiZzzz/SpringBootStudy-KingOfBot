import { GameObject } from "./GameObject";
import { Cell } from './Cell'

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();
        
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        this.cells = [new Cell(info.r, info.c)];  // 存放蛇的身体，cells[0]存放蛇头
        this.next_cell = null; //下一步的目标
        
        this.speed = 5; //蛇每秒钟走5个格子
        this.direction = -1; // -1表示没有指令，0、1、2、3表示上、右、下、左
        this.status = "idle"; //idle表示静止, move表示正在移动, die表示死亡

        this.dr = [-1, 0, 1, 0]; // 4个方向行的偏移量
        this.dc = [0, 1, 0, -1]; // 4个方向列的偏移量

        this.round = 0; //表示回合数
        this.eps = 1e-2;

        this.deathProgress = 0; // 用于跟踪死亡动画的进展
        this.particles = []; // 存放粒子
        this.isDissolved = false; // 标志蛇体是否已经解体
        this.particlesGenerated = false; // 初始化粒子生成标志

        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;

        //蛇眼睛不同方向的x的偏移量
        this.eye_dx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];

        //蛇眼睛不同方向的y的偏移量
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [-1, 1],
        ];
    }

    start() { 

    }

    set_direction(d) { // 设置蛇的移动方向，-1表示没有指令，0、1、2、3表示上、右、下、左
        this.direction = d;
    }

    check_tail_increasing() {
        // 检测当前回合，蛇的长度是否应该增加
        if (this.round <= 10) return true;
        if (this.round % 3 === 1) return true;
        return false;
    }


    next_step() {
        // 将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d;
        this.direction = -1; // 清空操作
        this.status = "move";
        this.round++; 

        const k = this.cells.length;
        for (let i = k; i > 0; i--) {
            // 深层复制
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        if (!this.gamemap.check_valid(this.next_cell)) {
            this.status = "die"; // 蛇撞墙，死亡
        }
     }

    update_move() { 
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.eps) {
            this.cells[0] = this.next_cell; // 添加一个新蛇头
            this.next_cell = null;
            this.status = "idle"; //走完了，停下来

            if (!this.check_tail_increasing()) this.cells.pop(); // 蛇的长度不应该增加
        }
        else {
            const move_distance = this.speed * this.timedelta / 1000; // 计算蛇移动的距离，根据速度和时间差来计算，
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;         
            if (!this.check_tail_increasing()) {
                const tailIndex = this.cells.length - 1;
                const tail = this.cells[tailIndex];
                const tail_target = this.cells[tailIndex - 1];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y; // 计算尾巴的目标位置，并移动尾巴
                tail.x += tail_dx * move_distance / distance;
                tail.y += tail_dy * move_distance / distance;
            }
        }
    }

    update() {
        // 每一帧执行一次
        
        // 更新蛇的移动
        if (this.status === 'move') this.update_move();
        this.render();
       
        if (this.status === 'die') {
            this.update_death_animation();
        }
    }

    update_death_animation() {
        // 死亡动画更新
        if (this.deathProgress < 1) {
            // 颜色渐变
            this.deathProgress += 0.01; // 根据需要调整死亡延迟
        } else if (!this.particlesGenerated) {
            // 第一次粒子效果
            this.generate_particles();
            this.particlesGenerated = true; // 添加一个标志来表示粒子已生成
        }
        this.update_particles();

        if (this.particles.length === 0 && this.deathProgress >= 1) {
            this.isDissolved = true; // 当所有粒子都消失时，设置蛇体为已解体
        }
    }

    

    generate_particles() {
        // 生成粒子
        if (this.particles.length === 0) {
            for (let i = 0; i < 100; i++) { // 生成100个粒子
                this.particles.push({
                    x: this.cells[0].x,
                    y: this.cells[0].y,
                    dx: (Math.random() - 0.5) * 2 / this.gamemap.L, // 随机方向
                    dy: (Math.random() - 0.5) * 2 / this.gamemap.L, // 随机方向
                    size: 0.1 * this.gamemap.L,
                    life: 1, // 初始生命值
                    color: this.color,
                });
            }
        }
    }

    update_particles() {
        // 更新粒子位置和生命值
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.01; // 根据需要调整这个值 这是粒子最后湮灭的速度

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
       

        const L = this.gamemap.L;
        const alpha = 0.8;
        const snake_L = L * alpha;
        const delta_L = (1 - alpha) / 2;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;

         // 绘制粒子
        for (let p of this.particles) {
            this.gamemap.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.life})`; // 使用蛇的颜色来绘制粒子
            this.gamemap.ctx.beginPath();
            this.gamemap.ctx.arc(p.x * this.gamemap.L, p.y * this.gamemap.L, p.size, 0, Math.PI * 2);
            this.gamemap.ctx.fill();
        }
        if (this.isDissolved) return; // 如果蛇体已解体，则不再渲染

        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L , cell.y * L, snake_L / 2, 0, Math.PI * 2);
            ctx.fill();
        } 

        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.5 + delta_L) * L, Math.min(a.y, b.y) * L, snake_L, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5 + delta_L) * L, Math.abs(a.x - b.x) * L, snake_L);
            }
        }

        //绘制眼睛
        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i++) { 
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.25) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.25) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.075, 0, Math.PI * 2);
            ctx.fill();
        }

    }

    hexToRgb(hex) {
    // 将十六进制颜色转换为RGB格式
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);

    return `${r}, ${g}, ${b}`;
    }
}