import { Router } from "express"
import { auth, admin } from './middlewares.js'
import db from "../db.js"
import fs from 'fs'
import multer from "multer"

const router = Router()
const upload = multer()
router.use(upload.any())

router.get('/api/orders', auth, async (req, res) => {
  const [orders] = await db.query(`select * from orders where user_id=?`, [req.userData.id])
  res.json(orders)
})

router.get('/api/orders/:id', auth, admin, async (req, res) => {
  const [data] = await db.query(`select * from orders where id=?`, [req.params.id])
  res.json(data[0])
})

router.get('/api/allOrders', auth, admin, async (req, res) => {
  const [orders] = await db.query(`select * from orders ORDER BY status ASC, created_at`)
  res.json(orders)
})

router.post('/api/order', auth, async (req, res) => {
  const { files: documents } = req
  const {  serviceId, inputs } = req.body
  const { userData } = req

  const fileNames = []
  if (documents?.length) {
    documents.forEach(doc => {
      const fileName = String(Math.random()).substr(-6) + '-' + doc.originalname
      fs.writeFileSync('./uploads/files/' + fileName, doc.buffer)
      fileNames.push('files/' + fileName)
    })
  }

  const order = {
    user_id: userData.id,
    service_id: serviceId,
    inputs: JSON.stringify(inputs),
    documents: JSON.stringify(fileNames)
  }

  const [{ insertId }] = await db.query("insert into orders set ?", order)
  res.json({ id: insertId })
})

router.post('/api/acceptOrder', auth, admin, async (req, res) => {
  const { orderId } = req.body
  await db.query("update orders set status=1 where id = ?", [orderId])
  res.end()
})

router.post('/api/denyOrder', auth, admin, async (req, res) => {
  const { orderId } = req.body
  await db.query("update orders set status=3 where id = ?", [orderId])
  res.end()
})

export default router