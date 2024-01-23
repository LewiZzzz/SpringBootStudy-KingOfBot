const GAME_OBJECTS = [];

export class GameObject  {
    constructor() {
        GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0;
    }

    start() {

    }

    update() {
        // 每帧执行一次，除了第一帧
    }

    on_destroy() { 
        // 删除之前执行
    }

    destroy() {
        this.on_destroy();
        const index = GAME_OBJECTS.indexOf(this);
        if (index > -1) {
            GAME_OBJECTS.splice(index, 1);
        }
    }
}



let last_timestamp; //上一次执行的时刻

const step = timestamp => {
    GAME_OBJECTS.forEach(obj => {
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
        
        
    });
    last_timestamp = timestamp;
    requestAnimationFrame(step)
}

requestAnimationFrame(step)