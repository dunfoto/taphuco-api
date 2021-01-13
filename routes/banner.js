const Banner = require("../models/banner.model"),
    { saveImage } = require("../common/image"),
    { validation } = require("../common/Authentication")
module.exports = app => {
    app.post("/banner", async (req, res) => {
        try {
            const { body } = req

            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            body.position = (await Banner.countDocuments({}))
            const banner = new Banner(body)
            await banner.save()
            res.status(200).json({ data: banner, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/banner/:id", async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Banner.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.img = body.img
                data.nodes = body.nodes
                await data.save()
                res.status(200).json({ data: "Update success", error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no this record in system!" })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/banner/:id", async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Banner.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/banners", validation("BANNER:GET_LIST"), async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Banner.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await Banner.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/banners/all", async (req, res) => {
        try {
            const data = await Banner.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete("/banner/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await Banner.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/banners/position", async (req, res) => {
        try {
            const { body } = req
            console.log(body)
            await Promise.all(body.map(async data => {
                await Banner.update({ _id: data._id }, { position: data.position })
            }))
            res.status(200).json({ data: "Updated success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}