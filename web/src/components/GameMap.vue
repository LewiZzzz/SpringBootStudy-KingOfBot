<template>
  <div ref="parent" class="gamemap">
    <div style="margin-right: 60px">player1</div>
    <canvas ref="canvas" tabindex="0"></canvas>
    <div style="margin-left: 60px">player2</div>
  </div>
</template>

<script>
import { GameMap } from '@/assets/scripts/GameMap'
import { ref, onMounted } from 'vue'

export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'), parent.value);
        });

        return {
            parent,
            canvas,
        }
    },
}
</script>

<style>
div.gamemap { 
    width: 100%; 
    height: 100%; 
    display: flex;
    justify-content: center;
    align-items: center;
}

.player-canvas {
  width: 150px; /* 或根据需要调整 */
  height: 100px; /* 或根据需要调整 */
}
</style>