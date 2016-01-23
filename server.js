'use strict'

var port = process.env.PORT || 8080

var _ = require('lodash')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var socket = require('socket.io')

var app = express()
var server = http.createServer(app)
var io = socket(server)

var posts = []
var clients = []

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

server.listen(port)

io.on('connection', function (socket) {
  console.log('connected')
  socket.emit('news', { hello: 'world' })
  socket.on('my other event', function (data) {
    console.log(data)
  })
})

console.log('Hello world!')
