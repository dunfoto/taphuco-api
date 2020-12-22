const { rmSync } = require('fs')
const Solution = require('../models/solution.model'),
    { saveImage } = require("../common/image")

module.exports = app => {
    app.post('/images/upload', async (req, res) => {
        try {
            const { body } = req,
                imgs = await Promise.all(body.map(async (img, index) => {
                    if (img.includes("data:image/png;base64")) {
                        const data = await saveImage(img)
                        if (data.error) throw data.error
                        return data.result
                    } else {
                        return img
                    }
                }))
            res.status(200).json({ data: imgs, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.post('/solution', async (req, res) => {
        try {
            const { body } = req
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            const data = new Solution(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/solutions', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Solution.find({}).sort({ updatedAt: -1, createdAt: -1 }).limit(limit).skip(page * limit),
                pagination = { page, limit, total: await Solution.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/solution/:id', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 }, params: { id } } = req,
                data = await Solution.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.put('/solution/:id', async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Solution.findById(id)
            if (data) {
                if (body.img.includes("data:image/png;base64")) {
                    const data = await saveImage(body.img)
                    if (data.error) throw data.error
                    body.img = data.result
                }
                data.title = body.title
                data.img = body.img
                data.content = body.content
                await data.save()
                res.status(200).json({ data: "Update success", error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no this record in system!" })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete('/solution/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            await Solution.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}