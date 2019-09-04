/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function.js
* Created at  : 2019-08-12
* Updated at  : 2019-09-04
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION } = require("../enums/precedence_enum");
const { expression } = require("../enums/states_enum");

module.exports = {
    id         : "Arrow function",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression) {
            return token.id === "Arrow";
        }
    },
    initialize (node, token, parser) {
        parser.change_state("arrow_parameters");
        const parameters = parser.generate_next_node();

        parser.change_state("punctuator");
        const arrow_token = parser.generate_next_node();

        parser.prepare_next_state("concise_body", true);
        const body = parser.generate_next_node();

        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = parameters.start;
        node.end         = body.end;

        parser.end(node);
        parser.current_state = expression;
    }
};
