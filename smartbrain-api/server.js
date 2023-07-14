//agregar el script "start": "nodemon server.js", al package json
//"type": "module", agregar esto para tambien para usar express
import express from "express";
const app = express();
import bcrypt from "bcrypt-nodejs"
import cors from "cors";
import knex from "knex";  //knex para conectar el server con el database



 const db = knex({
  client: 'pg',  //seleccionar pg o mysql
  connection: {
    host : '127.0.0.1',
    port : 5432,  //postgres pgadmin 4
    user : 'postgres',  //owner que sale en git bash al poner \d
    password : 'test',  //contraseña del usuario postgres
    database : 'smartbrain' 
  }
});

db.select("*").from("users").then(data => {
	console.log("data: ", data);
});  



app.use(express.urlencoded());  //para poder manipular las request 
app.use(express.json());
app.use(cors());  //para que se pueda comunicar con el frontend en chrome



// const database = {      //por mas que agregue usuarios, cada vez que guarde los cambios del archivo server.js, nodemon reinicia el server y vuelve a leer el codigo, volviendo la database a solo 2 usuarios
// 	users: [{
// 		id:"123",
// 		name: "John",
// 		email: "john@gmail.com",
// 		password: "cookies",
// 		entries: 0,  //registro de cuántas imagenes introdujo
// 		joined: new Date()   //registro de fecha de sign up
// 	},
// 	{
// 	 	id:"1234",
// 		name: "Sally",
// 		email: "sally@gmail.com",
// 		password: "bananas",
// 		entries: 0, 
// 		joined: new Date()   

// 	}]
// }


app.get("/", (req, res) => {
	res.send("server running")
})


// app.post("/signin", (req, res) => {
// 	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
// 		res.json(database.users[0])
// 	} else {
// 		res.status(400).json("error logging in")  //.json() es lo mismo que send()
// 	}
// })


app.post("/signin", (req, res) => {
	db.select("email", "hash").from("login").where("email", "=", req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);  //returns true
		if (isValid) {
			return db.select("*").from("users").where("email", "=", req.body.email).then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json("unable to get user"))
		} else {res.status(400).json("wrong credentials")}
	}).catch(err => res.status(400).json("wrong credentials"))
})

// app.post("/register", (req, res) => {
// 	const {email,name,password} = req.body
// 	database.users.push({
// 			id:"125",
// 			name: name,
// 			email: email,
// 			password: password,
// 			entries: 0, 
// 			joined: new Date()   
// 	})
// 	res.json(database.users[database.users.length-1]); //para responder con el ultimo usuario creado, que va a ser el que mandaron como register
// });

// app.post("/register", (req, res) => {
// 	const {email,name,password} = req.body
// 	db("users").insert({			//funciones de knex documentation
// 		email: email,
// 		name: name,
// 		joined: new Date()
// 	}).returning("*")   //returning("*") es para indicar el select que hace 
// 	.then(response => {res.json(response[0])})   //la response de knex es un array, por eso respondemos con response[0] para que el front pueda acceder a dataid dataname y todo los demas como está construido
// 	.catch(err => res.status(400).json("Email ya se encuentra registrado"));   //porque en la db le pusimos UNIQUE a la columna email
// });


app.post("/register",  (req, res) => {
	const {email,name,password} = req.body;
	const hash = bcrypt.hashSync(password);  //agrega bcrypt y el metodo .transaction() de knex para agregar password y registrar en ambas tablas, login y users
	db.transaction(trx => {  //trx transaction object
		trx.insert({
			hash: hash,
			email: email
		}).into("login")	//inserta hash y email a la tabla "login"
		.returning("email").then(loginEmail => { //response registrada en login, pasa a registrarse en users
			trx("users").insert({			//usa trx("tabla").insert({}) en vez de trx.insert({}).into("tabla")
			email: loginEmail[0].email, //porque la response es un array con 1 solo obtjeto, el usuario
			name: name,
			joined: new Date()
		}).returning("*")   
		.then(response => {res.json(response[0])})   
		})
		.then(trx.commit)
		.catch(trx.rollback)  //si hay error vuelve para atras y ejecuta el catch que sigue al db.transaction.. el que está justo aca abajo
	})
		
		.catch(err => res.status(400).json("Email ya se encuentra registrado"));  
});


// app.get("/profile/:id", (req, res) =>{
// 	const { id} = req.params;
// 	let found = false
// 	database.users.forEach(user => {
// 		if (user.id === id) {
// 			found = true;
// 			return	res.json(user)
// 		} 
// 	})
// 	if (!found) {
// 		res.status(400).json("not found")
// 	}

// })

app.get("/profile/:id", (req, res) =>{
	const { id} = req.params;
	db.select("*").from("users").where({id: id}).then(user => {
		if (user.length) {			//cuando haces una request con id que no existe en la base de datos de responde con un array vacio, que en js eso es true, no va a dar error. Entonces hay que usar este if para simular que hubo un error y hacer saber que el id ingresado no existe
			res.json(user[0]);
		}else {
			res.status(400).json("User ID not found");
		}
		
	}).catch(err => res.status(400).json("error getting user"))
	// if (!found) {
	// 	res.status(400).json("not found")
	// }

})


// app.put("/image", (req, res) =>{
// 	const { id} = req.body;
// 	let found = false
// 	database.users.forEach(user => {
// 		if (user.id === id) {
// 			found = true;
// 			user.entries++;
// 			return	res.json(user.entries)   //para chequear como va cambiando el database mandar en postaman PUTs a 3000/image con un body "id": "123" y despues ir al home "/" para que loguee los usuarios
// 		} 
// 	})
// 	if (!found) {
// 		res.status(400).json("not found")
// 	}

// })


app.put("/image", (req, res) =>{
	const { id} = req.body;
	db("users").where("id", "=", id).increment("entries", 1).returning("entries").then(entries =>{
		res.json(entries[0].entries)
	}).catch(err => {
		res.status(400).json("unable to get entries")
	})
//con los methods de knex reemplaza el js anterior para actualizar la db e incrementar en 1 las entries de cada usuario
	// cada vez que se haga una put request con ese id de usuario 
})




//BCRYPT-NODEJS
// bcrypt.hash("bacon", null, null, function(err, hash) {
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });









app.listen(3001, () => {
	console.log("app is running on port 3001")
})

/*DISEÑO DE LA API (ENDPOINTS)
/ --> res =this is working
/signin --> post = success/fail  por mas que no quieras crear un usuario en el signin, es mas seguro usar POST para los datos sensibles como las contraseñas para que vayan dentro del body y no en la url string
/register --> post = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/

