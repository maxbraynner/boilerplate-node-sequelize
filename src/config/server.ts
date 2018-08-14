#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from "../app";
import * as http from 'http';


export class Server {

  private port;
  private server: http.Server;

  constructor() {
    this.port = this.normalizePort(process.env.PORT || '3000');
    app.set('port', this.port);

    this.server = http.createServer(app);
  }

  /**
   * Listen on provided port, on all network interfaces.
   */
  async start() {
    this.server.listen(this.port);
    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onListening.bind(this));
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  private onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  private onListening() {
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  private normalizePort(val) {
    const serverPort = parseInt(val, 10);

    if (isNaN(serverPort)) {
      // named pipe
      return val;
    }

    if (serverPort >= 0) {
      // port number
      return serverPort;
    }

    return false;
  }
}

export default new Server();