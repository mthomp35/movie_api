// create constant/variable called http that imports/requires/assigns to it an instance of the HTTP module
const http = require('http'),
  fs = require('fs'),
  url = require('url');

// use dot notation to use the function createServer which will be called everytime a request is made against the server
http.createServer((request, response) => {
  // pull the url requested and put in variable addr 
  let addr = request.url,
  // parse the url retrieved 
  q = url.parse(addr, true),
  // empty container to be used later for storing the file path
  filePath = '';

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  // check that the exact pathname of the entered URL is 
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html'});
    response.write(data);
    response.end();

  });

}).listen(8080);

console.log('My test server is running on Port 8080.');
