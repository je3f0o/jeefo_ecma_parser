/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_expression.js
* Created at  : 2019-08-17
* Updated at  : 2019-08-17
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

const expect = require("expect.js");

module.exports = (node, expression, precedence) => {
    it(`should be ${ expression } expression`, () => {
        expect(node.id).to.be(`${ expression }`);
        expect(node.type).to.be("Expression");
        expect(node.precedence).to.be(precedence);
    });
};
