import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UsersRepository'

class UserController {
	async create(req: Request, res: Response) {
		const { name, email } = req.body
		const userRepository = getCustomRepository(UserRepository)
		const userAlreadyExists = await userRepository.findOne({
			email
		})
		if (userAlreadyExists) {
			return res.status(400).json({ message: ' Email already exists' })
		}
		const user = userRepository.create({
			name,
			email
		})

		await userRepository.save(user)

		res.json(user)
	}
}

export { UserController }
