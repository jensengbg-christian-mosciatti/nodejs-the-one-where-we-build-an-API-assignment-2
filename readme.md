Basic NodeJs App to handle lines in the shopping cart of an e-commerce web site

Endpoints

-- New Shopping cart
/api/cart 
POST 
body: {
    "newCart" : true
 } 

--Get all products in catalog
/api/products
GET

--Get product from catalog by artcode
/api/products/:artcode
GET
params: artcode

--Get cart content
/api/cart/:cartId
GET
params: cartId

--Add product to cart
/api/cart/product
POST
body: {
    "cartId": XXXXXX,
    "product": XXXXXX
}

--Delete product from cart
/api/cart/product/:cartId/:productId
DELETE
params: cartId, productId
