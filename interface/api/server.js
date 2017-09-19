const express = require("express")

let app = express()

app.get('/', (req,res) => {
  return res.send("hello")
})

app.listen(80)
