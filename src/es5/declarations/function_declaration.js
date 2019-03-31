/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration.js
* Created at  : 2019-01-29
* Updated at  : 2019-03-26
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum            = require("../enums/states_enum"),
      precedence_enum        = require("../enums/precedence_enum"),
      get_parameters         = require("../helpers/get_parameters"),
      get_pre_comment        = require("../helpers/get_pre_comment"),
      get_start_position     = require("../helpers/get_start_position"),
      get_current_state_name = require("../helpers/get_current_state_name");

module.exports = {
    id         : "Function declaration",
    type       : "Declaration",
    precedence : 31,

    is : (tokem, parser) => {
        switch (parser.current_state) {
            case states_enum.statement  :
            case states_enum.expression :
                return true;
        }
        return false;
    },
    initialize : (symbol, current_token, parser) => {
        let name = null, expression_name;
        const pre_comment             = get_pre_comment(parser),
              is_function_declaration = parser.current_state === states_enum.statement;

        if (! is_function_declaration) {
            symbol.id       = "Function expression";
            symbol.type     = "Expression";
            expression_name = get_current_state_name(parser);
        }

        parser.prepare_next_state("expression", true);

        if (is_function_declaration || parser.next_token.id === "Identifier") {
            parser.expect("identifier", parser => parser.next_symbol_definition.id === "Identifier");
            name = parser.next_symbol_definition.generate_new_symbol(parser);
            parser.prepare_next_state("expression", true);
        }

        parser.expect('(', parser => parser.next_token.value === '(');
        const parameters = get_parameters(parser);

        parser.prepare_next_state("block_statement", true);
        parser.expect('{', parser => parser.next_token.value === '{');
        const body = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.name        = name;
        symbol.parameters  = parameters;
        symbol.body        = body;
        symbol.pre_comment = pre_comment;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = body.end;

        if (is_function_declaration) {
            parser.terminate(symbol);
        } else {
            parser.prepare_next_state(expression_name);
        }
    }
};
