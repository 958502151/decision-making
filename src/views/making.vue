<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Search, Fold, Expand, Warning } from '@element-plus/icons-vue'
import { fabric } from 'fabric'
import line from '@/assets/line.svg'
import useArrowHeadRect from '@/utils/useArrowHeadRect.ts'
import useFabricWheelAndMove from '@/utils/useFabricWheelAndMove.ts'
import useMaking from '@/utils/useMaking.ts'
import useModel from '@/utils/useModel.ts'
import { useRoute } from 'vue-router'
import { array } from '@/utils/testData.json'

const route = useRoute()
const type = route.query.type

// 模糊查询值
const searchValue = ref<string>('')

const isLeft = ref<Boolean>(true)

//高亮tab
const light = ref<number>(1)

// 规章
const gzList = ref<Array<any>>([])

const canvas = ref<any>()/*  */

// 子流程
const isModel = ref<Boolean>(false)
const modelCanvas = ref<any>()
// 选中的模块
let choose: any

const handleModel = (e: any, item: any) => {
    choose = {...e, item}
    isModel.value = !isModel.value
}

watch(isModel, (val) => {
    if(val) {
        nextTick(() => {
            const model = modelCanvas.value as HTMLCanvasElement;

            const fabs = new fabric.Canvas(model, {
                width: document.getElementsByClassName('model')[0].clientWidth - 2,
                height: document.getElementsByClassName('model')[0].clientHeight - 2,
                fireRightClick: true, // 启用右键，button的数字为3
                imageSmoothingEnabled: false,
                selection: false,
                backgroundColor: "#1d3b51",
                // top: 20
            });
            useFabricWheelAndMove(fabs)
            fabs.renderAll()
            if(type === '1') {
                const initLiu = (arr: any, x: number, y: number) => {
                    let [cx, cy] = [x, y]
                    arr.forEach((item: any) => {
                        switch (item.type) {
                            case 1: { 
                                useArrowHeadRect(fabs, [cx, cy], {...item, callBack: () => { choose.option.current += 1; choose.sure() }})
                                cy += 180
                                break;
                            }
                            case 2: {
                                useModel(fabs, [cx, cy], { ...item, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0})
                                cy += 180
                                break;
                            }
                            case 3: {
                                useMaking(fabs, [cx, cy], item.text)
                                initLiu(item.children.yes, cx, cy + 180)
                                initLiu(item.children.no, cx + 440, cy)
                                break;
                            }
                        }
                    })
                }
                initLiu(choose.item.children, 80, 20)
                /** text: string
                    end: Boolean
                    message: string
                    view?: Boolean,
                */
            } else if(type === '2') {
                useArrowHeadRect(fabs, [80, 20], { text: '汇报通知', message: '外勤，值班干部，工务，电务，列车调度员', view: true})
                useArrowHeadRect(fabs, [80, 200], { text: '使用手摇把', message: '确认手摇把正常', view: true})
                useArrowHeadRect(fabs, [80, 380], { text: 'FAS通知', end: true, message: '调度完成', view: true})
            } else {
                const arrow1 = useArrowHeadRect(fabs, [80, 20], { text: '汇报通知', message: '外勤，值班干部，工务，电务，列车调度员', dateTime: '2023-09-21 10:20:55'})
                const arrow2 = useArrowHeadRect(fabs, [80, 200], { text: '使用手摇把', message: '确认手摇把正常'})
                const arrow4 = useArrowHeadRect(fabs, [80, 380], { text: 'FAS通知', end: true, message: '调度完成', dateTime: '2023-09-21 10:25:55'})

                let buff = [arrow1, arrow2, arrow4]
                let i = 0
                const renderLiu = () => {
                        // 确定回调函数
                    buff[i].sure().then(() => {
                        i++
                        if(i <= buff.length - 1)
                        renderLiu()
                    })
                }
                renderLiu()
            }
        })
    }
})

let fab: any
// let ctx: CanvasRenderingContext2D
// 初始化画布
const init = () => {
    const canvasHtml = canvas.value as HTMLCanvasElement;
    fab = new fabric.Canvas(canvasHtml, {
        width: document.getElementsByClassName('right')[0].clientWidth,
        height: document.getElementsByClassName('right')[0].clientHeight,
        fireRightClick: true, // 启用右键，button的数字为3
        imageSmoothingEnabled: false,
        selection: false,
        // backgroundColor: "rgba(0,0,0,1)",
    });
    useFabricWheelAndMove(fab)

    if(type === '1') {
        const initLiu = (arr: any, x: number, y: number) => {
            let [cx, cy] = [x, y]
            arr.forEach((item: any) => {
                switch (item.type) {
                    case 1: { 
                        useArrowHeadRect(fab, [cx, cy], {...item, callBack: () => {}})
                        cy += 180
                        break;
                    }
                    case 2: {
                        useModel(fab, [cx, cy], { ...item, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0})
                        cy += 180
                        break;
                    }
                    case 3: {
                        useMaking(fab, [cx, cy], item.text)
                        initLiu(item.children.yes, cx, cy + 180)
                        initLiu(item.children.no, cx + 440, cy)
                        break;
                    }
                }
            })
        }
        initLiu(array, 80, 0)
        /** text: string
            end: Boolean
            message: string
            view?: Boolean,
        */
    } else if(type === '2') {
        const initLiu = (arr: any, x: number, y: number) => {
            let [cx, cy] = [x, y]
            arr.forEach((item: any) => {
                switch (item.type) {
                    case 1: { 
                        useArrowHeadRect(fab, [cx, cy], {...item, view: true, callBack: () => {}})
                        cy += 180
                        break;
                    }
                    case 2: {
                        useModel(fab, [cx, cy], { ...item, view: true, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0})
                        cy += 180
                        break;
                    }
                    case 3: {
                        useMaking(fab, [cx, cy], item.text, true)
                        initLiu(item.children.yes, cx, cy + 180)
                        initLiu(item.children.no, cx + 440, cy)
                        break;
                    }
                }
            })
        }
        initLiu(array, 80, 0)
    } else {
        let buff: any= []
        const initLiu = (arr: any, x: number, y: number) => {
            let [cx, cy] = [x, y]
            arr.forEach((item: any) => {
                switch (item.type) {
                    case 1: { 
                        buff.push(useArrowHeadRect(fab, [cx, cy], {...item, view: true, callBack: () => {}, dateTime: '2023-09-21 10:20:55'}))
                        cy += 180
                        break;
                    }
                    case 2: {
                        buff.push(useModel(fab, [cx, cy], { ...item, view: true, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 3}))
                        cy += 180
                        break;
                    }
                    case 3: {
                        buff.push(useMaking(fab, [cx, cy], item.text, true))
                        initLiu(item.children.yes, cx, cy + 180)
                        initLiu(item.children.no, cx + 440, cy)
                        break;
                    }
                }
            })
        }
        initLiu(array, 80, 0)

        let i = 0
        const renderLiu = () => {
                // 确定回调函数
            buff[i].sure().then(() => {
                i++
                if(i <= buff.length - 1)
                renderLiu()
            })
        }
        renderLiu()
    }
}

/*  */
onMounted(() => {
    getGzList()
    getSjList()
    init()
    window.addEventListener('click', (e) => {
        console.log(e)
    })
})

// 获取规章假数据
const loading = ref<Boolean>(false)
const getGzList = () => {
    loading.value = true
    setTimeout(()=>{
        loading.value = false
        gzList.value = [
            {
                title: '铁总 普速技规 第2条',
                content: '铁路基本建设应严格按照国家规定的程序进行，必须符合国家相关法律法规，执行国家标准、行业标准和技术规范。设计工作必须由具有相应资质等级的单位承担，根据已批准的可行性研究报告进行并充分听取建设单位、使用部门的意见。设计文件须经有关部门审查，并按规定的审批程序批准'
            },
            {
                title: '铁总 普速技规 第2条',
                content: '铁路基本建设应严格按照国家规定的程序进行，必须符合国家相关法律法规，执行国家标准、行业标准和技术规范。设计工作必须由具有相应资质等级的单位承担，根据已批准的可行性研究报告进行并充分听取建设单位、使用部门的意见。设计文件须经有关部门审查，并按规定的审批程序批准'
            },
            {
                title: '铁总 普速技规 第2条',
                content: '铁路基本建设应严格按照国家规定的程序进行，必须符合国家相关法律法规，执行国家标准、行业标准和技术规范。设计工作必须由具有相应资质等级的单位承担，根据已批准的可行性研究报告进行并充分听取建设单位、使用部门的意见。设计文件须经有关部门审查，并按规定的审批程序批准'
            },
            {
                title: '铁总 普速技规 第2条',
                content: '铁路基本建设应严格按照国家规定的程序进行，必须符合国家相关法律法规，执行国家标准、行业标准和技术规范。设计工作必须由具有相应资质等级的单位承担，根据已批准的可行性研究报告进行并充分听取建设单位、使用部门的意见。设计文件须经有关部门审查，并按规定的审批程序批准'
            },
        ]
    }, 2000)
}

// 获取数据
const dataSource = ref<Array<any>>([])
const getSjList = () => {
    loading.value = true
    setTimeout(()=>{
        loading.value = false
        dataSource.value = [
            {
                id: 1,
                home: '龙宫',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 2,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 3,
                home: '龙宫',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 4,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 4,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 4,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 4,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 4,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
            {
                id: 8,
                home: '原平南',
                area: '宁武西(不含)-龙(含)-北大牛(不含)上下行'
            },
        ]
    }, 2000)
}

// 表格头,后续可能更改从后台请求表格头
const tableColumn: Array<any> = [
    {
        label: '序号',
        prop: 'id',
        width: 60
    },
    {
        label: '变电所',
        prop: 'home',
        width: 120
    },
    {
        label: '供电范围',
        prop: 'area'
    }
]

//
const handleIsLeft = () => {
    isLeft.value = !isLeft.value
    nextTick(() => {
        fab.setWidth(document.getElementsByClassName('right')[0].clientWidth)
        fab.setHeight(document.getElementsByClassName('right')[0].clientHeight)
        fab.renderAll()
    })
}
</script>

<template>
    <div class="making">
        <div class="title">
            <span>道岔失去表示</span>
        </div>
        <div class="box">
            <div class="left" v-show="isLeft">
                <el-input v-model="searchValue" class="search" placeholder="搜案顶案/教语/规卓/案例" :prefix-icon="Search">
                    <template #suffix>
                        <el-icon style="cursor: pointer;" @click="handleIsLeft"><Fold /></el-icon>
                    </template>
                </el-input>

                <div class="tab">
                    <div @click="() => light = 1" :class="light === 1 && 'light'">关联规章<img v-show="light === 1" :src="line"/></div>
                    <div  @click="() => light = 2" :class="light === 2 && 'light'" style="margin-left: 5rem">关联数据<img v-show="light === 2" :src="line"/></div>
                </div>

                <el-scrollbar v-show="light === 1" v-loading="loading" style="overflow-y: auto; height: 22rem; margin-top: 0.5rem;">
                    <div class="gz-box" v-for="(item, index) in gzList" :key="index">
                        <div class="gz-title">{{ item.title }}</div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                </el-scrollbar>

                <el-scrollbar v-show="light === 2" v-loading="loading" style="overflow-y: auto; height: 22rem; margin-top: 0.5rem;">
                    <div class="sj-title">·供电臂数据</div>
                    <div class="sj-content table">
                        <el-table empty-text="没有数据" header-cell-class-name="header" cell-class-name="cell" row-class-name="row" :data="dataSource">
                            <el-table-column v-for="(item, index) in tableColumn" :key="index" v-bind="item"/>
                        </el-table>
                    </div>
                </el-scrollbar>

                <div class="warn">
                    <el-icon color="rgba(255, 129, 38, 1)" style="margin-right: 0.5rem;"><Warning /></el-icon>请注意及时向领导汇报
                </div>
            </div>

            <el-icon style="cursor: pointer;" @click="handleIsLeft" class="icon" v-show="!isLeft"><Expand /></el-icon>

            <div class="right">
                <canvas ref="canvas"></canvas>
            </div>

            <!-- 子流程 -->
            <div class="model" v-show="isModel">
                <canvas ref="modelCanvas"></canvas>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scope>
@import '@/style/common.css';

.making {
    height: calc(100% + 2.5rem);
    overflow: hidden;
    flex-shrink: 0;
    background: #08163c95;
    .title {
        // width: 100rem;
        height: 2.75rem;
        background: linear-gradient(90deg, #165cff87 0%, rgba(22, 93, 255, 0.00) 100%);
        color: #FFF;
        font-family: Alibaba PuHuiTi 2.0;
        font-size: 1.25rem;
        font-style: normal;
        font-weight: 500;
        line-height:  2.75rem;
        padding: 0 1.25rem;
        
    }
    .box {
        padding: 1.25rem;
        display: flex;
        .left {
            width: 27.5rem;
            height: 32.5rem;
            flex-shrink: 0;
            background-color: rgba(13, 64, 183, 0.1);
            color: rgba(255, 255, 255, 0.8);
            .search {
                height: 2.375rem;
            }
            .tab {
                display: flex;
                justify-content: center;
                margin-top: 1rem;
                color: rgba(255, 255, 255, 0.8);
                font-family: Alibaba PuHuiTi 2.0;
                font-size: 1rem;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 0.1rem;
                div{
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    img {
                        margin-top: 0.1rem;
                    }
                }
                .light {
                    color: var(--unnamed, #38FFFF);
                    font-family: Alibaba PuHuiTi 2.0;
                    font-size: 1rem;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
            }
            .gz-box {
                width: 23rem;
                flex-shrink: 0;
                padding: 1rem 1.25rem 1rem 0.88rem;
                background: rgba(22, 93, 255, 0.2);
                margin: 1rem 1.25rem 1rem 1.25rem;
                .gz-title {
                    color: #38FFFF;
                    font-family: Alibaba PuHuiTi 2.0;
                    font-size: 1rem;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 1.375rem; /* 137.5% */
                }
                .content {
                    color: #FFF;
                    font-family: Alibaba PuHuiTi 2.0;
                    font-size: 0.875rem;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 1.375rem; /* 157.143% */
                    margin-top: 0.75rem;
                }
            }
            .warn {
                width: 25rem;
                flex-shrink: 0;
                border: 1px solid #FF8126;
                background: rgba(255, 129, 38, 0.10);
                padding: 0.75rem 0;
                margin: 0.75rem auto 0 auto;
                color: #FFF;
                font-family: Alibaba PuHuiTi 2.0;
                font-size: 1rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .sj-title {
                color: #38FFFF;
                font-family: Alibaba PuHuiTi 2.0;
                font-size: 0.875rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin-left: 2.19rem;
                letter-spacing: 0.2rem;
                margin-top: 1.13rem;
            }
            .sj-content {
                margin-top: 0.62rem;
            }
            .table {
                .header {
                    background: #0b1c43;
                    height: 1.75rem;
                    flex-shrink: 0;
                    text-align: center;
                }
                .cell {
                    text-align: center;
                    padding-top: 0.075rem;
                    padding-bottom: 0.075rem;
                    .btn {
                        color: #38FFFF;
                        text-align: center;
                        font-family: Alibaba PuHuiTi 2.0;
                        font-size: 0.875rem;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                    }
                }
            }
        }
        .icon {
            color: white;
        }
        .right {
            width: 100%;
            height: 32.5rem;
        }
        .model {
            width: 30%;
            height: 30rem;
            position: fixed;
            // background: rgba(0,0,0,0.8);
            border-radius: 1rem;
            margin-left: 60%;
            // padding: 1rem;
        }
    }
}
</style>