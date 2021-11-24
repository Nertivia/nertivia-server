export default function handlePostgreError (err: any): {statusCode: number, message: string} | undefined{
	if (err) {
		if (err.code === '42P01') {
			console.log(err);
			console.log("\x1b[41m", "\x1b[30m", "Please run the following command to fix your database issues: npm run knex:migrate:latest\n", "\x1b[0m");
			console.log("\x1b[31m", "Please run the following command to fix your database issues: npm run knex:migrate:latest", "\x1b[0m");
			return {
				statusCode: 500,
				message: "Something went wrong when interacting with the database.",
				...err
			};
		}
		// TODO: IMPLEMENT OTHER ERRORS

		
	}
	return undefined;
}