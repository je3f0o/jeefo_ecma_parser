/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement.js
* Created at  : 2019-03-18
* Updated at  : 2019-08-16
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

const states_enum        = require("../../es5/enums/states_enum");
const precedence_enum    = require("../../es5/enums/precedence_enum");
const keyword_definition = require("../../es5/common/keyword_definition");

const get_variable_bindings_list = require(
    "../helpers/get_variable_binding_list"
);

module.exports = {
    id         : "Variable statement",
    type       : "Statement",
    precedence : precedence_enum.STATEMENT,

    is : (current_token, parser) => {
        return parser.current_state === states_enum.statement;
    },
    initialize : (node, current_token, parser) => {
        const keyword  = keyword_definition.generate_new_node(parser);
        let terminator = null;

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
