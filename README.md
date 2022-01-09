# Junglecook

Live Link: [Junglecook](https://jrk-junglecook.web.app)

# About the application:

## Basics

Junglecook is a fully responsive CRUD web application. It uses a model view controller to control user inputs and data of the application and a firebase for login/logout functionality. Each page is loaded dynamically by injecting the view using the URL. The page styling was done using Sass and media queries to make each page responsive in design for tablet and mobile.

## Login Functionality

This page uses firebase to control user log in and log out. The app.js file catches errors in this process, such as an incorrect password or invalid email, and displays a modal so the user can know what went wrong. Upon signing in or logging out, checks are run to see if a user is logged in in the app.js file and update the content on the screen, such as a link to your recipes page or updating the login button to now say logout. When a user logs in, their first name is saved in a variable, and this variable's value is displayed on various pages.

## CRUD functionality

### Create:

For the CRUD functionality of this application, an array of user recipes is stored in the model.js file. Once logged in, a user can navigate to the create recipe page. They must fill in the required inputs, or a modal will appear telling the user to do so. On the create recipe page, a user can delete or add ingredients and instructions. However, there must be at least one of both. The total number of ingredients and instructions are tracked through a variable. As the user increments or decrements from these variables, we append the needed number of inputs for the total amount of ingredients or instructions.

Once all the required inputs have the necessary information, the user can press the create recipe button. This button creates an object with the basic info of the recipe and arrays for the ingredients and instructions. This information is then stored inside the user recipes array.

### Read:

The Our recipes page gets data from a JSON file that stores the data for the four recipes found on the page, and this data is retrieved and looped through, appending each recipe onto the page with the correct content and image.

After successfully creating a recipe, a user can browse to the your recipes page. The array of user recipes is looped through much like the JSON file for public recipes. Each recipe found is appended onto the page with the correct information and content.

Each recipe is dynamically loaded, with a view button that navigates to the view recipe page. This button also runs a function that updates a variable that tracks what recipe is clicked. The button passes to the setSelectedRecipe function the number of the recipes index and sets the currently selected recipe to that index. So, when the user clicks this button the view recipe page can dynamically load the content for the recipe at the given index value.

### Update:

A user can select the edit button that is next to one of the recipes they created. The edit button navigates to the edit recipe page and runs a function that sets the currently selected recipe to the index of that recipe in the user recipes array. So when the user clicks this button, the edit recipe page is dynamically loaded with the content for the recipe at the given index value.

Each input field contains the data of the selected recipe. Here the user can change any value, as well as add or delete ingredients and instructions. If a user presses the cancel button, the recipe will remain unchanged. If the user presses the submit button, we change the values of the selected recipe to the new ones with a submit edit function. This function also creates new arrays for instructions and ingredients and sets the current ones to these.

### Delete:

When each recipe is created they are appended to the page with a delete button. The delete button passes to a delete function of the index of that recipe. Then, it splices one value at that index value, removing that specific recipe from the user recipes array.
