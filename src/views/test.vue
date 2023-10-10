<template>
    <el-scrollbar class="boxsss">
        <canvas id="test"></canvas>
        <!-- <canvas id="static"></canvas> -->
    </el-scrollbar>
</template>

<script setup lang="ts">

import useFabricWheelAndMove from '@/utils/useFabricWheelAndMove';
import { fabric } from 'fabric'
import { onMounted, ref } from 'vue'

let buff: any = []
onMounted(() => {
    init(document.getElementById('test'))
})

const init = (doc: HTMLElement | null) => {
    const canvas = ref<any>(null)
    const canvasHtml = doc as HTMLCanvasElement;

    canvas.value = new fabric.Canvas(canvasHtml, {
        width: document.getElementsByClassName('boxsss')[0]?.clientWidth,
        height: document.getElementsByClassName('boxsss')[0]?.clientHeight,
        fireRightClick: true, // 启用右键，button的数字为3
        imageSmoothingEnabled: true,
        selection: false,
        backgroundColor: "rgba(0,0,0,0)",
        svgViewportTransformation: true,
        skipOffscreen: true,
        overlayVpt: true,
        centeredScaling: true,
        enableRetinaScaling: true,
    });

    // let i = 0
    // 分帧渲染
    buff = draw(canvas)
    // let id: number
    // const m = () => {
    //     const n = buff.slice(i, i+500)
    //     n.forEach((item: any) => {
    //         if(i-500 < 10000)
    //         canvas.value.add(item)
    //     })
    //     i += 500
    //     if(i-500 < buff.length)
    //     id = requestAnimationFrame(m)
    //     else
    //     cancelAnimationFrame(id)
    // }
    // id = requestAnimationFrame(m)
    // // 画布缩放 定位
    // canvas.value.absolutePan({ x: 3000, y: 1700 });
    // canvas.value.zoomToPoint({ x: canvas.value.getWidth(), y: canvas.value.getHeight() }, 0.5);
    
    useFabricWheelAndMove(canvas.value)
}
let flag = true

// 批量绘制
const draw = (canvas: { value: {
renderAll(): unknown; requestRenderAll: () => void; add: (arg0: fabric.Circle) => void;
}; }) => {
    let i = 0
    const buff: any = []
    while(i !== 10000) {
        let color: string
        let innerCircle = new fabric.Circle({
            radius: Math.floor(Math.random()*50 + 5),
            left: Math.floor(Math.random()*5000),
            top: Math.floor(Math.random()*3000),
            fill: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.random()})`,
            // stroke: '#CAC7CA',
            selectable: false,
            // dirty: true,
            noScaleCache: true,
            centeredScaling: true,
            perPixelTargetFind: true,
            // evented: false,
        });
        innerCircle.on('mouseover', (e: fabric.IEvent) => {
            const target = e.target as any
            color = target.fill
            target.set('fill', 'yellow')
            if(flag) {
                canvas.value.renderAll()
                flag = !flag
            } else {
                canvas.value.requestRenderAll();
            }
        });
        innerCircle.on('mouseout', (e: fabric.IEvent) => {
            const target = e.target as any
            target.set('fill', color)
            canvas.value.requestRenderAll();
        });
        innerCircle.on('mousedown', (e: fabric.IEvent) => {
            const target = e.target as any
            target.set('fill', 'yellow')
            handleClick(canvas)
        })
        canvas.value.add(innerCircle)
        buff.push(innerCircle)
        i++
    }
    return buff
    // canvas.value.animate('fill', )
}

const handleClick = (canvas: { value: any; }) => {
    let is = true
    let m = () => {
        setTimeout(() => {
            if(is) {
                buff.slice(0, 500).forEach((item: { set: (arg0: string, arg1: string) => void; }) => {
                    item.set('fill', '#fff')
                })
            } else {
                buff.slice(0, 500).forEach((item: { set: (arg0: string, arg1: string) => void; }) => {
                    item.set('fill', 'red')
                })
            }
            is = !is
            canvas.value.requestRenderAll();
            m()
        }, 1000)
    }
    m()
}
</script>

<style lang="scss">
.boxsss {
    height: 100%;
    width: 100%;
    overflow: auto;
    #static {
        position: flex;
        top: 0;
        z-index: 0;
    }
    // #test {
    //     z-index: 1;
    // }
}
</style>