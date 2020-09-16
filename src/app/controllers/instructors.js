const Instructor = require('../models/Instructor')
const { date, age } = require('../../lib/utils')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 3
        offset = limit * (page - 1)

        params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors) {

                const pagination = {
                    total: Math.ceil(instructors[0].total / limit),
                    page
                }

                for (let instructor of instructors) {
                    instructor.services = instructor.services.split(',')
                }

                return res.render('instructors/index', { instructors, filter, pagination })
            }
        }

        Instructor.paginate(params)
    },
    create(req, res) {
        return res.render('instructors/create')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        let instructorId = await Instructor.create(req.body)

        return res.redirect(`/instructors/${instructorId}`)
    },
    async show(req, res) {
        let instructor = await Instructor.find(req.params.id)

        if (!instructor) return res.send('Instructor not found!')

        instructor.age = age(instructor.birth)
        instructor.services = instructor.services.split(',')
        instructor.created_at = date(instructor.created_at).format

        return res.render('instructors/show', { instructor })
    },
    async edit(req, res) {
        let instructor = await Instructor.find(req.params.id)

        if (!instructor) return res.send('Instructor not found!')

        instructor.birth = date(instructor.birth).iso

        return res.render('instructors/edit', { instructor })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        await Instructor.update(req.body)

        return res.redirect(`/instructors/${req.body.id}`)
    },
    async delete(req, res) {
        await Instructor.delete(req.body.id)

        return res.redirect(`/instructors`)
    }
}

