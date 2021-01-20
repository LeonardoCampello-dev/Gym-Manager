const express = require("express");
const routes = express.Router();

const instructors = require("../app/controllers/InstructorsController");

const { fillAllFields } = require("../validators/fields");

routes.get("/", instructors.index);
routes.get("/create", instructors.create);
routes.get("/:id", instructors.show);
routes.get("/:id/edit", instructors.edit);

routes.post("/", fillAllFields, instructors.post);
routes.put("/", fillAllFields, instructors.put);
routes.delete("/", instructors.delete);

module.exports = routes;
