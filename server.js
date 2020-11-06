const path = require('path');
const http = require('http');
const express = require('express');

require('./modules/database')
const sockets = require('./modules/sockets');


const app = express();
const server = http.createServer(app);
sockets(server);

//  Set static folder:
app.use(express.static(path.join(__dirname, 'public')))



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Surver running on port ' + PORT));