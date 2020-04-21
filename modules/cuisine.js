'use strict';

const superagent = require('superagent');

function getCuisineFromApi(request,response,next){
  let url='https://api.edamam.com/search';
  superagent.get(url)
    .query({
      app_key:'ee627180bbfefd66310f27f6647fdeeb',
      app_id:'095f4895',
      q: request.params.cuisineType

    })
    .then (cuisineResponse =>{
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



// favorited recipe handler

// get recipe from database


//edit recipe


// add own recipe- will need a form for this

//recipe constructor
function Recipe(recipeData){
  this.cuisineType = recipeData.recipe.cuisineType;
  this.mealType = recipeData.recipe.mealType;
  this.dishtype = recipeData.recipe.dishType;
  this.recipeName = recipeData.recipe.label;
  this.image = recipeData.recipe.image;
  this.url = recipeData.recipe.url;
  this.yield = recipeData.recipe.yield;
}



//export modules
module.exports = getCuisineFromApi;
