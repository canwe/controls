var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res){
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

app.get('/form/teamslug/formslug/', function (req, res) {
    console.log('handling request');

    setTimeout(function () {
        res.sendfile('FormData.js');
        console.log('handled request');
    }, 10);

});

app.listen(3000);
console.log('Listening on port 3000');