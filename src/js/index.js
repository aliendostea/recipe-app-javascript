// Global app controller
/*****examples
 * 
 * 
 * 
 // import string from "./models/Search";
 // import {add as a, mult as m, ID} from './views/searchView'
 // import * as searchView from './views/searchView'
 // console.log(string, `using imported functions ${searchView.add(searchView.ID, 2)} and ${searchView.mult(3, 5)}.  ${string}`);
*
*
**/
import Search from './models/Search';
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from './views/searchView';
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader, elementsStrings} from './views/base';
/***
 * --search object
 * --current recipe
 * --shopping list object
 * --liked recipes
 * 
 */
const state = {};

/** ------- for testing

 window.state = state;
*/

/* 
* ***** -------------search controller
*/ 
const controlSearch = async () => {
    /// 1.-  get query from view
    const query = searchView.getInput(); /// real
    // const query = 'pizza'; //// testing
    
    if(query){
        /// 2.- new search object and add to state
        state.search = new Search(query);

        /// 3.-  Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);


        try {
          /// 4.-  search for recipes
          await state.search.getResults();
          
          /// 5.-  render results on UI
          clearLoader();
          searchView.renderResults(state.search.result);
           // console.log(state.search.result);
        } catch (error){
            alert(error,'error controlSearch:/');
            clearLoader();
        }

    }

}

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

/*
//// start - for testing 
window.addEventListener("load", (e) => {
  e.preventDefault();
  controlSearch();
});
//// end - for testing 
*/

elements.searchResPages.addEventListener('click', e =>{
      const btn = e.target.closest('.btn-inline', `.${elementsStrings.btnPages}`);
      if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
      }
});

/*
*
* ***** ------------- Recipe controller
*
*/
const controlRecipe = async ()  => {
  /// get ID fron url
  const id = window.location.hash.replace('#', '');  

  if (id) {
    // prepare UI for Changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    ///// highlight Selected search item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    // testing
    // window.r = state.recipe;

    try {
        // get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
    
        // calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
    
        // render recipe
        clearLoader();
        recipeView.renderRecipe(
              state.recipe,
              state.likes.isLiked(id)
        );

        // console.log(state.recipe);
    } catch (error) {
         console.log(error);
         alert(error,'error processing recipe :/');
    }
    
  }
  
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*
*
* ***** ------------- List controller
*
*/
const controlList = () => {
  /// create a new list if there in none yet
  if (!state.list) state.list = new List();


  /// add each ingredient to the list and UI
  state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);  
        listView.renderItem(item);
  });
}

/// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
      const id = e.target.closest(".shopping__item").dataset.itemid;

      /// handle the delete button
      if (e.target.matches(".shopping__delete, .shopping__delete *")) {
            /// delete from state
            state.list.deleteItem(id);
            
            /// delete from UI
            listView.deleteItem(id);

      /// handle the count update
      } else if (e.target.matches('.shopping__count-value')) {
            const val = parseFloat(e.target.value, 10);
            state.list.updateCount(id, val);
      }
});


/*
*
* ***** ------------- Like controller
*
*/
const controlLike = () => {
      if (!state.likes) state.likes = new Likes();
      const currentID = state.recipe.id;

      /// user has NOT yet liked current recipe
      if (!state.likes.isLiked(currentID)) {
            /// add like to the state
            const newLike = state.likes.addLikes(
                  currentID,
                  state.recipe.title,
                  state.recipe.author,
                  state.recipe.img 
            );

            /// toggle the like button
            likesView.toggleLikeBtn(true);

            /// add like to UI list
            likesView.renderLike(newLike);

      } else {
      /// user HAS yet liked current recipe
            /// remove like to the state
            state.likes.deleteLikes(currentID);

            /// toggle the like button
            likesView.toggleLikeBtn(false);

            /// remove like to UI list
            likesView.deleteLike(currentID);
      }
      likesView.toggleLikeMenu(state.likes.getNumLikes());
}

/// restore liked recipes on page load
window.addEventListener('load', () => {
      state.likes = new Likes();

      /// restore likes
      state.likes.readStorage();

      /// toggle like menu button
      likesView.toggleLikeMenu(state.likes.getNumLikes());

      /// render the existing likes
      state.likes.likes.forEach(like => likesView.renderLike(like));
});


/// handling recipe button clicks
elements.recipe.addEventListener('click', e => {

  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');  
            recipeView.updateServingsIngredients(state.recipe);
        }

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        /// add ingredients to shopping list
        controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        /// add likes recipe to likes bar /// likes controller
        controlLike();
  }
});







