import request from 'supertest'
import { app } from '../../app'

describe('Users', () => {
	request(app).post('/users').send({
		email: 'user@example.com',
		name: 'User Example'
	})
})
