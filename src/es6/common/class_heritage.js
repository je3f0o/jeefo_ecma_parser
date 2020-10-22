/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_heritage.js
* Created at  : 2019-08-28
* Updated at  : 2020-09-02
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

const {class_heritage} = require("../enums/states_enum");
const {
    EXPRESSION,
    LEFT_HAND_SIDE_EXPRESSION,
} = require("../enums/precedence_enum");
const {get_last_non_comment_node} = require("../../helpers");

module.exports = {
    id         : "Class heritage",
    type       : "Class definitions",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === class_heritage,
    initialize : (node, token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        parser.parse_next_node(LEFT_HAND_SIDE_EXPRESSION - 1);
        const expr = get_last_non_comment_node(parser, true);

        node.keyword    = keyword;
        node.expression = expr;
        node.start      = keyword.start;
        node.end        = expr.end;
    }
};
