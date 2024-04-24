const path = require('path');
const srcdir = 'src/';

const webpack = require('webpack'); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

let runMode = "development";

if (process.argv.indexOf('--mode=development') === -1) {
  console.log('Running production build...');
  runMode = 'production'
} else {
  console.log('Running development build...');
  runMode = 'development'
}

function generatePlugins(envMode) {
	const devPlugins = [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			files: [
				"src/app.css", 
				"src/app.js"
			],
			server: {
				baseDir: "build",
				serveStaticOptions: {
						extensions: ["html"]
				}
			}
		})
	];

	const prodPlugins = [];

	if (envMode === 'production') {
    return prodPlugins;
  } else {
    return devPlugins;
  }
}

const buildPlugins = generatePlugins(runMode);

module.exports = {
  entry: {
		'app': [
			path.resolve(srcdir, 'app.js'),
			path.resolve(srcdir, 'app.scss')
		]
	},
	output: {
		filename: '[name].js',
		path: path.resolve('./', 'build'),
	},
	module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {

            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      }
    ]
  },
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			$j: 'jquery'
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'src/images', to: `images` },
				{ from: '**/*', globOptions: { ignore: ['{**/\_*,**/\_*/**}'] }, context: 'src' }
			],
		})
	].concat(buildPlugins),
}