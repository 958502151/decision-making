// 所有图形的父类

abstract class Simple {
    text: string
    id: string // 随机生成颜色唯一值
    start: Boolean = false // 标识头
    end: Boolean = false // 表示尾
    ctx: CanvasRenderingContext2D // 当前画布对象
    width: number // 画布的宽
    height: number // 画布的高

    protected constructor(text: string, id: string, start: Boolean, end:Boolean, ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.text = text
        this.id = id
        this.start = start
        this.end = end
        this.ctx = ctx
        this.width = width
        this.height = height
    }

    // 获取当前画布状态
    getImage() {
        return this.ctx.getImageData(0, 0, this.width ,this.height)
    }

    abstract draw(x: number, y: number): void // 绘制图形

    abstract chooseAnimal(): void // 当前决策图形
}

export default Simple