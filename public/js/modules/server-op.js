const baseUrl = "http://localhost:8000";
const cartId = "hK6CpEvE";

export const stall = async (stallTime = 3000) => {
  await new Promise(resolve => setTimeout(resolve, stallTime));
};

export const loadCartList = () => {
  const url = baseUrl + "/api/cart/" + cartId;
  return fetch(url, { method: "GET" })
    .then(res => res.json())
    .then(async data => {
      await stall(700);
      return data;
    })
    .catch(error => error);
};

export const loadProductList = () => {
  const url = baseUrl + "/api/products";
  return fetch(url, { method: "GET" })
    .then(res => res.json())
    .then(async data => {
      await stall(700);
      return data;
    })
    .catch(error => error);
};

export const dbAddProd = async prod => {
  const url = baseUrl + "/api/cart/product";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify({ cartId: cartId, product: prod })
  })
    .then(res => res.json())
    .then(async data => {
      await stall(500);
      if (data.message != null) {
        window.swal(data.message);
        return false;
      } else {
        return true;
      }
    })
    .catch(error => {
      window.swal(error);
      return false;
    });
};

export const dbRemoveProdFromCart = async (id, EventTarget) => {
  const url = baseUrl + "/api/cart/product/" + cartId + "/" + id;

  return fetch(url, { method: "DELETE" })
    .then(res => res.json())
    .then(async data => {
      await stall(500);
      if (data.message) {
        window.swal(data.message);
        return 0;
      } else return data;
    })
    .catch(error => window.swal(error));
};

export const checkItemsInCart = () => {
  const url = baseUrl + "/api/cart/" + cartId;
  return fetch(url, { method: "GET" })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        window.swal(data.message);
        return 0;
      } else return data.data.content.length;
    })
    .catch(error => {
      window.swal(error);
      return 0;
    });
};

export const checkProductsInCart = async prodArray => {
  const cartContent = await loadCartList();

  for (const el of cartContent.data.content) {
    const dataObj = prodArray.find(elem => elem.artcode === el.product);

    if (dataObj != null) dataObj.inCart = true;
  }
  return prodArray;
};
