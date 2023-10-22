<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Fold, Expand, Warning, CloseBold } from '@element-plus/icons-vue'
import { fabric } from 'fabric'
import line from '@/assets/line.svg'
import useArrowHeadRect from '@/utils/useArrowHeadRect.ts'
import useFabricWheelAndMove from '@/utils/useFabricWheelAndMove.ts'
import useMaking from '@/utils/useMaking.ts'
import useModel from '@/utils/useModel.ts'
import { useRoute } from 'vue-router'
import { array, guizhang, sjComlun, shuju, sjTypeList, fuzhuxian } from '@/utils/testData.json'
import useCounter from '@/store/counter.ts'
import { ElMessage } from 'element-plus'

const counter = useCounter()
const route = useRoute()
const { type, id } = route.query
const yuan = route.query.yuan as string

const myArray = JSON.parse(JSON.stringify((array as any)[yuan]))

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
// 缓存绘制图形
const map: any = {}

watch(isModel, (val) => {
    let fabs: any 
    if(val) {
        nextTick(() => {
            choose.option.current = 0; // 初始化
            const model = modelCanvas.value as HTMLCanvasElement;

            fabs = new fabric.Canvas(model, {
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
                                const m = useArrowHeadRect(fabs, [cx, cy], { ...item, callBack: (times: any) => { choose.option.current += 1; choose.sure(); item.dateTime = times; item.ok = true; choose.item.ok = true} })
                                // 暂时无用代码
                                if(item.ok) {
                                    m.sure()
                                    choose.item.ok = true
                                }
                                cy += 180
                                break;
                            }
                            case 2: {
                                useModel(fabs, [cx, cy], { ...item, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0 })
                                cy += 180
                                break;
                            }
                            case 3: {
                                useMaking(fabs, [cx, cy], { ...item, text: item.text, callback: () => {}, ok: item.ok })
                                initLiu(item.children.yes, cx, cy + 220)
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
                const initLiu = (arr: any, x: number, y: number) => {
                    let [cx, cy] = [x, y]
                    arr.forEach((item: any) => {
                        switch (item.type) {
                            case 1: { 
                                useArrowHeadRect(fabs, [cx, cy], {...item, view: true, callBack: () => {}})
                                cy += 180
                                break;
                            }
                            case 2: {
                                useModel(fabs, [cx, cy], { ...item, view: true, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0})
                                cy += 180
                                break;
                            }
                            case 3: {
                                useMaking(fabs, [cx, cy + 20], { ...item, text: item.text, callback: () => {}, ok: item.ok, view: true })
                                initLiu(item.children.yes, cx, cy + 200)
                                initLiu(item.children.no, cx + 440, cy + 20)
                                break;
                            }
                        }
                    })
                }
                initLiu(choose.item.children, 80, 0)
            } else {
                let buff: any= []
                const initLiu = (arr: any, x: number, y: number) => {
                    let [cx, cy] = [x, y]
                    arr.forEach((item: any) => {
                        switch (item.type) {
                            case 1: { 
                                buff.push(useArrowHeadRect(fabs, [cx, cy], {...item, view: true, callBack: () => {}}))
                                cy += 180
                                break;
                            }
                            case 2: {
                                buff.push(useModel(fabs, [cx, cy], { ...item, view: true, size: item.children.length, callback: (e: any) => handleModel(e, item), current: item.children.length}))
                                cy += 180
                                break;
                            }
                            case 3: {
                                buff.push(useMaking(fabs, [cx, cy + 20], { ...item, text: item.text, callback: () => {}, ok: item.ok, view: true }))
                                initLiu(item.children.yes, cx, cy + 200)
                                initLiu(item.children.no, cx + 440, cy + 20)
                                break;
                            }
                        }
                    })
                }
                initLiu(choose.item.children, 80, 0)

                // let i = 0
                // const renderLiu = () => {
                //         // 确定回调函数
                //     if(buff[i].ok || buff[i].type === 2) {
                //         buff[i].sure().then(() => {
                //             i++
                //             if(i <= buff.length - 1)
                //             renderLiu()
                //         })
                //     }
                // }
                // renderLiu()
            }
        })
    }
})

// 长线连接的点
const linelist: Array<any> = []

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
    let mk = true
    if(type === '1') {
        const initLiu = (arr: any, x: number, y: number) => {
            let [cx, cy] = [x, y]
            // let mk = true
            // mk = true
            // mk = !mk

            arr.forEach((item: any) => {
                switch (item.type) {
                    case 1: {
                        map[item.id] = useArrowHeadRect(fab, [cx, cy], {...item, callBack: (times: any) => {item.dateTime = times; item.ok = true}}).shape
                        cy += 180
                        if(item.last)
                        linelist.push([[cx + 160, cy - 20], item.last])
                        break;
                    }
                    case 2: {
                        map[item.id] = useModel(fab, [cx, cy], { ...item, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0}).shape
                        cy += 180
                        if(item.last)
                        linelist.push([[cx + 160, cy - 20], item.last])
                        break;
                    }
                    case 3: {
                        // mk = item.left ? false : true
                        map[item.id] = useMaking(fab, [cx, cy + 20], { ...item, text: item.text, callback: () => {item.ok = true}, ok: item.ok }).shape
                        if(item.children.yes instanceof Array) {
                            initLiu(item.children.yes, cx, cy + 200)
                        } else {
                            initLiu([], cx, cy + 200)
                            if(item.point && item.point.yes) {
                                linelist.push([[cx + 160,  cy + 180], [cx + 160 + item.point.yes[0],  cy + 180 + item.point.yes[1]]])
                                linelist.push([[cx + 160 + item.point.yes[0],  cy + 180 + item.point.yes[1]], item.children.yes])
                            } else
                            linelist.push([[cx + 160, cy + 180], item.children.yes])
                        }
                        if(item.children.no instanceof Array) {
                            initLiu(item.children.no, mk ? (cx + 440) : (cx - 440),  item.children.no[0].type !== 3? cy + 20 : cy)
                        } else {
                            initLiu([], mk ? (cx + 440) : (cx - 440), item.children.no[0].type !== 3? cy + 20 : cy)
                            if(item.point && item.point.no) {
                                linelist.push([[cx + 425,  item.children.no[0].type !== 3? cy + 65 : cy], [cx + 425 + item.point.no[0], (item.children.no[0].type !== 3? cy + 65 : cy) + item.point.no[1]]])
                                linelist.push([[cx + 425 + item.point.no[0] - 220, (item.children.no[0].type !== 3? cy + 163 : cy) + item.point.no[1]], item.children.no])
                            }
                            else
                            linelist.push([[cx + 425,  item.children.no[0].type !== 3? cy + 65 : cy], item.children.no])
                        }
                        break;
                    }
                }
            })
        }
        initLiu(myArray, 80, 0)
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
                        map[item.id] = useArrowHeadRect(fab, [cx, cy], {...item, view: true, callBack: () => {}}).shape
                        cy += 180
                        if(item.last)
                        linelist.push([[cx + 160, cy - 20], item.last])
                        break;
                    }
                    case 2: {
                        map[item.id] = useModel(fab, [cx, cy], { ...item, view: true, size: item.children.length, callback: (e: any) => handleModel(e, item), current: 0}).shape
                        cy += 180
                        if(item.last)
                        linelist.push([[cx + 160, cy - 20], item.last])
                        break;
                    }
                    case 3: {
                        map[item.id] = useMaking(fab, [cx, cy + 20], { ...item, text: item.text, callback: () => {}, ok: item.ok, view: true }).shape
                        if(item.children.yes instanceof Array) {
                            initLiu(item.children.yes, cx, cy + 200)
                        } else {
                            initLiu([], cx, cy + 200)
                            if(item.point && item.point.yes) {
                                linelist.push([[cx + 160,  cy + 180], [cx + 160 + item.point.yes[0],  cy + 180 + item.point.yes[1]]])
                                linelist.push([[cx + 160 + item.point.yes[0],  cy + 180 + item.point.yes[1]], item.children.yes])
                            } else
                            linelist.push([[cx + 160, cy + 180], item.children.yes])
                        }
                        if(item.children.no instanceof Array) {
                            initLiu(item.children.no, mk ? (cx + 440) : (cx - 440),  item.children.no[0].type !== 3? cy + 20 : cy)
                        } else {
                            initLiu([], mk ? (cx + 440) : (cx - 440), item.children.no[0].type !== 3? cy + 20 : cy)
                            if(item.point && item.point.no) {
                                linelist.push([[cx + 425,  item.children.no[0].type !== 3? cy + 65 : cy], [cx + 425 + item.point.no[0], (item.children.no[0].type !== 3? cy + 65 : cy) + item.point.no[1]]])
                                linelist.push([[cx + 425 + item.point.no[0] - 220, (item.children.no[0].type !== 3? cy + 163 : cy) + item.point.no[1]], item.children.no])
                            }
                            else
                            linelist.push([[cx + 425,  item.children.no[0].type !== 3? cy + 65 : cy], item.children.no])
                        }
                        break;
                    }
                }
            })
        }
        initLiu(myArray, 80, 0)
    } else {
        // let buff: any= []
        const initLiu = (arr: any, x: number, y: number) => {
            let [cx, cy] = [x, y]
            arr.forEach((item: any) => {
                switch (item.type) {
                    case 1: { 
                        map[item.id] = useArrowHeadRect(fab, [cx, cy], {...item, view: true, callBack: () => {}}).shape
                        cy += 180
                        if(item.last)
                        linelist.push([[cx + 160, cy - 20], item.last])
                        break;
                    }
                    case 2: {
                        const current = item.children.filter((sub: any) => sub.ok).length
                        map[item.id] = useModel(fab, [cx, cy], { ...item, view: true, size: item.children.length, callback: (e: any) => handleModel(e, item), current}).shape
                        cy += 180
                        if(item.last)
                        linelist.push([[cx + 160, cy - 20], item.last])
                        break;
                    }
                    case 3: {
                        map[item.id] = useMaking(fab, [cx, cy + 20], { ...item, text: item.text, callback: () => {}, ok: item.ok, view: true }).shape
                        if(item.children.yes instanceof Array) {
                            initLiu(item.children.yes, cx, cy + 200)
                        } else {
                            initLiu([], cx, cy + 200)
                            if(item.point && item.point.yes) {
                                linelist.push([[cx + 160,  cy + 180], [cx + 160 + item.point.yes[0],  cy + 180 + item.point.yes[1]]])
                                linelist.push([[cx + 160 + item.point.yes[0],  cy + 180 + item.point.yes[1]], item.children.yes])
                            } else
                            linelist.push([[cx + 160, cy + 180], item.children.yes])
                        }
                        if(item.children.no instanceof Array) {
                            initLiu(item.children.no, mk ? (cx + 440) : (cx - 440),  item.children.no[0].type !== 3? cy + 20 : cy)
                        } else {
                            initLiu([], mk ? (cx + 440) : (cx - 440), item.children.no[0].type !== 3? cy + 20 : cy)
                            if(item.point && item.point.no) {
                                linelist.push([[cx + 425,  item.children.no[0].type !== 3? cy + 65 : cy], [cx + 425 + item.point.no[0], (item.children.no[0].type !== 3? cy + 65 : cy) + item.point.no[1]]])
                                linelist.push([[cx + 425 + item.point.no[0] - 220, (item.children.no[0].type !== 3? cy + 163 : cy) + item.point.no[1]], item.children.no])
                            }
                            else
                            linelist.push([[cx + 425,  item.children.no[0].type !== 3? cy + 65 : cy], item.children.no])
                        }
                        break;
                    }
                }
            })
        }
        if(counter.historyArray.length !== 0)
        initLiu((counter.historyArray as any).find((fin: any) => fin.id == id).array, 80, 0)

        // let i = 0
        // const renderLiu = () => {
        //     // 确定回调函数
        //     if(buff[i].ok) {
        //         buff[i].sure().then(() => {
        //             i++
        //             if(i <= buff.length - 1)
        //             renderLiu()
        //         })
        //     }
        // }
        // renderLiu()
    }
}

/*  */
onMounted(() => {
    getGzList()
    getSjList()
    init()
    tableHeight.value = document.getElementsByClassName('left')[0].clientHeight - 203
    const drawLine = (point1: Array<[number, number]>, point2: Array<[number, number]>) => {
        let dian
        if(point1[1] < point2[1])
        dian = [{x: point1[0], y: point1[1]}, {x: point1[0], y: point2[1]}, {x: point2[0], y: point2[1]}]
        else 
        dian = [{x: point1[0], y: point1[1]}, {x: point2[0] as any - 220, y: point1[1]}, {x: point2[0] as any - 220, y: point2[1] as any + 100}]
        const point = new fabric.Polyline(dian as any, {
            stroke: '#165DFF',
            strokeWidth: 2,
            fill: 'transparent',
            selectable: false,
            evented: false
        })
        fab.add(point)
    }
    linelist.forEach(item => {
        if(item[1] instanceof Array) {
            drawLine(item[0] , item[1])
        }
        else {
            const point = [map[item[1]]?.group.get('left') + 160, map[item[1]]?.group.get('top') - 50]
            drawLine(item[0], point)
        }
    })
    if((fuzhuxian  as any)[yuan]) {
        (fuzhuxian  as any)[yuan].forEach((item: any) => {
            const point = new fabric.Polyline(item as any, {
            stroke: '#165DFF',
            strokeWidth: 2,
            fill: 'transparent',
            selectable: false,
            evented: false
        })
        fab.add(point)
        })
    }
    // window.addEventListener('click', (e) => {
    // })
})

// 获取规章假数据
const loading = ref<Boolean>(false)
const getGzList = () => {
    loading.value = true
    setTimeout(()=>{
        loading.value = false
        gzList.value = (guizhang as any)[yuan]
    }, 2000)
}

// 获取数据
const dataSource = ref<Array<any>>([])
    
// 关联数据下拉框
const sjType = ref<number>(1)
// 表格头,后续可能更改从后台请求表格头
const tableColumn = ref<any>()

const getSjList = () => {
    // debugger
    tableColumn.value = (sjComlun as any)[sjType.value]
    loading.value = true
    setTimeout(()=>{
        loading.value = false
        dataSource.value = (shuju as any)[sjType.value]
    }, 2000)
}

//
const handleIsLeft = () => {
    isLeft.value = !isLeft.value
    nextTick(() => {
        fab.setWidth(document.getElementsByClassName('right')[0].clientWidth)
        fab.setHeight(document.getElementsByClassName('right')[0].clientHeight)
        fab.renderAll()
    })
}

// 保存
const handleSure = () => {
    (counter.historyArray as any).push({array: myArray, id: counter.historyArray.length + 1, date: new Date().toLocaleString().split(' ')[0].replaceAll('/', '-'), time: new Date().toLocaleString().split(' ')[1], createUser: '管理员', yuan, name: ['出站信号机灭灯', '道岔失去表示接车', '抱闸', '受电弓挂异物'][yuan as any - 1]})
    ElMessage.success('确定成功')
}

const tableHeight = ref<number>(485)
</script>

<template>
    <div class="making">
        <div class="title">
            <span>{{['出站信号机灭灯', '道岔失去表示接车', '抱闸', '受电弓挂异物'][yuan as any - 1]}}</span>
            <el-button v-if="type === '1'" class="btn" color="#38FFFF" @click="handleSure" type="success">保存案例</el-button>
        </div>
        <div class="box">
            <div class="left" v-show="isLeft">
                <el-input readonly v-model="searchValue" class="search">
                    <template #suffix>
                        <el-icon style="cursor: pointer;" @click="handleIsLeft"><Fold /></el-icon>
                    </template>
                </el-input>

                <div class="tab">
                    <div @click="() => light = 1" :class="light === 1 && 'light'">关联规章<img v-show="light === 1" :src="line"/></div>
                    <div  @click="() => light = 2" :class="light === 2 && 'light'" style="margin-left: 5rem">关联数据<img v-show="light === 2" :src="line"/></div>
                </div>

                <el-scrollbar class="scrollbar" v-show="light === 1" v-loading="loading" style="overflow-y: auto; margin-top: 0.5rem;">
                    <div class="gz-box" v-for="(item, index) in gzList" :key="index">
                        <div class="gz-title">{{ item.title }}</div>
                        <div class="content" v-html="item.content"></div>
                    </div>
                </el-scrollbar>

                <div v-show="light === 2" v-loading="loading">
                    <div class="sj-title">·<!--{{yuan === '1' ? '出站信号机' : '道岔'}}-->
                        <el-select @change="getSjList" size="small" v-model="sjType">
                            <el-option v-for="(item, index) in (sjTypeList as any)[1]" :label="item.label" :value="item.value" :key="index"></el-option>
                        </el-select>
                    </div>
                    <div class="sj-content table">
                        <el-table :height="tableHeight" empty-text="没有数据" header-cell-class-name="header" cell-class-name="cell" row-class-name="row" :data="dataSource">
                            <el-table-column v-for="(item, index) in tableColumn" :key="index" v-bind="item"/>
                        </el-table>
                    </div>
                </div>

                <div class="warn">
                    <el-icon color="rgba(255, 129, 38, 1)" style="margin-right: 0.5rem;"><Warning /></el-icon>请注意及时向领导汇报
                </div>
            </div>

            <el-icon style="cursor: pointer;" @click="handleIsLeft" class="icon" v-show="!isLeft"><Expand /></el-icon>

            <div class="right">
                <canvas ref="canvas"></canvas>
            </div>

            <!-- 子流程 -->
            <div class="model" v-if="isModel">
                <div class="title">{{ choose.option.text }}<el-icon style="cursor: pointer;" @click="isModel = false"><CloseBold /></el-icon></div>
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
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        height: 2.75rem;
        background: linear-gradient(90deg, #165cff87 0%, rgba(22, 93, 255, 0.00) 100%);
        color: #FFF;
        font-family: 'Alibaba PuHuiTi 2.0';
        font-size: 1.25rem;
        font-style: normal;
        font-weight: 500;
        line-height:  2.75rem;
        padding: 0 1.25rem;
        .btn {
            color: #068897;
            margin-left: 2rem;
            border-radius: 0;
        }
        
    }
    .box {
        padding: 1.25rem;
        display: flex;
        .left {
            width: 27.5rem;
            height: calc(100vh - 13rem);
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
                font-family: 'Alibaba PuHuiTi 2.0';
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
                    font-family: 'Alibaba PuHuiTi 2.0';
                    font-size: 1rem;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
            }
            .scrollbar {
                height: calc(100vh - 23rem);
                .gz-box {
                    width: 23rem;
                    flex-shrink: 0;
                    padding: 1rem 1.25rem 1rem 0.88rem;
                    background: rgba(22, 93, 255, 0.2);
                    margin: 1rem 1.25rem 1rem 1.25rem;
                    .gz-title {
                        color: #38FFFF;
                        font-family: 'Alibaba PuHuiTi 2.0';
                        font-size: 1rem;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 1.375rem; /* 137.5% */
                    }
                    .content {
                        color: #FFF;
                        font-family: 'Alibaba PuHuiTi 2.0';
                        font-size: 0.875rem;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 1.375rem; /* 157.143% */
                        margin-top: 0.75rem;
                    }
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
                font-family: 'Alibaba PuHuiTi 2.0';
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
                font-family: 'Alibaba PuHuiTi 2.0';
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
                    background: #041c7d;
                    height: 1.75rem;
                    flex-shrink: 0;
                    text-align: center;
                    color: #fff;
                }
                .cell {
                    text-align: center;
                    padding-top: 0.075rem;
                    padding-bottom: 0.075rem;
                    .btn {
                        color: #38FFFF;
                        text-align: center;
                        font-family: 'Alibaba PuHuiTi 2.0';
                        font-size: 0.875rem;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                        border-radius: 0;
                    }
                }
            }
        }
        .icon {
            color: white;
        }
        .right {
            width: 100%;
            height: calc(100vh - 13rem);
        }
        .model {
            width: 30%;
            height: calc(100vh - 15rem);
            position: fixed;
            // background: rgba(0,0,0,0.8);
            border-radius: 1rem;
            margin-left: 60%;
            // padding: 1rem;
        }
    }
}
</style>