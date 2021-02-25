import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UserRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'

class SendMailController {
	async execute(req: Request, res: Response) {
		const { email, survey_id } = req.body

		const usersRepository = getCustomRepository(UserRepository)
		const surveysRepository = getCustomRepository(SurveysRepository)
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const userAlreadyExists = await usersRepository.findOne({ email })

		if (!userAlreadyExists) {
			return res.status(400).json({ error: 'User does not exists' })
		}

		const surverAlreadyExists = await surveysRepository.findOne({
			id: survey_id
		})

		if (!surverAlreadyExists) {
			return res.status(400).json({ error: 'Survey does not exists' })
		}

		const surveyUser = surveysUsersRepository.create({
			user_id: userAlreadyExists.id,
			survey_id
		})

		await surveysUsersRepository.save(surveyUser)

		await SendMailService.execute(
			email,
			surverAlreadyExists.title,
			surverAlreadyExists.description
		)

		return res.json(surveyUser)
	}
}

export { SendMailController }
