const dotenv = require("dotenv")
dotenv.config()
const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    cors = require("cors")

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
mongoose.set('debug', true)
const db = mongoose.connection
db.on("error", console.error.bind(console, ">----- Connection Error:"))
db.on("open", () => {
    console.log("> Connected to MongoDB")
})

require("./models/aboutUs.model")
require("./models/admin.model")
require("./models/banner.model")
require("./models/category.model")
require("./models/customerExperience.model")
require("./models/home.model")
require("./models/hotSpot.model")
require("./models/image.model")
require("./models/power.model")
require("./models/solution.model")

app.use(cors())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

require('./routes')(app)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)

    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.code || 500)
            .json({
                status: 'error',
                message: err
            })
    })
}

app.use((err, req, res, next) => {
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        })
})


module.exports = app
