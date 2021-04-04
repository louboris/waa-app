const express = require('express')
const app = express()
//var formidable = require('formidable');
const port = process.env.PORT || 80
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// MongoDB



const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://45.92.108.113:27017'; // for local use
const dbName = 'imagesSaved2';
let db

var connectWithRetry = function() {
  return MongoClient.connect(url, function(err, client) {
  if(err) {
    console.error('try to connect to MongoDB in 5 sec.')
    setTimeout(connectWithRetry, 5000);
  }
  try{
    
    db = client.db(dbName);
    console.log("Connected successfully to server");
  }
  catch {
    console.error('try to connect to MongoDB in 5 sec.')
  }

});
}
connectWithRetry()



//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection')
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




app.post('/fileupload', function (req, res) {

  var base64Image = req.body.image.replace(/^data:image\/png;base64,/, "");
  let path = "images/"+ Date.now()+".png"
  require("fs").writeFile("./public/" + path, base64Image, 'base64', function(err) {
    console.log(err);
    if (err == null) {
      res.json({ success: true })
      let obj = {
        'username': req.body.username,
        'datetime': Date.now(),
        'pathImage': path
      };
      console.log(obj)
      db.collection("images").insertOne(obj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        
      });
      
    }
  });
});

app.get('/savedimages', (req, res) => {
    res.sendFile(__dirname + '/public/savedimages.html')
});

app.get('/getallsavedimages', (req, res) => {
  let htmlReturn = ''
  db.collection("images").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  
  });

});
