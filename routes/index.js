module.exports = app => {
    require("./auth")(app)
    require("./admin")(app)
    require("./adminCMS")(app)
    require("./config")(app)
    require("./banner")(app)
}