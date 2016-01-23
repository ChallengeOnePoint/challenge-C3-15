'use strict'

var port = process.env.PORT || 8080

var _ = require('lodash')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

var server = http.createServer(app)
server.listen(port)

console.log('Hello world!')
