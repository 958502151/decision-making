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
        selectable: false
    })
    let juxing: fabric.Group
    if(option.end) {
        juxing = new fabric.Group([innerCircle, myText],{hasControls: false, hasBorders: false, selectable: false})
    } else {
        juxing = new fabric.Group([innerCircle, line, arrowHead, myText],{hasControls: false, hasBorders: false, selectable: false})
    }
    juxing.on('mousedown', () => {
        if(!option.view)
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
                const time = new fabric.Text(option.dateTime || date.toLocaleString().replaceAll('/', '-'), {
                    left: x + 160,
                    top: y + 61,
                    fontSize: 16,
                    fill: '#fff',
                    originX: 'center',
                    originY: 'center',
                    selectable: false
                })
                fab.add(time)
                myText.animate('top', '-=10', {
                    duration: 1000,
                    onChange: fab.renderAll.bind(fab),
                    easing: fabric.util.ease.easeInCubic
                });
                if(option.callBack)
                option.callBack()
                option.ok = true
                fab.bringToFront(myText)
                fab.renderAll()
                resolvue(true)
            }
        })
    }
    return { startAnimation, endAnimation, sure, message: option.message, type: 'rect' }
}

export default useArrowHeadRect;