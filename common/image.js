const fs = require("fs")
const saveImage = (data, name) => {
    let error = null, result = null
    fs.writeFile(`public/${name}`, data, "base64", err => {
        if (err) return error = err
        return `${process.env.HOST}/${name}`
    })
}

module.exports = {
    saveImage
}