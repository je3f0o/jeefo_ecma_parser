/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : break_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.8
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }           = require("../enums/states_enum");
const { STATEMENT }           = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    is_terminator,
    has_no_line_terminator
} = require("../../helpers");

module.exports = {
	id         : "Break statement",
	type       : "Statement",
	precedence : STATEMENT,

	is         : (token, { current_state : s }) => s === statement,
    initialize : (node, current_token, parser) => {
        const keyword  = terminal_definition.generate_new_node(parser);
        let identifier = null, terminator = null;

        parser.prepare_next_state("label_identifier");
        if (parser.next_node_definition) {
            identifier = parser.generate_next_node(parser);
            parser.prepare_next_state("punctuator");
        }

        const has_terminator = (
            is_terminator(parser) &&
            has_no_line_terminator(keyword, parser.next_token)
        );
        if (has_terminator) {
            terminator = terminal_definition.generate_new_node(parser);
        }

        node.keyword    = keyword;
        node.identifier = identifier;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || identifier || keyword).end;

        parser.terminate(node);
    }
};
