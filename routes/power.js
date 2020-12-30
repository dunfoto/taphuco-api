const Power = require("../models/power.model"),
    { saveImage } = require("../common/image"),
    Category = require('../models/category.model'),
    decodeUriComponent = require('decode-uri-component'),
    { isValidObjectId } = require('../common/mongoose'),
    escapeStringRegexp = require('escape-string-regexp')

module.exports = app => {
    app.post('/power', async (req, res) => {
        try {
            const { body } = req
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            const data = new Power(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.put('/power/:id', async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Power.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.title = body.title
                data.content = body.content
                data.categories = body.categories
                data.img = body.img
                await data.save()
                res.status(200).json({ data: "Update success", error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no this record in system!" })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/powers', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Power.find({}).sort({ updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await Power.countDocuments({}) }
            console.log(data)
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/powers/random', async (req, res) => {
        try {
            const { query: { limit = 2 } } = req,
                temp = await Power.aggregate([{ $sample: { size: Number(limit) } }]),
                data = await Power.find({ _id: { $in: temp.map(t => t._id) } }).populate('categories')
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/powers/all", async (req, res) => {
        try {
            const { query: { category } } = req,
                dataCategory = await Category.findOne({ title: decodeUriComponent(category) })
            let condition = {}
            if (dataCategory) condition.categories = dataCategory._id
            const data = await Power.find(condition).sort({ updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.get('/power/:id', async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Power.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.get('/power/:id/:idPower', async (req, res) => {
        try {
            const { params: { id, idPower } } = req
            if (isValidObjectId(id)) {
                const category = await Category.findById(id)
                if (category) {
                    if (isValidObjectId(idPower)) {
                        const data = await Power.findById(idPower)
                        res.status(200).json({ data, error: null })
                    } else {
                        const $regex = escapeStringRegexp(decodeUriComponent(idPower)),
                            data = await Power.findOne({ title: { $regex }, categories: category._id }).populate('categories')
                        res.status(200).json({ data, error: null })
                    }
                } else {
                    res.status(302).json({ data: null, error: "Don't match category with Power" })
                }
            } else {
                const $regex = escapeStringRegexp(decodeUriComponent(id)),
                    category = await Category.findOne({ title: { $regex } })
                if (category) {
                    if (isValidObjectId(idPower)) {
                        const data = await Power.findById(idPower)
                        res.status(200).json({ data, error: null })
                    } else {
                        const $regex = escapeStringRegexp(decodeUriComponent(idPower)),
                            data = await Power.findOne({ title: { $regex }, categories: category._id }).populate('categories')
                        res.status(200).json({ data, error: null })
                    }
                } else {
                    res.status(302).json({ data: null, error: "Don't match category with Power" })
                }
            }
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/power-ref/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            if (isValidObjectId(id)) {
                const category = await Category.findById(id),
                    data = await Power.find({ categories: category._id }).limit(6)
                if (data) {
                    res.status(200).json({ data, error: null })
                } else {
                    res.status(302).json({ data: null, error: "Have no record" })
                }
            } else {
                const $regex = escapeStringRegexp(decodeUriComponent(id)),
                    category = await Category.findOne({ title: { $regex } }),
                    data = await Power.find({ categories: category._id }).limit(6)
                if (data) {
                    res.status(200).json({ data, error: null })
                } else {
                    res.status(302).json({ data: null, error: "Have no record" })
                }
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.delete("/power/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await Power.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}