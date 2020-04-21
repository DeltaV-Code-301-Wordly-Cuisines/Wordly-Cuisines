'use strict';
// required middleware and modules
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
//const client = require('./utility/database');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
const cuisineModule = require('./modules/cuisine');
const {getCuisineFromApi,addRecipe,showRecipeDetails,showrecipe} = cuisineModule;
const client =require('./data/database');




app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(methodOverride('_method'));


//renders recipe buttons form
app.get('/',(request, response) => {
  response.send('hi');
});

app.get('/searches/new', (request, response) => {
    response.render('pages/searches/new');
  });

//render response from getCuisineFromApi
app.get('/cuisines/:cuisineType', getCuisineFromApi);
app.post('/recipe/:recipeName',showRecipeDetails);
app.post('/favorite',addRecipe);
app.get('/favorite',showrecipe);
// app.get('/details/:id', getNutritionDetail);

// establish server
client.connect()
  .then(() => {
    console.log('PG is listening!');
  })
  .catch((err) => {
    console.error(err);
  });

//app.get('*', (request, response) => response.status(404).render('./pages/error-view', {error:'(404) Page not found'}));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));


