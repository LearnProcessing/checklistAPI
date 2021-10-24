const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes')
const errorHandler = require('./middlewares/error-handler')
const port = 3000
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.get('/', (req, res) => {
  res.redirect('/checklists')
})
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
