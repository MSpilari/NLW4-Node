import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (): Promise<Connection> => {
	const defaultOptions = await getConnectionOptions()

	return await createConnection(
		Object.assign(defaultOptions, {
			database:
				process.env.NODE_ENV === 'test'
					? './src/database/database.test.sqlite'
					: defaultOptions.database,
			type: process.env.NODE_ENV === 'test' ? 'sqlite' : defaultOptions.type,
			logging: process.env.NODE_ENV === 'test' ? true : defaultOptions.logging
		})
	)
}
