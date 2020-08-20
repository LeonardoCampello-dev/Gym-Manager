const Member = require('../models/Member')
const { date } = require('../../lib/utils')

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
            callback(members) {
                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }

                return res.render("members/index", { members, filter, pagination })
            }
        }

        Member.paginate(params)
    },
    async create(req, res) {
        let results = await Member.instructorsSelectOptions()
        const instructorsSelectOptions = results.rows

        return res.render("members/create", { instructorsSelectOptions })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        let results = await Member.create(req.body)
        const memberId = results.rows[0].id

        return res.redirect(`/members/${memberId}`)
    },
    async show(req, res) {
        let results = await Member.find(req.params.id)
        const member = results.rows[0]

        if (!member) return res.send("Member not found!")

        member.birth = date(member.birth).birthDay

        return res.render("members/show", { member })
    },
    async edit(req, res) {
        let results = await Member.find(req.params.id)
        const member = results.rows[0]

        if (!member) return res.send("Member not found!")

        member.birth = date(member.birth).iso

        results = await Member.instructorsSelectOptions()
        const instructorsSelectOptions = results.rows

        return res.render("members/edit", { member, instructorsSelectOptions })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        let results = await Member.update(req.body)

        return res.redirect(`/members/${req.body.id}`)
    },
    async delete(req, res) {
        let results = await Member.delete(req.body.id)

        return res.redirect(`/members`)
    }
}
