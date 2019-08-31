/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method_definition.js
* Created at  : 2019-08-28
* Updated at  : 2019-08-28
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

const { PROPERTY_CONTROL }   = require("../enums/precedence_enum");
const { is_delimiter_token } = require("../../helpers");
const {
    property_list,
    property_assign,
    method_definition,
} = require("../enums/states_enum");

module.exports = {
    id         : "Property control",
    type       : "Expression",
    precedence : PROPERTY_CONTROL,

    is : (token, parser) => {
        if (parser.current_state === property_list) {
            parser.current_state = null;
            const next_token = parser.look_ahead(true);
            if (! is_delimiter_token(next_token, ':')) {
                parser.current_state = method_definition;
            } else {
                parser.current_state = property_assign;
            }
        }
    },
    initialize : () => {}
};
