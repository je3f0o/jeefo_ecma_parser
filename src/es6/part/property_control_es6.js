/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_control_es6.js
* Created at  : 2019-08-28
* Updated at  : 2019-09-05
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { PROPERTY_CONTROL_ES6 } = require("../enums/precedence_enum");
const {
    is_asterisk,
    is_assign_token,
} = require("../../helpers");
const {
    reference_id,
    property_list,
    property_name,
    method_definition,
    cover_initialized_name,
} = require("../enums/states_enum");

const is_possible_reference_id = (() => {
    const delimiters = [',', '}'];
    return token => {
        return token.id === "Delimiter" && delimiters.includes(token.value);
    };
})();

module.exports = {
    id         : "Property control es6",
    type       : "Expression",
    precedence : PROPERTY_CONTROL_ES6,

    is : (token, parser) => {
        if (parser.current_state !== property_list) { return; }

        const next_token = parser.look_ahead(true);

        if (is_asterisk(token)) {
            parser.current_state = method_definition;
        } else if (is_assign_token(next_token)) {
            parser.current_state = cover_initialized_name;
        } else if (is_possible_reference_id(next_token)) {
            parser.current_state = reference_id;
        } else {
            parser.prev_state    = property_list;
            parser.current_state = property_name;
        }
    },
    initialize : () => {}
};
