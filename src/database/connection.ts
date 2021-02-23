import { createConnection } from 'typeorm'
try {
	createConnection()
	console.log('DB connected')
} catch (err) {
	console.log(err)
}
