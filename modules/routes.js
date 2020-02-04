const {
  getProductByArt,
  getProducts,
  createCart,
  getCartById,
  deleteItemFromCart,
  getProductInCartByField,
  getProductInCartById,
  addProductToCart
} = require("./database");

const shortid = require("shortid");

function respondClient(res, par = {}) {
  // 'res' and 'par' are objects.
  // All keys  in 'par' except for 'status' are sent in the response object: res.send(JSON.stringify({field1, field2}))
  // status = numeric, HTTP status code, this field is sent as parameter to the status function: res.status(status)
  //
  if (typeof res !== "object") return "Fatal Error";

  let status = 200;
  let data = {};
  if (
    par.status &&
    typeof par.status === "number" &&
    par.status >= 100 &&
    par.status < 600
  )
    status = par.status;
  const entries = Object.entries(par);
  for (const [key, value] of entries) {
    if (key === "status") continue;
    data[key] = value;
  }

  res.status(status).send(JSON.stringify(data));
  // res.status(status).send(data);
}

// respondClient({
//   status: 2,
//   data: { foo: "a", bar: 1 },
//   totali: 120,
//   finito: "fatto"
// });

module.exports = function(app) {
  app.get("/api/products", (req, res) => {
    /*      Get all products from database      */
    const products = getProducts();
    if (!products.length)
      return respondClient(res, {
        status: 200,
        message: "No products found in the database"
      });
    // res.status(200).send({ message: "No products found in the database" });

    respondClient(res, { status: 200, data: products });
    // res.status(200).send({ data: products });
  });

  app.get("/api/products/:artcode", (req, res) => {
    /*      Get Product by artcode      */
    const product = getProductByArt(req.params.artcode);

    if (!product)
      return respondClient(res, {
        status: 200,
        message: "The product was not found in the database"
      });

    respondClient(res, { status: 200, data: product });
  });

  app.post("/api/cart", (req, res) => {
    /*      Create new Cart      */
    if (!req.body.newCart)
      return respondClient(res, {
        status: 400,
        message:
          "No cart created. Add the property 'newCart' and set it to true"
      });

    const newCart = createCart(shortid.generate());

    if (!newCart)
      return respondClient(res, {
        status: 500,
        message: "Error creating a new cart"
      });

    respondClient(res, { status: 200, data: newCart });
  });

  app.get("/api/cart/:cartId", (req, res) => {
    /* Returns content of cart by cartID*/

    const cart = getCartById(req.params.cartId);

    if (!cart)
      return respondClient(res, {
        status: 200,
        message: "the cart with given ID was not found"
      });

    const total = cart.content.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);

    cart.cartTotal = total;
    // respondClient(res, { status: 200, data: cart, cartTotal: total });
    respondClient(res, { status: 200, data: cart });
  });

  app.post("/api/cart/product", (req, res) => {
    /*      Add Product to Cart      */

    if (!req.body.cartId || req.body.cartId == "")
      return respondClient(res, {
        status: 400,
        message: "cartId is mandatory"
      });

    const cartId = req.body.cartId;
    if (!getCartById(cartId))
      return respondClient(res, {
        status: 400,
        message: `Your cart id ${cartId} was not found`
      });

    if (!req.body.product || req.body.product == "")
      return respondClient(res, {
        status: 400,
        message: `The request does not contain any products`
      });

    const prodInDb = getProductByArt(req.body.product);

    if (!prodInDb)
      return respondClient(res, {
        status: 400,
        message: `The requested product was not found in the database`
      });

    const product = req.body.product;

    let qty = 1;
    // Removed as required by the customer. There should be only one :-)
    //   if (req.body.qty != null && req.body.qty > qty) qty = req.body.qty;

    let check = getProductInCartByField(cartId, ["product", product]);

    // if item is already in the cart
    if (check) {
      if (false) {
        // Removed as required by customer. function (assigns qty of duplicate item to the existing one in cart)
        database
          .get("carts")
          .find({ cart: cartId })
          .findProductInCartById(check.id)
          .assign({ qty: check.qty + qty })
          .write();
      } else {
        return respondClient(res, {
          status: 200,
          data: check,
          message:
            "The product is already in cart. Add something else or go to payment, but stop bugging me, please"
        });
      }
    } else {
      const newId = shortid.generate();

      const productObj = {
        id: newId,
        qty: qty,
        product: product,
        artId: prodInDb.id,
        name: prodInDb.name,
        img: prodInDb.img,
        price: prodInDb.price
      };

      // Add product to cart
      check = addProductToCart(cartId, productObj, newId);

      if (!check)
        return respondClient(res, {
          status: 500,
          message: "Error adding the product to the database"
        });

      respondClient(res, { status: 200, data: check });
    }
  });

  app.delete("/api/cart/product/:cartId/:productId", (req, res) => {
    /*      Remove Product from Cart      */

    const cartItem = getProductInCartById(
      req.params.cartId,
      req.params.productId
    );

    if (!cartItem)
      return respondClient(res, {
        status: 200,
        message: "Item with given cartId and productId was not found"
      });

    const deletedItem = deleteItemFromCart(req.params.cartId, cartItem);

    if (!deletedItem[0])
      return respondClient(res, {
        status: 500,
        message: "Server error removing the item from cart"
      });

    respondClient(res, {
      status: 200,
      data: deletedItem[0]
    });
  });

  /* 404 - Requests below*/
  app.get("*", (req, res) => {
    respondClient(res, {
      status: 404,
      message: "Page not found"
    });
  });

  app.delete("*", (req, res) => {
    respondClient(res, {
      status: 404,
      message: "Page not found"
    });
  });

  app.post("*", (req, res) => {
    respondClient(res, {
      status: 404,
      message: "404 - Page not found"
    });
  });
};
