import { Router } from "express"
import { auth, admin } from './middlewares.js'
import db from "../db.js"

const router = Router()

router.post('/api/services', auth, admin, async (req, res) => {
  let { title, description, fee, time, conditions, documents, inputs, api } = req.body
  if ([title, description, fee, time].some(p => p == null)) return res.sendStatus(400)

  conditions = conditions.filter(c => !!c.trim())
  documents = documents.filter(c => !!c.trim())
  inputs = inputs.filter(c => !!c.name.trim())

  const [{insertId: serviceId}] = await db.query("insert into services SET ?", {
    title,
    description,
    fee,
    time,
    api,
    conditions: JSON.stringify(conditions),
    documents: JSON.stringify(documents),
    inputs: JSON.stringify(inputs)
  })

  const [[service]] = await db.query("select * from services where id = ?", [serviceId])
  res.json(service)
})

router.post('/api/services/:id', auth, admin, async (req, res) => {
  let { title, description, fee, time, conditions, documents, inputs, api } = req.body
  if ([title, description, fee, time].some(p => p == null)) return res.sendStatus(400)

  conditions = conditions.filter(c => !!c.trim())
  documents = documents.filter(c => !!c.trim())
  inputs = inputs.filter(c => !!c.name.trim())

  await db.query(`update services set title=?, description=?, fee=?, time=?, conditions=?, documents=?, inputs=?, api=? where id = ?`, [title, description, fee, time,JSON.stringify(conditions),JSON.stringify(documents), JSON.stringify(inputs), api, req.params.id])
  res.end()
})

router.delete('/api/services/:id', auth, admin, async (req, res) => {
  await db.query(`delete from services where id = ?`, [req.params.id])
  res.end()
})

router.get('/api/services', async (req, res) => {
  const [services] = await db.query(`select * from services`)
  res.json(services)
})

router.get('/api/services/:id', async (req, res) => {
  const { id } = req.params
  const [ service ] = await db.query(`select * from services where id = ?`, [id])
  res.json(service[0])
})

export default router
