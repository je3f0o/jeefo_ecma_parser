/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : class_tail.js
* Created at  : 2019-08-23
* Updated at  : 2020-09-06
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

const {EXPRESSION}          = require("../enums/precedence_enum");
const {class_tail}          = require("../enums/states_enum");
const {is_identifier_token} = require("../../helpers");

module.exports = {
    id         : "Class tail",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === class_tail,
    initialize : (node, token, parser) => {
        let heritage = null;
        if (is_identifier_token(token, "extends")) {
            parser.change_state("class_heritage");
            heritage = parser.generate_next_node();
        }

        parser.change_state("class_body");
        const body = parser.generate_next_node();

        node.heritage = heritage;
        node.body     = body;
        node.start    = (heritage || body).start;
        node.end      = body.end;
    }
};
