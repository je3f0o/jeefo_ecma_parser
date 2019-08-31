/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.1
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
	id         : "Do while statement",
	type       : "Statement",
	precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === statement,
	initialize : (node, current_token, parser) => {
        let terminator = null;
        const do_keyword = terminal_definition.generate_new_node(parser);

        // Statement
        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        // while keyword
        parser.prepare_next_state(null, true);
        parser.expect("while", parser => parser.next_token.value === "while");
        const while_keyword = terminal_definition.generate_new_node(parser);

        // Expression
        parser.prepare_next_state("parenthesized_expression", true);
        const expression = parser.generate_next_node();

        // ASI
        parser.prepare_next_state("delimiter");
        if (has_no_line_terminator(expression, parser.next_token)) {
            parser.expect(";", is_terminator);
            terminator = terminal_definition.generate_new_node(parser);
        }

        node.do_keyword    = do_keyword;
        node.statement     = statement;
        node.while_keyword = while_keyword;
        node.expression    = expression;
        node.terminator    = terminator;
        node.start         = do_keyword.start;
        node.end           = (terminator || expression).end;

        parser.terminate(node);
    }
};
