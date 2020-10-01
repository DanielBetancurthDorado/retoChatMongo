const mensaje = require("../controllers/mensaje");
var express = require("express");
var router = express.Router();
const Joi = require("joi");
const fs = require("fs");
const ws = require("../wslib");
const { response } = require("express");

const validateMensaje = (mensaje) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
      .required(),
  });
  return schema.validate(mensaje);
};

router.get("/", function (req, res, next) {
  mensaje.getMensajes((mensajes) => {
    res.send(mensajes);
  });
});

router.get("/:id", function (req, res, next) {
  mensaje.getMensaje(parseInt(req.params.id), (mensajes) => {
    if (!mensajes)
      res.status(404).send("El mensaje con el ts dado, no fue encontrado");
    else res.send(mensajes);
  });
});

router.post("/", function (req, res, next) {
  const { error } = validateMensaje(req.body);
  if (error) {
    console.log(error);
    return res.status(412).send(error);
  } else {
    let m = {
      message: req.body.message,
      author: req.body.author,
      ts: new Date().getTime(),
    };

    mensaje.addMensaje(m);
    res.send(m);
  }
  ws.sendMessages();
});

router.put("/:id", function (req, res, next) {
  const { error } = validateMensaje(req.body);
  if (error) {
    console.log(error);
    return res.status(412).send(error);
  } else {
    mensaje.updateMensaje(parseInt(req.params.id), req.body.message, () => {
      res.send("Updated");
      ws.sendMessages();
    });
  }
});

router.delete("/:id", function (req, res, next) {
  mensaje.deleteMensaje(parseInt(req.params.id), (data) => {
    res.send("Deleted");
    ws.sendMessages();
  });
});
module.exports = router;
