import { fabric } from 'fabric'

interface Option {
    text: string
    end?: Boolean
    message: string
    view?: Boolean
    dateTime?: string
    callBack?: Function | any
    ok?: Boolean
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
        // selectable: false,
    })

    const line = new fabric.Line([160 + x, 100 + y, 160 + x, 160 + y], {
        stroke: '#165DFF',
        strokeWidth: 2,
    })

    const arrowHead = new fabric.Polygon([
        {x: 161 + x, y: 162 + y},
        {x: 151 + x, y: 152 + y},
        {x: 171 + x, y: 152 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    })

    const jiantou = new fabric.Group([line, arrowHead],{hasControls: false, hasBorders: false, selectable: false})

    const message = new fabric.Textbox(option.message, {
        left: x + 160,
        top: y + 55,
        width: 300,
        fontSize: 14,
        fill: '#fff',
        originX: 'center',
        originY: 'center',
        selectable: false,
        textAlign: 'center',
        splitByGrapheme: true,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    })

    const myText = new fabric.Text(option.text, {
        left: x + 160,
        top: y + 25 - (message.height || 0) / 20,
        fontSize: 20,
        fill: '#fff',
        originX: 'center',
        originY: 'center',
        selectable: false,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    })
    
    let juxing: fabric.Group
    if(option.end) {
        juxing = new fabric.Group([innerCircle, myText, message],{hasControls: false, hasBorders: false, selectable: false})
    } else {
        juxing = new fabric.Group([innerCircle, jiantou, myText, message],{hasControls: false, hasBorders: false, selectable: false})
    }

    let [lx, ly] = [0, 0]

    juxing.on('mousedown', ({e}) => {
        [lx, ly] = [e.offsetX, e.offsetY]
    })

    juxing.on('mouseup', ({e}) => {
        if(!option.view && lx === e.offsetX && ly === e.offsetY)
        sure()
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

    const startAnimation = () => {
        flag = true
        id = requestAnimationFrame(render)
    }

    const endAnimation = () => {
        flag = false
    }

    const sure = () => {
        return new Promise((resolvue) => {
            if(innerCircle.fill !== 'rgba(22, 93, 255, 1)') {
                innerCircle.set('fill', 'rgba(22, 93, 255, 1)')
                const date = new Date()
                const times = option.dateTime || date.toLocaleString().replaceAll('/', '-')
                const time = new fabric.Text(times, {
                    left: x + 160,
                    top: y + 61 + (message.height || 0) / 2,
                    fontSize: 14,
                    fill: '#fff',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    fontFamily: 'Alibaba PuHuiTi 2.0'
                })
                fab.add(time)
                myText.animate('top', '-=10', {
                    duration: 1000,
                    onChange: fab.renderAll.bind(fab),
                    easing: fabric.util.ease.easeInCubic
                });
                message.animate('top', `-=${28 - (message.height || 0) / 2}`, {
                    duration: 1000,
                    onChange: fab.renderAll.bind(fab),
                    easing: fabric.util.ease.easeInCubic
                });
                innerCircle.animate('height', `+=${(message.height || 0) / 5}`, {
                    duration: 1000,
                    onChange: fab.renderAll.bind(fab),
                    easing: fabric.util.ease.easeInCubic
                });
                if(option.callBack)
                option.callBack(times)
                // option.ok = true
                fab.bringToFront(myText)
                fab.renderAll()
                resolvue(true)
            }
        })
    }
    if(option.ok) sure()
    return { startAnimation, endAnimation, sure, message: option.message, type: 1, ok: option.ok }
}

export default useArrowHeadRect;