/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_expression.js
* Created at  : 2019-08-26
* Updated at  : 2020-08-22
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

const { is_expression }             = require("../../es5/helpers");
const { NEW_WITHOUT_ARGS }          = require("../enums/precedence_enum");
const { terminal_definition }       = require("../../common");
const { get_last_non_comment_node } = require("../../helpers");
const {
    new_with_args,
    meta_property,
} = require("../enums/states_enum");

const is_new_expression = (token, parser) => {
    if (is_expression(parser) && ! get_last_non_comment_node(parser)) {
        const next_token = parser.look_ahead(true);
        if (next_token.id === "Operator" && next_token.value === '.') {
            parser.prev_state    = parser.current_state;
            parser.current_state = meta_property;
            return;
        }
        return true;
    }
};

module.exports = {
    id         : "New expression",
    type       : "Expression",
    precedence : NEW_WITHOUT_ARGS,

    is         : is_new_expression,
    initialize : (node, current_token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();
        const expression_name = parser.get_current_state_name();
        console.log(keyword);
        console.log(expression_name);
        process.exit();

        parser.prepare_next_state(expression_name, true);
        const expression = parser.parse_next_node(node.precedence);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;

        if (expression.id === "Function call expression") {
            node.precedence = new_with_args;
        }
    }
};
