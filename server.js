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

var postits = []
var clients = []

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

server.listen(port)

io.on('connection', function (socket) {
  console.log('connected')

  postits.forEach(function(postit) {
    socket.emit('postits.upsert', postit)
  })

  socket.on('postits.upsert', function (postit) {
    console.log('upsert postit ', postit)

    if (postit.id == null) {
      postit.id = postits.length + 1
      postits.push(postit)
    }
    socket.emit('postits.upsert', postit)
  })
})

console.log('Hello world!')
