const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/dbconnect');
const initRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8888;
app.use(cookieParser());
const cors=require('cors');
app.use(cors({
	origin:process.env.CLIENT_URL,
	methods:['GET','POST','PUT','DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRoutes(app);
app.listen(port, () => {
	console.log('Sever running on the port: ' + port);
});
