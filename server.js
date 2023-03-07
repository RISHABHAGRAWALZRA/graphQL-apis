const express = require('express')
const bodyParser = require('body-parser')



const app = express()
app.use(bodyParser.json())

app.use('/', (req,res,next) => {
    res.send("Up and Running")
})

app.listen(8081)

