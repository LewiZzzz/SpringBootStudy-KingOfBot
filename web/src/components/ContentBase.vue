<template>
    <div class="content-base">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ContentBase',
}
</script>

<style scoped>
.content-base {
    padding: 20px;
    margin: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    height: 80vh;
}
</style>
