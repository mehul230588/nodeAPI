var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var bookRouter = require('./routes/book.router');

app.use('/api/Books', bookRouter);

var port = process.env.port || 3000;

app.get('/', function(request, response){
    response.send('Welcome to my node-API');
});

app.listen(port, function(){
    console.log(`Started listening at port ${port}`);
});