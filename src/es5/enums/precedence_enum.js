/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : precedence_enum.js
* Created at  : 2019-02-13
* Updated at  : 2019-03-28
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

module.exports = {
    TERMINATION         : 0,
    COMMA               : 1,
    TERNARY             : 4,
    GROUPING_EXPRESSION : 20,
    BELOW_PRIMITIVE     : 30,
    PRIMITIVE           : 31,
    STATEMENT           : 40,
};
