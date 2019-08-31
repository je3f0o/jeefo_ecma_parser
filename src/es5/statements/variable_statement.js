/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement.js
* Created at  : 2019-03-18
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }           = require("../enums/states_enum");
const { STATEMENT }           = require("../enums/precedence_enum");
const { is_terminator }       = require("../../helpers");
const { terminal_definition } = require("../../common");
const get_variable_declaration_list = require(
    "../helpers/get_variable_declaration_list"
);

module.exports = {
    id         : "Variable statement",
    type       : "Statement",
    precedence : STATEMENT,

	is         : (token, parser) => parser.current_state === statement,
    initialize : (node, current_token, parser) => {
        const keyword  = terminal_definition.generate_new_node(parser);
        let terminator = null;

        parser.prepare_next_state("expression", true);

        const {
            list,
            delimiters
        } = get_variable_declaration_list(parser, true);

        if (is_terminator(parser)) {
            terminator = terminal_definition.generate_new_node(parser);
        }

        node.keyword    = keyword;
        node.list       = list;
        node.delimiters = delimiters;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || list[list.length - 1]).end;

        parser.terminate(node);
    }
};
