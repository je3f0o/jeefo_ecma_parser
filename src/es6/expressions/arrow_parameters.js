/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_parameters.js
* Created at  : 2019-09-04
* Updated at  : 2020-08-28
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

const {EXPRESSION}       = require("../enums/precedence_enum");
const {arrow_parameters} = require("../enums/states_enum");

module.exports = {
    id         : "Arrow parameters",
	type       : "Arrow function definition",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === arrow_parameters,
    initialize () {},

    refine (node, expr, parser) {
        switch (expr.id) {
            case "Async arrow head":
            case "Cover parenthesized expression and arrow parameter list":
                expr = parser.refine("arrow_formal_parameters", expr);
                break;
            case "Identifier reference":
                expr = parser.refine("binding_identifier", expr);
                break;
            default: parser.throw_unexpected_refine(node, expr);
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    }
};
