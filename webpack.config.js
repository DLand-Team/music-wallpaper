const path = require('path');

module.exports = {
	entry: "./application-main.ts",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js",
	},
	resolve: {
		extensions: ['.ts'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	},
};
