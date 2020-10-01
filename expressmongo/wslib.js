const WebSocket = require("ws");
const mensaje = require("./controllers/mensaje");
const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    ws.on("message", (message) => {
      mensaje.addMensaje(JSON.parse(message));
      sendMessages();
    });
  });

  sendMessages = () => {
    let messages = [];
    mensaje.getMensajes((data) => {
      data.forEach((element) => {
        messages.push(element.message);
      });
      clients.forEach((client) => client.send(JSON.stringify(messages)));
    });
  };
  exports.sendMessages = sendMessages;

};

exports.wsConnection = wsConnection;
