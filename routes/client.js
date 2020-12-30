const Client = require('../models/client.model'),
    { removeImage, saveImage } = require('../common/image')

module.exports = app => {
    app.get('/clients', async (req, res) => {
        try {
            const data = await Client.find({})
            res.status(200).json({ data, error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })

    app.post('/client', async (req, res) => {
        try {
            const { body } = req,
                newBody = body.filter(temp => temp.includes("data:image/png;base64")),
                imgs = await Promise.all(newBody.map(async img => {
                    if (img.includes("data:image/png;base64")) {
                        const data = await saveImage(img)
                        if (data.error) throw data.error
                        return { img: data.result }
                    } else {
                        return { img }
                    }
                }))
            await Client.insertMany(imgs, { ordered: false })
            res.status(200).json({ data: "Success", error: null })
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, error: err })
        }
    })

    app.delete('/client/:id', async (req, res) => {
        try {
            const { params: { id } } = req,
                data = await Client.findById(id)
            removeImage(data.img)
            await data.remove()
            res.status(200).json({ data: "Deleted success", error: null })
        } catch (err) {
            res.status(302).json({ data: null, error: err })
        }
    })
}