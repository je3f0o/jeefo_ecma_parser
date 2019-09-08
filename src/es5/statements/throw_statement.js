/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : throw_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-09
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

const { statement } = require("../enums/states_enum");
const { STATEMENT } = require("../enums/precedence_enum");
const {
    is_terminator,
    has_no_line_terminator,
} = require("../../helpers");

module.exports = {
	id         : "Throw statement",
	type       : "Statement",
	precedence : STATEMENT,

	is         : (_, { current_state : s }) => s === statement,
    initialize : (node, token, parser) => {
        let terminator = null;

        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("expression_expression", true);
        if (parser.next_token.start.line > keyword.start.line) {
            parser.throw_unexpected_token("Illegal newline after throw");
        }
        parser.post_comment = null;
        const expression = parser.generate_next_node();

        const has_terminator = (
            is_terminator &&
            has_no_line_terminator(keyword, parser.next_token)
        );
        if (has_terminator) {
            parser.change_state("punctuator");
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
