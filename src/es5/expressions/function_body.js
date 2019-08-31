/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_body.js
* Created at  : 2019-08-27
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

const { function_body }           = require("../enums/states_enum");
const { is_close_curly }          = require("../../helpers");
const { terminal_definition }     = require("../../common");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "Function body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (token, parser) => parser.current_state === function_body,
    initialize : (node, current_token, parser) => {
        const open           = terminal_definition.generate_new_node(parser);
        const statement_list = [];

        parser.prepare_next_state(null, true);
        while (! is_close_curly(parser)) {
            statement_list.push(parser.parse_next_node(TERMINATION));
            parser.prepare_next_state(null, true);
        }
        const close = terminal_definition.generate_new_node(parser);

        node.open_curly_bracket  = open;
        node.statement_list      = statement_list;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        parser.ending_index = node.end.index;
    }
};
