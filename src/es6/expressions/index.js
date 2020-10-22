/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-22
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

module.exports = ast_node_table => {
    [
        "meta_property",

        "generator_method",
        "method_definition",

        "arrow_function",
        "class_expression",
        "grouping_expression",
        "generator_expression",
    ].forEach(path => {
        const node_def = require(`./${ path }`);
        ast_node_table.register_node_definition(node_def);
    });

    ["new", "yield"].forEach(reserved_word => {
        const node_def = require(`./${ reserved_word }_expression`);
        ast_node_table.register_reserved_word(reserved_word, node_def);
    });
};
