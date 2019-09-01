/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_statement.js
* Created at  : 2019-08-08
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

const expect         = require("expect.js");
const { STATEMENT }  = require("../../src/es6/enums/precedence_enum");
const { I_AST_Node } = require("@jeefo/parser");

module.exports = (id, node) => {
    it(`should be '${ id } statement'`, () => {
        expect(node).to.be.an(I_AST_Node);

        expect(node.id).to.be(`${ id } statement`);
        expect(node.type).to.be("Statement");
        expect(node.precedence).to.be(STATEMENT);
    });
};
