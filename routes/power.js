const Power = require("../models/power.model")

module.exports = app => {
    app.post('/power', async (req, res) => {
        try {
            const { body } = req,
                data = new Power(body)
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
            if (data) {
                data.title = body.title
                data.content = body.content
                data.categories = body.categories
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
                data = await Power.find({}).sort({ updatedAt: -1, createdAt: -1 }).limit(limit).skip(page * limit).populate('categories'),
                pagination = { page, limit, total: await Power.countDocuments({}) }
            console.log(data)
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
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