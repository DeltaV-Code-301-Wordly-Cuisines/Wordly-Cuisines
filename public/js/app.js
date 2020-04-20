'use strict';

const superagent = require('superagent');

function getCuisineFromApi(request,response,next){
let url='https://api.edamam.com/search';
superagent.get(url);
.query({
        KEY:process.env.CUISINE_KEY,
        app_id:process.env.APP_ID,
        q: search.query,

        
    .then (cuisineResponse =>{
        cost recipeData = cuisineResponse.body

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
    this.cuisineType = recipeData.hits.recipe.cuisineType;
    this.mealType = recipeData.hits.recipe.mealType;
    this.dishtype = recipeData.hits.recipe.dishType;
    this.recipeName = recipeData.hits.recipe.label;
    this.image = recipeData.hit.image;
    this.url = recipeData.hit.url;
    this.yield = recipeData.hit.yield;
}



//export modules 
module.exports = {getCuisineFromApi  };