/**
 * APP.JS - Main entry file
 * The app starts here. The current NODE_ENV will be booted.
 */

/**
 * Improve the require path. Controllers, models and helpers can
 * be required direclty, without the need of traversing the
 * relative path.
 *
 * This will work, anywhere on the app.
 * const controller = apprequire('controller/samples');
 * const controller = newApprequire('controller/samples');
 */
global.apprequire = function(fileName) { return require(__dirname + '/app/' + fileName)};
global.newApprequire = function(fileName) { return new (require(__dirname + '/app/' + fileName))() };

//Getting the module and the current environment
const yamler = require('yamler')
const env    = process.env.NODE_ENV || 'local'

//Getting the configuration for the application and the database
const appConfig = yamler('config/application.yml')[env]
const dbConfig  = yamler('config/database.yml')[env]

require('./config/initializers/server.js')(appConfig) //bootServer
require('./config/initializers/database.js')(dbConfig, env) //bootDatabase