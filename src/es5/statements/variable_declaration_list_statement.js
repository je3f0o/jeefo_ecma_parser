/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_statement.js
* Created at  : 2019-03-18
* Updated at  : 2019-03-18
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

const states_enum                   = require("../enums/states_enum"),
      get_pre_comment               = require("../helpers/get_pre_comment"),
      get_start_position            = require("../helpers/get_start_position"),
      get_variable_declaration_list = require("../helpers/get_variable_declaration_list");

function get_last_element (array) {
    return array[array.length - 1];
}

module.exports = {
    id         : "Variable declaration list",
    type       : "Statement",
    precedence : 31,

    is         : (current_token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state("expression", true);

        const list = get_variable_declaration_list(parser, true);

        const asi = parser.next_token === null || parser.next_token.value !== ';';

        symbol.pre_comment = pre_comment;
        symbol.token       = current_token;
        symbol.list        = list;
        symbol.ASI         = asi;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = asi ? get_last_element(list).end : parser.next_token.end;

        parser.terminate(symbol);
    }
};
