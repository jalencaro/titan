const Error    = apprequire('helpers/errors.helper')
const ErrorHandler = require('ibm-error-handler')
const Session = apprequire('models/session.model')
const ignoredRoutes = [
	{ method: 'GET', route: '/status'},
	{ method: 'POST', route: '/login'}
]

module.exports = (req, res, next) => {
	if(_isIgnored({ method: req.method, route: req.url })) { return next() }

	let token = req.get('bearer')
	if(!token) { 
		return ErrorHandler.exec(new Error.AccessDenied("TOKEN_NOT_PRESENT"), res) }

	Session.get(token)
	.then(session => {
		req.user = session
		next()
	}).catch(err => ErrorHandler.exec(err, res))
}

function _isIgnored(api) {
	let ignored = ignoredRoutes.map(allowed => { 
		if(api.method.match(allowed.method) && api.route.match(allowed.route)) { return true } 
	})

	if (ignored.indexOf(true) > -1) { return true }
	else { return false }
}