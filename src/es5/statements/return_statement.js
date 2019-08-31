/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.9
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }              = require("../enums/states_enum");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    is_terminator,
    has_no_line_terminator,
} = require("../../helpers");

module.exports = {
	id         : "Return statement",
	type       : "Statement",
	precedence : STATEMENT,

	is         : (token, parser) => parser.current_state === statement,
    initialize : (node, current_token, parser) => {
        let expression = null, terminator = null;
        const keyword  = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression");

        if (has_no_line_terminator(keyword, parser.next_token)) {
            if (! is_terminator(parser)) {
                parser.post_comment = null;
                expression = parser.parse_next_node(TERMINATION);
            }

            if (is_terminator(parser)) {
                terminator = terminal_definition.generate_new_node(parser);
            }
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || expression || keyword).end;

        parser.terminate(node);
    }
};
