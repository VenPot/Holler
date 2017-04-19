var http = require('http')
var fs = require('fs')
var handlebars = require("handlebars")
var chatdb = require('./chatdb.1.js')
var gm = require('./gm.js')
var qs = require('querystring')
var myServer = {
  counter: 0,
  parsedBody: '',
  messages: [],
  pmessages: [],
  pchats: {},
  filename: '',
  logoutUser: '',
  appLoad: function() {
    myServer.pchats['login'] = []
    chatdb.getInitialContent('privateChat', function(err, data) {
      if (err) console.log('error in displayprivateChat', err)
      var pm = JSON.parse(JSON.stringify(data))
      for (var i = 0; i < pm.length; i++) {
        myServer.pchats[pm[i].uname] = pm[i].chatlog
      }
      myServer.pchats['login'] = []
      console.log('myServer.pchats is ', myServer.pchats)
    })
    chatdb.getInitialContent('publicChat', function(err, data) {
      if (err) console.log('error in displayprivateChat', err)
      var pm = JSON.parse(JSON.stringify(data))
      for (var i = 0; i < pm.length; i++) {
        myServer.pchats['messages'] = pm[i].chatlog
      }
      myServer.messages = myServer.pchats['messages']
    })

  }
}
myServer.appLoad()
var server = http.createServer(function(req, res) {
  console.log(myServer.counter++)
  console.log(req.url)

  switch (req.url) {
    case '/styles1.css':
      myServer.filename = __dirname + '/styles1.css'
      console.log(myServer.filename)
      res.writeHead(200, {
        'Content-Type': 'text/css'
      })
      fs.createReadStream(myServer.filename, 'utf8').pipe(res)
      break
    case '/login.css':
      myServer.filename = __dirname + '/login.css'
      console.log(myServer.filename)
      res.writeHead(200, {
        'Content-Type': 'text/css'
      })
      fs.createReadStream(myServer.filename, 'utf8').pipe(res)
      break

    case '/client.js':
      myServer.filename = __dirname + '/client.js'
      console.log(myServer.filename)
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      })
      fs.createReadStream(myServer.filename, 'utf8').pipe(res)
      break
    case '/welcome.js':
      myServer.filename = __dirname + '/welcome.js'
      console.log(myServer.filename)
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      })
      fs.createReadStream(myServer.filename, 'utf8').pipe(res)
      break
    case '/favicon.ico':
      break
    case '/dummy':
      break
    case '/':
      myServer.filename = __dirname + '/login.html'
      console.log(myServer.filename)
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      fs.createReadStream(myServer.filename, 'utf8').pipe(res)

      break
    default:
      var dataflag = 0

      req.on('data', function(data) {
        dataflag = 1
        var body = ''
        body = body + data
        myServer.parsedBody = qs.parse(body)
        if (myServer.parsedBody.reason == 'save') {
          myServer.logoutUser = myServer.parsedBody.user;
          var index = myServer.pchats['login'].indexOf(myServer.logoutUser)
          myServer.pchats['login'].splice(index, 1)
          chatdb.saveChat(myServer.messages)
          chatdb.savePrivateChat(myServer.pchats)
          var d = fs.readFileSync(__dirname + '/login.html', 'utf8')
          res.end(d)
        }
        console.log('body is ', myServer.parsedBody)
      })

      req.on('end', function() {
        if (dataflag == 0) {
          //displayInitialForm(res)
        }
        else if (myServer.parsedBody.name) {
          myServer.pchats['login'].push(myServer.parsedBody.name)
          displayForm(res, myServer.parsedBody.name)

        }
        else if (myServer.parsedBody.reason == 'poll') gm.getPollMessages(res, myServer.parsedBody.user, myServer.pchats)
        else {
          var d = new Date()
          var d1 = d.toTimeString()
          var d2 = d1.split(':')
          var displaydate = d2[0] + ':' + d2[1]
            //var displaydate = Date.now()
          if (myServer.parsedBody.data != 'none' && myServer.parsedBody.mode == 'messages') {
            myServer.messages.push([myServer.parsedBody.user, myServer.parsedBody.data, displaydate])
            console.log('public chat ', myServer.messages)
            gm.getMessages(res, myServer.parsedBody.user, myServer.messages)
          }
          else if (myServer.parsedBody.mode != 'messages') {
            var usermash = myServer.parsedBody.user + myServer.parsedBody.mode
            var revmash = myServer.parsedBody.mode + myServer.parsedBody.user
            var arrayToInsert = ''
            if (myServer.pchats[usermash]) arrayToInsert = usermash
            if (myServer.pchats[revmash]) arrayToInsert = revmash

            if (arrayToInsert != '') {
              myServer.pchats[arrayToInsert].push([myServer.parsedBody.user, myServer.parsedBody.data, displaydate])
              gm.getMessages(res, myServer.parsedBody.user, myServer.pchats[arrayToInsert])
              console.log('already exists', myServer.pchats[arrayToInsert])
            }
            else {
              myServer.pmessages.push([myServer.parsedBody.user, myServer.parsedBody.data, displaydate])
              myServer.pchats[usermash] = myServer.pmessages
              myServer.pmessages = []
              gm.getMessages(res, myServer.parsedBody.user, myServer.pchats[usermash])
              console.log('brand new created', myServer.pchats[usermash])
            }
            gm.getMessages(res, myServer.parsedBody.user, myServer.messages)
          }
        }
        res.end()
      })
  }
})

server.listen(8080)




function displayForm(res, user) {
  res.writeHead(200, {
    'Content-type': 'text/html',
    'Cache-Control': 'max-age=1, must-revalidate'
  })
  var block1 = ''
  var source = ''
  for (var i = 0; i < myServer.messages.length; i++) {
    block1 = block1 + '<div class="colors"><img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88"><div id="first">' + myServer.messages[i][0] + '</div>&nbsp&nbsp<div id="second">' + myServer.messages[i][2] + '</div>&nbsp&nbsp&nbsp&nbsp&nbsp<div id="third">' + myServer.messages[i][1] + '</div></div><br>'
  }
  myServer.filename = __dirname + '/main.html'
  source = fs.readFileSync(myServer.filename, 'utf-8')

  var template = handlebars.compile(source)
  var data1 = {
    "user": user,
    "block1": block1
  }
  res.end(template(data1))
}
