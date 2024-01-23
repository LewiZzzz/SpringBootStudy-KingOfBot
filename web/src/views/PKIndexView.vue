<template>
    <ContentBase>
        <div class="align-center">
            <h1>对战平台</h1>
            <PlayGround></PlayGround>
        </div>
    </ContentBase>
</template>

<script>
import ContentBase from '@/components/ContentBase.vue';
import PlayGround from '@/components/PlayGround'

export default {
    name: 'PKIndexView',
    components: {
        ContentBase,
        PlayGround,
    },
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
    },
    computed: {
    },
    watch: {
    },
}

</script>

<style scoped></style>

