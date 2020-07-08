import { Pool } from "pg"

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
  max: parseInt(process.env.MAX_CLIENTS, 10) || 10,
  ssl: process.env.NODE_ENV === "production" && {
    cert: process.env.PG_CERT,
    rejectUnauthorized: false,
  },
})

pgPool.on("error", (err) => {
  console.error("Unexpected error in PostgresSQL connection pool", err)
})

export const queryChildrenByGuardianEmail = async (guardianEmail: string) => {
  const client = await pgPool.connect()

  try {
    // language=PostgreSQL
    const result = await client.query<{ id: string; name: string }>(
      `
              SELECT s.id, s.name
              FROM students s
                       JOIN guardian_to_students gts ON s.id = gts.student_id
                       JOIN guardians g ON gts.guardian_id = g.id
              WHERE g.email = $1
    `,
      [guardianEmail]
    )
    return result.rows
  } finally {
    client.release()
  }
}

export const queryChildData = async (
  guardianEmail: string,
  childId: string
) => {
  const client = await pgPool.connect()

  try {
    // language=PostgreSQL
    const result = await client.query(
      `
              SELECT s.id, s.name, school.name as school_name, s.profile_pic
              FROM students s
                       JOIN schools school ON s.school_id = school.id
                       JOIN guardian_to_students gts ON s.id = gts.student_id
                       JOIN guardians g ON gts.guardian_id = g.id
              WHERE g.email = $1
                AND s.id = $2
    `,
      [guardianEmail, childId]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}
