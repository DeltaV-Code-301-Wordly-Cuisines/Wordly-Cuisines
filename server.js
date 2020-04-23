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

const {getCuisineFromApi,addRecipe,showRecipeDetails,showrecipe, displayPersonalRecipeForm, addPersonalRecipe, showPersonalRecipe,deleteFavorite,updateOneRecipe,editOneRecipe,deletePersonal,updateOnePersonalRecipe,editOnePersonalRecipe,filterFavorite} = cuisineModule;

const client =require('./data/database');




app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(methodOverride('_method'));



//renders homepage login for new and existing users
app.get('/',(request, response) => {
  response.render('pages/homepage');
});

//renders about us page
app.get('/about',(request, response) => {
  response.render('pages/aboutTheTeam');
});

// navigation for favorite recipes
app.get('/recipe/favorite', (request,response) => {
  response.render('pages/cuisines/favorites');
});


//nav for recipe box
app.get('/recipebox',showPersonalRecipe);

// For the new search page
app.get('/recipes/search', (request,response) => {
  response.render('pages/searches/new')
});


//creation of new recipe by user
app.get('/recipes/create', displayPersonalRecipeForm) 
app.post('/recipes/create', displayPersonalRecipeForm)

// rendering of personal recipe form into recipe box
app.post('/recipebox', addPersonalRecipe);
app.get('/searches/new', (request, response) => {
    response.render('pages/searches/new');
  });

//render response from getCuisineFromApi
app.get('/cuisines/:cuisineType', getCuisineFromApi);
app.post('/recipe/:recipeName',showRecipeDetails);
// app.post('/favoriteDaital/:recipeName',showRecipeDetails);
app.post('/favorite',addRecipe);
app.get('/favorite',showrecipe);
app.delete('/favorite/:id',deleteFavorite);
app.put('/favorite/:id/edit',updateOneRecipe);
app.put('/recipebox/:id/edit',updateOnePersonalRecipe);
app.get('/favorite/:id/edit', editOneRecipe);
app.get('/recipebox/:id/edit',editOnePersonalRecipe);
app.delete('/recipebox/:id',deletePersonal);
app.post('/favorite/filter',filterFavorite);
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


