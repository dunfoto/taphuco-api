const History = require("../models/history.model"),
    { saveImage } = require("../common/image")
module.exports = app => {
    app.post("/history", async (req, res) => {
        try {
            const { body } = req

            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            body.position = (await History.countDocuments({})) - 1
            const history = new History(body)
            await history.save()
            res.status(200).json({ data: history, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/history/:id", async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await History.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.img = body.img
                data.year = body.year
                data.content = body.content
                await data.save()
                res.status(200).json({ data: "Update success", error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no this record in system!" })
            }
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/history/:id", async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await History.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/histories", async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await History.find({}).sort({ year: 1, updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await History.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.get("/histories/all", async (req, res) => {
        try {
            const data = await History.find({}).sort({ updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete("/history/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await History.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/historys/position", async (req, res) => {
        try {
            const { body } = req,
                lstPosition = body.map(async data => {
                    await History.update({ _id: data._id }, { position: data.position })
                })
            Promise.all(lstPosition).then(result => console.log(result))
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}