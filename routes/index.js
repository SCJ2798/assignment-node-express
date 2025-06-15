const { Router } = require("express");
const Sequelize  = require("sequelize");
const AuthController = require('../controller/auth_controller');
const ProductController = require('../controller/product_controller');
const HttpResponseError = require("../error/http_response_error");

const app = Router();

app.use('/auth',AuthController);
app.use('/product',ProductController);

 // Identify Erros
app.use((err, req, res, next) => {
    
    if (err instanceof HttpResponseError) {
      console.log(err);
      res.status(err.code).json({ error: err.name, msg: err.message });
      return;
    }

    else if (err instanceof Sequelize.UniqueConstraintError) {
      console.log(err);
      var msgs = "";
      err.errors.forEach(e => {
        msgs = msgs.concat(e.message, ',')
      });
      res.status(409).json({ error: err.name, msg: msgs });
      return;
    }
  
    console.error("ERROR", err);
    res.status(500).json({ err });

});

module.exports.routes = app;