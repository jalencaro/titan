/**
 * SESSION
 * Any login will create a new session, which will have a token.
 * The token will be exchanged by the app and the API to identify
 * the user and its valid session.
 */
const mongoose = require('mongoose')
const Schema   = mongoose.Schema

/**
 * Validates the schema for this model
 * @type {Schema}
 */
const schema = new Schema({
	uid:      { type: String, required: true, unique: true},
	name:     { type: String, required: true},
	email:    { type: String, required: true},
})

///////////////////
//Static methods //
///////////////////

/**
 * Will create a new user inside the application if the user does not exists.
 * @param  {Object} user     Holds the user information from bluepages
 * @return                   The user
 */
schema.statics.get = function(authUser) {
	return new Promise((resolve, reject) => {
		this.findOne({ uid: authUser.uid}).exec()
		.then(result => {
			let user = (result) ? result : new this()

			user.uid      = authUser.uid
			user.name     = authUser.name
			user.email    = authUser.email

			return user.save()
		}).then(user => resolve(user))
		.catch(err => reject(err))
	})
}

module.exports = mongoose.model('User', schema)
