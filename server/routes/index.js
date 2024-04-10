import { Router } from "express"
import user from './user.js'
import services from './services.js'
import orders from './orders.js'
const router = Router()

router.use(user)
router.use(services)
router.use(orders)

export default router