const Model = require("../models/admin.model"),
    mongoose = require("mongoose")

module.exports = (app) => {
    /**
     * @swagger
     * /admins:
     *   get:
     *     tags:
     *       - Admin
     *     description: Returns all admin
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of admin
     */
    app.get("/admins", async (req, res) => {
        try {
            const lst = await Model.find()
            res.status(200).json({ data: lst, errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: err })
        }
    })

    /**
     * @swagger
     * /admin:
     *   post:
     *     tags:
     *      - Admin
     *     description: Creates a new admin
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: admin
     *         description: '{"username": "example", "email": "example@domain.com", "password": "Example123" }'
     *         in: body
     *         required: true
     *     responses:
     *       200:
     *         description: Successfully created
     */
    app.post("/admin", async (req, res) => {
        try {
            const { body } = req
            const newRecord = new Model(body)
            await newRecord.save()
            res.status(200).json({ data: newRecord, errors: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, errors: err })
        }
    })

    /**
     * @swagger
     * /admin/{id}:
     *   get:
     *     tags:
     *       - Admin
     *     description: Returns a single admin
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: admin's id
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: A single admin
     */
    app.get("/admin/:id", async (req, res) => {
        const { id } = req.params
        console.log(mongoose.Types.ObjectId(id))
        try {
            const detail = await Model.findById(mongoose.Types.ObjectId(id))
            res.status(200).json({ data: detail, errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: err })
        }
    })

    /**
     * @swagger
     * /admin/{id}:
     *   put:
     *     tags:
     *      - Admin
     *     description: Update a new admin
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: id admin
     *         in: path
     *         required: true
     *       - name: admin
     *         description: '{"username": "example", "email": "example@domain.com", "password": "Example123" }'
     *         in: body
     *         required: true
     *     responses:
     *       200:
     *         description: Successfully created
     */
    app.put("/admin/:id", async (req, res) => {
        try {
            const {
                body,
                params: { id },
            } = req
            const newUpdate = await Model.findOneAndUpdate({ id }, body)
            res.status(200).json({ data: newUpdate, errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: err })
        }
    })

    /**
     * @swagger
     * /admin/{id}:
     *   delete:
     *     tags:
     *       - Admin
     *     description:
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: admin's id
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: A single admin
     */
    app.delete("/admin/:id", async (req, res) => {
        try {
            const {
                params: { id },
            } = req
            await Model.findByIdAndDelete(id)
            res.status(200).json({ data: "Delete success", errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: err })
        }
    })
}
