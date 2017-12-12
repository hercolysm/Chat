var MongoClient = require('mongodb').MongoClient;
var conn;

MongoClient.connect('mongodb://localhost/chat', function(err, database) {
	if(err) throw err;

	conn = database;
	console.log("Connected with MongoDB success!");
})

module.exports = { findAll };

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
