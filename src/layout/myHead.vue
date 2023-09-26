<template>
  <div class="my-head">
    <div @click="() => active = item.path" v-for="(item, index) in menuList" :key="index">
      <div class="box" :class="item.path === active ? 'first-active' : 'first'" v-if="index === 0">
        {{ item.name }}
      </div>
      <div class="box" :class="item.path === active ? 'other-active' : 'other'" v-else>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'


interface menuType {
  path: string,
  name: string,
  id?: number
}

const menuList: Array<menuType> = [
  {
    path: 'start',
    name: '启动预案'
  },
  {
    path: 'view',
    name: '查看预案'
  },
  {
    path: 'history',
    name: '应急处理历史'
  }
]

// 高亮当前页面菜单
const active = ref<string>('start')
const route = useRoute()
onMounted(() => {
  active.value = route.path.replace('/', '')
})

// 路由跳转
const router = useRouter()
watch(active, (val) => {
  if(['start', 'view', 'history'].includes(val))
  router.push(val)
})

router.afterEach((to) => {
  active.value = to.path.replaceAll('/', '')
  // to and from are both route objects.
})
</script>

<style lang="scss">
.my-head {
  background: #091A47;
  height: 2.5rem;
  display: flex;
  .box {
    color: #FFF;
    text-align: center;
    font-family: YouSheBiaoTiHei;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding: 0.4rem 4.19rem;
    background-size: cover;
    background-position: bottom;
    cursor: pointer;
    margin-left: -1rem;
  }
  .first {
    background-image: url('@/assets/menu1.svg');
    opacity: 0.8;
  }
  .first-active {
    background-image: url('@/assets/menu1-active.svg');
  }
  .other {
    background-image: url('@/assets/menu2.svg');
    opacity: 0.8;
  }
  .other-active {
    background-image: url('@/assets/menu2-active.svg');
  }
}
</style>