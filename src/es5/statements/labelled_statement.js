/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.12
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { labelled_statement }     = require("../enums/states_enum");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "Labelled statement",
    type       : "Statement",
	precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === labelled_statement,
    initialize : (node, token, parser) => {
        parser.change_state("expression");
        const identifier = parser.generate_next_node();

        parser.prepare_next_state("delimiter", true);
        const delimiter = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        node.identifier = identifier;
        node.delimiter  = delimiter;
        node.statement  = statement;
        node.start      = identifier.start;
        node.end        = statement.end;
    }
};
