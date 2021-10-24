const express = require('express')
const app = express()
const cors = require('cors')
const { urlencoded } = require('express')

app.use(cors())
app.use(urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})