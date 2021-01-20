const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  async all() {
    const query = `
        SELECT instructors.*, count(members) AS total_members
        FROM instructors
        LEFT JOIN members ON (members.instructor_id = instructors.id)
        GROUP BY instructors.id
        ORDER BY total_members DESC
        `;

    const results = await db.query(query);

    return results.rows;
  },
  async create(data) {
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
    `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      date(Date.now()).iso,
    ];

    const results = await db.query(query, values);

    return results.rows[0].id;
  },
  async find(id) {
    const results = await db.query(`SELECT * FROM instructors WHERE id = $1`, [
      id,
    ]);

    return results.rows[0];
  },
  async findBy(filter) {
    const query = `
        SELECT instructors.*, count(members) AS total_members
        FROM instructors
        LEFT JOIN members ON (members.instructor_id = instructors.id)
        WHERE instructors.name ILIKE '%${filter}%'
        OR instructors.services ILIKE '%${filter}%'
        GROUP BY instructors.id
        ORDER BY total_members DESC
        `;

    const results = await db.query(query);

    return results.rows;
  },
  update(data) {
    const query = `
            UPDATE instructors SET
                avatar_url=($1),
                name=($2),
                birth=($3),
                gender=($4),
                services=($5)
            WHERE id = $6
        `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id,
    ];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE FROM instructors WHERE id = $1`, [id]);
  },
  async paginate({ filter, limit, offset }) {
    let query = "",
      filterQuery = "",
      totalQuery = `(
                SELECT count(*) FROM instructors
            ) AS total`;

    if (filter) {
      filterQuery = `
            WHERE instructors.name ILIKE '%${filter}%'
            OR instructors.services ILIKE '%${filter}%'
            `;

      totalQuery = `(
                SELECT count(*) FROM instructors
                ${filterQuery}
            ) AS total`;
    }

    query = `
        SELECT instructors.*, ${totalQuery}, count(members) AS total_members
        FROM instructors
        LEFT JOIN members ON (members.instructor_id = instructors.id)
        ${filterQuery}
        GROUP BY instructors.id LIMIT $1 OFFSET $2
        `;

    const results = await db.query(query, [limit, offset]);

    return results.rows;
  },
};
