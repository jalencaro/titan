module.exports = {
	AccessDenied     : AccessDenied,
	Unauthorized     : Unauthorized,
	NotFound         : NotFound,
	AlreadyExists    : AlreadyExists,
	BadRequest       : BadRequest,
	Forbidden        : Forbidden
}

/**
 * User is trying to access a resource he does not have permission to
 * @param {string} message A custom message to overwrite the default one
 * 
 */
function AccessDenied(message) {
	this.name = 'AccessDenied'
	this.message = message || 'ACCESS_DENIED'
	this.stack = (new Error()).stack
}
AccessDenied.prototype = Object.create(Error.prototype)
AccessDenied.prototype.constructor = AccessDenied

/**
 * User trying to login has no permission to do so
 * @param {string} message A custom message to overwrite the default one
 */
function Unauthorized(message) {
	this.name = 'Unauthorized'
	this.message = message || 'UNAUTHORIZED'
	this.stack = (new Error()).stack
}
Unauthorized.prototype = Object.create(Error.prototype)
Unauthorized.prototype.constructor = Unauthorized

/**
 * Not found on bluepages
 * @param {string} message A custom message to overwrite the default one
 */
function NotFound(message) {
	this.name = 'NotFound'	
	this.message = message || 'NOT_FOUND'
	this.stack = (new Error()).stack
}
NotFound.prototype = Object.create(Error.prototype)
NotFound.prototype.constructor = NotFound

/**
 * Attempt to create something that already exists
 * @param {string} message A custom message to overwrite the default one
 */
function AlreadyExists(message) {
	this.name = 'AlreadyExists'	
	this.message = message || 'ALREADY_EXISTS'
	this.stack = (new Error()).stack
}
AlreadyExists.prototype = Object.create(Error.prototype)
AlreadyExists.prototype.constructor = AlreadyExists

/**
 * User trying to execute an API with invalid parameters
 * @param {string} message A custom message to overwrite the default one
 */
function BadRequest(message) {
	this.name = 'BadRequest'
	this.message = message || 'BAD_REQUEST'
	this.stack = (new Error()).stack
}
BadRequest.prototype = Object.create(Error.prototype)
BadRequest.prototype.constructor = BadRequest

/**
 * User trying to perform an action he has no permission to
 * @param {string} message A custom message to overwrite the default one
 */
function Forbidden(message) {
	this.name = 'Forbidden'
	this.message = message || 'ACCESS_FORBIDDEN'
	this.stack = (new Error()).stack
}
Forbidden.prototype = Object.create(Error.prototype)
Forbidden.prototype.constructor = Forbidden
