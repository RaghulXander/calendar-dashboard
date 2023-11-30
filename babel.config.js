module.exports = {
	presets: [
		['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }],
		'@babel/preset-react',
		'@babel/preset-typescript'
	],
	plugins: [
		'babel-plugin-transform-class-properties',
		'lodash',
		['@babel/plugin-proposal-private-property-in-object', { loose: true }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
		['@babel/plugin-proposal-private-methods', { loose: true }]
	]
};
