/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : await_experession.js
* Created at  : 2019-08-22
* Updated at  : 2019-08-22
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

const { AWAIT_EXPRESSION }       = require("../enums/precedence_enum");
const is_expression              = require("../../es5/helpers/is_expression");
const terminal_definition        = require("../../common/terminal_definition");
const { get_current_state_name } = require("../../helpers");

module.exports = {
    id         : "Await exression",
    type       : "Unary operator",
    precedence : AWAIT_EXPRESSION,

    is         : (token, parser) => is_expression(parser),
    initialize : (node, current_token, parser) => {
        const keyword         = terminal_definition.generate_new_node(parser);
        const expression_name = get_current_state_name(parser);

        parser.prepare_next_state(expression_name, true);
        const expression = parser.parse_next_node(AWAIT_EXPRESSION);

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;
    }
};
