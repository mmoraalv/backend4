import express from 'express';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import { __dirname } from './path.js'
import path from 'path'

const PORT = 8080;
const app = express();

const server = app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
});

const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine()) //Defino que voy a trabajar con hbs y guardo la config
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))


io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

	socket.on('newProduct', async product => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});
});

app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/static', (req, res) => {
	res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);

