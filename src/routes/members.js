const express = require("express");
const routes = express.Router();

const members = require("../app/controllers/MembersController");

const { fillAllFields } = require("../validators/fields");

routes.get("/", members.index);
routes.get("/create", members.create);
routes.get("/:id", members.show);
routes.get("/:id/edit", members.edit);

routes.post("/", fillAllFields, members.post);
routes.put("/", fillAllFields, members.put);
routes.delete("/", members.delete);

module.exports = routes;
