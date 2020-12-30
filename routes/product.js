const Product = require("../models/product.model"),
    Category = require('../models/category.model'),
    { saveImage } = require("../common/image"),
    { isValidObjectId } = require('../common/mongoose'),
    decodeUriComponent = require('decode-uri-component'),
    escapeStringRegexp = require('escape-string-regexp')

module.exports = app => {
    app.post('/product', async (req, res) => {
        try {
            const { body } = req
            body.imgs = await Promise.all(body.imgs.map(async (img, index) => {
                if (img.includes("data:image/png;base64")) {
                    const data = await saveImage(img)
                    if (data.error) throw data.error
                    return data.result
                } else {
                    return img
                }
            }))
            const data = new Product(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put('/product/:id', async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Product.findById(id)
            if (data) {
                body.imgs = await Promise.all(body.imgs.map(async (img, index) => {
                    if (img.includes("data:image/png;base64")) {
                        const data = await saveImage(img)
                        if (data.error) throw data.error
                        return data.result
                    } else {
                        return img
                    }
                }))
                data.title = body.title
                data.imgs = body.imgs
                data.prepare = body.prepare
                data.afterDye = body.afterDye
                data.complete = body.complete
                data.category = body.category
                await data.save()
                res.status(200).json({ data: "Update success", error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no this record in system!" })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/products', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Product.find({}).sort({ updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))).populate('category'),
                pagination = { page, limit, total: await Product.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/products/all", async (req, res) => {
        try {
            const data = await Product.find({}).sort({ updatedAt: -1, createdAt: -1 })
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/product/:id', async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Product.findById(id)
            if (data) {
                res.status(200).json({ data, error: null })
            } else {
                res.status(302).json({ data: null, error: "Have no exist record!" })
            }
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })


    app.get('/product/:id/:idProduct', async (req, res) => {
        try {
            const { params: { id, idProduct } } = req
            if (isValidObjectId(id)) {
                const category = await Category.findById(id)
                if (category) {
                    if (isValidObjectId(idProduct)) {
                        const data = await Product.findById(idProduct)
                        res.status(200).json({ data, error: null })
                    } else {
                        const $regex = escapeStringRegexp(decodeUriComponent(idProduct)),
                            data = await Product.findOne({ title: { $regex }, category: category._id })
                        res.status(200).json({ data, error: null })
                    }
                } else {
                    res.status(302).json({ data: null, error: "Don't match category with product" })
                }
            } else {
                const $regex = escapeStringRegexp(decodeUriComponent(id)),
                    category = await Category.findOne({ title: { $regex } })
                if (category) {
                    if (isValidObjectId(idProduct)) {
                        const data = await Product.findById(idProduct)
                        res.status(200).json({ data, error: null })
                    } else {
                        const $regex = escapeStringRegexp(decodeUriComponent(idProduct)),
                            data = await Product.findOne({ title: { $regex }, category: category._id })
                        res.status(200).json({ data, error: null })
                    }
                } else {
                    res.status(302).json({ data: null, error: "Don't match category with product" })
                }
            }
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.get('/product-ref/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            if (isValidObjectId(id)) {
                const category = await Category.findById(id),
                    data = await Product.find({ category: category._id })
                if (data) {
                    res.status(200).json({ data, error: null })
                } else {
                    res.status(302).json({ data: null, error: "Have no record" })
                }
            } else {
                const $regex = escapeStringRegexp(decodeUriComponent(id)),
                    category = await Category.findOne({ title: { $regex } }),
                    data = await Product.find({ category: category._id })
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

    app.delete('/product/:id', async (req, res) => {
        try {
            const { params: { id } } = req
            await Product.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}