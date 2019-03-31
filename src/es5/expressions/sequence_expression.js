/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
* Created at  : 2019-03-28
* Updated at  : 2019-03-30
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

const precedence_enum             = require("../enums/precedence_enum"),
      is_expression               = require("../helpers/is_expression"),
      get_expression              = require("../helpers/get_expression"),
      get_current_state_name      = require("../helpers/get_current_state_name"),
      get_last_non_comment_symbol = require("../helpers/get_last_non_comment_symbol");

module.exports = {
	id         : "Sequence expression",
    type       : "Expression",
	precedence : precedence_enum.COMMA,

	is : (token, parser) => {
        return token.value === ','
            && is_expression(parser)
            && get_last_non_comment_symbol(parser) !== null;
    },
    initialize : (symbol, current_token, parser) => {
        const expressions     = [get_last_non_comment_symbol(parser, true)];
        const expression_name = get_current_state_name(parser);

        parser.change_state("delimiter");
        expressions.push(parser.next_symbol_definition.generate_new_symbol(parser));
        parser.prepare_next_state(expression_name, true);

        LOOP:
        while (true) {
            if (parser.next_token.value === ';') { break; }

            expressions.push(get_expression(parser, precedence_enum.COMMA));

            if (parser.next_token === null) {
                break;
            }

            switch (parser.next_token.value) {
                case ',' :
                    parser.change_state("delimiter");
                    expressions.push(parser.next_symbol_definition.generate_new_symbol(parser));

                    parser.prepare_next_state(expression_name, true);
                    break;
                case ';' :
                    break LOOP;
                default:
                    parser.throw_unexpected_token();
            }
        }

        symbol.expressions = expressions;
        symbol.start       = expressions[0].start;
        symbol.end         = expressions[expressions.length - 1].end;
        console.log(symbol);
        process.exit();
    }
};
