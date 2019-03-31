/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_variable_declaration_list.js
* Created at  : 2019-03-14
* Updated at  : 2019-03-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const get_variable_declarator = require("./get_variable_declarator");

module.exports = function get_variable_declaration_list (parser, is_nullable) {
    const list = [];

    LOOP:
    while (true) {
        list.push(get_variable_declarator(parser));

        if (parser.next_token === null) {
            if (is_nullable) { break; }

            parser.throw_unexpected_end_of_stream();
        }

        switch (parser.next_token.value) {
            case ',' :
                const state_name = is_nullable ? "expression" : "expression_no_in";
                parser.prepare_next_state(state_name, true);
                break;
            case ';' :
                break LOOP;
            default:
                parser.throw_unexpected_token(`Expected delimiter instead saw: ${ parser.next_token.value }`);
        }
    }

    return list;
};
