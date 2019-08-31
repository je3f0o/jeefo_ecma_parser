/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : precedence_enum.js
* Created at  : 2019-08-22
* Updated at  : 2019-08-27
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
    AWAIT_EXPRESSION     : 16,
    ASYNC_METHOD         : 34,
    ASYNC_ARROW_FUNCTION : 39,
}, precedence_enum);
