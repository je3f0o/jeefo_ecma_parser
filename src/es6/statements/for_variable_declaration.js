/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_variable_declaration.js
* Created at  : 2020-08-27
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {STATEMENT}                = require("../enums/precedence_enum");
const {for_variable_declaration} = require("../enums/states_enum");
const {
    is_comma,
    is_terminator,
    is_identifier_token,
} = require("../../helpers");

module.exports = {
    id         : "For variable declaration",
    type       : "Iteration statements",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === for_variable_declaration,

    initialize (node, token, parser) {
        parser.expect("var", is_identifier_token(token, "var"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        const list       = [];
        const delimiters = [];
        let   terminator = null;

        LOOP:
        do {
            parser.prepare_next_state("variable_declaration", true);
            list.push(parser.generate_next_node());

            const {id, value} = parser.look_ahead(true);
            switch (id) {
                case "Delimiter" :
                    switch (value) {
                        case ',' :
                            parser.prepare_next_state("punctuator", true);
                            delimiters.push(parser.generate_next_node());
                            break;
                        case ';' :
                            parser.prepare_next_state("punctuator", true);
                            terminator = parser.generate_next_node();
                            break LOOP;
                        default: parser.throw_unexpected_token();
                    }
                    break;
                case "Identifier" :
                    if (["in", "of"].includes(value)) break LOOP;
                    parser.throw_unexpected_token();
                    break;
                default: parser.throw_unexpected_token();
            }
        } while (true);

        node.keyword          = keyword;
        node.declaration_list = list;
        node.delimiters       = delimiters;
        node.terminator       = terminator;
        node.start            = keyword.start;
        node.end              = (terminator || list[list.length - 1]).end;

        parser.end(node);
    }
};
