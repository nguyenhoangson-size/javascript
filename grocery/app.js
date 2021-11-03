// query 
const form = document.querySelector('.grocery-form');
const alert = document.querySelector('.alert');
const grocery = document.getElementById('grocery');
const clearBtn = document.querySelector('.clear-btn');
const list = document.querySelector('.grocery-list');
const container = document.querySelector('.grocery-container');
const submitBtn = document.querySelector('.submit-btn');
// edit option
let editElement;
let editFlag = false;
let editID = "";
// EVENTS LISTENER
//sumbit form
form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
//load items
window.addEventListener('DOMContentLoaded', setupItems);
//function

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id,value);
    // display alert
    displayAlert("item add to the list", "success");
    //show container
    container.classList.add('show-container');
    // add local strorage
    addToLocalStorage(id, value);
    //set to back to default
    setToBackToDefault();
  }
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Value changed", "success");
    //edit local Storage
    editToLocalStorage(editID, value);
    setToBackToDefault();
  }
  else {
    displayAlert("Plesae enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000)
}
//Clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    })
  }
  container.classList.remove('show-container');
  displayAlert("empty list", "danger");
  setToBackToDefault();
  localStorage.removeItem('list');
}
//edit item
function editItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = item.dataset.id;
  submitBtn.textContent = "edit";
  
}
// delete item
function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  console.log(item)
  const id = item.dataset.id;
  console.log(id)
  list.removeChild(item);
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert("Item removed", "danger");
  setToBackToDefault();
  //remove from to loacl storage
  removeFromLocalStorage(id);
}
// set back to default
function setToBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editId = '';
  submitBtn.textContent = 'submit';
}
//LOCAL STORAGE
function addToLocalStorage(id, value) {
  // console.log("add item ")
  const grocery = { id, value };
  let items = getLocalStorage()
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  })
  localStorage.setItem("list", JSON.stringify(items));
}
function editToLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  })
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// Local storage API
//set Item
//get Item
// remove Item
//save as strings
// localStorage.setItem('item', JSON.stringify(["item1",'item2']));
// const item =  JSON.parse(localStorage.getItem('item'));
// console.log(item);
// localStorage.removeItem('item');
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item){
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}
function createListItem(id, value) {
  const element = document.createElement('article');
  //add classList
  // add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add('grocery-item');
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button  type="button" class="edit-btn" >
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`
  ;
  //append list
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element)
}