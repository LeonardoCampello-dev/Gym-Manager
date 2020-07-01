const express = require('express')
const { Router } = require('express')
const instructors = require('./instructors')

const routes = express.Router()

routes.get("/", (req, res) => {
    return res.redirect("instructors")
})

routes.get("/instructors", (req, res) => {
    return res.render("instructors/index")
})

routes.get("/instructors/create", (req, res) => {
    return res.render("instructors/create")
})

routes.post("/instructors", instructors.post)

routes.get("/members", (req, res) => {
    return res.render("members")
})

module.exports = routes
