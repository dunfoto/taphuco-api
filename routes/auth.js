const jwt = require("jsonwebtoken"),
    Admin = require("../models/admin.model"),
    bcrypt = require("bcryptjs")

module.exports = (app) => {
    app.post("/login/admin", async (req, res) => {
        try {
            const {
                body: { email, password },
            } = req
            const admin = await Admin.findOne({ email })
            console.log("ADMIN", admin)
            if (admin) {
                const isPassword = await bcrypt.compare(password, admin.password)
                console.log("CHECK PASSWORD", isPassword)
                if (isPassword) {
                    const tokenAuth = jwt.sign(admin.toJSON(), process.env.JWT_KEY, {
                        expiresIn: 2419200,
                    })
                    res.status(200).json({ data: basicAdmin(admin), token: tokenAuth, errors: null })
                } else {
                    res
                        .status(302)
                        .json({ data: null, errors: "Have somethings problem!" })
                }
            } else {
                res
                    .status(302)
                    .json({ data: null, errors: "Have somethings problem!" })
            }
        } catch (err) {
            console.log(err)
            res.status(302).json({ data: null, errors: err })
        }
    })

    app.post("/register/admin", async (req, res) => {
        try {
            const { body } = req,
                data = new Admin(body)

            data.password = await bcrypt.hash(data.password, 10)
            await data.save()
            res.status(200).json({ data, errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: "Email was existed!" })
        }
    })
}

const basicAdmin = admin => {
    const { _id, email, roles } = admin
    return { _id, email, roles }
}