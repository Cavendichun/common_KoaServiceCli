const sleep = (dur) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, dur);
    })
}

export default sleep;