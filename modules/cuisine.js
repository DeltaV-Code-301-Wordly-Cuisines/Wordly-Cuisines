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
function getNutritionDetail(request, response) {

  const SQL = `
    SELECT ingredient,calories, recipeName, image 
    FROM cuisine
    WHERE id = $1
    LIMIT 1;
  `;

  client.query(SQL, [request.params.id])
    .then(results => {
      const { rows } = results;

      response.render('pages/searches/details', {
        recipe: rows[0]
      });

    })
    .catch((err) => {
      console.error(err);
    })
}


function showRecipeDetails(request, response) {
  console.log(request.body);
  response.render('pages/cuisines/details', { recipe: JSON.parse(request.body.recipe) });

}

// favorited recipe handler

// get recipe from database


//edit recipe


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
      if (searchResults.rowCount < 1 ) {
        client.query(SQL, values)
            .then(results=>{
              response.redirect(`/favorite`);
            })
          .catch((err) => {
            console.error(err);

          });
      }else{
        response.send('the recipe already exist')
      }
      
    })
}

function showrecipe(request, response) {

  const SQL = ' SELECT *FROM favoriteRecipe ; ';

  client.query(SQL)
    .then(results => {
      const { rowCount, rows } = results;
      console.log(rows);
      response.render('pages/cuisines/favorite', {
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



//export modules
module.exports = { getCuisineFromApi, getNutritionDetail, showRecipeDetails, addRecipe, showrecipe };
