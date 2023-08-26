import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';

export class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
	}

	async addProduct(product) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		const { title, description, price, code, stock, status, category } = product;

		if (!title || !description || !price || !status || !code || !stock || !category) {
			console.log(
				'El producto debe incluir los campos title, description, price, status, code, stock y category'
			);
			return;
		}

		product.id = uuidv4();
		const prodExists = this.products.find(element => element.code === code);

		if (prodExists) {
			return false;
		} else {
			product.status = true;
			this.products.push(product);
		}

		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	async getProducts() {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products;
	}

	async getProductById(id) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products.find(product => product.id == id) ?? false;
	}

	async updateProducts(id, update) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		let product = this.products.find(prod => prod.id == id);
		if (!product) {
			return false;
		}

		let keys = Object.keys(update);
		keys.map(key => key !== 'id' && (product[key] = update[key]));
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	async deleteProduct(id) {
		const fileProducts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		this.products = fileProducts.filter(prod => prod.id !== id);
		if (this.products.length === fileProducts.length) {
			return false;
		}
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	static incrementarID() {
		this.idIncrement ? this.idIncrement++ : (this.idIncrement = 1);
		return this.idIncrement;
	}
}
