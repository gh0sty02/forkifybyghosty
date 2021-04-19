class SearchView {
  _parentElement = document.querySelector('.search');

  // getting the query from the search bar and clearing it
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // clearing the search bar

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // publisher-subscriber model to add submit handler to the search button
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
