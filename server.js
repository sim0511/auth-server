// server.js
const express = require('express');

class Server {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.routes();
  }

  routes() {
    this.app.get('/', (req, res) => {
      res.send('Hello World!');
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.start();
