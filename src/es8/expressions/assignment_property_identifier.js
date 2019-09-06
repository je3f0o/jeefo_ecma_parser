/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_property_identifier.js
* Created at  : 2019-09-06
* Updated at  : 2019-09-06
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

const { EXPRESSION }                     = require("../enums/precedence_enum");
const { assignment_property_identifier } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment property identifier",
	type       : "Expression",
	precedence : EXPRESSION,

    is (_, { current_state }) {
        return current_state === assignment_property_identifier;
    },

	refine (node, property) {
        ["identifier", "initializer", "start", "end"].forEach(prop => {
            node[prop] = property[prop];
        });
    },
};
