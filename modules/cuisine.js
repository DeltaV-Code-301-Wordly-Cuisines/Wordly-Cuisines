'use strict';

const superagent = require('superagent');
const client = require('../data/database');

function getCuisineFromApi(request, response, next) {
  let url = 'https://api.edamam.com/search';
  superagent.get(url)
    .query({
      app_key: 'ee627180bbfefd66310f27f6647fdeeb',
      app_id: '095f4895',
      q: request.params.cuisineType

    })
    .then(cuisineResponse => {
      const recipeData = cuisineResponse.body.hits;
      let recipeResults = recipeData.map(recipe => {

        return new Recipe(recipe);
      });
      let viewModel = {
        recipes: recipeResults,
      };
      response.render('pages/searches/show', viewModel);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
}

// recipe detail handler

function showRecipeDetails(request, response) {
  response.render('pages/cuisines/details', { recipe: JSON.parse(request.body.recipe) });
}



// favorited recipe handler

// get recipe from database
function showrecipe(request, response) {

  const SQL = ' SELECT *FROM favoriteRecipe ; ';

  client.query(SQL)
    .then(results => {
      const { rowCount, rows } = results;
      response.render('pages/cuisines/favorite', {
        recipes: rows,
        rowcount: rowCount
      });

    })
    .catch((err) => {
      console.error(err);
    });
}

//delete recipe
function deleteFavorite(request,response){
  const SQL = `
  DELETE FROM favoriteRecipe
  WHERE Id = $1
`;
client.query(SQL,[request.params.id])
  .then(() => {
    response.redirect('/favorite');
  })
  .catch((err) => {
    console.error(err);

  });
}


// add recipe to favorite

// add own recipe- will need a form for this

function addRecipe(request, response) {

  const { url, ingredient, recipeName, image } = JSON.parse(request.body.recipe);
  const searchQuery = `SELECT * FROM favoriteRecipe WHERE url=$1 `;
  client.query(searchQuery, [url])
    .then(searchResults => {
      const SQL = `
    INSERT INTO favoriteRecipe ( url, ingredient,  recipeName ,image)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;
      const values = [url, ingredient, recipeName, image];

      // POST - REDIRECT - GET
      if (searchResults.rowCount < 1) {
        client.query(SQL, values)
          .then(results => {
            response.redirect(`/favorite`);
          })
          .catch((err) => {
            console.error(err);

          });

      }else{
        response.redirect(`/favorite`);
      }

    })
}


//handler to create recipe form
function displayPersonalRecipeForm(request, response) {
  response.render('pages/cuisines/createRecipe');
}

// recipe handler for adding personalRecipe
function addPersonalRecipe(request, response) {
  const { recipeName, image, cuisineType, ingredient, mealType, dishType } = request.body;
  const SQL = `
    INSERT INTO personalRecipe ( recipeName, image, cuisineType, ingredient, mealType, dishType )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
  const values = [recipeName, image, cuisineType, ingredient, mealType, dishType];
  client.query(SQL, values)
    .then(results => {
      let id = results.rows[0].id;
      response.redirect(`/recipeBox/${id}`);

    })
    .catch((err) => {
      console.error(err);

    });
}
function showPersonalRecipe(request, response) {

  const SQL = ' SELECT *FROM personalRecipe ; ';
  client.query(SQL)
    .then(results => {
      const { rowCount, rows } = results;
      console.log(rows);
      response.render('pages/cuisines/recipeBox', {
        recipes: rows,
        rowcount: rowCount
      });

    })
    .catch((err) => {
      console.error(err);
    });
}


//recipe constructor
function Recipe(recipeData) {
  this.cuisineType = recipeData.recipe.cuisineType;
  this.ingredient = recipeData.recipe.ingredientLines;
  this.totalNutrients = recipeData.recipe.totalNutrients;
  this.mealType = recipeData.recipe.mealType;
  this.dishtype = recipeData.recipe.dishType;
  this.recipeName = recipeData.recipe.label;
  this.image = recipeData.recipe.image;
  this.url = recipeData.recipe.url;
  this.yield = recipeData.recipe.yield;
}

function editOneRecipe(request, response) {

  const SQL = `
  SELECT *
  FROM favoriteRecipe
  WHERE Id = $1
`;
client.query(SQL, [request.params.id])
  .then(results => {
    const recipes = results.rows[0];
    const viewModel = {
      recipes
    };
    response.render('pages/searches/edit',viewModel);
  })
}

function updateOneRecipe(request, response, next) {
const{note,ingredient} = request.body;
console.log(request.body);
const SQL = `
UPDATE favoriteRecipe SET
note= $1,
ingredient=$2
WHERE id = $3;
`;
const parameters = [note,ingredient, parseInt(request.params.id)];
client.query(SQL, parameters)
.then(() => {
  response.redirect(`/favorite`);
})
.catch( error => console.log(error));
}

//export modules

module.exports = { getCuisineFromApi, getNutritionDetail, showRecipeDetails, addRecipe, showrecipe, displayPersonalRecipeForm, addPersonalRecipe, showPersonalRecipe, deleteFavorite,updateOneRecipe,editOneRecipe };

