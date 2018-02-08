function Mongo() {
	var mongoCredentials = {
		uri: process.env.MONGO_URI || 'localhost',
		port: process.env.MONGO_PORT || '27017',
		db: process.env.MONGO_DB_PATH || 'paintwithbob',
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
