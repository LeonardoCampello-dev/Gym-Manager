const express = require('express')
const routes = express.Router()

const instructors = require('./instructors')
const members = require('./members')

routes.use('/instructors', instructors)
routes.use('/members', members)

routes.get("/", (req, res) => {
    return res.redirect("instructors")
})

module.exports = routes
