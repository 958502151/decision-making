const ctx: Worker = self as any;
// ctx.addEventListener('message', (res) => {
//     console.log('接收到了消息', res);
// }, false);
ctx.onmessage = (res) => {
    console.log(res)
        // res.data.draw().forEach((element: any) => {
        //     res.data.canvas.add(element)
        // });
    ctx.postMessage({ok: true});
};
// ctx.addEventListener('error', (err) => {
//     console.log('收集错误', err);
// });
ctx.onerror = (err) => {
    console.log('收集错误', err);
};
export default ctx;