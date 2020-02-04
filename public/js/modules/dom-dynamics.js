import { removeProdFromCart, add2Cart } from "./dom.js";

export const dynamicProductCard = (domEl, prod) => {
  const cont = document.createElement("section");
  cont.classList.add("product-card-cont");
  cont.setAttribute("prod-id", prod.id);
  cont.setAttribute("prod-code", prod.artcode);

  const art = document.createElement("article");

  const el1 = document.createElement("h4");
  el1.classList.add("prod-name");
  el1.innerHTML = prod.name;

  const el2 = document.createElement("p");
  el2.classList.add("prod-code");
  el2.innerHTML = "Code: " + prod.artcode;

  const el3 = document.createElement("p");
  el3.classList.add("prod-price");
  el3.innerHTML = "Price: " + prod.price + " $";

  const img = document.createElement("img");
  img.setAttribute("src", prod.img);
  img.setAttribute("alt", prod.name);

  const button = document.createElement("button");
  button.setAttribute("prodcode", prod.artcode);
  if (prod.inCart != null && prod.inCart) {
    button.classList.add("prd-btn-incart");
    button.innerHTML = "In Cart";
    button.disabled = true;
  } else {
    button.classList.add("prd-btn-standard");
    button.innerHTML = "Add to Cart";
  }

  button.addEventListener("click", event => {
    add2Cart(event);
  });

  art.append(el1, el2, el3, img);
  cont.append(art, button);
  domEl.append(cont);
};

export const dynamicCartLine = (domEl, prod) => {
  const cont = document.createElement("section");
  cont.classList.add("cart-line");
  cont.setAttribute("cart-prod-id", prod.id);
  cont.setAttribute("artcode", prod.product);

  const art = document.createElement("article");

  const img = document.createElement("img");
  img.setAttribute("src", prod.img);
  img.setAttribute("alt", prod.name);

  const nameCodeDiv = document.createElement("div");

  const el1 = document.createElement("h4");
  el1.classList.add("cart-prod-name");
  el1.innerHTML = prod.name;

  const el2 = document.createElement("p");
  el2.classList.add("cart-prod-code");
  el2.innerHTML = "Code: " + prod.product;

  nameCodeDiv.append(el1, el2);

  const el3 = document.createElement("p");
  el3.classList.add("cart-prod-price");
  el3.innerHTML = "Price: " + prod.price + "$";

  art.append(img, nameCodeDiv, el3);

  const button = document.createElement("button");
  button.setAttribute("cart-prod-id", prod.id);
  button.addEventListener("click", event => {
    removeProdFromCart(event);
  });

  cont.append(art, button);
  domEl.append(cont);
};
