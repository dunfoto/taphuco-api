const Product = require("../models/product.model"),
    { saveImage } = require("../common/image")

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
}