// 画布缩放 定位
// fab.absolutePan({ x: document.getElementsByClassName('right')[0].clientWidth / 10, y: document.getElementsByClassName('right')[0].clientHeight / 10 });
const useFabricWheelAndMove= (fab: any) => {
    fab.zoomToPoint({ x: fab.getWidth(), y: fab.getHeight() }, 0.99);

    //处理canvas整体缩放
    fab.on('mouse:wheel', function (opt: { e: { deltaY: any; offsetX: any; offsetY: any; preventDefault: () => void; stopPropagation: () => void; }; }) {
        if (!fab) return;
        let delta = opt.e.deltaY;
        let zoom = fab.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 5) zoom = 5;
        if (zoom < 0.1) zoom = 0.1;

        fab.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom.toFixed(2));
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });




    //处理canvas的整体拖动
    let isDown = false;
    // let lastX: number, lastY: number;
    fab.on('mouse:down', (opt: { button: number; target: null; e: { offsetX: number; offsetY: number; }; }) => {
        //处理右键异常
        if (opt.button == 3) {
            document.oncontextmenu = () => {
                return false;
            }
        }
        isDown = true
        // lastX = opt.e.offsetX
        // lastY = opt.e.offsetY
    })

    fab.on('mouse:move', function (opt: { e: any; }) {
        if (isDown) {
            let e = opt.e
            let x: number
            let y: number

            x = e.movementX
            y = e.movementY
            fab.relativePan({ x, y })
        }
    })

    fab.on('mouse:up', function (_opt: any) {
        isDown = false;
    })
}

export default useFabricWheelAndMove