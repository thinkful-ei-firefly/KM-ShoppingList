'use strict';

const STORE = {
  items: [
    {id: cuid(), name: "apples", checked: false},
    {id: cuid(), name: "oranges", checked: false},
    {id: cuid(), name: "milk", checked: true},
    {id: cuid(), name: "bread", checked: false}
  ],
  hideChecked: false,
  search: '',
  searchOn: false

};


function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class = "js-item-edit">
            <span class = "button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  //console.log("Generating shopping list element");

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  //console.log('`renderShoppingList` ran');
  let filteredItems = STORE.items;
  let aaaa;
  if (STORE.hideChecked) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  if (STORE.searchOn){
    //aaaa = filteredItems.filter(item => !item.name.indexOf(STORE.search) >= 0);
    filteredItems = filteredItems.filter(function(item){
      return (item.name.indexOf(STORE.search) != -1);
    });
  }

  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  //console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    //console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log("Toggling checked property for item with id " + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}


function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function deleteListItem(itemId) {
  const itemIndex = STORE.items.findIndex(item => item.id === itemId);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const id = getItemIdFromElement(event.currentTarget);
    deleteListItem(id);
    renderShoppingList();
  });
  //console.log('`handleDeleteItemClicked` ran')
}

function toggleHideFilter() {
  STORE.hideChecked = !STORE.hideChecked;
}
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', function(){
    toggleHideFilter();
    renderShoppingList();
  });
}

function toggleSearch(){
  STORE.searchOn = !STORE.searchOn;
  if (!STORE.searchOn){
    $('.search-js').val('');
    STORE.search = '';
  }
  renderShoppingList();
}
function handleSearch(){
  $('#js-search').submit(function(event){
    event.preventDefault();
    const query = $('.search-js').val();
    STORE.search = query;
    $('.search-js').val('Click Search to show all');
    console.log(STORE.search);
    toggleSearch();
  });
}

function editItem(item, list){
  $(list).html(`<li data-item-id="${item.id}">
  <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
  <div class="shopping-item-controls">
    <form id = "scree">
      <label for="edit-item-form">new name</label>
      <input type="text" name="form-edit" class="js-item-edit-form" placeholder="e.g., broccoli">
      <button type="submit">Submit</button>
    </form>
  </div>
</li>`)
}
function handleEditClick(){
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const list = event.currentTarget.closest('li');
    const id = getItemIdFromElement(event.currentTarget);
    const itemIndex = STORE.items.findIndex(item => item.id === id);
    editItem(STORE.items[itemIndex], list);
  });
}
function handleEditSubmit(){
  $('.shopping-item-controls').submit(function(event){
    alert("ahh");
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemIndex = STORE.items.findIndex(item => item.id === itemId);
    STORE.items[itemIndex].name = $('.js-item-edit-form').val();
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleSearch();
  handleEditClick();
  handleEditSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);