/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_heritage.js
* Created at  : 2019-08-28
* Updated at  : 2019-09-08
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

const { EXPRESSION }     = require("../enums/precedence_enum");
const { class_heritage } = require("../enums/states_enum");

module.exports = {
    id         : "Class heritage",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === class_heritage,
    initialize : (node, token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("left_hand_side_expression", true);
        parser.context_stack.push(node.id);
        const expression = parser.generate_next_node();
        parser.context_stack.pop();

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;
    }
};
