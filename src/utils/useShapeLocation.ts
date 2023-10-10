const useShapeLocation = (arr: any) => {
    let newArr = arr
    let [x, y] = [80, 0]

    const getPoint = (nArr: Array<any>) => {
        nArr?.forEach((item: any) => {
            item.point = [x, y]
            switch (item.type) {
                case 1: {
                    y += 180
                    break
                }
                case 2: {
                    y += 180
                    break
                }
                case 3: {
                    y += 200
                    getPoint(item.children.no)
                    getPoint(item.children.yes)
                    break
                }
            }
        })
    }
    getPoint(newArr)
    return newArr
}

export default useShapeLocation