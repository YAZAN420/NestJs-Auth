import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessTokenGuard } from 'src/iam/presentation/http/guards/access-token.guard';
// import { Action } from 'src/iam/domain/enums/action.enum';
// import { CheckPolicies } from 'src/iam/presentation/http/decorators/check-policies.decorator';
// import { PoliciesGuard } from 'src/iam/presentation/http/guards/policies.guard';
// import { Product } from 'src/products/domain/product';

@UseGuards(AccessTokenGuard)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`clinet ${client.id} connected!`);
  }
  handleDisconnect(client: Socket) {
    console.log(`clinet ${client.id} left!`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any) {
    this.server.emit('receiveMessage', `server ${data}`);
  }

  // @UseGuards(PoliciesGuard)
  // @CheckPolicies([
  //   (authPort, user) => authPort.checkPermission(user, Action.Read, Product),
  // ])
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomName);
    console.log(`Client ${client.id} joined room: ${roomName}`);

    client.emit('receiveMessage', `You joined room: ${roomName}`);
  }

  @SubscribeMessage('sendMessageToRoom')
  handleMessageToRoom(@MessageBody() data: { room: string; message: string }) {
    console.log(`message to room ${data.room}`, data.message);
    this.server
      .to(data.room)
      .emit('receiveMessage', `[from room ${data.room}]: ${data.message}`);
  }
}
