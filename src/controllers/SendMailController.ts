import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { resolve } from 'path'

import { SurveysRepository } from '../repositories/SurveysRepository'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'
import { UserRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'
import { AppError } from '../errors/AppError'

class SendMailController {
	async execute(req: Request, res: Response) {
		const { email, survey_id } = req.body

		const usersRepository = getCustomRepository(UserRepository)
		const surveysRepository = getCustomRepository(SurveysRepository)
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const userAlreadyExists = await usersRepository.findOne({ email })

		if (!userAlreadyExists) {
			throw new AppError('User does not exists')
		}

		const surverAlreadyExists = await surveysRepository.findOne({
			id: survey_id
		})

		if (!surverAlreadyExists) {
			throw new AppError('Survey does not exists')
		}

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

		const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
			where: { user_id: userAlreadyExists.id, value: null },
			relations: ['user', 'survey']
		})

		const variables = {
			name: userAlreadyExists.name,
			title: surverAlreadyExists.title,
			description: surverAlreadyExists.description,
			id: '',
			link: process.env.URL_MAIL
		}

		if (surveyUserAlreadyExists) {
			variables.id = surveyUserAlreadyExists.id
			await SendMailService.execute(
				email,
				surverAlreadyExists.title,
				variables,
				npsPath
			)
			return res.json(surveyUserAlreadyExists)
		}

		const surveyUser = surveysUsersRepository.create({
			user_id: userAlreadyExists.id,
			survey_id
		})

		await surveysUsersRepository.save(surveyUser)

		variables.id = surveyUser.id

		await SendMailService.execute(
			email,
			surverAlreadyExists.title,
			variables,
			npsPath
		)

		return res.json(surveyUser)
	}
}

export { SendMailController }
