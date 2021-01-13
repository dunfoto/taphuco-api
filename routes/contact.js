const Contact = require("../models/contact.model")

module.exports = app => {
    app.post('/contact', async (req, res) => {
        try {
            const { body } = req,
                data = new Contact(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/contacts', async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Contact.find({}).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await Contact.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get('/contact/:id', async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Contact.findById(id)
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}