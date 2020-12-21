const fs = require("fs"),
    { v4 } = require("uuid")
const saveImage = async (data) => {
    try {
        const name = `${Date.now()}-${v4()}.png`
        await fs.writeFileSync(`public/imgs/${name}`, data.replace(/^data:image\/png;base64,/, ""), "base64")
        return { result: `${process.env.HOST}/imgs/${name}`, error: null }
    } catch (err) {
        return { result: null, error: err }
    }
}

module.exports = {
    saveImage
}