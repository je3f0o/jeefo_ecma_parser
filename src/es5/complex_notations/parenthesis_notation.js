/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parenthesis_notation.js
* Created at  : 2019-01-27
* Updated at  : 2019-01-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = {
    id         : "Grouping expression",
    type       : "Grouping expression",
    precedence : 20,

    is         : token => token.delimiter === '(',
    initialize : (symbol, current_token, scope) => {
        var start = scope.current_token.start;

        scope.advance();
        this.expression = scope.expression(0);

        if (scope.current_token.delimiter === ')') {
            this.start = start;
            this.end   = scope.current_token.end;

            scope.current_expression = this;
        } else {
            scope.current_token.error_unexpected_token();
        }
    },
};
