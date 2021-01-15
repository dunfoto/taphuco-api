const jwt = require("jsonwebtoken"),
    Admin = require("../models/admin.model"),
    Permission = require("../models/permission.model")

const validation = role => async (req, res, next) => {
    if (!Boolean(role)) return next()
    try {
        const token = req.header('Authorization')
        if (!Boolean(token)) throw new Error()
        const data = jwt.verify(token, process.env.JWT_KEY)
        if (data.email === "admin@gmail.com") {
            next()
        } else {
            const admin = await Admin.findOne({ _id: data._id }),
                permissions = await Permission.findById(admin.permission).populate("roles")
            if (!admin) throw new Error()
            if (!Boolean(permissions.roles.find(temp => temp.code == role))) throw new Error()
            req.admin = admin
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(401).send({ data: null, errors: 'Not authorized to access this resource' })
    }
}

module.exports = {
    validation
}