const { checkAdmin } = require("../common/Authentication")
module.exports = app => {
    app.post("/check-token", checkAdmin, (req, res) => {
        try {
            res.status(200).json({ data: "Token is valid", errors: null })
        } catch (err) {
            res.status(302).json({ data: null, errors: err })
        }
    })
}