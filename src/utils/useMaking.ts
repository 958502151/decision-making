import { fabric } from 'fabric'
interface Option {
    text: string
    callback: Function
    ok: Boolean
    left?: Boolean
    view?: Boolean
    yon?: string
}
// 决策框
const useMaking = (fab: any, point: Array<number>, option: Option) => {
    const [x, y] = point;
    const width = 320
    const height = 82
    let flag = false
    let id: number
    const diamond = new fabric.Path(`M${width/2} 0 L${width} ${height/2 + 20} L${width/2} ${height + 40} L0 ${height/2 + 20} Z`)
    diamond.set({ left: x, top: y - 20, stroke: '#165DFF', fill: 'rgb(0,0,0,0)' })


    const lineDown = new fabric.Line([160 + x, 100 + y, 160 + x, 160 + y], {
        stroke: '#165DFF',
        strokeWidth: 2,
    });

    const yes = new fabric.Text('是', {
        left: x + 170,
        top: y + 115,
        fontSize: 20,
        fill: '#38FFFF',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    });

    const arrowDown = new fabric.Polygon([
        {x: 161 + x, y: 162 + y},
        {x: 151 + x, y: 152 + y},
        {x: 171 + x, y: 152 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    });


    const lineLeft = new fabric.Line([350 + x, 41 + y, 420 + x, 41 + y], {
        stroke: '#165DFF',
        strokeWidth: 2,
    });

    const no = new fabric.Text('否', {
        left: x + 370,
        top: y + 11,
        fontSize: 20,
        fill: '#38FFFF',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    });

    const arrowLeft = new fabric.Polygon([
        {x: 422 + x, y: 42 + y},
        {x: 412 + x, y: 32 + y},
        {x: 412 + x, y: 52 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    });

    const lineLeft2 = new fabric.Line([70 - x, 41 + y, 140 - x, 41 + y], {
        stroke: '#165DFF',
        strokeWidth: 2,
    });

    const no2 = new fabric.Text('否', {
        left: x - 60,
        top: y + 11,
        fontSize: 20,
        fill: '#38FFFF',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    });

    const arrowLeft2 = new fabric.Polygon([
        {x: 70 - x, y: 42 + y},
        {x: 80 - x, y: 32 + y},
        {x: 80 - x, y: 52 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    });

    const myText = new fabric.Textbox(option.text, {
        width: 200,
        left: x + 160,
        top: y + 41,
        fontSize: 20,
        fill: '#fff',
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
        splitByGrapheme: true,
        fontFamily: 'Alibaba PuHuiTi 2.0'
    });

    let lingXing
    if(option.yon === 'no')
    lingXing = new fabric.Group([diamond, lineLeft, no, arrowLeft, myText],{hasControls: false, hasBorders: false, selectable: false})
    else if(option.yon === 'yes')
    lingXing = new fabric.Group([diamond, lineDown, yes, arrowDown, myText],{hasControls: false, hasBorders: false, selectable: false})
    else if(option.left)
    lingXing = new fabric.Group([diamond, no2, yes, lineLeft2, lineDown, arrowDown, arrowLeft2, myText],{hasControls: false, hasBorders: false, selectable: false})
    else
    lingXing = new fabric.Group([diamond, no, yes, lineLeft, lineDown, arrowDown, arrowLeft, myText],{hasControls: false, hasBorders: false, selectable: false})

    let [lx, ly] = [0, 0]

    lingXing.on('mousedown', ({e}) => {
        [lx, ly] = [e.offsetX, e.offsetY]
    })

    lingXing.on('mouseup', ({e}) => {
        if(!option.view && lx === e.offsetX && ly === e.offsetY)
        sure()
    })
    fab.add(lingXing)

    const render = () => {
        if(flag) {
            diamond.set('stroke', diamond.stroke === 'red' ? 'yellow' : 'red')
            fab.renderAll()
            setTimeout(() => {
                id = requestAnimationFrame(render)
            }, 700)
        } else {
            cancelAnimationFrame(id)
            diamond.set('stroke', '#165DFF')
            fab.renderAll()
        }
    }

    const startAnimation = () => {
        flag = true
        id = requestAnimationFrame(render)
    }

    const endAnimation = () => {
        flag = false
    }

    const sure = () => {
        return new Promise((resolvue) => {
            diamond.set('fill', 'rgba(22, 93, 255, 1)')
            fab.renderAll()
            option.callback()
            resolvue(true)
        })
    }
    if(option.ok) sure()
    return { startAnimation, endAnimation, sure, type: 3, shape: lineDown }
}

export default useMaking