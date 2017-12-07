function Mongo() {
	var mongoCredentials = {
		uri: 'localhost',
		port: '27017',
		db: 'paintwithbob',
		credentials: {
			user: process.env.MONGO_USERNAME,
			pass: process.env.MONGO_PASSWORD,
			auth: {
				authdb: process.env.MONGO_AUTHDB
			}
		}
	}
	this.connection = mongoCredentials;
}

module.exports = new Mongo();