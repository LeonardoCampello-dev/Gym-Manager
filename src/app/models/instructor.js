const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`SELECT * FROM instructors`, (err, results) => {
            if (err) return res.send(`Database error: ${err}`)

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
        INSERT INTO instructors (
            avatar_url,
            name,
            birth,
            gender,
            services,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.services,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results) => {
            if (err) return res.send(`Database error: ${err}`)

            callback(results.rows[0])
        })

    },
    find(id, callback) {
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], (err, results) => {
            if (err) return res.send(`Database error: ${err}`)

            callback(results.rows[0])
        })
    }
}