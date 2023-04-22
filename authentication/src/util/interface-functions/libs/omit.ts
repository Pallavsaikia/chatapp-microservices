export function omit<T>(obj: any, ...args: string[]): T {
    const copyObj = JSON.parse(JSON.stringify(obj))
    for (let i = 0; i < args.length; i++) {
        try {
            delete copyObj[args[i]]
        } catch { }

    }
    return copyObj
}

export function pick<T>(obj: any, ...args: string[]): T {

    const copyObj = JSON.parse(JSON.stringify(obj))
    for (const k in copyObj) {  
        if (!args.includes(k)) {
            delete copyObj[k]
        }

    }
    return copyObj
}




