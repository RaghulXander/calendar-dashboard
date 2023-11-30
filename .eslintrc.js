module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['standard-with-typescript', 'airbnb', 'prettier'],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error']
	},
	ignorePatterns: ['**/public']
};
