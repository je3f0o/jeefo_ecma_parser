/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-02
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

const error_reporter                   = require("./error_reporter");
const { missing_initializer_in_const } = error_reporter;

exports.is_destructuring_binding_pattern = require(
    "./is_destructuring_binding_pattern"
);
exports.error_reporter         = error_reporter;
exports.validate_const_binding = (node, parser) => {
    if (! node.initializer) {
        missing_initializer_in_const(parser, node.binding);
    }
};
