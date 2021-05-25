const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('/searchfoods', db.searchFoods)
app.post('/searchbrandedfoods', db.searchBrandedFoods)

app.get('/category', db.getCategory)
app.get('/category/:id', db.getCategoryById)
app.post('/category/', db.createCategory)
app.put('/category/:id', db.updateCategory)
app.delete('/category/:id', db.deleteCategory)
app.delete('/nutrient', db.getNutrient)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
