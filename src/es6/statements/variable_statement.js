/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement.js
* Created at  : 2020-09-06
* Updated at  : 2020-09-07
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

const {statement} = require("../enums/states_enum");
const {STATEMENT} = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    is_identifier_token,
    has_no_line_terminator,
} = require("../../helpers");

module.exports = {
    id         : "Variable statement",
    type       : "Variable statement",
    precedence : STATEMENT,

    is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.expect("var", is_identifier_token(token, "var"));
        parser.change_state("keyword");

        const list       = [];
        const keyword    = parser.generate_next_node();
        const delimiters = [];
        let terminator   = null;
        do {
            parser.prepare_next_state("variable_declaration", true);
            const decl = parser.generate_next_node();
            if (decl.binding.id === "Binding pattern" && ! decl.initializer) {
                parser.throw_unexpected_token(
                    "Missing initializer in destructuring declaration",
                    decl
                );
            }
            list.push(decl);

            const next_token = parser.look_ahead();
            if (! next_token) break;
            if (is_delimiter_token(next_token, ',')) {
                parser.prepare_next_state("punctuator", true);
                delimiters.push(parser.generate_next_node());
            } else if (has_no_line_terminator(decl, next_token)) {
                parser.expect(';', is_delimiter_token(next_token, ';'));
                parser.prepare_next_state("punctuator", true);
                terminator = parser.generate_next_node();
                break;
            } else {
                // ASI
                break;
            }
        } while (true);

        node.keyword          = keyword;
        node.declaration_list = list;
        node.delimiters       = delimiters;
        node.terminator       = terminator;
        node.start            = keyword.start;
        node.end              = (terminator || list[list.length - 1]).end;

        parser.terminate(node);
    }
};
