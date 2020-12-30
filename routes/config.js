const fs = require("fs"),
    { checkAdmin } = require("../common/Authentication")

module.exports = app => {
    app.get("/config", async (req, res) => {
        try {
            const config = JSON.parse(await fs.readFileSync("config/config.json", "utf-8"))
            res.status(200).json({ data: config, errors: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, errors: err })
        }
    })

    app.post("/config/:type", checkAdmin, async (req, res) => {
        try {
            const { params: { type }, body } = req,
                config = JSON.parse(await fs.readFileSync("config/config.json", "utf8"))
            config[type] = body
            await fs.writeFileSync("config/config.json", JSON.stringify(config), "utf-8")
            res.status(200).json({ data: "Update Success", errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: err })
        }
    })
}