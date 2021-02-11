const proxiedArray = (key) => new Proxy(Array, {
    construct(target, [args]) {
        const mappedArray = {}
        const temp = new Map()
        args.forEach(item => {
            if (!temp.has(item[key])) {
                const filteredItems = args.filter(arg => arg[key] === item[key])
                mappedArray[item[key]] = filteredItems.length > 1 ? filteredItems : filteredItems[0]
                temp.set(item[key], true)
            }
        })

        return new Proxy(new target(...args), {
            get(arr, prop) {
                switch (prop) {
                    case 'push':
                        return item => {
                            mappedArray[item[key]].push(item)
                            arr[prop].call(arr, item)
                        }
                    case 'find':
                        return key => {
                            return mappedArray[key]
                        }
                    default:
                        return arr[prop]
                }
            }
        })
    }
})