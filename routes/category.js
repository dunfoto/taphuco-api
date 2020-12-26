const Category = require("../models/category.model"),
    { saveImage } = require("../common/image"),
    decodeUriComponent = require('decode-uri-component'),
    mongoose = require('mongoose')

module.exports = app => {
    app.post('/category', async (req, res) => {
        try {
            const { body } = req
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            const data = new Category(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.put('/category/:id', async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Category.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.img = body.img
                data.title = body.title
                data.description = body.description
                await data.save()
                res.status(200).json({ data: "Update success", error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no this record in system!" })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/categories', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Category.find({}).sort({ updatedAt: -1, createdAt: -1 }).limit(limit).skip(page * limit),
                pagination = { page, limit, total: await Category.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/categories/all', async (req, res) => {
        try {
            const data = await Category.find({}).sort({ updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/category/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            if (mongoose.Types.ObjectId.isValid(id)) {
                const data = await Category.findById(id)
                res.status(200).json({ data, error: null })
            } else {
                const data = await Category.findOne({ title: decodeUriComponent(id) })
                res.status(200).json({ data, error: null })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete("/category/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await Category.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.get('/categories/search', async (req, res) => {
        try {
            const { query: { search } } = req,
                data = await Category.fuzzySearch(search)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}