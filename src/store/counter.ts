import { defineStore } from "pinia";//表示要定义store
//通过defineStore定义store,内部会自动管理store
const userCounter = defineStore("counter", {
    state: () => ({
        historyArray: [],
    }),
})
// 调用userCounter
export default userCounter;