/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement.js
* Created at  : 2019-03-18
* Updated at  : 2020-08-27
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

const {STATEMENT} = require("../enums/precedence_enum");
const {statement} = require("../enums/states_enum");

const get_variable_bindings_list = require(
    "../helpers/get_variable_binding_list"
);
console.log("HELLO ???");
process.exit();

module.exports = {
    id         : "Variable statement",
    type       : "Statement",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.change_state("keyword");
        const keyword  = parser.generate_next_node();
        let terminator = null;

        // debug next
        parser.prepare_next_state("expression", true);

        const {
            list,
            delimiters
        } = get_variable_bindings_list(parser, true);

        if (parser.next_token && parser.next_token.value === ';') {
            terminator = parser.generate_next_node();
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
