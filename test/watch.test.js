const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const Watch = require("../models/Watch");
const { newWatchPost } = require("../controllers/watch");

describe("Testes para newWatchPost", function () {
  let req, res, next, watchStub;

  beforeEach(() => {
    req = {
      body: {
        permalink: "unique-title",
        title: "Novo Filme",
        year: 2024,
        duration: 120,
        video: "https://example.com/video.mp4",
      },
      user: { id: "user123" },
      flash: sinon.spy(),
      redirect: sinon.spy(),
    };
    res = { render: sinon.spy(), redirect: sinon.spy() };
    next = sinon.spy();
    watchStub = sinon.stub(Watch, "findOne");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Deve criar uma nova produção quando os dados são válidos", function (done) {
    watchStub.yields(null, null);
    const saveStub = sinon.stub(Watch.prototype, "save").yields(null);

    newWatchPost(req, res, next);

    setTimeout(() => {
      expect(saveStub.calledOnce).to.be.true;
      expect(req.flash.calledWith("success")).to.be.true;
      expect(res.redirect.calledWith("/")).to.be.true;
      done();
    }, 10);
  });

  it("Deve retornar erro se o permalink já existir", function (done) {
    watchStub.yields(null, { permalink: "unique-title" });

    newWatchPost(req, res, next);

    setTimeout(() => {
      expect(req.flash.calledWith("error")).to.be.true;
      expect(res.redirect.calledWith("/novo")).to.be.true;
      done();
    }, 10);
  });

  it("Deve retornar erro se o título tiver mais de 100 caracteres", function (done) {
    req.body.title = "A".repeat(101);
    newWatchPost(req, res, next);

    setTimeout(() => {
      expect(req.flash.calledWith("error")).to.be.true;
      expect(res.redirect.calledWith("/novo")).to.be.true;
      done();
    }, 10);
  });

  it("Deve retornar erro se o ano for inválido", function (done) {
    req.body.year = 1800;
    newWatchPost(req, res, next);

    setTimeout(() => {
      expect(req.flash.calledWith("error")).to.be.true;
      done();
    }, 10);
  });

  it("Deve retornar erro se a duração for inválida", function (done) {
    req.body.duration = -10;
    newWatchPost(req, res, next);

    setTimeout(() => {
      expect(req.flash.calledWith("error")).to.be.true;
      done();
    }, 10);
  });

  it("Deve retornar erro se a URL do vídeo for inválida", function (done) {
    req.body.video = "invalid-url";
    newWatchPost(req, res, next);

    setTimeout(() => {
      expect(req.flash.calledWith("error")).to.be.true;
      done();
    }, 10);
  });
});
