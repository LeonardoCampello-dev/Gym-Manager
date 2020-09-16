const express = require('express')
const routes = express.Router()

const members = require('../app/controllers/members')

routes.get("/", members.index)
routes.get("/create", members.create)
routes.get("/:id", members.show)
routes.get("/:id/edit", members.edit)

routes.post("/", members.post)
routes.put("/", members.put)
routes.delete("/", members.delete)

module.exports = routes