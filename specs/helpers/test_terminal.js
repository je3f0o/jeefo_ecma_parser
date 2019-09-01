/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_terminal.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-01
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

const expect             = require("expect.js");
const { I_AST_Node }     = require("@jeefo/parser");
const { TERMINAL_TOKEN } = require("../../src/es6/enums/precedence_enum");

module.exports = (node, value) => {
    expect(node).to.be.an(I_AST_Node);

    expect(node.id).to.be("Terminal symbol");
    expect(node.type).to.be("Terminal symbol token");
    expect(node.precedence).to.be(TERMINAL_TOKEN);
    expect(node.value).to.be(value);
};
