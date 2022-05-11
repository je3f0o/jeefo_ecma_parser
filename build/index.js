/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2022-05-11
* Updated at  : 2022-05-12
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const fs    = require("@jeefo/fs");
const path  = require("path");
const Jeefo = require("jeefo");
const paths = require("jeefo/server/paths");

paths.npm_dir       = path.resolve(process.cwd(), "../node_modules");
paths.frontend_dir  = path.resolve(process.cwd(), "../src");
paths.public_js_dir = path.resolve(process.cwd(), "public");

const config = require("jeefo/config");
config.app_bundler.name = "jeefo_parser.js";

const patch = () => new Promise((resolve, reject) => {
  const dest = "./node_modules/jeefo/server/bundlers/app_bundler.js";
  fs.copyFile("./bundler.js", dest, err => {
    err ? reject(err) : resolve();
  });
});

(async function main () {
  await patch();
  const bundler = require("jeefo/server/bundlers/app_bundler");

  const jeefo    = new Jeefo({http: {port: 4444}, https: {is_enabled: false}});
  const {server} = jeefo;

  server.router.register({
      path   : "/bundle",
      method : "POST",
  }, async (req, res) => {
    await bundler.bundle();
    const content = await fs.readFile("./public/jeefo_parser.js", "utf8");
    const jeefo = `module.exports = ${content.substr(161, 1)}`;
    const result = `${content.slice(0, -1)};${jeefo}}`;
    await fs.writeFile("../src/dist/jeefo_parser.js", result, "utf8");
    res.sendStatus(200);
  });

  server.on("http_listen", () => {
    const {port} = server.config.http;
    console.log(`Listening on: http://0.0.0.0:${port}`);
  });

  server.on("https_listen", () => {
    const {port} = server.config.https;
    console.log(`Listening on: https://0.0.0.0:${port}`);
  });

  await jeefo.initialize();
  jeefo.start();
})();