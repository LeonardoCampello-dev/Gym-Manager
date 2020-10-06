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

                return res.render('members/index.njk', { members, filter, pagination })
            }
        }

        Member.paginate(params)
    },
    async create(req, res) {
        const instructorsSelectOptions = await Member.instructorsSelectOptions()

        return res.render('members/create.njk', { instructorsSelectOptions })
    },
    async post(req, res) {
        const memberId = await Member.create(req.body)

        return res.redirect(`/members/${memberId}`)
    },
    async show(req, res) {
        let member = await Member.find(req.params.id)

        if (!member) return res.send('Membro não encontrado!')

        member.birth = date(member.birth).birthDay

        return res.render('members/show.njk', { member })
    },
    async edit(req, res) {
        let member = await Member.find(req.params.id)

        if (!member) return res.send('Membro não encontrado!')

        member.birth = date(member.birth).iso

        const instructorsSelectOptions = await Member.instructorsSelectOptions()

        return res.render('members/edit.njk', { member, instructorsSelectOptions })
    },
    async put(req, res) {
        await Member.update(req.body)

        return res.redirect(`/members/${req.body.id}`)
    },
    async delete(req, res) {
        await Member.delete(req.body.id)

        return res.redirect(`/members`)
    }
}
