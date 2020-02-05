import {
  loadProductList,
  loadCartList,
  checkItemsInCart,
  checkProductsInCart,
  dbRemoveProdFromCart,
  dbAddProd
} from "./server-op.js";

import {
  emptyElement,
  displayData,
  displayNoData,
  cartBulletDom,
  updCartTotal,
  btnState,
  addRemOverlay
} from "./dom.js";

/** Products **/
export const loadProducts = async () => {
  const domEl = document.querySelector(".product-cards");
  emptyElement(domEl, true);
  //   await stall(700);
  let data = await loadProductList();
  data = await checkProductsInCart(data.data);

  if (data.length) displayData(domEl, data, "products");
  else displayNoData(domEl, "There are no products to display");
};

export const add2Cart = async event => {
  let error = { status: false, message: "" };
  let prod;
  if (event.target.hasAttribute("prodcode")) {
    prod = event.target.getAttribute("prodcode");

    if (prod) {
      //   console.log("prd: ", prod);
    } else {
      error.status = true;
      error.message = "Error: no products attached to the request";
    }
  } else {
    error.status = true;
    error.message = "Error: product code is required";
  }

  if (error.status) {
    window.swal(error.message);
    return error;
  }

  const interval = btnState(event.target, 1);
  if (await dbAddProd(prod, event.target)) {
    btnState(event.target, 2, interval);
    cartBulletDom(1, true);
  } else btnState(event.target, 3, interval);
};

/**  Cart **/
export const loadCart = async () => {
  const domEl = document.querySelector(".cart-content");
  emptyElement(domEl, true);

  const data = await loadCartList();

  if (data.data.content.length) displayData(domEl, data.data.content, "cart");
  else displayNoData(domEl, "Your cart is empty");
  console.log(data.data.cartTotal);
  updCartTotal(data.data.cartTotal);
};

export const removeProdFromCart = async event => {
  let error = { status: false, message: "" };

  let id;
  if (event.target.hasAttribute("cart-prod-id")) {
    id = event.target.getAttribute("cart-prod-id");

    if (id) {
      //   console.log("prd: ", prod);
    } else {
      error.status = true;
      error.message = "Error: no line identifier found in the request";
    }
  } else {
    error.status = true;
    error.message = "Error: Line identifier required";
  }

  if (error.status) {
    window.swal(error.message);
    return error;
  }

  const el = document.querySelector(`.cart-line[cart-prod-id='${id}']`);
  addRemOverlay(el);

  const removedLine = await dbRemoveProdFromCart(id, EventTarget);
  if (removedLine) el.remove();
  else addRemOverlay(el, false);

  const items = await checkItemsInCart();
  cartBulletDom(items);
  if (!items) {
    const domEl = document.querySelector(".cart-content");
    displayNoData(domEl, "Your cart is empty");
  }
  updCartTotal();
};

export const updCartBullet = async () => {
  const items = await checkItemsInCart();
  cartBulletDom(items);
};
