const http = require('http');
const url = require('url');
const fs = require('fs');
//let addr = request.url;
//let q = url.parse(addr, true);

const server = http.createServer(function (request, response) {
    
    //const urlObject = url.parse(req.url, true);
    const q = url.parse(addr, true);
    const addr = request.url;
    //const fileName = "." + urlObject.pathname;
    
    fs.readFile(addr, function(err, data) {

        if (err) {
            response.writeHead(404, {'Content-Type': 'text/html'});
            return response.end('404 Not Found');
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end('Hello Node!');
    });
        
});

    server.listen(5000, () => {
    console.log('My first Node test server is running on Port 5000.');
});

