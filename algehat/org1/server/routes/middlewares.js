import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) return res.sendStatus(401)
    req.userData = jwt.verify(token, process.env.TOKEN_SECRET)
    next()
  } catch (err) {
    res.status(401).redirect('/')
  }
}

export const admin = (req, res, next) => {
  if (req?.userData?.admin === true)
    next()
  else
    res.status(401).redirect('/')
}