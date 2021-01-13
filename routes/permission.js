const Permission = require("../models/permission.model")

module.exports = app => {
    app.post("/permission", async (req, res) => {
        try {
            const { body } = req,
                data = new Permission(body)
            await data.save()
            res.status(200).json({ data, error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })


    app.put("/permission/:id", async (req, res) => {
        try {
            const { params: { id }, body } = req,
                data = await Permission.findById(id)
            if (data) {
                data.name = body.name
                data.roles = body.roles
                data.level = body.level
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

    app.get("/permission/:id", async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Permission.findById(id).populate('roles')
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/permissions", async (req, res) => {
        try {
            const { query: { page = 0, limit = 10 } } = req,
                data = await Permission.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 }).limit(Number(limit)).skip(Number(Number(page) * Number(limit))),
                pagination = { page, limit, total: await Permission.countDocuments({}) }
            res.status(200).json({ data, pagination, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.get("/permissions/all", async (req, res) => {
        try {
            const data = await Permission.find({}).sort({ position: 1, updatedAt: -1, createdAt: -1 }).select("name")
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete("/permission/:id", async (req, res) => {
        try {
            const { params: { id } } = req
            await Permission.findByIdAndDelete(id)
            res.status(200).json({ data: "Deleted success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}