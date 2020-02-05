import { loadProducts, loadCart, updCartBullet } from "./modules/main.js";

document.getElementById("menu-toggle").addEventListener("click", () => {
  toggleMenu();
});

function toggleMenu() {
  const nav = document.querySelector("header nav");
  nav.classList.toggle("hide-nav");
}

document.addEventListener("DOMContentLoaded", event => {
  if (event.target.location.pathname === "/products.html") {
    loadProducts();
  }
  if (event.target.location.pathname === "/shoppingcart.html") {
    loadCart();
  }
  updCartBullet();
});
