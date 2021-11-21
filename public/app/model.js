var MODEL = (function () {
  var _userRecipes = [];

  var _changePage = function (page, callback) {
    if (page == "") {
      $.get(`pages/home/home.html`, function (data) {
        $("#app").html(data);
      });
    } else {
      $.get(`pages/${page}/${page}.html`, function (data) {
        $("#app").html(data);
        if (callback) {
          callback();
        }
      });
    }
  };

  var _loadPublicRecipes = function () {
    $.getJSON("data/data.json", function (recipes) {
      $.each(recipes.PUBLIC_RECIPES, function (index, recipes) {
        $(".content").append(`
          <div id="public_recipe_" + "${index}" class="container">
            <div class="image-holder" id=${
              "image_" + index
            }><a class="button" onclick="setSelectedRecipe(${index})" href="#/view-recipe">View</a></div>
            <div class="info">
              <h2>${recipes.name}</h2>
              <p>${recipes.description}</p>
              <div class="icon-row">
                <img class="info-icon" src="images/time.svg" alt="" />
                <p>${recipes.time}</p>
              </div>
              <div class="icon-row">
                <img class="info-icon" src="images/servings.svg" alt="" />
                <p>${recipes.size}</p>
              </div>
            </div>
          `);
        $("#image_" + index).css("background-image", `${recipes.image}`);
      });
    });
  };

  var _loadUserRecipes = function () {
    $(".content").html("");
    let user = firebase.auth().currentUser;
    $(".content").append(`<h1 id="displayName"></h1>`);
    $("#displayName").html(
      "Hey, " + user.displayName + " here are your recipes!"
    );
    if (_userRecipes.length == 0) {
      $(".content").append(`<h3>No Recipes Found</h3>`);
    } else {
      for (let i = 0; i < _userRecipes.length; i++) {
        $(".content").append(`
    <div class="container">
    <div id=${"image_" + [i]} class="image-holder">
      <a class="button" onclick="setSelectedRecipe(${i})" id="view-recipe" href="#/view-recipe">View</a>
    </div>
    <div class="info">
      <h2>${_userRecipes[i].name}</h2>
      <p>
      ${_userRecipes[i].description}
      </p>
      <div class="icon-row">
        <img class="info-icon" src="images/time.svg" alt="" />
        <p>     ${_userRecipes[i].time}</p>
      </div>
      <div class="icon-row">
        <img class="info-icon" src="images/servings.svg" alt="" />
        <p>     ${_userRecipes[i].size} servings</p>
      </div>
    </div>
    <div class="button-holder">
      <a class="button button-recipe" onclick="setSelectedRecipe(${i})" id="editrecipe" href="#/edit-recipe">Edit Recipe</a>
      <button class="button button-recipe" onclick="deleteRecipe(${i})" >Delete</button>
    </div>
  </div>
    `);
        $("#image_" + [i]).css("background-image", `${_userRecipes[i].image}`);
      }
    }
  };

  var _viewUserRecipe = function (data, recipe) {
    $(".content .main").append(
      `
      <div class="title"><h1>${data[recipe].name}</h1></div>
      <div class="image-holder"></div>
      <div class="info">
        <div class="discription">
          <h1>Description</h1>
          <p>
          ${data[recipe].description}
        </div>
        <div class="time">
          <h2>Total Time:</h2>
          <p>${data[recipe].time}</p>
        </div>
        <div class="servings">
          <h2>Servings:</h2>
          <p>${data[recipe].size}</p>
        </div>
      </div>
    
    `
    );
    for (let i = 0; i < data[recipe].ingredients.length; i++)
      $(".ingredients p").append(`${data[recipe].ingredients[i]}<br />`);
    for (let i = 0; i < data[recipe].instructions.length; i++)
      $(".instructions p").append(
        `${i + 1}. ${data[recipe].instructions[i]}<br />`
      );
    $(".instructions").append(
      `<a class="button" onclick="setSelectedRecipe(${recipe})" id="editrecipe" href="#/edit-recipe">Edit Recipe</a>`
    );
    $(".image-holder").css("background-image", `${data[recipe].image}`);
  };

  var _viewPublicRecipe = function (data, recipe) {
    $(".content .main").append(
      `
      <div class="title"><h1>${data[recipe].name}</h1></div>
      <div class="image-holder"></div>
      <div class="info">
        <div class="discription">
          <h1>Description</h1>
          <p>
          ${data[recipe].description}
        </div>
        <div class="time">
          <h2>Total Time:</h2>
          <p>${data[recipe].time}</p>
        </div>
        <div class="servings">
          <h2>Servings:</h2>
          <p>${data[recipe].size}</p>
        </div>
      </div>
    
    `
    );
    for (let i = 0; i < data[recipe].ingredients.length; i++)
      $(".ingredients p").append(`${data[recipe].ingredients[i]}<br />`);
    for (let i = 0; i < data[recipe].instructions.length; i++)
      $(".instructions p").append(
        `${i + 1}. ${data[recipe].instructions[i]}<br />`
      );

    $(".image-holder").css("background-image", `${data[recipe].image}`);
  };

  return {
    changePage: _changePage,
    loadPublicRecipes: _loadPublicRecipes,
    loadUserRecipes: _loadUserRecipes,
    userRecipes: _userRecipes,
    viewUserRecipe: _viewUserRecipe,
    viewPublicRecipe: _viewPublicRecipe,
  };
})();
