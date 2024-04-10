import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
// import sendMail from '../mail.js';
import { Router } from "express"
import { auth, admin } from './middlewares.js'
import db from "../db.js"

let router = Router()

/**
 * 
 * @param {String} _id - The id or the account object
 */
async function genrateToken(_id) {
  let account
  if (typeof _id == 'string') {
    const [result] = await (await db).query("select id, name, email, nationalId, admin from users where id = ?", [_id])
    account = result[0]

  } else {
    account = _id
  }

  if (!account) return

  // check if user is banned
  // if (account.banned) {
  //   res.status(403).json({banned: true})
  // }
  let payload = {
    id: account.id,
    name: account.name,
    email: account.email,
    nationalId: account.nationalId,
    admin: !!account.admin
  }

  return jwt.sign(payload, process.env.TOKEN_SECRET)
}

router.post('/api/refreshToken', async (req, res)=> {
  try {
    let token = req.body.token
    let data = jwt.verify(token, process.env.TOKEN_SECRET)
    const [[user]] = await db.query("select id, name, email, nationalId, admin from users where id = ?", [data.id])
    if (!user) {
      return res.sendStatus(401)
    }
    // token is OK
    let newToken = await genrateToken(user)
    if (!newToken) throw new Error('invalid token')
    res.json({token: newToken})

  } catch (error) {
    // token invalid
    res.sendStatus(401)
  }
})

async function register(req, res) {
  const { password, name, nationalId } = req.body
  let { email } = req.body

  if (!/\w{2,}@\w{2,}\.\w{2,}/i.test(email)) {
    return res.status(401).json(
      {
        email: "E-mail invalid"
      }
    )
  }
  email = email.toLowerCase()

  if (!name || name.length < 3) {
    return res.status(401).json(
      {
        name: "Name cant be less than 3 characters"
      }
    );
  }

  if (!password || password.length < 8) {
    return res.status(401).json(
      {
        password: "Password cant be less than 8 characters"
      }
    );
  }

  const [result] = await db.query("select email from users where email = ?", [email])

  if (result && result.length > 0) {
    if (email == result[0].email) {
      return res.status(401).json(
        {
          email: "Email is already registered"
        }
      );
    }
  } else {
    const [result] = await db.query("select id from users limit 1")

    const account = {
      password: await bcrypt.hash(password, 10),
      name,
      email,
      nationalId,
      admin: result.length === 0? 1:0
    }

    const [{ insertId }] = await db.query("insert into users set ?", account)

    res.json({ token: await genrateToken(insertId+'')})
    return insertId
  }
}

router.post('/api/register', register)

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const [[user]] = await db.query(`
      select id, name, email, nationalId, admin, password from users
      where email = ?`
    , [email])

    if (!user) {
      return res.status(401).json({
        email: "Unkown email" });
    } else {
      if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).json({
          password: "Wrong password"
        })
      }
    }

    const token = await genrateToken(user)
    res.status(201).json({ token })

  } catch (err) {
    console.error(err)
    res.status(400).json({ err: err })
  }
})

router.get('/api/user/:id', auth, async (req, res)=> {
  const { id } = req.params
  const [[user]] = await db.query("select id, email, name, nationalId from users where id = ?", [id])
  res.json(user)
})

router.get('/api/users', auth, admin, async (req, res) => {
  console.log('hiasd')
  const [users] = await db.query(`select id, username, first_name, last_name from users WHERE userType = 3`)
  res.json(users)
})

router.post('/api/deleteUser/:userId', auth, admin, async (req, res) => {
  const { userId } = req.params
  await db.query(`delete from users where id = ?`, [userId])
  res.end()
})

export default router
