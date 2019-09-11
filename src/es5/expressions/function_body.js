/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_body.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-10
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

const { function_body }           = require("../enums/states_enum");
const { terminal_definition }     = require("../../common");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");
const {
    is_open_curly,
    is_close_curly,
} = require("../../helpers");

module.exports = {
    id         : "Function body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (token, { current_state : s }) => s === function_body,
    initialize : (node, token, parser) => {
        parser.expect('{', is_open_curly);
        parser.context_stack.push(node.id);
        const list = [];

        parser.change_state("punctuator");
        const open = parser.generate_next_node();
        parser.prepare_next_state(null, true);
        while (! is_close_curly(parser)) {
            list.push(parser.parse_next_node(TERMINATION));
            parser.prepare_next_state(null, true);
        }
        parser.change_state("punctuator");
        const close = terminal_definition.generate_new_node(parser);

        node.open_curly_bracket  = open;
        node.statement_list      = list;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        parser.ending_index = node.end.index;
        parser.context_stack.pop();
    }
};
