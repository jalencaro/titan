/**
 * Will tell if the server is up
 */
class Status {
	constructor() { }

	/**
	 * Returns a status from server to check if it is online
	 */
	index(req, res) {
		res.status(200).send({status: 'live'})
	}
}

module.exports = Status