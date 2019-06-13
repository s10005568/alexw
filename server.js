// Required Modules
var express    = require("express");
const mysql = require('mysql');
var morgan     = require("morgan");
var app        = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(morgan("tiny"));
app.use(express.static("./"));

//connect to SQL here
const db = mysql.createConnection({
	host     : 'localhost',
	port	 : '3306',
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

//route
app.route('/api').get((req, res) => {
  res.send({
    "todo":[
  {"title":"John", "completed":false}, 
]
  })
})

//insert statement here
app.route('/api/todos').post((req, res) => {
	console.log(req.body.title)
	const name = req.body.title
	const type = req.body.completed
console.log(JSON.stringify(req.body))
	const queryString = "insert into items (type, name) values (?, ?)"
	db.query(queryString, [type, name], (err, res, fields) => {
		if(err) {
			console.log("insert failed. " + err);
			res.end()
			return;
		}
		
		console.log("insert success");
	});	
	
	res.end()
})

//delete statement here
app.route('/api/todos').delete((req, res) => {
	var todo = JSON.parse(req.query.todo)
	var name = todo.title
	const queryString = 'DELETE FROM items WHERE NAME like "'+name+'"'
	console.log('sql: '+queryString);
	db.query(queryString, [name],(err, res, fields) => {
		if(err) {
			console.log("delete failed. " + err);
			res.end()
			return;
		}
		
		console.log("delete success");
	});	
  res.sendStatus(204)
})

//get statement here
app.route('/api/todos').get((req, res) => {
 
	const queryString = 'select * from items';
 	db.query(queryString, (err, rows, fields) => {
		if(err) {
			console.log('query failed ' + queryString);
			res.sendStatus(500)
			return
		}
		console.log('fetch success');

		const items = rows.map((row) => {
			return {completed: row.type, title: row.name}
		});
		res.send({"todo": items})
	});
 })

 //put statement here
 app.route('/api/todos').put((req, res) => {
	const queryString = 'UPDATE items SET NAME = "'+ req.body.title+'", type = ' +req.body.completed+' WHERE NAME LIKE "'+req.body.title+'"'
	console.log(queryString)
	db.query(queryString, (err, res, fields) => {
		if(err) {
			console.log("update failed. " + err);
			res.end()
			return;
		}
		
		console.log("update success");
	});	
	
	res.end()
})




app.get("/", function(req, res) {
    res.sendFile("./index.html"); //index.html file of your angularjs application
});

// Create DB
app.get('/createdb', (req, res) => {
	let sql = 'CREATE DATABASE test';
	db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('DB created');
	});
}); 

// Retrieve sorted DB
app.get('/items/:id', (req, res) => {
	console.log('fetching items with type: ' + req.params.id);
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

// Retrieve all
app.get('/items', (req, res) => {
	console.log('fetching all items');
	const userId = req.params.id
	const queryString = 'select * from items';
	db.query(queryString, (err, rows, fields) => {
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

// Start Server
app.listen('3000', () => {
	console.log('Server started on port 3000');
});