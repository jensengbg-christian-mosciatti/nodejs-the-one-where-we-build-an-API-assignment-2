import {
  stall,
  loadProductList,
  loadCartList,
  checkItemsInCart,
  checkProductsInCart
} from "./modules/server-op.js";

import {
  emptyElement,
  displayData,
  displayNoData,
  cartBulletDom,
  updCartTotal
} from "./modules/dom.js";

document.getElementById("menu-toggle").addEventListener("click", () => {
  toggleMenu();
});

function toggleMenu() {
  const nav = document.querySelector("header nav");
  nav.classList.toggle("hide-nav");
}

document.addEventListener("DOMContentLoaded", event => {
  if (event.target.location.pathname === "/products.html") {
    const domEl = document.querySelector(".product-cards");
    loadProducts(domEl);
  }
  if (event.target.location.pathname === "/shoppingcart.html") {
    const domEl = document.querySelector(".cart-content");
    loadCart(domEl);
  }

  updCartBullet();
});

async function updCartBullet() {
  const items = await checkItemsInCart();
  cartBulletDom(items);
}

async function loadProducts(domEl) {
  emptyElement(domEl, true);
  await stall(700);
  let data = await loadProductList();
  data = await checkProductsInCart(data.data);

  if (data.length) displayData(domEl, data, "products");
  else displayNoData(domEl, "There are no products to display");
}

async function loadCart(domEl) {
  emptyElement(domEl, true);
  await stall(700);
  const data = await loadCartList();

  if (data.data.content.length) displayData(domEl, data.data.content, "cart");
  else displayNoData(domEl, "Your cart is empty");

  updCartTotal(data.data.cartTotal);
}
