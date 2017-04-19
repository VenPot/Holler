var exports = module.exports = {}

exports.getMessages = function(res, user, messages) // shows chat messages to the user
  {
    var block3 = ''
    for (var i = 0; i < messages.length; i++) {
      block3 = block3 + '<div class="colors"><img src="https://avatars0.githubusercontent.com/u/694779?v=3&s=88"><div id="first">' + messages[i][0] + '</div>&nbsp&nbsp<div id="second">' + messages[i][2] + '</div>&nbsp&nbsp&nbsp&nbsp&nbsp<div id="third">' + messages[i][1] + '</div></div><br>'
    }
    res.end(block3)
  }

exports.getPollMessages = function(res, user, pchats) { // sends object
  console.log('user is ', user)
  var re = new RegExp(user)
  console.log('pchats in getPollMessages', pchats)
  var pollResponse = {
    'messages': pchats['messages'],
    'login': pchats['login']
  }
  var userFilter = Object.keys(pchats).filter(containsUser)

  function containsUser(value) {
    if (value.match(re)) {
      pollResponse[value] = pchats[value]
      console.log('value, pollresponse value', value, pollResponse[value])
      return value
    }
  }
  res.end(JSON.stringify(pollResponse))
}
