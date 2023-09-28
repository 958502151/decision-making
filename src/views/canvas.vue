<template>
    <el-scrollbar class="boxsss">
        <div id="test"></div>
        <el-button @click="handleToJSON">序列化</el-button>
        <el-button @click="handleToCanvas">反序列化</el-button>
    </el-scrollbar>
</template>

<script setup lang="ts">

import Konva from 'konva'
import { onMounted } from 'vue'

let buff: any = []
onMounted(() => {
    init()
})

let stage: any
let json: JSON
const handleToJSON = () => {
    json = stage.toJSON()
    stage.clear()
    console.log(json)
    
}

const handleToCanvas = () => {
    stage = Konva.Node.create(json, 'test');
    
    sf(stage)
}
const init = () => {
    stage = new Konva.Stage({
        container: 'test',
        width: document.getElementsByClassName('boxsss')[0].clientWidth,
        height: document.getElementsByClassName('boxsss')[0].clientHeight,
        draggable: true
    });

    var layer = new Konva.Layer();

    buff = draw(layer)
    buff.forEach((item: any) => {
        layer.add(item)
    })
    stage.add(layer)

    layer.scaleX(0.5)
    layer.scaleY(0.5)
    sf(layer)
}

const sf = (layer: any) => {
    stage.on('wheel', (e: any) => {
        let max = 10
        let min = 0.1
        let step = 0.02

        const { offsetX: x, offsetY: y } = e.evt
        
        let offsetX = (x -layer.offsetX()) * layer.scaleX() / (layer.scaleX() - step) - (x - layer.offsetX())
        let offsetY = (y -layer.offsetY()) * layer.scaleY() / (layer.scaleY() - step) - (y - layer.offsetY())
    
        if((e.evt as any).wheelDelta) {
            if((e.evt as any).wheelDelta > 0) {
                if(layer.scaleX() < max && layer.scaleY() < max) {
                    layer.scaleX(layer.scaleX() + step)
                    layer.scaleY(layer.scaleY() + step)
                    layer.move({x: -offsetX, y: -offsetY})
                }
            } else {
                if(layer.scaleX() > min && layer.scaleY() > min) {
                    layer.scaleX(layer.scaleX() - step)
                    layer.scaleY(layer.scaleY() - step)
                    layer.move({x: offsetX, y: offsetY})
                }
            }
        }
    })
}

// 批量绘制
const draw = (layer: any) => {
    let i = 0
    const buff: any = []
    while(i !== 10000) {
        let color: string
        let innerCircle = new Konva.Circle({
            radius: Math.floor(Math.random()*50 + 5),
            x: Math.floor(Math.random()*5000),
            y: Math.floor(Math.random()*3000),
            fill: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.random()})`,
            // stroke: '#CAC7CA',
            // listening: i < 1000
        });
        innerCircle.on('mouseover', () => {
            color = innerCircle.attrs.fill
            innerCircle.fill('yellow')
            layer.batchDraw();
        });
        innerCircle.on('mouseout', () => {
            innerCircle.fill(color)
            layer.batchDraw();
        });
        innerCircle.on('mousedown', () => {
            innerCircle.fill('yellow')
            layer.batchDraw();
            handleClick()
        })
        buff.push(innerCircle)
        // layer.add(innerCircle)
        i++
    }
    return buff
}

const handleClick = () => {
    let is = true
    let m = () => {
        setTimeout(() => {
            if(is) {
                buff.slice(0, 500).forEach((item: any) => {
                    item.fill('#fff')
                })
            } else {
                buff.slice(0, 500).forEach((item: any) => {
                    item.fill('red')
                })
            }
            is = !is
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
    overflow: hidden;
    #test {
        overflow: hidden;
    }
    // #test {
    //     z-index: 1;
    // }
}
</style>