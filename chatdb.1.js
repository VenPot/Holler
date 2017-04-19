var exports = module.exports = {}
var mongo = require('mongodb').MongoClient

exports.mongoconnect = function() {
  mongo.connect('mongodb://' + process.env.IP + ':27017/myNewDatabase', function(err, db) {
    if (err) console.log(err)
    var privateChat = db.collection('privateChat')
    return privateChat
  })
}

exports.saveChat = function(messages) {
  mongo.connect('mongodb://' + process.env.IP + ':27017/myNewDatabase', function(err, db) {
    if (err) console.log(err)
    var publicChat = db.collection('publicChat')
    publicChat.findOneAndUpdate({
      uname: 'publicChat'
    }, {
      $set: {
        'uname': 'publicChat',
        'date': new Date().toLocaleTimeString(),
        'chatlog': messages
      }
    }, {
      upsert: true
    }, function(err, data) {
      if (err) throw err

      db.close()
    })
  })

}

exports.savePrivateChat = function(pchats) {
  mongo.connect('mongodb://' + process.env.IP + ':27017/myNewDatabase', function(err, db) {
    if (err) console.log(err)
    var privateChat = db.collection('privateChat')
      // var cmp=parseInt(process.argv[2],10);
    var pckey = Object.keys(pchats)
    for (var i = 0; i < pckey.length; i++) {
      privateChat.findOneAndUpdate(

        {
          uname: pckey[i]
        }, {
          $set: {
            uname: pckey[i],
            date: new Date().toLocaleTimeString(),
            chatlog: pchats[pckey[i]]
          }
        }, {
          upsert: true
        },
        function(err, data) {
          if (err) throw err
        })
    }
    db.close()
    console.log('private chats have been inserted')
  })
}

exports.getInitialContent = function(typeofchat, callback) {
  mongo.connect('mongodb://' + process.env.IP + ':27017/myNewDatabase', function(err, db) {
    if (err) console.log(err)
    var chat = db.collection(typeofchat)
    chat.find({}).toArray(function(err, docs) {
      if (err) console.log(err)

      db.close()
      callback(null, docs)
    })
  })
}
