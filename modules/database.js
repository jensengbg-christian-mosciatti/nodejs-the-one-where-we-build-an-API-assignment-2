const lowdb = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db/database.json");
const database = lowdb(adapter);

database._.mixin({
  findProductInCartById: function(array, id) {
    let index = array.content.find(el => el.id === id);
    if (index == null) index = false;
    return index;
  }
});

database._.mixin({
  findProductInCartByField: function(array, field = undefined, id = undefined) {
    let index = array.content.find(el => el[field] === id);
    if (index == null) index = false;
    return index;
  }
});

function initiateDatabase() {
  if (!database.has("products").value())
    database.defaults({ products: [] }).write();

  if (!database.has("carts").value()) database.defaults({ carts: [] }).write();
}

function getProductByArt(artcode) {
  return database
    .get("products")
    .find({ artcode: artcode })
    .value();
}

function getProducts() {
  return database.get("products").value();
}

function createCart(id) {
  database
    .get("carts")
    .push({ cart: id, content: [] })
    .write();

  return database
    .get("carts")
    .find({ cart: id })
    .value();
}

function getCartById(cartId) {
  return database
    .get("carts")
    .find({ cart: cartId })
    .value();
}

function getProductInCartById(cartId, productId) {
  return database
    .get("carts")
    .find({ cart: cartId })
    .findProductInCartById(productId)
    .value();
}

function deleteItemFromCart(cartId, cartItem = {}) {
  return database
    .get("carts")
    .find({ cart: cartId })
    .get("content")
    .remove(cartItem)
    .write();
}

function getProductInCartByField(cartId, field = { fieldName, fieldValue }) {
  // field = [fieldName, fieldValue]
  return database
    .get("carts")
    .find({ cart: cartId })
    .findProductInCartByField(`${field[0]}`, field[1])
    .value();
}

function addProductToCart(cartId, productObj, id) {
  database
    .get("carts")
    .find({ cart: cartId })
    .get("content")
    .push(productObj)
    .write();

  return database
    .get("carts")
    .find({ cart: cartId })
    .findProductInCartById(id)
    .value();
}

exports.initiateDatabase = initiateDatabase;
exports.getProductByArt = getProductByArt;
exports.getProducts = getProducts;
// exports.database = database;

exports.createCart = createCart;
exports.getCartById = getCartById;
exports.getProductInCartById = getProductInCartById;
exports.getProductInCartByField = getProductInCartByField;
exports.deleteItemFromCart = deleteItemFromCart;
exports.addProductToCart = addProductToCart;
