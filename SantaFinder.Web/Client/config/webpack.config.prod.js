'use strict';

const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.config.common');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(commonConfig, {
     module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader'] }),
                    'to-string-loader',
                    'css-loader',
                    'sass-loader'
                ],
            }
        ]
    },

     plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: false,
            unsafe: true
        }),
        new ExtractTextPlugin('index.css')
    ],

    resolve: {
        alias: {
            '@angular/common' : '@angular/common/bundles/common.umd.min.js',
            '@angular/compiler' : '@angular/compiler/bundles/compiler.umd.min.js',
            '@angular/core' : '@angular/core/bundles/core.umd.min.js',
            '@angular/http' : '@angular/http/bundles/http.umd.min.js',
            '@angular/platform-browser' : '@angular/platform-browser/bundles/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic' : '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
            '@angular/router' : '@angular/router/bundles/router.umd.min.js',
            '@angular/router-deprecated' : '@angular/router-deprecated/bundles/router-deprecated.umd.min.js',
            '@angular/upgrade' : '@angular/upgrade/bundles/upgrade.umd.min.js'
        }
    }
});