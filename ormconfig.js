module.exports = {
	type: 'postgres',
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	url: process.env.DB_URL,
	migrations: ['./src/database/migrations/**.ts'],
	entities: ['./src/models/**.ts'],
	cli: {
		migrationsDir: './src/database/migrations'
	}
}
