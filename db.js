var MongoClient = require('mongodb').MongoClient;
var conn;

MongoClient.connect('mongodb://localhost/chat', function(err, database) {
	if(err) throw err;

	conn = database;
	console.log("Connected with MongoDB success!");
})

module.exports = { findAll, insert };

/* funções */

/**
 * findAll
 *
 * Retorna consulta
 */
function findAll(callback) {

	if (conn) {
		var db = conn.db('chat');
		db.collection('message').find({}).toArray(callback);
	}

}

/**
 * insert
 *
 * Insere mensagem no BD
 */
function insert(msg) {

	if (msg) {
		console.log('Inserindo mensagem no banco de dados...');
		var db = conn.db('chat');
		db.collection('message').insert(msg);
	}

}
