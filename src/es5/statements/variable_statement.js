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

const {statement}               = require("../enums/states_enum");
const {STATEMENT}               = require("../enums/precedence_enum");
const {is_comma, is_terminator} = require("../../helpers");

module.exports = {
    id         : "Variable statement",
    type       : "Variable statement",
    precedence : STATEMENT,

    is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.change_state("keyword");
        const keyword    = parser.generate_next_node();
        const list       = [];
        const delimiters = [];
        let terminator   = null;

        do {
            parser.prepare_next_state("variable_declaration", true);
            list.push(parser.generate_next_node());

            if (parser.next_token === null) { break; }
            else if (is_comma(parser)) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
            }
        } while (! is_terminator(parser));

        if (parser.next_token) {
            parser.expect(';', is_terminator);
            parser.change_state("punctuator");
            terminator = parser.generate_next_node();
        }

        node.keyword          = keyword;
        node.declaration_list = list;
        node.delimiters       = delimiters;
        node.terminator       = terminator;
        node.start            = keyword.start;
        node.end              = (terminator || list[list.length - 1]).end;
    }
};
