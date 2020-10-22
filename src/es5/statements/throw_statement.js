/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : throw_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
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

const {statement}              = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_terminator,
    is_identifier_token,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Throw statement",
	type       : "The throw statement",
	precedence : STATEMENT,

	is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.expect("throw", is_identifier_token(token, "throw"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        if (! has_no_line_terminator(keyword, parser.next_token)) {
            parser.throw_unexpected_token("Illegal newline after throw");
        }
        parser.parse_next_node(TERMINATION);
        const expr = get_last_non_comment_node(parser, true);

        let terminator = null;
        if (has_no_line_terminator(expr, parser.next_token)) {
            parser.expect(';', is_terminator);
            terminator = parser.generate_next_node();
        }

        node.keyword    = keyword;
        node.expression = expr;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || expr).end;

        parser.terminate(node);
    }
};
