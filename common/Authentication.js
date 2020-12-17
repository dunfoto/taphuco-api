const jwt = require("jsonwebtoken"),
    Admin = require("../models/admin.model")

const checkAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        const admin = await Admin.findOne({ _id: data._id }).populate(["google", "facebook", "orders"])
        if (!admin) {
            throw new Error()
        }
        req.admin = admin
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send({ data: null, errors: 'Not authorized to access this resource' })
    }
}

module.exports = {
    checkAdmin
}