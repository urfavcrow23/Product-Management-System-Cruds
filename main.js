// DOM Elements
const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const submit = document.getElementById("submit");
const tbody = document.getElementById("tbody");
const btnDeleteAll = document.getElementById("deleteAll");
const search = document.getElementById("search");

let mood = "create";
let tmp;
let searchMood = "title";

// Initialize Data
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// Event Listeners
submit.addEventListener("click", handleSubmit);
price.addEventListener("input", getTotal);
taxes.addEventListener("input", getTotal);
ads.addEventListener("input", getTotal);
discount.addEventListener("input", getTotal);
search.addEventListener("input", () => searchData(search.value));
document
  .getElementById("searchTitle")
  .addEventListener("click", () => getSearchMood("searchTitle"));
document
  .getElementById("searchCategory")
  .addEventListener("click", () => getSearchMood("searchCategory"));

// Event Handlers
function handleSubmit() {
  const newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (validateProduct(newPro)) {
    if (mood === "create") {
      addProducts(newPro);
    } else {
      updateProduct(newPro);
    }
    clearData();
    saveToLocalStorage();
    showData();
  }
}

function validateProduct(product) {
  return (
    product.title && product.price && product.category && product.count < 100
  );
}

function addProducts(product) {
  for (let i = 0; i < product.count; i++) {
    dataPro.push(product);
  }
}

function updateProduct(product) {
  dataPro[tmp] = product;
  mood = "create";
  submit.innerHTML = "Create";
  count.style.display = "block";
}

// Functions
function getTotal() {
  if (price.value && taxes.value && ads.value) {
    const result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "#040";
  } else {
    total.innerHTML = "0";
    total.style.background = "#a00d02";
  }
}

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

function saveToLocalStorage() {
  localStorage.setItem("product", JSON.stringify(dataPro));
}

function showData() {
  getTotal();
  if (!tbody) {
    console.error("Table body element not found");
    return;
  }

  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button class="update" onclick="updateData(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
      </tr>
    `;
  }
  tbody.innerHTML = table;
  updateDeleteAllButton();
}

function updateDeleteAllButton() {
  if (!btnDeleteAll) {
    console.error("Delete All button element not found");
    return;
  }
  btnDeleteAll.innerHTML =
    dataPro.length > 0
      ? `<button onclick="deleteAll()">Delete All</button>`
      : "";
}

function deleteData(i) {
  dataPro.splice(i, 1);
  saveToLocalStorage();
  showData();
}

function deleteAll() {
  localStorage.removeItem("product");
  dataPro = [];
  showData();
}

function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotal();
  count.style.display = "none";
  category.value = dataPro[i].category;
  submit.innerHTML = "Update";
  mood = "update";
  tmp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

function getSearchMood(id) {
  searchMood = id === "searchTitle" ? "title" : "category";
  search.placeholder =
    "Search By " + searchMood.charAt(0).toUpperCase() + searchMood.slice(1);
  search.focus();
  search.value = "";
  showData();
}

function searchData(value) {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (
      searchMood === "title" &&
      dataPro[i].title.includes(value.toLowerCase())
    ) {
      table += createTableRow(i);
    } else if (
      searchMood === "category" &&
      dataPro[i].category.includes(value.toLowerCase())
    ) {
      table += createTableRow(i);
    }
  }
  tbody.innerHTML = table;
}

function createTableRow(i) {
  return `
    <tr>
      <td>${i + 1}</td>
      <td>${dataPro[i].title}</td>
      <td>${dataPro[i].price}</td>
      <td>${dataPro[i].taxes}</td>
      <td>${dataPro[i].ads}</td>
      <td>${dataPro[i].discount}</td>
      <td>${dataPro[i].total}</td>
      <td>${dataPro[i].category}</td>
      <td><button class="update" onclick="updateData(${i})">Update</button></td>
      <td><button onclick="deleteData(${i})">Delete</button></td>
    </tr>
  `;
}

// Initial Data Display
showData();
