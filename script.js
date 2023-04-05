//for opening sidebar
function openNav() 
{
    document.getElementById("mySidenav").style.width = "500px";
    document.getElementById("main-body").style.marginRight = "500px";
}

// for closing sidebar
function closeNav() 
{
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main-body").style.marginRight = "0";
} 

//Making Favorites meal array if its not exits in local storage
if(localStorage.getItem("favoritesList") == null)
{
    localStorage.setItem("favoritesList", JSON.stringify([]));
}

//all global variable

const mealList = document.getElementById('meal');
const mealDetailsContent = document.getElementById('meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

//Event Listener for closing recipe details page
recipeCloseBtn.addEventListener('click',()=>{
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// fetch api will search details from the meal_db api
async function fetchMealDetailsFromApi(url, inputValue)
{
    const response=await fetch(`${url+inputValue}`);
    const meals = await response.json();
    return meals;
}

//get meal list that matches with the meal_db api
function showMealList()
{
    // trim function removes all spaces from text expect for single spaces between words
    let searchInputTxt = document.getElementById('search-input').value;
    
    //for favorite list 
    let arr=JSON.parse(localStorage.getItem("favoritesList"));
    
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // calling fetchMealDetailsFromApi function
    let meals=fetchMealDetailsFromApi(url, searchInputTxt); 

    meals.then(data =>
    {
        let html="";
        if(data.meals)
        {
            data.meals.forEach(meal => {
                let isFav=false;
                for (let index = 0; index < arr.length; index++) 
                {
                    if(arr[index]==meal.idMeal){
                        isFav=true;
                    }
                }
                // if food is present in favorites list then favorite btn will be active
                if(isFav)
                {
                    html += `
                    <div class="meal-item">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn active-color" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>`;
                }
                // if food is not present in favorites list then favorite btn will be not active
                else
                {
                    html += `
                    <div class="meal-item">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>`;
                }
            });
            mealList.classList.remove('notFound');
        }
        else
        {
            html="Sorry, We Didn't Find Any Meal!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    });
}

// show Mealdetails function
function showMealDetails(id)
{
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    
    // calling fetchMealDetailsFromApi function
    let details=fetchMealDetailsFromApi(url,id);

    details.then(data => mealRecipeDetails(data.meals));
}

// meal recipe details function
function mealRecipeDetails(meal)
{
    meal=meal[0];

    let html=`
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">Recipe Category: ${meal.strCategory}</p>
            <p class="recipe-category">Area: ${meal.strArea}</p>
            <div class="recipe-instruction">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>

            <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="Meal_image">
            </div>

            <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
            </div>
            `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// add and remove food in favorite list
function addRemoveToFavList(id)
{
    let arr=JSON.parse(localStorage.getItem("favoritesList"));
    let contain=false;
    
    for(let index=0; index <arr.length; index++)
    {
        if(id==arr[index])
        {
            contain=true;
        }
    }
    if(contain)
    {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Your Meal Removed From Your Favorite List");
    }
    else
    {
        arr.push(id);
        alert("Your Meal Is Added In Your Favorite List");
    }
    localStorage.setItem("favoritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList()
}

// show favorite meal list
function showFavMealList()
{
    let arr=JSON.parse(localStorage.getItem("favoritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const favBody=document.getElementById("favorites-body");
    let html="";

    // if food not available in favorites food list
    if (arr.length==0) 
    {
        html += `
            <div class="error-container">
                <span class="display-1 d-block">404</span>
                <div class="mb-4 lead">
                    No meal added in your favorites list.
                </div>
            </div>
            `;
        favBody.innerHTML=html;
    } 
    // if food available in favorites food list
    else 
    {
        for (let index = 0; index < arr.length; index++) 
        {
            // calling async function
            let favMeal=fetchMealDetailsFromApi(url,arr[index]);
            favMeal.then(data=>{
                let meal=data.meals[0];
                html += `
                    <div class="fav-meal-item">
                        <div class="fav-meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="fav-meal-name-details">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn active-color" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>
                `;
                favBody.innerHTML = html;
            });   
        }
    }
}