const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");



const isProduction = (process.env.NODE_ENV === 'production');

const fileNamePrefix = isProduction? '[chunkhash].' : '';

module.exports = {
    mode: !isProduction ? 'development': 'production',
    entry: {
      shows: './src/js/show.js',
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: fileNamePrefix + 'bundle.js',
      assetModuleFilename: "images/[name][ext]",
      clean: true,
    },
    target: 'web',
    devServer: { 
      static: "./dist"
    },

    devtool: !isProduction ? 'source-map' : 'inline-source-map', 
    module: {
      rules: [	
        { 
          test: /\.js$/i,
          exclude: /(node_modules)/,
          use: { 
            loader: 'babel-loader', 
            options: {
            presets: ['@babel/preset-env']
          }}
        }, 
        { 
          test: /\.css$/i, 
          use: [ 'style-loader', 'css-loader' ]		
        },
        { 
            test: /.s[ac]ss$/i, 
            use: [ 'style-loader', 'css-loader' , 'sass-loader']		
        },
        {  
          test: /\.(svg|eot|ttf|woff|woff2)$/i,  
          type: "asset/resource",
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "./src/index.html"),
        chunks: ["shows"],
        inject: "body",
        filename: "index.html",
      }),
      new copyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/css"),
            to: path.resolve(__dirname, "dist/css"),
          },
        ],
      }),
      new copyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/TestPic"),
            to: path.resolve(__dirname, "dist/TestPic"),
          },
        ],
      }),
    ],
}


 if(isProduction) {
  module.exports.plugins.push(
    new MiniCssExtractPlugin({
      filename: fileNamePrefix + "[name].css",
    })
  );
};