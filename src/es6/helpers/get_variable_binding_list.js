/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_variable_binding_list.js
* Created at  : 2019-08-11
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-declarations-and-the-variable-statement
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const parse_binding       = require("./parse_binding");
const { lexical_binding } = require("../nodes");

module.exports = parser => {
    const list       = [];
    const delimiters = [];

    LOOP:
    while (true) {
        parser.prev_node = parse_binding(parser);
        parser.prepare_next_node_definition(
            parser.prev_node.id !== "Identifier"
        );
        list.push(lexical_binding.generate_new_node(parser));

        if (parser.next_token === null) { break; }
        if (parser.next_token.id !== "Delimiter") {
            parser.throw_unexpected_token();
        }

        switch (parser.next_token.value) {
            case ',':
                parser.change_state("delimiter");
                const comma = parser.generate_next_node();
                delimiters.push(comma);

                parser.prepare_next_state("expression", true);
                break;
            case ';':
                break LOOP;
            default:
                parser.throw_unexpected_token();
        }
    }

    return { list, delimiters };
};
