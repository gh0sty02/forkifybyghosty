// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
import * as model from './model.js';
import recipeView from './views/recipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { async } from 'regenerator-runtime';
import searchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/AddRecipeView.js';
import { MODAL_CLOSE_SEC } from './config';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept;
}

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // results view to mark selected search result

    resultsView.update(model.getSearchResultsPage());

    // loading the recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
    //4) rendering the bookmarks
    bookmarksView.update(model.state.bookmark);
    // test
  } catch (err) {
    recipeView.renderError();
  }
};

// to control the search results

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    // getting the query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    // rendering the query
    resultsView.render(model.getSearchResultsPage());

    // rendering the pagination

    PaginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

// adding the handler functions
const controlPaginaton = function (goToPage) {
  // rendering the new query
  resultsView.render(model.getSearchResultsPage(goToPage));

  // rendering the new pagination

  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe (in state)
  model.updateServings(newServings);
  // update the recipe in ui
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmark);
};

const ControlAddRecipe = async function (newRecipe) {
  try {
    // loading the spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // render the recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmark);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // closing the form window
    setTimeout(function () {
      // addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmark);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPaginaton);
  addRecipeView._addHandlerUpload(ControlAddRecipe);
};
init();
