import { dynamicProductCard, dynamicCartLine } from "./dom-dynamics.js";
import { loadCartList } from "./server-op.js";

export const displayData = (domEl, data, type) => {
  emptyElement(domEl, false);

  let func;
  switch (type) {
    case "products":
      func = dynamicProductCard;
      break;
    case "cart":
      func = dynamicCartLine;
      break;
  }
  for (const el of data) func(domEl, el);
};

export const displayNoData = (domEl, message) => {
  emptyElement(domEl, false);

  const el = document.createElement("p");
  el.innerHTML = message ? message : "No data to display";
  domEl.append(el);
};

export const emptyElement = (domEl, loading) => {
  while (domEl.firstElementChild) {
    domEl.firstElementChild.remove();
  }
  if (loading) {
    const div = document.createElement("div");
    div.setAttribute("style", "text-align: center");
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "/images/blocks-1s-58px.gif");
    const el = document.createElement("p");
    el.innerHTML = "Loading data...";

    div.append(spinner, el);
    domEl.append(div);
  }
};

export const addRemOverlay = (domEl, add = true) => {
  // if add=true: add thr overlay
  // if add=false: remove the overlay (last child, without querySelectors)
  if (add) {
    domEl.classList.add("blur");
    const removingEl = document.createElement("div");
    removingEl.classList.add("removing");
    const removingImg = document.createElement("img");
    removingImg.setAttribute("src", "./images/blocks-1s-58px.gif");
    removingImg.setAttribute("width", "50px");
    removingImg.setAttribute("height", "auto");
    removingImg.setAttribute("style", "display: 'inline-block'");

    const removingTxt = document.createElement("p");
    removingTxt.innerHTML = "Deleting...";

    removingEl.append(removingImg, removingTxt);
    domEl.append(removingEl);
  } else domEl.removeChild(domEl.lastElementChild);
};

export const updCartTotal = async (total = null) => {
  if (total == null) {
    const data = await loadCartList();
    total = data.data.cartTotal;
  }
  total == null ? 0 : total;

  document.getElementById("order-total").innerHTML = `${total} $`;
};

export const btnState = (buttonEl, state, interval = false) => {
  //state = 0 --> standard
  //state = 1 --> adding
  //state = 2 --> complete
  //state = 3 --> Error
  //state = 4 --> Already in cart

  if (interval) clearInterval(interval);
  interval = false;

  if (!buttonEl) return;

  buttonEl.classList.remove(...buttonEl.classList);
  switch (state) {
    case 0:
      buttonEl.innerText = "Add to Cart";
      buttonEl.classList.add("prd-btn-standard");
      break;
    case 1:
      buttonEl.disabled = true;
      buttonEl.classList.add("prd-btn-appending");
      buttonEl.innerText = ">";
      interval = setInterval(() => {
        if (buttonEl.innerText.length === 10) buttonEl.innerText = "";
        buttonEl.innerText += ">";
      }, 300);
      break;
    case 2:
      //   buttonEl.disabled = false;
      buttonEl.classList.add("prd-btn-complete");
      buttonEl.innerText = "Success!";
      setTimeout(() => {
        btnState(buttonEl, 4);
      }, 1500);
      break;
    case 3:
      buttonEl.classList.add("prd-btn-error");
      buttonEl.innerText = "Error";

      setTimeout(() => {
        buttonEl.disabled = false;
        btnState(buttonEl, 4);
      }, 2500);
      break;
    case 4:
      buttonEl.disabled = true;
      buttonEl.classList.add("prd-btn-incart");
      buttonEl.innerText = "In Cart";
      break;
  }
  return interval;
};

export const cartBulletDom = (qty, add = false) => {
  const bulletTxt = document.getElementById("cart-bullet");
  if (add) bulletTxt.innerHTML = Number(bulletTxt.innerHTML) + qty;
  else bulletTxt.innerHTML = qty;

  const bullet = document.getElementById("cart-bullet-cont");
  if (qty && bullet.classList.contains("hidden")) {
    bullet.classList.remove("hidden");
  } else if (!qty && !bullet.classList.contains("hidden")) {
    bullet.classList.add("hidden");
  }
};
