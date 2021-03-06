const express = require('express');
const multer = require('multer');
const fs = require('fs');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// // // const fileLoader = require('file-loader');

const getPlugins = () => {
    const plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin({
            clearConsole: true,
        })
    ];
    fs.readdirSync('./src/html/').forEach(filename => {
        const splitted = filename.split('.');
        if (splitted[1] === 'html') {
            plugins.push(
                new HtmlWebpackPlugin({
                    template: `./src/html/${filename}`,
                    filename: `./${filename}`
                }),
            );
        }
    });

    return plugins;
};

module.exports = {
    entry: [
        './src/js/app.js',
        './src/scss/app.scss'
    ],
    output: {
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: './src/html',
        watchContentBase: true,
        hot: true,
        open: true,
        inline: true,
        quiet: true,
        historyApiFallback: true,
        before: function (app) {
            app.use('/assets', express.static('./src/assets'));
            app.use('/img', express.static('./src/assets/img'));

            let storage = multer.memoryStorage();
            let upload = multer({ storage: storage });
            app.post('/ordernow', upload.single('ordernow__file'), function (req, res, next) {
                console.log(req.file);
                console.log(req.body);
                res.send({ status: 'ok', reponse: req.body, fileSize: req.file.buffer.length } );
            });
        }
    },
    plugins: getPlugins(),
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: "eslint-loader",
            //     options: {
            //         emitWarning: true,
            //     }
            // },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: () => [
                                require('autoprefixer')({
                                    browsers: ['ie >= 8', 'last 4 version']
                                }),
                            ]
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },

            // // // //added jpeg/png/gif handler
            // // // {
            // // //     test: /\.(png|jpg|gif)$/,
            // // //     use: [
            // // //         {
            // // //             loader: 'file-loader',
            // // //             options: {},
            // // //         },
            // // //     ],
            // // // },

        ],
    },
    resolve: {
        extensions: ['.js', '.jpg', '.png', '.html', '.scss'],
    },
};
