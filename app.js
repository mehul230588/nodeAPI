var express = require('express');

var app = express();
var port = process.env.port || 3000;

app.get('/', function(request, response){
    response.send('Welcome to my node-API');
});

app.listen(port, function(){
    console.log(`Started listening at port ${port}`);
});