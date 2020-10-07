const Instructor = require('../models/Instructor')
const { date, age } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            let { filter, page, limit } = req.query

            page = page || 1
            limit = limit || 3
            offset = limit * (page - 1)

            params = {
                page,
                limit,
                offset,
                filter
            }

            const instructors = await Instructor.paginate(params)

            const pagination = {
                total: Math.ceil(instructors[0].total / limit),
                page
            }

            if (!instructors) return res.send('Erro ao encontrar instrutores!')

            for (let instructor of instructors) {
                instructor.services = instructor.services.split(',')
            }

            return res.render('instructors/index.njk', { instructors, pagination, filter })
        } catch (error) {
            console.error(error)
        }
    },
    create(req, res) {
        return res.render('instructors/create.njk')
    },
    async post(req, res) {
        try {
            let instructorId = await Instructor.create(req.body)

            return res.redirect(`/instructors/${instructorId}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            let instructor = await Instructor.find(req.params.id)

            if (!instructor) return res.send('Instrutor não encontrado!')

            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(',')
            instructor.created_at = date(instructor.created_at).format

            return res.render('instructors/show.njk', { instructor })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            let instructor = await Instructor.find(req.params.id)

            if (!instructor) return res.send('Instrutor não encontrado!')

            instructor.birth = date(instructor.birth).iso

            return res.render('instructors/edit.njk', { instructor })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            await Instructor.update(req.body)

            return res.redirect(`/instructors/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            await Instructor.delete(req.body.id)

            return res.redirect(`/instructors`)
        } catch (error) {
            console.error(error)
        }
    }
}

