const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport")
const jwt = require("jsonwebtoken"),
    Admin = require("../models/admin.model"),
    bcrypt = require("bcryptjs"),
    Permission = require('../models/permission.model'),
    Role = require('../models/role.model'),
    fs = require("fs")

module.exports = (app) => {
    app.post("/login/admin", async (req, res) => {
        try {
            const authAdmin = JSON.parse(await fs.readFileSync("config/admin.json", "utf-8"))
            const {
                body: { email, password },
            } = req
            if (email == authAdmin.email) {
                if (password === authAdmin.password) {

                    roles = await Role.find({})
                    const tokenAuth = jwt.sign({ email, roles }, process.env.JWT_KEY, {
                        expiresIn: 2419200,
                    })
                    res.status(200).json({ data: { email, roles }, token: tokenAuth, errors: null })
                } else {
                    res
                        .status(302)
                        .json({ data: null, errors: "Have somethings problem!" })
                }
            } else {
                const admin = await Admin.findOne({ email })
                if (admin) {
                    const isPassword = await bcrypt.compare(password, admin.password)
                    if (isPassword) {
                        const tokenAuth = jwt.sign((await basicAdmin(admin)), process.env.JWT_KEY, {
                            expiresIn: 2419200,
                        })
                        res.status(200).json({ data: await basicAdmin(admin), token: tokenAuth, errors: null })
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

const basicAdmin = async admin => {
    const { _id, email, permission } = admin,
        roles = (await Permission.findById(permission).populate('roles')).roles
    return { _id, email, permission, roles }
}