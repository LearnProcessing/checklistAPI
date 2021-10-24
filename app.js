const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes')
const port = 3000
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(router)

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
