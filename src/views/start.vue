<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import test from '@/assets/test.png'
import titleIcon from '@/assets/titleIcon.svg'
import play from '@/assets/play.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

interface listType {
    value: number
    label: string
}

interface demoType {
    image: string
    title: string
    date: string
    id: number
}

// 模糊查询值
const searchValue = ref<string>('')

// 下拉框
const selectValue = ref<number>(1)
const list = ref<Array<listType>>([
    { value: 1, label: '全部案例' },
    { value: 2, label: '测试案例1' },
    { value: 3, label: '测试案例2' }
])

watch(selectValue, () => {
    demoList.value = []
    getList()
})

onMounted(() => {
    getList()
})

const demoList = ref<Array<demoType>>([])

const loading = ref<Boolean>(false)
// 假数据
const getList = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        demoList.value = [
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 1
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 2
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 3
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 4
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 4
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 4
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 4
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于14个月前',
                id: 4
            },
        ]
    }, 2000)
}
</script>

<template>
    <div class="start">
        <el-input v-model="searchValue" class="search" placeholder="搜案顶案/教语/规卓/案例" :prefix-icon="Search"></el-input>

        <el-select class="select" v-model="selectValue">
            <el-option v-for="item in list" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
        
        <el-scrollbar class="demo-box">
            <el-row>
                <el-col :span="6" v-for="(item, index) in demoList" :key="index">
                    <div class="box" @click="router.push({path: 'makingView', query: {type: 1, id: item.id}})">
                        <img :src="item.image"/>
                        <img class="play" :src="play">
                    </div>
                    <div class="title">
                        <img :src="titleIcon"/>
                        <span style="margin-left: 1rem;">{{ item.title }}</span>
                    </div>
                    <div class="date">
                        {{ item.date }}
                    </div>
                </el-col>
            </el-row>
            <div v-show="loading" style="margin-top: 5rem;" v-loading="loading"></div>
        </el-scrollbar>
    </div>
</template>

<style lang="scss">
.start {
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    background: #08163c95;
    padding: 1.25rem;
    .search {
        width: 41.25rem;
        height: 3.375rem;
        flex-shrink: 0;
        background: #165DFF;
    }
    .select {
        display: block;
        width: 11.25rem;
        height: 2.625rem;
        flex-shrink: 0;
        margin-top: 2.5rem;
        background: var(--theme-color);
    }
    .demo-box {
        margin-top: 0.5rem;
        overflow-y: auto;
        height: calc(100% - 10rem);
        .box {
            width: 20rem;
            height: 11.25rem;
            flex-shrink: 0;
            margin-top: 2.5rem;
            cursor: pointer;
            .play {
                position: absolute;
                margin-left: -11.5rem;
                margin-top: 4rem;
            }
        }
        .title {
            color: #FFF;
            font-family: Alibaba PuHuiTi 2.0;
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 500;
            line-height: 1.5rem; /* 100% */
            margin-top: 1.25rem;
            display: flex;
            letter-spacing: 0.2rem;
        }
        .date {
            color: #FFF;
            font-family: Alibaba PuHuiTi 2.0;
            font-size: 1rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.5rem; /* 150% */
            opacity: 0.6;
            margin-top: 0.75rem;
        }
    }
}
</style>