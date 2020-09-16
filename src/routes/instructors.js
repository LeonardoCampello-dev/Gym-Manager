const express = require('express')
const routes = express.Router()

const instructors = require('../app/controllers/instructors')

routes.get("/", instructors.index)
routes.get("/create", instructors.create)
routes.get("/:id", instructors.show)
routes.get("/:id/edit", instructors.edit)

routes.post("/", instructors.post)
routes.put("/", instructors.put)
routes.delete("/", instructors.delete)

module.exports = routes