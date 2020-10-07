const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    async all(callback) {
        const results = await db.query(`SELECT * FROM members ORDER BY name ASC`)

        return results.rows
    },
    async create(data) {
        const query = `
        INSERT INTO members (
            avatar_url,
            name,
            email,
            birth,
            gender,
            blood,
            weight,
            height,
            instructor_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            data.gender,
            data.blood,
            data.weight,
            data.height,
            data.instructor
        ]

        const results = await db.query(query, values)

        return results.rows[0].id
    },
    async find(id) {
        const query = `
        SELECT members.*, instructors.name AS instructor_name
        FROM members
        LEFT JOIN instructors ON (members.instructor_id = instructors.id)
        WHERE members.id = $1
        `

        const results = await db.query(query, [id])

        return results.rows[0]
    },
    update(data) {
        const query = `
            UPDATE members SET
                avatar_url=($1),
                name=($2),
                email=($3),
                birth=($4),
                gender=($5),
                blood=($6),
                weight=($7),
                height=($8),
                instructor_id=($9)
            WHERE id = $10
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            data.gender,
            data.blood,
            data.weight,
            data.height,
            data.instructor,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM members WHERE id = $1`, [id])
    },
    async instructorsSelectOptions() {
        const results = await db.query(`SELECT name, id FROM instructors`)
        return results.rows
    },
    async paginate({ filter, limit, offset }) {
        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM members
            ) AS total`

        if (filter) {
            filterQuery = `
            WHERE members.name ILIKE '%${filter}%'
            OR members.email ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM members
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT members.*, ${totalQuery}
        FROM members
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `

        const results = await db.query(query, [limit, offset])

        return results.rows
    }
}