import { Router } from "express"
import user from './user.js'
import services from './services.js'
import orders from './orders.js'
import messages from './messages.js'
const router = Router()

router.use(user)
router.use(services)
router.use(orders)
router.use(messages)

export default router