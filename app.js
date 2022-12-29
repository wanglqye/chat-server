const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('HEllom,'))

app.listen(port, () => console.log('启动啦'))
