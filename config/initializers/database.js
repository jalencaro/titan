/**
 * Initializes the mongo database
 * @param  {Object} 	config      	Holds the configuration used on the server
 * @param  {String} 	environment 	The name of the environment
 * @return {Database}             		Mongoose module with mongo initialized
 */
function bootDatabase(config, environment) {
	const mongoose   = require('mongoose')
	mongoose.Promise = global.Promise

	if (!environment && environment!=='local') { mongoose.connect(config.uri + config.name, { mongos: true }) } 
	else { mongoose.connect( config.uri + config.name ) }
}

module.exports = bootDatabase
