import { Router } from 'express';
import { CartManager } from '../controllers/cartManager.js';

const routerCart = Router();
const cartManager = new CartManager('./src/models/carts.json');

routerCart.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	const products = await cartManager.getProductsFromCart(cid);
	products ? res.status(200).send(products) : res.status(404).send('Carrito no existente');
});

routerCart.post('/', async (req, res) => {
	await cartManager.createCart();
	res.status(200).send('Carrito creado correctamente');
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const confirmacion = await cartManager.addProductToCart(cid, pid);
	confirmacion
		? res.status(200).send('Producto agregado correctamente')
		: res.status(404).send('Carrito o producto inexistente');
});

export default routerCart;