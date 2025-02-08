var async = require("async");
var Watch = require("../models/Watch");
var Category = require("../models/Category");
var Reference = require("../models/Reference");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");

// POST New Production
exports.newWatchPost = function (req, res, next) {
  var body = req.body;

  // Validações manuais para express-validator@2.21.0
  req.checkBody("title", "Título é obrigatório").notEmpty();
  req.checkBody("year", "Ano inválido").isInt();
  req.checkBody("video", "URL inválida").isURL();

  var errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors);
    return res.render("novo", { form: {} });
  }

  Watch.findOne({ permalink: req.body.permalink }, function (err, watch) {
    if (watch) {
      req.flash("error", {
        msg: "O permalink inserido já existe. Tente outro.",
      });
      return res.redirect("/novo");
    }

    // Criando nova produção
    var newWatch = new Watch({
      criador: req.user.id,
      permalink: req.body.permalink,
      layout: "filme",
      featured: false,
      title: req.body.title,
      subtitle: req.body.subtitle,
      sinopse: req.body.sinopse,
      year: req.body.year,
      classind: req.body.classind,
      duration: req.body.duration,
      video: req.body.video,
      thumb480: req.body.thumb480,
      imgbg: req.body.imgbg,
      tags: req.body.tags,
      status: "pending",
    });

    newWatch.save(function (err) {
      if (err) {
        req.flash("error", { msg: "Erro ao salvar no banco de dados." });
        return res.redirect("/novo");
      }
      req.flash("success", {
        msg: "Muito obrigado por sua colaboração. Em breve a produção estará no ar. <3",
      });
      res.redirect("/");
    });
  });
};
