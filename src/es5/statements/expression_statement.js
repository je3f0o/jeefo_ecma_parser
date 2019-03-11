/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-05
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum                 = require("../enums/states_enum"),
      precedence_enum             = require("../enums/precedence_enum"),
      get_pre_comment             = require("../helpers/get_pre_comment"),
      get_start_position          = require("../helpers/get_start_position"),
      get_last_non_comment_symbol = require("../helpers/get_last_non_comment_symbol");

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : 40,

    is : (token, parser) => {
        if (parser.current_state === states_enum.statement) {
            switch (token.id) {
                case "String" :
                case "Number" :
                    return true;
                case "Identifier" :
                    switch (token.value) {
                        case "null" :
                        case "true" :
                        case "false" :
                        case "undefined" :
                            return true;
                    }
                    return parser.symbol_table.reserved_words[token.value] === undefined;
            }
        }
        return false;
    },

    initialize : (symbol, current_token, parser) => {
        let post_comment  = null;
        const pre_comment = get_pre_comment(parser);

        parser.current_symbol = null;
        parser.change_state("expression");
        let expression = parser.get_next_symbol(precedence_enum.TERMINATION);
        if (expression.id === "Comment") {
            if (parser.next_token && parser.next_token.value === ';') {
                post_comment = expression;
            }

            expression = get_last_non_comment_symbol(parser);
        }

        const asi = parser.next_token === null || parser.next_token.value !== ';';

        symbol.expression   = expression;
        symbol.ASI          = asi;
        symbol.pre_comment  = pre_comment;
        symbol.post_comment = post_comment;
        symbol.start        = get_start_position(pre_comment, expression);
        symbol.end          = asi ? expression.end : parser.next_token.end;

        parser.terminate(symbol);
    }
};
