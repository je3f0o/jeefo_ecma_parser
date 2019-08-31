/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : cover_object_error.js
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Cover object error",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (token, parser) => {
        const last_node = get_last_non_comment_node(parser);
        if (last_node && last_node.id === "Object literal") {
            last_node.properties.forEach(property => {
                if (property.id === "Cover initialized name") {
                    parser.throw_unexpected_token(
                        null, property.initializer.assign_operator
                    );
                }
            });
        }
    },
    initialize : () => {}
};
