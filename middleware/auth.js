module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send("Pour cette route une clé d'authentification est nécésaire")
  } else if (req.headers.authorization === process.env.AUT_KEY) {
    next()
  } else {
    return res.status(401).send("La clé d'authentification est pas correct")
  }
}
