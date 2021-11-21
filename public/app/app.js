var ingredCounter = 3;
var instructCounter = 3;
var selectedRecipe = 0;
var onUserRecipePage = false;
var loggedIn = false;

function addIngredient() {
  ingredCounter++;
  $(".ingredients").append(
    `<input
    id="ing${ingredCounter}"
    name="ing${ingredCounter}"
    class="form-recipe-input"
    placeholder="Ingredient #${ingredCounter}"
  />`
  );
}

function addInstruction() {
  instructCounter++;
  $(".instructions").append(
    `<input
    id="inst${instructCounter}"
    name="inst${instructCounter}"
    class="form-recipe-input"
    placeholder="Instruction #${instructCounter}"
    />`
  );
}

function deleteIngredient() {
  if (ingredCounter == 1) {
    displayModal("Most have atleast<br> one ingredient", "Continue to site");
  } else if (ingredCounter > 1) {
    let id = document.getElementById(`ing${ingredCounter}`);
    id.remove();
    ingredCounter--;
  }
}

function deleteInstruction() {
  if (instructCounter == 1) {
    displayModal("Most have atleast<br> one instruction", "Continue to site");
  } else if (instructCounter > 1) {
    let id = document.getElementById(`inst${instructCounter}`);
    id.remove();
    instructCounter--;
  }
}

function publicRecipesHandler() {
  MODEL.loadPublicRecipes();
}

function userRecipesHandler() {
  MODEL.loadUserRecipes();
}

function setSelectedRecipe(recipe) {
  selectedRecipe = recipe;
}

function deleteRecipe(recipe) {
  displayModal("Recipe Deleted!", "Continue to site");
  MODEL.userRecipes.splice(recipe, 1);
  MODEL.loadUserRecipes();
}

function editRecipe() {
  loadUserName();
  instructCounter = 0;
  ingredCounter = 0;
  $("#image").val(MODEL.userRecipes[selectedRecipe].image);
  $("#name").val(MODEL.userRecipes[selectedRecipe].name);
  $("#description").val(MODEL.userRecipes[selectedRecipe].description);
  $("#time").val(MODEL.userRecipes[selectedRecipe].time);
  $("#size").val(MODEL.userRecipes[selectedRecipe].size);
  for (
    let i = 0;
    i < MODEL.userRecipes[selectedRecipe].instructions.length;
    i++
  ) {
    instructCounter++;
    $(".instructions").append(` <input
  id="inst${i + 1}"
  name="inst${i + 1}"
  class="form-recipe-input"

  value="${MODEL.userRecipes[selectedRecipe].instructions[i]}"
/>`);
  }
  for (
    let i = 0;
    i < MODEL.userRecipes[selectedRecipe].ingredients.length;
    i++
  ) {
    ingredCounter++;
    $(".ingredients").append(` <input
id="ing${i + 1}"
name="ing${i + 1}"
class="form-recipe-input"
value="${MODEL.userRecipes[selectedRecipe].ingredients[i]}"
/>`);
  }
}

function submitEdits() {
  if (
    $("#name").val() &&
    $("#description").val() &&
    $("#time").val() &&
    $("#size").val() &&
    $("#ing1").val() &&
    $("#inst1").val() != ""
  ) {
    MODEL.userRecipes[selectedRecipe].name = $("#name").val();
    MODEL.userRecipes[selectedRecipe].image = $("#image").val();
    MODEL.userRecipes[selectedRecipe].description = $("#description").val();
    MODEL.userRecipes[selectedRecipe].time = $("#time").val();
    MODEL.userRecipes[selectedRecipe].size = $("#size").val();
    instructions = [];
    ingredients = [];
    $(".form-recipe .ingredients input").each(function (index) {
      if (this.value != "") {
        ingredients.push(this.value);
      }
    });
    MODEL.userRecipes[selectedRecipe].ingredients = ingredients;
    $(".form-recipe .instructions input").each(function (index) {
      if (this.value != "") {
        instructions.push(this.value);
      }
    });
    MODEL.userRecipes[selectedRecipe].instructions = instructions;
    displayModal("Recipe Edited!", "<a href='#/view-recipe'>View Edits</a>");
  } else {
    displayModal("Please fill in the <br> required inputs", "Try again");
  }
}

function loadUserName() {
  let user = firebase.auth().currentUser;
  $("#editing-user").html("Hey, " + user.displayName + " edit your recipe!");
  $("#creating-user").html("Hey, " + user.displayName + " create your recipe!");
}

function createRecipe(e) {
  if (
    $("#name").val() &&
    $("#description").val() &&
    $("#time").val() &&
    $("#size").val() &&
    $("#ing1").val() &&
    $("#inst1").val() != ""
  ) {
    displayModal("Creating recipe...");
    ingredients = [];
    instructions = [];
    recipe = {};
    recipe.name = $("#name").val();
    recipe.image = $("#image").val();
    recipe.description = $("#description").val();
    recipe.time = $("#time").val();
    recipe.size = $("#size").val();
    $(".form-recipe .ingredients input").each(function (index) {
      if (this.value != "") {
        ingredients.push(this.value);
      }
    });
    $(".form-recipe .instructions input").each(function (index) {
      if (this.value != "") {
        instructions.push(this.value);
      }
    });
    recipe.instructions = instructions;
    recipe.ingredients = ingredients;
    MODEL.userRecipes.push(recipe);
    displayModal(
      "Recipe Created!",
      "<a href='#/your-recipes'>View your recipes!</a>"
    );
  } else {
    displayModal("Please fill in the <br> required inputs", "Try again");
  }
}

function viewUserRecipeHandler() {
  MODEL.viewUserRecipe(MODEL.userRecipes, selectedRecipe);
}

function viewPublicRecipeHandler() {
  $.getJSON("data/data.json", function (recipes) {
    let publicRecipes = recipes.PUBLIC_RECIPES;
    MODEL.viewPublicRecipe(publicRecipes, selectedRecipe);
  });
}

function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: fName,
        })
        .then(() => {
          updateSiteWithInfo();
        });
      $("#login").html("Logout");
      $("#footer-login").html("Logout");
      $("#create-recipe").removeClass("noDisplay");
      $("#your-recipes").removeClass("noDisplay");
      $(".user-links a").removeClass("noDisplay");
      loggedIn = true;
    } else {
      loggedIn = false;
      $("#login").html("Login");
      $("#footer-login").html("Login");
      $("#create-recipe").addClass("noDisplay");
      $(".user-links a").addClass("noDisplay");
      $("#your-recipes").addClass("noDisplay");
    }
  });
}

function updateSiteWithInfo() {
  let user = firebase.auth().currentUser;
  $("#displayName").html(user.displayName);
}

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");
  if (pageID == "login") {
    MODEL.changePage(pageID, initLoginListeners);
  } else if (pageID == "our-recipes") {
    onUserRecipePage = false;
    MODEL.changePage(pageID, publicRecipesHandler);
  } else if (pageID == "your-recipes") {
    if (loggedIn == true) {
      onUserRecipePage = true;
      MODEL.changePage(pageID, userRecipesHandler);
    } else {
      MODEL.changePage(pageID, userRecipesHandler);
      displayModal(
        "Please login to <br> continue",
        "<a href='#/login'>Continue to site</a>"
      );
    }
  } else if (pageID == "create-recipe") {
    if (loggedIn == true) {
      MODEL.changePage(pageID, loadUserName);
      ingredCounter = 3;
      instructCounter = 3;
    } else {
      MODEL.changePage(pageID);
      displayModal(
        "Please login to <br> continue",
        "<a href='#/login'>Continue to site</a>"
      );
    }
  } else if (pageID == "edit-recipe") {
    if (loggedIn == true) {
      MODEL.changePage(pageID, editRecipe);
    } else {
      MODEL.changePage(pageID);
      displayModal(
        "Please login to <br> continue",
        "<a href='#/login'>Continue to site</a>"
      );
    }
  } else if (pageID == "view-recipe" && onUserRecipePage == false) {
    MODEL.changePage(pageID, viewPublicRecipeHandler);
  } else if (pageID == "view-recipe" && onUserRecipePage == true) {
    if (loggedIn == true) {
      MODEL.changePage(pageID, viewUserRecipeHandler);
    } else {
      MODEL.changePage(pageID);
      displayModal(
        "Please login to <br> continue",
        "<a href='#/login'>Continue to site</a>"
      );
    }
  } else {
    MODEL.changePage(pageID);
  }
  if (pageID != "") {
    $("nav a").removeClass("active");
    $("#" + pageID).addClass("active");
  }
}

function activeLink() {
  $("nav a").click(function () {
    if ($("nav").hasClass("nav-slide")) {
      $("nav").toggleClass("nav-slide");
    }
  });
}

function initLoginListeners() {
  //Login with account
  $("#login-button").click(function (e) {
    e.preventDefault();
    let email = $("#login-email").val();
    let password = $("#login-password").val();
    displayModal("Logging In...");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        displayModal("Login Successful", "Continue to site");
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        if (errorCode == "auth/invalid-email") {
          displayModal("Invalid Email, <br> please try again", "Try Again");
        } else if (errorCode == "auth/wrong-password") {
          displayModal("Incorrect Password", "Try Again");
        } else if (errorCode == "auth/user-not-found") {
          displayModal("No user found", "Try Again");
        }
      });
    $("#login-email").val("");
    $("#login-password").val("");
  });

  //Signup with an account
  $("#signup-button").click(function (e) {
    e.preventDefault();
    fName = $("#fName").val();
    lName = $("#lName").val();
    let email = $("#email").val();
    let password = $("#password").val();
    displayModal("Signing up...");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        displayModal("Signup and Login<br>Successful", "Continue to site");
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        if (errorCode == "auth/invalid-email") {
          displayModal("Invalid Email, <br> please try again", "Try Again");
        } else if (errorCode == "auth/weak-password") {
          displayModal(
            "Password too short<br> Must be 6 or more digits",
            "Try Again"
          );
        } else if (errorCode == "auth/email-already-in-use") {
          displayModal("Email already in use", "Try Again");
        }
        // ..
      });
    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#password").val("");
  });
}

function logOutHandler() {
  $("#login").click(function (e) {
    if (e.target.innerHTML == "Logout") {
      firebase
        .auth()
        .signOut()
        .then(() => {
          displayModal("Logout Successful", "Continue to site");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
  $("#footer-login").click(function (e) {
    if (e.target.innerHTML == "Logout") {
      firebase
        .auth()
        .signOut()
        .then(() => {
          displayModal("Logout Successful", "Continue to site");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}

function activeNav() {
  $("div.dropdown").click(function (e) {
    $("nav").toggleClass("nav-slide");
  });
}

function checkSize() {
  $(window).resize(function () {
    let screen = document.body.clientWidth;
    if (screen > 1030) {
      $("nav").removeClass("nav-slide");
      $("nav").removeClass("transition-smooth");
    }
    if ($(window).width() <= 1030) {
      $("nav").addClass("transition-smooth");
    }
  });
  if ($(window).width() <= 1030) {
    $("nav").addClass("transition-smooth");
  }
}

function initListeners() {
  $(window).on("hashchange", route);
  route();
}

function displayModal(text, buttonText) {
  gsap.to($(".modal"), {
    scale: 1,
    duration: 0.8,
    display: "flex",
    ease: "elastic.out",
    onComplete: addModalListener,
  });
  $(".callout h1").html(text);
  if (buttonText) {
    $(".callout a").css("display", "flex");
    $(".callout a").html(buttonText);
  } else {
    $(".callout a").css("display", "none");
  }
}

function addModalListener() {
  $(".bg-click").click(function (e) {
    gsap.to($(".modal"), {
      scale: 0,
      duration: 0,
    });
  });
  $("#continue").click(function (e) {
    gsap.to($(".modal"), {
      scale: 0,
      duration: 0,
    });
  });
}

$(document).ready(function () {
  try {
    let app = firebase.app();
    gsap.set($(".modal"), { scale: 0 });
    initFirebase();
    initListeners();
    activeLink();
    logOutHandler();
    activeNav();
    checkSize();
    $("#login").html("Login");
  } catch {
    console.error();
  }
});
