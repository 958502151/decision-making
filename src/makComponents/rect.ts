// 矩形类
import Simple from './simple'

class Rect extends Simple {
    w: number; // 矩形宽
    h: number; // 矩形高
    constructor(text: string, id: string, start: Boolean, end: Boolean, ctx: CanvasRenderingContext2D, width: number, height: number, w: number, h: number) {
        super(text, id, start, end, ctx, width, height)
        this.w = w
        this.h = h
    }

    // 绘制矩形
    draw(x: number, y: number) {
        this.ctx.strokeRect(x, y, this.w, this.h)
    }

    chooseAnimal() {

    }
}

export default Rect