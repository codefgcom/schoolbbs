const express = require('express')
const app = express()
const port = 80

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/sb', function (req, res) {
    res.send('Hello sb!')
})

app.use('/', express.static('src/resources/static/'))

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})