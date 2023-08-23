import { Router } from 'express';
import { ProductManager } from '../controllers/productManager.js';

const routerProd = Router();
const productManager = new ProductManager('./src/models/products.json');

routerProd.get('/', async (req, res) => {
	const { limit } = req.query;
	const prods = await productManager.getProducts();
	const productos = prods.slice(0, limit);
	res.status(200).send(productos);
});

routerProd.get('/:pid', async (req, res) => {
	const { pid } = req.params;
	const prod = await productManager.getProductById(pid);
	prod ? res.status(200).send(prod) : res.status(404).send('Producto no existente');
});

routerProd.post('/', async (req, res) => {
	const confirmacion = await productManager.addProduct(req.body);
	confirmacion
		? res.status(200).send('Producto creado correctamente')
		: res.status(400).send('Producto ya existente');
});

routerProd.put('/:pid', async (req, res) => {
	const { pid } = req.params;
	const confirmacion = await productManager.updateProducts(pid, req.body);
	confirmacion
		? res.status(200).send('Producto actualizado correctamente')
		: res.status(400).send('Producto ya existente');
});

routerProd.delete('/:pid', async (req, res) => {
	const { pid } = req.params;
	const confirmacion = await productManager.deleteProduct(pid);
	confirmacion
		? res.status(200).send('Producto eliminado correctamente')
		: res.status(404).send('Producto no encontrado');
});

export default routerProd;