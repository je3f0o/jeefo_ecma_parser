/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_variable_declaration_list.js
* Created at  : 2019-03-14
* Updated at  : 2019-08-28
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

const { terminal_definition } = require("../../common");
const get_variable_declarator = require("./get_variable_declarator");

module.exports = (parser, is_nullable) => {
    const list       = [];
    const delimiters = [];

    LOOP:
    while (true) {
        list.push(get_variable_declarator(parser));

        if (parser.next_token === null) {
            if (is_nullable) { break; }

            parser.throw_unexpected_end_of_stream();
        }

        switch (parser.next_token.value) {
            case ',' :
                delimiters.push(
                    terminal_definition.generate_new_node(parser)
                );

                let state_name;
                if (is_nullable) {
                    state_name = "expression";
                } else {
                    state_name = "expression_no_in";
                }
                parser.prepare_next_state(state_name, true);
                break;
            case ';' :
                break LOOP;
            default:
                parser.throw_unexpected_token();
        }
    }

    return { list, delimiters };
};
