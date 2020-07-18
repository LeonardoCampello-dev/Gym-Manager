const instructor = require('../models/instructor')
const { date, age } = require('../../lib/utils')

module.exports = {
    index(req, res) {
        instructor.all((instructors) => {
            return res.render("instructors/index", { instructors })
        })
    },
    create(req, res) {
        return res.render("instructors/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }
        
        instructor.create(req.body, (instructor) => {
            return res.redirect(`/instructors/${instructor.id}`)
        })
    },
    show(req, res) {
        instructor.find(req.params.id, (instructor) => {
            if (!instructor) return res.send("Instructor not found!")

            instructor.age = age(instructor.age)
            instructor.services = instructor.services.split(",")

            instructor.created_at = date(instructor.created_at).format

            return res.render("instructors/show", { instructor })
        })
    },
    edit(req, res) {
        return
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        return
    },
    delete(req, res) {
        return
    }
}

