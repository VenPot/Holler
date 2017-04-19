/* global $ */
$(document).ready(function() {

  var mySpace = {
    pchats: {},
    nchats: {},
    bchats: {},
    preactive: []
  }

  var ta = document.getElementById('test')
  ta.scrollTop = ta.scrollHeight
  var clientuser = $('#user').text()
  var displayName = "<h3>Welcome " + clientuser + "!</h3>"
  $('#dname').html(displayName)
  var mode = 'messages'
  var finaluserobj = 'user=' + clientuser + '&mode=' + mode + '&data=none&reason=poll'
  console.log(clientuser)
  $.post('https://latesthollerclone-curious2code.c9users.io/send', finaluserobj, function(response) {
    mySpace.pchats = JSON.parse(response)
    createNotificationObject()
  })
  var sit = setInterval(function() {
    $.post('https://latesthollerclone-curious2code.c9users.io/send', finaluserobj, function(response) {
      mySpace.pchats = JSON.parse(response)
        // console.log(mode)
      if (mode == 'messages') {
        getMessages(mySpace.pchats, 'messages')
      }
      else {
        findArray()
      }
      getActiveUsers(mySpace.pchats['login'])
      populateNotifications()
    })
  }, 1 * 1000)

  // Zero the idle timer on mouse movement.
  $(this).mousemove(function(e) {
    idleTime = 0
  })
  $(this).keypress(function(e) {
    idleTime = 0
  })

  var idleTime = 0
  var idleInterval = setInterval(timerIncrement, 10 * 1000) // 10 sec

  function timerIncrement() {
    idleTime = idleTime + 1
    if (idleTime > 30) { // 300 seconds
      clearInterval(sit)
        // console.log("chat disconneted");
    }
  }

  $('#chatform').submit(function(e) {
    e.preventDefault()

    var formdata = $(this).serializeArray()
      // var formdata=$("#msg").text();
      //console.log('formdata is ', formdata)
    var submitdata = clientuser + '=' + formdata
      // console.log(submitdata)

    var chatformobj = 'user=' + clientuser + '&mode=' + mode + '&data=' + formdata[0].value + '&reason=msgin'
      //console.log('chatform obj is', chatformobj)
    $.post('/send', chatformobj, function(data, status) {
      // console.log("data in chatform submit is  ", data);
      // $('.chatmessage').html(data)
      //ta.scrollTop = ta.scrollHeight
    })
    this.reset()
  })

  $('#logout').click(function() {
    var saveData = 'user=' + clientuser + '&mode=' + mode + '&data=none&reason=save'
    $.post('/send', saveData, function(data, status) {
      clearInterval(sit)
      document.write(data)

    })
  })
  $('#notify').click(function() {
    createNotificationObject()
  })

  $('#privateChat').on('click', '.sample', function() {
    mode = $(this).attr('id')
    if (mode == 'messages') {
      document.title = 'Public Room'
    }
    else {
      document.title = mode
    }
    mySpace.nchats[mode] = 0
      //console.log('logged in mode is', mode)
      // console.log('pid is', $(this).parent().attr('id'))
    $(this).parent().children().removeClass("addcolor")
    $(this).addClass("addcolor").removeClass('btn-warning')
    $(this).children('.circles').html('')
    $('#msg').focus()

    findArray()
  })


  $('#publicChat').click(function() {
    mode = 'messages'
    getMessages(mySpace.pchats, 'messages')


  })

  function getMessages(pchats, content) // shows chat messages to the user
  {
    var style = ''
    var namecolor = ''
    var block3 = ''
      // for(var i=messages.length;i>0;i--)
    if (mySpace.pchats[content]) {
      var messages = pchats[content]
      for (var i = 0; i < messages.length; i++) {
        if (clientuser == messages[i][0]) {
          style = 'right'
          namecolor = 'first1'
        }
        else {
          style = 'left'
          namecolor = 'first'
        }

        block3 = block3 + '<div class="colors"><img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88"><div id="first">' + messages[i][0] + '</div>&nbsp&nbsp<div id="second">' + messages[i][2] + '</div>&nbsp&nbsp&nbsp&nbsp&nbsp<div id="third">' + messages[i][1] + '</div></div>'
          // block3 = block3 + '<div class="colors"><img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88"><div id="first"> ' + messages[i][0] + '</div>&nbsp<div id="second">' + messages[i][2] + '</div>&nbsp&nbsp&nbsp&nbsp&nbsp<div id="third">' + messages[i][1] + '</div></div>'
      }
    }
    else block3 = ''
    $('.chatmessage').html(block3)
    ta.scrollTop = ta.scrollHeight
  }

  function getActiveUsers(active) {
    var block3 = ''

    console.log("active users", active)
    var index = active.indexOf(clientuser)
    active.splice(index, 1)
    active.unshift('messages')
    if (mySpace.preactive.length != 0) {
      var newLogins = active.filter(function(element) {
          var contains = 0;
          for (var i = 0; i < mySpace.preactive.length; i++)
            if (element == mySpace.preactive[i]) contains++
              if (contains == 0) return element
        })
        //console.log("newLogins", newLogins)
      var loggedOutUsers = mySpace.preactive.filter(function(element) {
        var contains = 0
        for (var i = 0; i < active.length; i++)
          if (element == active[i]) contains++
            if (contains == 0) return element
      })
      console.log("logged out users", loggedOutUsers)

      for (var i = 0; i < newLogins.length; i++) {
        // block3 = block3 + '<img src="https://avatars1.githubusercontent.com/u/307872?v=3&s=96" class="images1"> <li class="loggedin" id="' + newLogins[i] + '">' + newLogins[i] + '<div class="circles"></div></li>'
        block3 = block3 + `<ul class="sample" id="` + newLogins[i] + `">
      <li>
    <img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88" class="imageicon">` + newLogins[i] + `
</li><div class="circles"><p  id=` + newLogins[i] + `circle></p></div>
    </ul>`

      }

      for (var j = 0; j < loggedOutUsers.length; j++) {
        $('#' + loggedOutUsers[j]).fadeTo('slow', 0.2, function() {})
      }

    }
    else {
      for (var i = 0; i < active.length; i++) {
        // block3 = block3 + '<img src="https://avatars1.githubusercontent.com/u/307872?v=3&s=96" class="images1"> <li class="loggedin" id="' + active[i] + '">' + active[i] + '<div class="circles"></div></li>'
        block3 = block3 + `<ul class="sample" id="` + active[i] + `">
      <li>
    <img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88" class="imageicon">` + active[i] + `
</li><div class="circles"><p id=` + active[i] + `circle></p></div>
    </ul>`
      }

    }

    mySpace.preactive = active


    if (block3 != '') {
      $('#privateChat').append(block3)
      $('#messages').children('li').html(`<img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88" class="imageicon">Public Room`)
    }

  }

  function createNotificationObject() {
    Object.keys(mySpace.pchats).forEach(function(item) {
      mySpace.bchats[item] = mySpace.pchats[item]
      if (!mySpace.nchats[item]) mySpace.nchats[item] = 0
    })
  }

  function populateNotifications() {

    Object.keys(mySpace.pchats).forEach(function(item) {
        // console.log("p,item, b is ", mySpace.pchats[item], item, mySpace.bchats[item])
        var strippedUserItem = item.replace(clientuser, '')
        if (typeof(mySpace.bchats[item]) === 'undefined')

        {


          mySpace.nchats[strippedUserItem] = mySpace.pchats[item].length


        }

        else {
          // console.log("inif", mySpace.bchats[item])
          if (mySpace.pchats[item].length > mySpace.bchats[item].length) {
            if (mySpace.nchats[strippedUserItem] > 0)
              mySpace.nchats[strippedUserItem] += mySpace.pchats[item].length - mySpace.bchats[item].length
            else if (mySpace.nchats[strippedUserItem] == 0)
              mySpace.nchats[strippedUserItem] = mySpace.pchats[item].length - mySpace.bchats[item].length
          }

        }
      })
      // console.log("mySpace.nchats is", mySpace.nchats)
    createNotificationObject()
    notify()
  }

  function notify() {
    console.log('mySpace.nchats is ', mySpace.nchats)
    Object.keys(mySpace.nchats).forEach(function(name) {
      if (mySpace.nchats[name] > 0) {
        var jqname = "#" + name
        var circelContent = jqname + "circle"
          // $('' + jqname + '').fadeTo('slow', 0.25, function() {})
        if (mode != name) {
          $(jqname).addClass("btn-warning")
          $(circelContent).html(mySpace.nchats[name])
        }
        else mySpace.nchats[name] = 0



        // console.log("jqname executed")
      }

    })
  }

  function findArray() {
    var arrayToInsert = ''
    if (mode == 'messages') getMessages(mySpace.pchats, 'messages')
    else {
      var usermash = clientuser + mode
      var revmash = mode + clientuser

      if (mySpace.pchats[usermash]) arrayToInsert = usermash
      if (mySpace.pchats[revmash]) arrayToInsert = revmash
      getMessages(mySpace.pchats, arrayToInsert)
    }
  }

})
