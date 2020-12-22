const CustomerExperience = require("../models/customerExperience.model"),
    { saveImage } = require("../common/image")

module.exports = app => {
    app.post('/customer-experience', async (req, res) => {
        try {
            const { body } = req
            console.log(body)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            const data = new CustomerExperience(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.put('/customer-experience/:id', async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await CustomerExperience.findById(id)
            if (body.img.includes("data:image/png;base64")) {
                const data = await saveImage(body.img)
                if (data.error) throw data.error
                body.img = data.result
            }
            if (data) {
                data.img = body.img
                data.title = body.title
                data.description = body.description
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

    app.get('/customer-experiences', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await CustomerExperience.find({}).sort({ updatedAt: -1, createdAt: -1 }).limit(limit).skip(page * limit),
                pagination = { page, limit, total: await CustomerExperience.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/customer-experience/:id', async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await CustomerExperience.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete("/customer-experience/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await CustomerExperience.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success!", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}