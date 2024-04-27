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
    name: account.name
  }

  return jwt.sign(payload, process.env.TOKEN_SECRET)
}

router.post('/api/refreshToken', async (req, res)=> {
  try {
    let token = req.body.token
    let data = jwt.verify(token, process.env.TOKEN_SECRET)
    // token is OK
    let newToken = await genrateToken({
      id: 0,
      name: 'admin'
    })
    if (!newToken) throw new Error('invalid token')
    res.json({token: newToken})

  } catch (error) {
    // token invalid
    res.sendStatus(401)
  }
})

const adminPass = bcrypt.hash('admin', 10)

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body


    if (email === 'admin') {
      if (!await bcrypt.compare(password, await adminPass)) {
        return res.status(401).json({
          password: "Wrong password"
        })
      }

    } else {
      return res.status(401).json({
        email: "Unkown email" });
    }

    const token = await genrateToken({
      id: 0,
      name: 'admin'
    })
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
