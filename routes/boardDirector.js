const BoardDirector = require("../models/boardDirector.model"),
    { saveImage } = require("../common/image")
module.exports = app => {
    app.post("/board-director", async (req, res) => {
        try {
            const { body } = req
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            body.position = (await BoardDirector.countDocuments({}))
            const data = new BoardDirector(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/board-director/:id", async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await BoardDirector.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.img = body.img
                data.name = body.name
                data.title = body.title
                data.position = body.position
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

    app.get("/board-director/:id", async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await BoardDirector.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/board-directors", async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await BoardDirector.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await BoardDirector.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/board-directors/all", async (req, res) => {
        try {
            const data = await BoardDirector.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete("/board-director/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await BoardDirector.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/board-directors/position", async (req, res) => {
        try {
            const { body } = req
            await Promise.all(body.map(async data => {
                await BoardDirector.update({ _id: data._id }, { position: data.position })
            }))
            res.status(200).json({ data: "Updated success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}