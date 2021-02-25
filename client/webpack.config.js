const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CleanCSSPlugin = require('less-plugin-clean-css');

module.exports = {
	entry: './src/js/app.ts',
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js",
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
    devServer: {
		contentBase: path.join(__dirname, 'dist'),
        compress: true
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: [
					{ loader: "ts-loader" }
				]
			},
			{
				test: /\.less$/,
				exclude: /node_modules/,
				use: [
					{
					  loader: 'style-loader',
					},
					{
					  loader: 'css-loader',
					},
					{
					  loader: 'less-loader',
					  options: {
						plugins: [
							new CleanCSSPlugin({ advanced: true })
						  ]
					  },
					},
				  ],
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new Dotenv({
			path: '../.env',
		  })
	  ],
}