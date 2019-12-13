/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : precedence_enum.js
* Created at  : 2019-08-22
* Updated at  : 2019-12-13
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

const precedence_enum = require("../../es6/enums/precedence_enum");

module.exports = Object.assign({
    AWAIT_EXPRESSION               : 16,
    ASYNC_METHOD                   : 34,
    ASYNC_ARROW_FUNCTION           : 39,
    ASYNC_ARROW_BINDING_IDENTIFIER : 39,
    ASYNC_FUNCTION_DECLARATION     : 41,
}, precedence_enum);
