/**
 * SESSION
 * Any login will create a new session, which will have a token.
 * The token will be exchanged by the app and the API to identify
 * the user and its valid session.
 */
const User     = apprequire('models/user.model')
const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectID = Schema.ObjectId
const Error    = apprequire('helpers/errors.helper')

const uuid     = require('uuid')

/**
 * Validates the schema for this model
 * @type {Schema}
 */
const schema = new Schema({
	isValid:  { type: Boolean, defaults: true, required: true},
	token:    { type: String, required: true },
	type:     { type: String, defaults: 'mobile', required: true },
	created:  { type: Date, required: true },
	modified: { type: Date, required: true },
	deviceId: { type: String, required: false},
	count:    { type: Number, defaults: 1, required: true },
	user:     { type: ObjectID, ref: 'User', required: true }
})

///////////////////
//Static methods //
///////////////////

/**
 * Will create a new session into the application
 * @param  {Object} ldapUser     	Holds the user information from bluepages
 * @param  {String} deviceId 		Holds the ID to identify the user's device
 * @param  {String} type     		The type of the session (mobile / admin / web)
 * @return                  		The session created into the database
 */
schema.statics.create = function(ldapUser, deviceId = "NA", type = 'mobile') {
	const User = apprequire('models/user.model')
	return new Promise((resolve, reject) => {
		let token = deviceId + '-' + uuid()

		User.get(ldapUser)
		.then(user => {
			let promises = [
				user,
				this.findOne({ user: user._id, deviceId: deviceId })
			]
			
			return Promise.all(promises)
		}).then(results => {
			let user    = results[0]
			let session = results[1]
			
			if (!session) {
				session = new this()

				session.type      = type
				session.created   = new Date()
				session.deviceId  = deviceId
				session.count     = 0
			}

			session.user      = user
			session.isValid   = true
			session.modified  = new Date()
			session.token     = token
			session.count++

			return session.save()
		}).then(session => this.populate(session, {path: 'user', select: {uid: 1, name: 1, email: 1, country: 1, locality: 1}, model: 'User'}))
		.then(session => resolve({
			uid: session.user.uid,
			name: session.user.name,
			email: session.user.email,
			token: session.token,
			country: session.user.country,
			locality: session.user.locality
		}))
		.catch(err => reject(err))
	})
}

/**
 * Will remap the user object with the most used information
 * @param  {Object} user     	Holds the user information from bluepages
 * @return {Object}       		The remapped object
 */
schema.statics.mapUserData = function(user) {
	return new Promise((resolve, reject) => {
		resolve({
			uid   : user.uid,
			name  : user.name,
			email : user.email,
			token : (user.token) ? user.token : ""
		})
	})
}

/**
 * Will retrieve the user information based on the session
 * @param  {String} token Holds the token of the user
 * @return {Object}       User information
 */
schema.statics.get = function(token) {
	return new Promise((resolve, reject) => {
		this.findOne({ token: token, isValid: true }).populate('user')
		.then(session => {
			if (!session) { return reject(new Error.AccessDenied("SESSION_NOT_FOUND")) } 
			else { 
				session.user.token = session.token
				resolve(this.mapUserData(session.user))
			}
				
		}).catch(err => reject(err))
	})
}

/**
 * Will invalidate the session of the user
 * @param  {String} token Holds the token of the user
 */
schema.statics.invalidate = function(token) {
	return this.findOneAndUpdate({ token: token }, { isValid: false})
}

module.exports = mongoose.model('Session', schema)
