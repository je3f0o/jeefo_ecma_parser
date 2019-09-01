/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement.js
* Created at  : 2019-03-18
* Updated at  : 2019-09-01
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

const { statement }     = require("../enums/states_enum");
const { STATEMENT }     = require("../enums/precedence_enum");
const { is_terminator } = require("../../helpers");

module.exports = {
    id         : "Variable statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (_, parser) => parser.current_state === statement,
    initialize : (node, token, parser) => {
        parser.change_state("delimiter");
        const keyword  = parser.generate_next_node();
        let terminator = null;

        parser.prepare_next_state("variable_declaration_list", true);
        const declaration_list = parser.generate_next_node();

        if (parser.next_token) {
            parser.expect(';', is_terminator);
            terminator = parser.generate_next_node();
        }

        node.keyword          = keyword;
        node.declaration_list = declaration_list;
        node.terminator       = terminator;
        node.start            = keyword.start;
        node.end              = (terminator || declaration_list).end;
    }
};
