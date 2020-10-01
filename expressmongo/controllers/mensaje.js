const conn = require("../lib/MongoUtils");

const getMensajes = (callback) =>
  conn.then((client) => {
    client
      .db("pruebadatabase")
      .collection("mensajes")
      .find({})
      .toArray((err, data) => {
        console.log(data);
        callback(data);
      });
  });

const getMensaje = (ts, callback) =>
  conn.then((client) => {
    client
      .db("pruebadatabase")
      .collection("mensajes")
      .findOne({ ts })
      .then((result) => {
        callback(result);
      });
  });

const addMensaje = (mensaje) => {
  conn.then((client) => {
    client.db("pruebadatabase").collection("mensajes").insertOne(mensaje);
  });
};

const updateMensaje = (ts, nMensaje, callback) => {
  conn.then((client) => {
    client
      .db("pruebadatabase")
      .collection("mensajes")
      .updateOne({ ts }, { $set: { message: nMensaje } })
      .then((result) => {
        callback(result);
      });
  });
};

const deleteMensaje = (ts, callback) => {
  conn.then((client) => {
    client
      .db("pruebadatabase")
      .collection("mensajes")
      .deleteOne({ ts }).then(result=>{
          callback(result);
      }).catch("Error");
  });
};

const mensaje = {
  getMensajes,
  getMensaje,
  addMensaje,
  updateMensaje,
  deleteMensaje,
};
module.exports = mensaje;
