/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }              = require("../enums/states_enum");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
	id         : "While statement",
	type       : "Statement",
	precedence : STATEMENT,

	is         : (token, parser) => parser.current_state === statement,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("parenthesized_expression", true);
        const expression = parser.generate_next_node();

        // Statement
        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        node.keyword           = keyword;
        node.expression        = expression.expression;
        node.statement         = statement;
        node.start             = keyword.start;
        node.end               = statement.end;
    }
};
