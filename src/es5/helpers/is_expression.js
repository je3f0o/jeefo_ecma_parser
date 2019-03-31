/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : is_expression.js
* Created at  : 2019-03-19
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

const states_enum = require("../enums/states_enum");

module.exports = function is_expression (parser) {
    switch (parser.current_state) {
        case states_enum.expression :
        case states_enum.expression_no_in :
            return true;
    }
    return false;
};
