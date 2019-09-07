/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : static_method.js
* Created at  : 2019-09-07
* Updated at  : 2019-09-07
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION }    = require("../enums/precedence_enum");
const { static_method } = require("../enums/states_enum");

module.exports = {
    id         : "Static method",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === static_method,
    initialize : (node, token, parser) => {
        parser.change_state("contextual_keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("method_definition", true);
        const expression = parser.generate_next_node();

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;
    }
};
