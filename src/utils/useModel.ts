// 叠合框图

import { fabric } from 'fabric'

interface Option {
    text: string
    end?: Boolean
    message: string
    view?: Boolean
    callback: Function
    size: number
    current: number
    ok: Boolean
    left: Boolean
    next: Boolean
}

// 两图形y间隔值180，x间隔值440
const useArrowHeadRect = (fab: any, point: Array<number>, option: Option) => {
    const [x, y] = point
    let flag = false
    let id: number

    const innerCircle = new fabric.Rect({
        left: x,
        top: y,
        width: 320,
        height: 82,
        fill: 'rgb(0, 0, 0, 0)',
        stroke: '#165DFF',
        rx: 20,
        ry: 20
        // selectable: false,
    })
    // 进度条
    const spin = new fabric.Rect({
        left: x + 160,
        top: y + 10,
        width: 140,
        height: 10,
        fill: 'rgb(0, 0, 0, 1)',
        stroke: 'white',
        rx: 6,
        ry: 6
        // selectable: false,
    })
    // 线性渐变
    let gradient = new fabric.Gradient({
        type: 'linear', // linear or radial
        gradientUnits: 'pixels', // pixels or pencentage 像素 或者 百分比
        coords: { x1: 0, y1: 0, x2: 140, y2: 0, r2: 2 }, // 至少2个坐标对（x1，y1和x2，y2）将定义渐变在对象上的扩展方式
        colorStops:[ // 定义渐变颜色的数组
        { offset: 0.6, color: '#4bff48' },
        ]
    })
    // 填充
    const fill = new fabric.Rect({
        left: x + 160,
        top: y + 10,
        width: 0,
        height: 10,
        fill: gradient,
        rx: 6,
        ry: 6
        // selectable: false,
    })

    const line = new fabric.Line([160 + x, 100 + y, 160 + x, 160 + y], {
        stroke: '#165DFF',
        strokeWidth: 2,
    })
    
    const next = new fabric.Line([160 + x, 100 + y, option.left ? 400 + x :  x - 80, 160 + y], {
        stroke: '#165DFF',
        strokeWidth: 2,
    })
    const nextHead = new fabric.Polygon([
        {x: x - 85, y: 173 + y},
        {x: x - 75, y: 163 + y},
        {x: x - 85, y: 163 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    angle: -60
    })
    // fab.add(line);
    const arrowHead = new fabric.Polygon([
        {x: 161 + x, y: 162 + y},
        {x: 151 + x, y: 152 + y},
        {x: 171 + x, y: 152 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    })

    const myText = new fabric.Text(option.text, {
        left: x + 160,
        top: y + 41,
        fontSize: 20,
        fill: '#fff',
        originX: 'center',
        originY: 'center',
        selectable: false,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    })
    let juxing: fabric.Group
    if(option.end) {
        juxing = new fabric.Group([innerCircle, myText, spin, fill],{hasControls: false, hasBorders: false, selectable: false})
    } else if(option.next) {
        arrowHead.set(arrowHead)
        juxing = new fabric.Group([innerCircle, next, nextHead, myText, spin, fill],{hasControls: false, hasBorders: false, selectable: false})
    } else {
        juxing = new fabric.Group([innerCircle, line, arrowHead, myText, spin, fill],{hasControls: false, hasBorders: false, selectable: false})
    }

    let [lx, ly] = [0, 0]

    juxing.on('mousedown', ({e}) => {
        [lx, ly] = [e.offsetX, e.offsetY]
    })

    juxing.on('mouseup', ({e}) => {
        if(lx === e.offsetX && ly === e.offsetY)
        option.callback({sure: () => sure(), option})
    })

    const render = () => {
        if(flag) {
            innerCircle.set('stroke', innerCircle.stroke === 'red' ? 'yellow' : 'red')
            fab.renderAll()
            setTimeout(() => {
                id = requestAnimationFrame(render)
            }, 700)
        } else {
            cancelAnimationFrame(id)
            innerCircle.set('stroke', '#165DFF')
            fab.renderAll()
        }
    }

    fab.add(juxing)
    // fab.bringToFront(spin)
    const sure = () => {
        if(fill.width as number < 140) {
            fill.animate('width', 140/option.size * (option.current || 0), {
                duration: 500,
                onChange: fab.renderAll.bind(fab),
                easing: fabric.util.ease.easeInCubic
            })
        }
        return new Promise((resolvue) => {
            if(innerCircle.fill !== 'rgba(22, 93, 255, 1)') {
                innerCircle.set('fill', 'rgba(22, 93, 255, 1)')
                fab.renderAll()
                resolvue(true)
            }
            resolvue(false)
        })
    }
    if(option.ok) sure()
    return { sure, message: option.message, type: 2, ok: option.ok }
}

export default useArrowHeadRect;