<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import test from '@/assets/test.png'
import titleIcon from '@/assets/titleIcon.svg'
import { useRouter } from 'vue-router';

const router = useRouter()

interface listType {
    value: number
    label: string
    disabled?: Boolean
}

interface demoType {
    image: string
    title: string
    date: string
    id: number
    first: number,
    secend: number
}

// 模糊查询值
const searchValue = ref<string>('')

// 下拉框
const selectValue = ref<number>(0)
const list = ref<Array<listType>>([
    { value: 0, label: '全部预案' },
    { value: 2, label: '设备故障' },
    { value: 3, label: '非正常行车', disabled: true },
    { value: 4, label: '灾害行车', disabled: true },
    { value: 5, label: '救援', disabled: true},
    { value: 6, label: '其他' }
])

const secendSelectValue = ref<number>(0)
const secendList: any = ({
    0: [
        { value: 0, label: '全部' }
    ],
    2: [
        { value: 0, label: '全部'},
        { value: 1, label: '出站信号灯绿黄灭灯灯', disabled: true },
        { value: 2, label: '出站信号机灭灯' },
        { value: 3, label: '道岔失去表示发车（出站信号机不能开放）', disabled: true },
        { value: 4, label: '道岔失去表示发车（出站信号机自动恢复）', disabled: true },
        { value: 5, label: '道岔失去表示接车' },
        { value: 6, label: '轨道电路红光带接车', disabled: true },
        { value: 7, label: '进站信号机故障', disabled: true },
        { value: 8, label: '列车冒进进站信号', disabled: true },
        { value: 9, label: '区间第一离去轨红光带发车', disabled: true },
        { value: 10, label: '区间一架通过信号机故障', disabled: true }
    ],
    3: [
        { value: 0, label: '全部'},
        { value: 1, label: '反方向行车', disabled: true }
    ],
    4: [
        { value: 0, label: '全部'},
        { value: 1, label: '天气恶劣难以辨认信号', disabled: true }
    ],
    5: [
        { value: 0, label: '全部'},
        { value: 1, label: '分部运行', disabled: true },
        { value: 2, label: '机车救援', disabled: true }
    ],
    6: [
        { value: 0, label: '全部' },
    ]
})

watch(selectValue, () => {
    secendSelectValue.value = 0
    getList()
})

watch(secendSelectValue, () => {
    getList()
})

onMounted(() => {
    getList()
})

const demoList = ref<Array<demoType>>([])

const loading = ref<Boolean>(false)
// 假数据
const getList = () => {
    demoList.value = []
    loading.value = true
    setTimeout(() => {
        loading.value = false
        demoList.value = [
            // {
            //     image: test,
            //     title: '出站信号机灭灯',
            //     date: '更新于1个月前',
            //     first: 2,
            //     secend: 2,
            //     id: 1
            // },
            // {
            //     image: test,
            //     title: '道岔失去表示接车',
            //     date: '更新于1个月前',
            //     first: 2,
            //     secend: 5,
            //     id: 2
            // },
            {
                image: test,
                title: '抱闸',
                date: '更新于1个月前',
                first: 6,
                secend: 0,
                id: 3
            },
            {
                image: test,
                title: '受电弓挂异物',
                date: '更新于1个月前',
                first: 6,
                secend: 0,
                id: 4
            },
            ].filter(fil => (selectValue.value === 0 || fil.first === selectValue.value && (fil.secend === secendSelectValue.value || secendSelectValue.value === 0)) && (fil.title.search(searchValue.value) !== -1 || searchValue.value === ''))    }, 2000)
}
</script>

<template>
    <div class="view">
        <el-input @keyup.enter="getList()" v-model="searchValue" class="search" placeholder="搜案预案/规章/数据/案例" :prefix-icon="Search"></el-input>

        <div style="display: flex;">
            <div class="select">
                <span style="width: 4rem;">类型:</span>
                <el-select v-model="selectValue">
                    <el-option v-for="item in list" :key="item.value" :value="item.value" :disabled="item.disabled" :label="item.label"/>
                </el-select>
            </div>
            
            <div class="select">
                <span style="width: 4rem; margin-left: 2rem;">名称:</span>
                <el-select v-model="secendSelectValue">
                    <el-option v-for="item in secendList[selectValue]" :key="item.value" :disabled="item.disabled" :value="item.value" :label="item.label"/>
                </el-select>
            </div>
        </div>
        
        <el-scrollbar class="demo-box">
            <el-row>
                <el-col :span="6" v-for="(item, index) in demoList" :key="index">
                    <div class="box">
                        <img :src="item.image"/>
                        <!-- <img class="play" :src="play"> -->
                    </div>
                    <div class="title">
                        <img :src="titleIcon"/>
                        <span style="margin-left: 1rem;">{{ item.title }}</span>
                    </div>
                    <div class="btn" @click="router.push({path: 'makingView', query: {type: 2, yuan: item.id}})">
                        查看
                    </div>
                </el-col>
            </el-row>
            <div v-show="loading" style="margin-top: 5rem;" v-loading="loading"></div>
        </el-scrollbar>
    </div>
</template>

<style lang="scss">
.view {
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
        // display: inline-block;
        display: flex;
        width: 15.25rem;
        height: 2.625rem;
        flex-shrink: 0;
        margin-top: 2.5rem;
        background: var(--theme-color);
        color: #fff;
        align-items: center;
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
            font-family: 'Alibaba PuHuiTi 2.0';
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 500;
            line-height: 1.5rem; /* 100% */
            margin-top: 1.25rem;
            display: flex;
            letter-spacing: 0.2rem;
        }
        .btn {
            cursor: pointer;
            width: 6rem;
            height: 2rem;
            flex-shrink: 0;
            border: 0.5px solid var(--unnamed, #38FFFF);
            background: rgba(4, 73, 73, 0.30);
            color: #FFF;
            font-family: 'Alibaba PuHuiTi 2.0';
            font-size: 1rem;
            font-style: normal;
            font-weight: 500;
            line-height: 2rem; /* 150% */
            background: url('@/assets/btn.svg');
            text-align: center;
            margin-top: 1.25rem;
        }
    }
}
</style>