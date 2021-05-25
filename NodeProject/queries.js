const Pool = require('pg').Pool
const pool = new Pool({
  user: 'wf',
  host: 'wf-usda-4.cbirtswcvghj.us-west-2.rds.amazonaws.com',
  database: 'postgres',
  password: 'Dietc0keDietc0ke',
  port: 5432,
})


// ***************************************************** 
// searchFoods
// ***************************************************** 
const searchFoods = (request, response) => {
  //const searchtextInput = request.params.searchtext
  const { searchtextInput } = request.body

console.log("SearchTextInput: " + searchtextInput )

  var searchtext = searchtextInput.split(" "); //remove empty spaces from search string
  var searchtextClean = searchtext.filter(str => str != "")
  searchtextClean = searchtextClean.join("&")

  console.log("Search text: " + searchtextClean)

  //const querytext = "SELECT fdc_id, description FROM (SELECT fdc_id as fdc_id, description as description, to_tsvector(description) as document FROM food ) p_search WHERE p_search.document @@ to_tsquery(\'egg & whole & raw\')"
  //const querytext = "SELECT fdc_id, description FROM (SELECT fdc_id as fdc_id, description as description, to_tsvector(description) as document FROM food WHERE data_type = 'foundation_food' ) p_search WHERE p_search.document @@ to_tsquery(\'"+ searchtextClean + "\')"
  const querytext = "SELECT fdc_id, description, data_type FROM (SELECT fdc_id as fdc_id, description as description, data_type as data_type, to_tsvector(description) as document FROM food WHERE data_type IN ('foundation_food','sr_legacy_food') ) p_search WHERE p_search.document @@ to_tsquery(\'"+ searchtextClean + "\')"

  pool.query(querytext, (error, results) => {
      if (error) {
      throw error
    }
    console.log("Results count:" + results.rows.length)

    var fdcIds
    if (results.rows.length > 0) {
       fdcIds = results.rows[0].fdc_id
    }

    for (i = 1; i< results.rows.length; i++) {
        fdcIds = fdcIds + "," + results.rows[i].fdc_id	
    }

    console.log("FDC_ID's: " + fdcIds )

      var queryNutrients = "SELECT food_nutrient.fdc_id, food_nutrient.nutrient_id, food_nutrient.amount, nutrient.name FROM food_nutrient JOIN nutrient ON food_nutrient.nutrient_id = nutrient.id WHERE fdc_id IN (" +fdcIds +") and food_nutrient.nutrient_id IN (1003, 1004, 1005, 1008) ORDER by food_nutrient.fdc_id; " 

     pool.query(queryNutrients, (error1, results1) => {
       if (error1) {
          throw error1
       }

      //var queryPortion = "SELECT * FROM food_portion WHERE fdc_id IN (" + fdcIds + ") ORDER BY food_portion.fdc_id;  "
      var queryPortion = "SELECT food_portion.*, measure_unit.name FROM food_portion JOIN measure_unit ON (food_portion.measure_unit_id = measure_unit.id) WHERE fdc_id IN (" + fdcIds + ") ORDER BY food_portion.fdc_id;  "
      pool.query(queryPortion, (error2, results2) => {
       if (error2) {
          throw error2
       }

	console.log("Nutrients Count: " + results1.rows.length)
        console.log("Nutrients:" + JSON.stringify(results1.rows))
      
        console.log("Result: "+JSON.stringify(results.rows))
      
        for (i = 0; i< results.rows.length; i++) {
          results.rows[i].Nutrients = results1.rows.filter(nutrient => nutrient.fdc_id == results.rows[i].fdc_id)
	  
          results.rows[i].Portion = results2.rows.filter(portion => portion.fdc_id == results.rows[i].fdc_id)
        }




        response.status(200).json(results.rows)

      }) //pool queryPortion



      }) //pool queryNutrients




  }) //pool querytext
} // end searchFoods


// ***************************************************** 
// searchBrandedFoods
// ***************************************************** 
const searchBrandedFoods = (request, response) => {
  const { searchtextInput } = request.body

console.log("SearchTextInput: " + searchtextInput )

  var searchtext = searchtextInput.split(" "); //remove empty spaces from search string
  var searchtextClean = searchtext.filter(str => str != "")
  searchtextClean = searchtextClean.join("&")

  console.log("Search text: " + searchtextClean)

  const querytext = "SELECT fdc_id, description, data_type FROM (SELECT fdc_id as fdc_id, description as description, data_type as data_type, to_tsvector(description) as document FROM food WHERE data_type IN ('branded_food') ) p_search WHERE p_search.document @@ to_tsquery(\'"+ searchtextClean + "\') LIMIT 200"

  pool.query(querytext, (error, results) => {
      if (error) {
      throw error
    }
    console.log("Results count:" + results.rows.length)

    var fdcIds
    if (results.rows.length > 0) {
       fdcIds = results.rows[0].fdc_id
    }

    for (i = 1; i< results.rows.length; i++) {
        fdcIds = fdcIds + "," + results.rows[i].fdc_id	
    }

    console.log("FDC_ID's: " + fdcIds )

      var queryNutrients = "SELECT food_nutrient.fdc_id, food_nutrient.nutrient_id, food_nutrient.amount, nutrient.name FROM food_nutrient JOIN nutrient ON food_nutrient.nutrient_id = nutrient.id WHERE fdc_id IN (" +fdcIds +") and food_nutrient.nutrient_id IN (1003, 1004, 1005, 1008) ORDER by food_nutrient.fdc_id; " 

     pool.query(queryNutrients, (error1, results1) => {
       if (error1) {
          throw error1
       }

      var queryBranded = "SELECT * FROM branded_food WHERE fdc_id IN (" + fdcIds + ") ORDER BY fdc_id;  "
      pool.query(queryBranded, (error2, results2) => {
       if (error2) {
          throw error2
       }

	console.log("Nutrients Count: " + results1.rows.length)
        console.log("Nutrients:" + JSON.stringify(results1.rows))
      
        console.log("Result: "+JSON.stringify(results.rows))
      
        for (i = 0; i< results.rows.length; i++) {
          results.rows[i].Nutrients = results1.rows.filter(nutrient => nutrient.fdc_id == results.rows[i].fdc_id)
	  
          results.rows[i].BrandInfo = results2.rows.filter(brand => brand.fdc_id == results.rows[i].fdc_id)
        }




        response.status(200).json(results.rows)

      }) //pool queryPortion



      }) //pool queryNutrients




  }) //pool querytext
  

} // end searchFoods


const getCategory = (request, response) => {
  pool.query('SELECT * FROM food_category ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getNutrient = (request, response) => {
  pool.query('SELECT * FROM food_category ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getCategoryById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM food_category WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createCategory = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO food_category (code, description) VALUES ($1, $2)', [code, description], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Food Category added with ID: ${result.insertId}`)
  })
}

const updateCategory = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE food_category SET code = $1, description = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteCategory = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM food_category WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  searchFoods,
  searchBrandedFoods,
  getCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getNutrient,
}

