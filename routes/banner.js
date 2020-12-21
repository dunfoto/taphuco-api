const Banner = require("../models/banner.model"),
    { saveImage } = require("../common/image")
module.exports = app => {
    app.post("/banner", async (req, res) => {
        try {
            const { body } = req

            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            body.position = (await Banner.countDocuments({})) - 1
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
            console.log(err)
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

    app.get("/banners", async (req, res) => {
        try {
            const data = await Banner.find({}).sort({ position: 1 })
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
            const { body } = req,
                lstPosition = body.map(async data => {
                    await Banner.update({ _id: data._id }, { position: data.position })
                })
            console.log(body)
            Promise.all(lstPosition).then(result => console.log(result))
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}


const updatePosition = async (id, position) => {
    try {
        await Banner.update({ _id }, { position: position })
    } catch (err) {
        return { data: null, error: err }
    }
}