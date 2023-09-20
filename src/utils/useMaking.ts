import { fabric } from 'fabric'

// 决策框
const useMaking = (fab: any, point: Array<number>, text: string, yesNext?: any, noNext?: any, callBack?: Function, view?: string) => {
    const [x, y] = point;
    const width = 320
    const height = 82
    let flag = false
    let id: number
    let yesOrNo: number
    const diamond = new fabric.Path(`M${width/2} 0 L${width} ${height/2} L${width/2} ${height} L0 ${height/2} Z`)
    diamond.set({ left: x, top: y, stroke: '#165DFF', fill: 'rgb(0,0,0,0)' })


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
        hasBorders: false
    });
    if(!view) {
        fab.add(yes)
    }
    yes.hoverCursor = 'pointer';
    yes.on('mouseover', function() {
        // 在鼠标悬浮时改变箭头的样式
        yes.set('fill', '#8afb44');
        fab.renderAll();
    });
    yes.on('mouseout', function() {
        // 在鼠标离开时还原箭头的样式
        yes.set('fill', '#38FFFF');
        fab.renderAll();
    });
    yes.on('mousedown', () => {
        yesOrNo = 1
        if(callBack)
        callBack()
        console.log('你点击了是')
    })

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
        hasBorders: false
    });
    if(!view) {
        fab.add(no)
    }
    no.hoverCursor = 'pointer';
    no.on('mouseover', function() {
        // 在鼠标悬浮时改变箭头的样式
        no.set('fill', 'red');
        fab.renderAll();
    });
    no.on('mouseout', function() {
        // 在鼠标离开时还原箭头的样式
        no.set('fill', '#38FFFF');
        fab.renderAll();
    });
    no.on('mousedown', () => {
        yesOrNo = 0
        if(callBack)
        callBack()
        console.log('你点击了否')
    })

    const arrowLeft = new fabric.Polygon([
        {x: 422 + x, y: 42 + y},
        {x: 412 + x, y: 32 + y},
        {x: 412 + x, y: 52 + y}
    ], {
    fill: '#165DFF',
    stroke: '#165DFF',
    });

    const myText = new fabric.Textbox(text, {
        width: 160,
        left: x + 160,
        top: y + 41,
        fontSize: 20,
        fill: '#fff',
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
        splitByGrapheme: true,
    });

    let lingXing
    if(view === 'no')
    lingXing = new fabric.Group([diamond, lineLeft, no, arrowLeft, myText],{hasControls: false, hasBorders: false, selectable: false})
    else if(view === 'yes')
    lingXing = new fabric.Group([diamond, lineDown, yes, arrowDown, myText],{hasControls: false, hasBorders: false, selectable: false})
    else
    lingXing = new fabric.Group([diamond, lineLeft, lineDown, arrowDown, arrowLeft, myText],{hasControls: false, hasBorders: false, selectable: false})

    fab.add(lingXing)
    if(callBack) {
        fab.bringToFront(no)
        fab.bringToFront(yes)
    }

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
            diamond.set('fill', 'rgba(22, 93, 255, 0.6)')
            fab.renderAll()
            if(yesOrNo) {
                resolvue(yesNext)
            } else {
                resolvue(noNext)
            }
        })
    }
    return { startAnimation, endAnimation, sure, type: 'making', yesNext, noNext }
}

export default useMaking