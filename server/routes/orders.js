import { Router } from "express"
import { auth, admin } from './middlewares.js'
import db from "../db.js"
import fs from 'fs'
import multer from "multer"
import FormData from "form-data"
import axios from "axios"

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
  const [orders] = await db.query(`
    select orders.*, users.name as user_name, services.title, services.inputs as inputNames, services.documents AS documentNames, services.api
    from orders
    JOIN services ON orders.service_id=services.id
    JOIN users ON orders.user_id=users.id
    where orders.id = ?
  `, [orderId])
  const order = orders[0]
  const data = []
  order.inputs.forEach((i, index) => {
    data.push({ name: order.inputNames[index], value: i })
  })

  const form = new FormData()
  form.append('note', order.title)
  form.append('user_name', order.user_name)
  form.append('external_id', order.id)
  form.append('reply_api', 'http://localhost/api/fulfillOrder')
  data.forEach(d => {
    form.append('data[]', JSON.stringify(d))
  })

  order.documents.forEach((path, index) => {
    form.append(encodeURIComponent(order.documentNames[index]), fs.readFileSync(`./uploads/${path}`), path)
  })

  try {
    if (order.api) {
      await axios.post(order.api, form, {
        headers: form.getHeaders()
      })
    }
    await db.query("update orders set status=1 where id = ?", [orderId])

  } catch (error) {
    console.error('Error sending data to API')
  } finally {
    res.end()
  }
})

router.post('/api/fulfillOrder', async (req, res) => {
  const { files } = req
  const { id, status } = req.body
  if (status == 1 && files.length) {
    const doc = files[0]
    const fileName = String(Math.random()).substr(-6) + '-' + doc.originalname
    fs.writeFileSync('./uploads/files/' + fileName, doc.buffer)
    const path = 'files/' + fileName
    await db.query("update orders set status=2, result_file=? where id = ?", [path, id])

  } else {
    await db.query("update orders set status=3 where id = ?", [id])
  }
  res.end()
})

router.post('/api/denyOrder', auth, admin, async (req, res) => {
  const { orderId } = req.body
  await db.query("update orders set status=3 where id = ?", [orderId])
  res.end()
})

export default router