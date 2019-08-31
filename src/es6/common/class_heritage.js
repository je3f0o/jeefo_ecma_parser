/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_heritage.js
* Created at  : 2019-08-28
* Updated at  : 2019-08-29
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

const { EXPRESSION }                 = require("../enums/precedence_enum");
const { class_heritage }             = require("../enums/states_enum");
const { terminal_definition }        = require("../../common");
const { parse_asignment_expression } = require("../../helpers");

module.exports = {
    id         : "Class heritage",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === class_heritage,
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.previous_nodes.push(keyword);
        parser.prepare_next_node_definition(true);
        parser.change_state("expression");
        const expression = parse_asignment_expression(parser);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;
    }
};
