/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl: 'todomvc-index.html',
			resolve: {
				store: function (todoStorage) {
					// Get the correct module (API or localStorage).
					return todoStorage.then(function (module) {
						module.get(); // Fetch the todo records in the background.
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});

	const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan')
const bodyParser = require('body-parser');

// Create connection

const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'test'
});

// Connect

db.connect((err) => {
		if(err){
			throw err;
		}
		console.log('MySql Connected');
}); 

const app = express();
app.use(express.static('./public'));
app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended: false}));

// Create DB
app.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE test';
	db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('DB created');
	});
}); 

// Retrieve DB
app.get('/items/:id', (req, res) => {
	console.log('fetching armor with type: ' + req.params.id);
	const userId = req.params.id
	const queryString = 'select * from items where type like ?';
	db.query(queryString, [userId], (err, rows, fields) => {
		if(err) {
			console.log('query failed ' + queryString);
			res.sendStatus(500)
			return
		}
		
		console.log('fetch success');
		const items = rows.map((row) => {
			return {type: row.type, name: row.name}
		});
		res.json(items);
	});
});

//insert into DB
app.post('/insert_item', (req, res) => {
	console.log('trying to insert a new awesome item');
	const type = req.body.type;
	const name = req.body.name;
	
	const queryString = "insert into items (type, name) values (?, ?)"
	db.query(queryString, [type, name], (err, res, fields) => {
		if(err) {
			console.log("insert failed. " + err);
			res.sendStatus(500)
			return;
		}
		
		console.log("insert success");
	});	
	
	res.end()
});

app.listen('3000', () => {
		console.log('Server started on port 3000');
});