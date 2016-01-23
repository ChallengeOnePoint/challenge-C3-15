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

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

server.listen(port)

function notifyActionOnPostItToClients(action, postit) {
  console.log('notifyActionOnPostItToClients ', "postits.${action}", postit)
  io.sockets.emit(`postits.${action}`, postit)
}

io.on('connection', (socket) => {
  console.log('connected')

  postits.forEach((postit) => {
    socket.emit('postits.upsert', postit)
  })

  socket.on('postits.upsert', (postit) => {
    console.log('upsert postit ', postit)

    if (postit.id == null) {
      postit.id = postits.length + 1
      postits.push(postit)
    } else {
      var serverPostit = _.findWhere(postits, { id: postit.id })
      if (serverPostit != null) {
        serverPostit.text = postit.text
        serverPostit.position = postit.position
      }
    }
    notifyActionOnPostItToClients('upsert', postit)
  })

  socket.on('postits.delete', (postit) => {
    console.log('delete postit ', postit)

    if (postit.id == null) {
      _.remove(postits, { id: postit.id })
    }
    notifyActionOnPostItToClients('delete', postit)
  })

})

console.log('Hello world!')
