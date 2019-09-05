/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : precedence_enum.js
* Created at  : 2019-08-12
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

const precedence_enum = require("../../es5/enums/precedence_enum");

module.exports = Object.assign({
    YIELD_EXPRESSION       : 2,
    GENERATOR_EXPRESSION   : 35,

    GENERATOR_METHOD       : 35,
    REFERENCE_ID           : 36,
    COVER_INITIALIZED_NAME : 36,
    PROPERTY_CONTROL_ES6   : 37,

    BINDING_PATTERN        : 41,
}, precedence_enum);
