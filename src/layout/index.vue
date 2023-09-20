<template>
    <div style="height: 100%;">
        <my-head></my-head>
        <div class="center-box">
            <router-view/>
        </div>
    </div>
</template>

<script setup lang="ts">
import myHead from '@/layout/myHead.vue'

</script>

<style lang="scss">
.center-box {
    height: calc(100% - 9.5rem);
    padding: 1.87rem 2.5rem;
    border-top: 0.5px solid rgb(112, 112, 112);
    overflow: hidden;
}
</style>