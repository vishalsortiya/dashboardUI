// web-socket.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    // Connect to the server's WebSocket endpoint
    this.socket = io('http://localhost:3000'); // Change the URL based on your server configuration
  }

  // Method to send a message to the server
  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  // Method to listen for incoming messages from the server
  onMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('message', (data: string) => observer.next(data));
    });
  }

  // Method to listen for incoming empData events
  onEmpData(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('empData', (data: any) => observer.next(data));
    });
  }

  // Method to listen for incoming empDataError events
  onEmpDataError(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('empDataError', (error: any) => observer.error(error));
    });
  }
}
