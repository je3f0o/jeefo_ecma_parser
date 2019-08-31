/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_declaration.js
* Created at  : 2019-08-30
* Updated at  : 2019-08-30
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

const expect          = require("expect.js");
const { I_AST_Node }  = require("@jeefo/parser");
const { DECLARATION } = require("../../src/es6/enums/precedence_enum");

module.exports = (id, node) => {
    it(`should be ${ id }`, () => {
        expect(node instanceof I_AST_Node).to.be(true);

        expect(node.id).to.be(id);
        expect(node.type).to.be("Declaration");
        expect(node.precedence).to.be(DECLARATION);
    });
};
