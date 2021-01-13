const { validate } = require("../models/role.model")
const Role = require("../models/role.model"),
    mongoose = require('mongoose')

module.exports = app => {
    app.post("/role", async (req, res) => {
        try {
            const { body } = req,
                data = new Role(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (error) {
            res.status(302).json({ data: null, error })
        }
    })

    app.get('/roles', async (req, res) => {
        try {
            const data = await Role.find({}).sort({ code: 1 })
            console.log(data)
            res.status(200).json({ data, error: null })
        } catch (error) {
            res.status(302).json({ data: null, error })
        }
    })
}