<template>
    <el-scrollbar class="boxsss">
        <canvas id="test"></canvas>
    </el-scrollbar>
</template>

<script setup lang="ts">
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
        width: 5143,
        height: 3167,
        fireRightClick: true, // 启用右键，button的数字为3
        imageSmoothingEnabled: false,
        selection: false,
        backgroundColor: "rgba(0,0,0,1)",
    });

    let i = 0
    // 分帧渲染
    buff = draw(canvas)
    let id: number
    const m = () => {
        const n = buff.slice(i, i+500)
        n.forEach((item: any) => {
            canvas.value.add(item)
        })
        i += 500
        if(i-500 < buff.length)
        id = requestAnimationFrame(m)
        else
        cancelAnimationFrame(id)
    }
    id = requestAnimationFrame(m)
    // 画布缩放 定位
    canvas.value.absolutePan({ x: 3000, y: 1700 });
    canvas.value.zoomToPoint({ x: canvas.value.getWidth() / 2, y: canvas.value.getHeight() / 2 }, 0.5);

    //处理canvas整体缩放
    canvas.value.on('mouse:wheel', function (opt: { e: { deltaY: any; offsetX: any; offsetY: any; preventDefault: () => void; stopPropagation: () => void; }; }) {
        if (!canvas.value) return;

        let delta = opt.e.deltaY;
        let zoom = canvas.value.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 10) zoom = 10;
        if (zoom < 0.1) zoom = 0.1;

        canvas.value.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    })


    //处理canvas的整体拖动
    let isDown = false;
    let lastX: number, lastY: number;
    canvas.value.on('mouse:down', (opt: { button: number; target: null; e: { offsetX: number; offsetY: number; }; }) => {
        //处理右键异常
        if (opt.button == 3) {
            document.oncontextmenu = () => {
                return false;
            }
        }
        isDown = true
        lastX = opt.e.offsetX
        lastY = opt.e.offsetY
    })

    canvas.value.on('mouse:move', function (opt: { e: any; }) {
        if (isDown) {
            let e = opt.e
            canvas.value.relativePan({ x: e.offsetX - lastX, y: e.offsetY - lastY })
            lastX = e.offsetX
            lastY = e.offsetY
        }
    })

    canvas.value.on('mouse:up', function (_opt: any) {
        isDown = false;
    })
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
            stroke: '#CAC7CA',
            selectable: false,
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
    .test2 {
        position: absolute;
        top: 0
    }
}
</style>