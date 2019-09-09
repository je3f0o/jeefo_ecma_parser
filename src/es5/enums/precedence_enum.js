/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : precedence_enum.js
* Created at  : 2019-02-13
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = {
    TERMINAL_SYMBOL      : -1,
    TERMINATION          : 0,
    COMMA                : 1,
    ASSIGNMENT_OPERATOR  : 3,
    TERNARY              : 4,
    UNARY_PREFIX         : 16,
    UNARY_POSTFIX        : 17,
    NEW_WITHOUT_ARGS     : 18,
    MEMBER_EXPRESSION    : 19,
    NEW_WITH_ARGS        : 19,
    CALL_EXPRESSION      : 19,
    GROUPING_EXPRESSION  : 20,
    PRIMITIVE            : 31,
    PROPERTY_ASSIGN      : 32,
    METHOD_DEFINITION    : 33,
    GETTER_METHOD        : 34,
    SETTER_METHOD        : 34,
    PROPERTY_NAME        : 34,
    PROPERTY_CONTROL     : 35,
    EXPRESSION           : 40,
    LABELLED_STATEMENT   : 39,
    EXPRESSION_STATEMENT : 45,
    STATEMENT            : 46,
    DECLARATION          : 47,

    COMMENT              : 99,
};
