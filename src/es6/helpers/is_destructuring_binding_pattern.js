/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : is_destructuring_binding_pattern.js
* Created at  : 2019-08-30
* Updated at  : 2019-08-30
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

// Destructuring binding patterns
const destructuring_binding_patterns = [
    "Array binding pattern",
    "Object binding pattern",
];

module.exports = node => destructuring_binding_patterns.includes(node.id);
