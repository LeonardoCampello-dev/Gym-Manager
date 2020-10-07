const Member = require('../models/Member')
const { date } = require('../../lib/utils')

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

            const members = await Member.paginate(params)

            const pagination = {
                total: Math.ceil(members[0].total / limit),
                page
            }

            return res.render('members/index.njk', { members, pagination, filter })
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        try {
            const instructorsSelectOptions = await Member.instructorsSelectOptions()

            return res.render('members/create.njk', { instructorsSelectOptions })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const memberId = await Member.create(req.body)

            return res.redirect(`/members/${memberId}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            let member = await Member.find(req.params.id)

            if (!member) return res.send('Membro não encontrado!')

            member.birth = date(member.birth).birthDay

            return res.render('members/show.njk', { member })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            let member = await Member.find(req.params.id)

            if (!member) return res.send('Membro não encontrado!')

            member.birth = date(member.birth).iso

            const instructorsSelectOptions = await Member.instructorsSelectOptions()

            return res.render('members/edit.njk', { member, instructorsSelectOptions })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            await Member.update(req.body)

            return res.redirect(`/members/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        try {
            await Member.delete(req.body.id)

            return res.redirect(`/members`)
        } catch (error) {
            console.error(error)
        }
    }
}
