/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : big_test.js
* Created at  : 2020-09-09
* Updated at  : 2020-09-09
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

const fs     = require("fs");
const db     = require(`${process.env.HOME}/projects/wmc/.temp/app/db`);
const path   = require("path");
const parser = require("./parser");

const root_dir = `${process.env.HOME}/projects/wmc`;
const base_dir = `${process.env.HOME}/projects/wmc/front_end`;

const files = Object.keys(db).filter(p => p.endsWith(".js"));

for (let i = 0; i < files.length; i += 1) {
    let filepath = files[i];
    if (filepath.startsWith("node_modules/")) {
        filepath = path.join(root_dir, filepath);
    } else {
        filepath = path.join(base_dir, filepath);
    }

    const source = fs.readFileSync(filepath, "utf8");
    try {
        parser.parse(source);
        console.log(`File[${i+1}] parsed.`);
    } catch (e) {
        console.log(e);
        console.log(`File[${i+1}] '${filepath}' failed.`);
        process.exit();
    }
}
console.log("done.");
