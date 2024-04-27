import { Router } from "express"
import { auth, admin } from './middlewares.js'
import db from "../db.js"

const router = Router()

router.get('/api/messages', auth, admin, async (req, res) => {
  const [messages] = await db.query(`select Messages.*, users.name, users.email from messages INNER JOIN users ON Messages.user_id=users.id ORDER BY 'created_at' DESC`)
  res.json(messages)
})

router.get('/api/messages/:id', auth, admin, async (req, res) => {
  const { id } = req.params
  if (id != null) {
    await db.query(`update messages set seen = 1 where id = ?`, [id])
  }
  res.end()
})

router.post('/api/message', auth, async (req, res) => {
  const { orderNo, message } = req.body
  await db.query("insert into messages set ?", {
    order_no: orderNo,
    message,
    user_id: req.userData.id
  })
  res.end()
})

export default router