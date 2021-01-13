const Social = require("../models/social.model"),
    { saveImage } = require("../common/image")

module.exports = app => {
    app.get('/socials', async (req, res) => {
        try {
            const data = await Social.find({})
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/social/:id', async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Social.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.post('/social', async (req, res) => {
        try {
            const { body } = req
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            const data = new Social(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.put('/social/:id', async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Social.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.img = body.img
                data.link = body.link
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

    app.delete("/social/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await Social.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/socials/all', async (req, res) => {
        try {
            const data = await Social.find({})
            console.log(data)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

}