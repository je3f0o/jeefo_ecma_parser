/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-05
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

[
    "is_expression",
    "get_expression",
    "get_right_value",
    "ignore_comments",
    "is_specific_method",
    "prepare_next_expression",
    "get_variable_declarator",
    "get_variable_declaration_list",
    "get_comma_separated_expressions",
].forEach(name => {
    exports[name] = require(`./${ name }`);
});
