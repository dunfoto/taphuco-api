const Solution = require('../models/solution.model'),
    { saveImage } = require("../common/image"),
    decodeUriComponent = require('decode-uri-component'),
    mongoose = require('mongoose'),
    escapeStringRegexp = require('escape-string-regexp')

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
            body.position = await Solution.countDocuments({})
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
                data = await Solution.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await Solution.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/solutions/all", async (req, res) => {
        try {
            const data = await Solution.find({}).sort({ positions: 1, updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/solutions/reference', async (req, res) => {
        try {
            const { query: { id } } = req,
                data = await Solution.aggregate([{ $match: { _id: { $ne: id } } }, { $sample: { size: 5 } }])
            data.forEach(v => { delete v.content })
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/solution/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            if (mongoose.Types.ObjectId.isValid(id)) {
                const data = await Solution.findById(id)
                res.status(200).json({ data, error: null })
            } else {
                const $regex = escapeStringRegexp(decodeUriComponent(id)),
                    data = await Solution.findOne({ title: { $regex } })
                res.status(200).json({ data, error: null })
            }
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
                data.showTitle = body.showTitle
                data.position = body.position ? body.position : data.position
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

    app.delete('/solution/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            await Solution.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.put("/solutions/position", async (req, res) => {
        try {
            const { body } = req
            console.log(body)
            await Promise.all(body.map(async data => {
                await Solution.update({ _id: data._id }, { position: data.position })
            }))
            res.status(200).json({ data: "Updated success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}
