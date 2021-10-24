function authorization(req, res, next) {
  try {
    if (req.headers.authorization !== process.env.AUTHORIZATION) {
      throw {message: "Not Authorized"}
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authorization