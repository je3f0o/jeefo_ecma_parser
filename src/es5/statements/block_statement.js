/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
* Created at  : 2017-08-18
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }              = require("../enums/states_enum");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    is_close_curly,
    is_delimiter_token,
} = require("../../helpers");

module.exports = {
	id         : "Block statement",
	type       : "Statement",
	precedence : STATEMENT,

    is : (token, parser) => {
        if (parser.current_state === statement) {
            return is_delimiter_token(token, '{');
        }
    },
	initialize : (node, current_token, parser) => {
        const statements = [];

        const open = terminal_definition.generate_new_node(parser);
        parser.prepare_next_state(null, true);
		while (! is_close_curly(parser)) {
            statements.push(parser.parse_next_node(TERMINATION));
            parser.prepare_next_state(null, true);
		}
        const close = terminal_definition.generate_new_node(parser);

        node.open_curly_bracket  = open;
        node.statements          = statements;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        parser.terminate(node);
    }
};
