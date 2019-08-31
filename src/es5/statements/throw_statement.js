/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : throw_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.13
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }              = require("../enums/states_enum");
const { get_right_value }        = require("../helpers");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
	id         : "Throw statement",
	type       : "Statement",
	precedence : STATEMENT,

	is         : (token, parser) => parser.current_state === statement,
    initialize : (node, current_token, parser) => {
        let terminator = null;
        const keyword  = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        if (parser.next_token.start.line > keyword.start.line) {
            parser.throw_unexpected_token("Illegal newline after throw");
        }
        parser.post_comment = null;
        const expression = get_right_value(parser, TERMINATION);
        parser.prev_node = parser.post_comment;

        if (parser.next_token            !== null &&
            parser.next_token.value      === ';'  &&
            parser.next_token.start.line === expression.end.line) {
            terminator = parser.generate_next_node();
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || expression).end;

        parser.terminate(node);
    }
};
