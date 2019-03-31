/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : is_property_name.js
* Created at  : 2019-03-30
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

module.exports = function is_property_name (parser) {
    switch (parser.next_symbol_definition.id) {
        case "Identifier"      :
        case "String literal"  :
        case "Numeric literal" :
            return true;
    }

    return false;
};
