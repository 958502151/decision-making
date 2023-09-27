<template>
    <el-scrollbar class="boxsss">
        <!-- <canvas style="background-color: rgba(0,0,0,1);" width="5134" height="3167" id="myCanvas"></canvas> -->
        <iframe width="1800" height="960" src="http://192.168.3.47:8998"></iframe>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'

onMounted(() => {
    nextTick(() => {
        const canvas = document.getElementById('myCanvas') as HTMLElement
        const ctx = (canvas as any).getContext('2d');
        let isDragging = false
        let lastX = 0
        let lastY = 0
        let scale = 1

        init(canvas)

        // 鼠标按下事件处理程序
        const handleMouseDown = (e: any) => {
            isDragging = true
            lastX = e.clientX
            lastY = e.clientY
        }

        // 鼠标移动事件处理程序
        const handleMouseMove = (e: any) => {
            if (isDragging) {
                ctx.clearRect(0, 0, 5134, 3167)
                const deltaX = e.clientX - lastX
                const deltaY = e.clientY - lastY
                lastX = e.clientX
                lastY = e.clientY

                // 移动canvas
                ctx.translate(deltaX, deltaY)
                draw(ctx)
            }
        }

        // 鼠标松开事件处理程序
        const handleMouseUp = () => {
            isDragging = false
        }

        // 鼠标滚轮事件处理程序
        const handleMouseWheel = (e: any) => {
            e.preventDefault()
            const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))

            // 缩放canvas
            if (delta > 0) {
                scale *= 1.1
            } else {
                scale /= 1.1
            }
            ctx.clearRect(0, 0, 5134, 3167)
            ctx.scale(scale, scale)
            draw(ctx)
        }

        // 添加事件监听器
        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)
        canvas.addEventListener('wheel', handleMouseWheel)
        canvas.addEventListener('DOMMouseScroll', handleMouseWheel) // 兼容火狐浏览器
    })
})

const init = (doc: any) => {
    const ctx = doc.getContext('2d')
    ctx.width = 5143,
    ctx.height = 3167,
    ctx.backgroundColor = "rgba(0,0,0,1)",
    ctx.scale(0.2, 0.2)
    draw(ctx)
}

// 批量绘制
const draw = (ctx: any) => {
    let i = 0
    while(i !== 10000) {
        ctx.beginPath()
        // ctx.arc(Math.floor(Math.random()*5000), Math.floor(Math.random()*3000), 50, 0, Math.PI * 2, false)
        ctx.arc(Math.floor(Math.random()*5000), Math.floor(Math.random()*3000), Math.random()*50 + 5, 0, Math.PI * 2, false)
        ctx.fillStyle = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.random()})`
        ctx.stroke = '#CAC7CA'
        // ctx.stroke()
        ctx.fill()
        i++
    }
    // ctx.fill()
}
</script>

<style lang="scss">
.boxsss {
    height: 100%;
    width: 100%;
    overflow: auto;
    position: absolute;
    .test2 {
        position: absolute;
        top: 0
    }
}
</style>