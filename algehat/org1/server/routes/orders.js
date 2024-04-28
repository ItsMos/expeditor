import { Router } from "express"
import { auth } from './middlewares.js'
import db from "../db.js"
import fs from 'fs'
import multer from "multer"
import FormData from "form-data"
import axios from "axios"

const router = Router()
const upload = multer()
router.use(upload.any())

router.get('/api/orders/:id', auth, async (req, res) => {
  const [data] = await db.query(`select * from requests where id=?`, [req.params.id])
  res.json(data[0])
})

router.get('/api/allOrders', auth, async (req, res) => {
  const [orders] = await db.query(`select * from requests ORDER BY status ASC, created_at`)
  res.json(orders)
})

router.post('/api', async (req, res) => {
  const { files } = req
  const {  note, user_name, external_id, reply_api } = req.body

  const data = req.body.data.map(obj => JSON.parse(obj))
  const request = {
    note,
    user_name,
    external_id,
    data: JSON.stringify(data),
    files: [],
    reply_api
  }

  if (files?.length) {
    files.forEach(file => {
      const fileName = String(Math.random()).substr(-6) + '-' + file.originalname
      fs.writeFileSync('./uploads/files/' + fileName, file.buffer)
      request.files.push({ name: decodeURIComponent(file.fieldname), path: 'files/' + fileName })
    })
  }

  request.files = JSON.stringify(request.files)

  const [{ insertId }] = await db.query("insert into requests set ?", request)
  res.json({ id: insertId })
})

router.post('/api/acceptOrder', auth, async (req, res) => {
  const { files } = req
  const { id } = req.body
  const form = new FormData()
  form.append('status', 1)
  if (files.length) {
    const doc = files[0]
    const fileName = String(Math.random()).substr(-6) + '-' + doc.originalname
    fs.writeFileSync('./uploads/files/' + fileName, doc.buffer)
    const path = 'files/' + fileName
    await db.query("update requests set status=1, result_file=? where id = ?", [path, id])

    form.append('result_file', doc.buffer, doc.originalname)
  }

  const [requests] = await db.query("select * from requests where id = ?", [id])
  const request = requests[0]
  form.append('id', request.external_id)

  try {
    if (request.reply_api) {
      await axios.post(request.reply_api, form, {
        headers: form.getHeaders()
      })
    }

  } catch (error) {
    console.error('Error sending data to API')
  } finally {
    res.end()
  }
})

router.post('/api/denyOrder', auth, async (req, res) => {
  const { id } = req.body
  const [requests] = await db.query("select * from requests where id = ?", [id])
  const request = requests[0]

  await db.query("update requests set status=2 where id = ?", [id])
  try {
    if (request.reply_api) {
      await axios.post(request.reply_api, { status: 0, id: request.external_id })
    }

  } catch (error) {
    console.error('Error sending data to API')
  } finally {
    res.end()
  }
})

export default router