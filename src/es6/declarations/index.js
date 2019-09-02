/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-22
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

module.exports = ast_node_table => {
    [
        "generator_declaration",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(`./${ path }`));
    });

    [
        "class",
        "function",
    ].forEach(reserved_word => {
        const node_def = require(`./${ reserved_word }_declaration`);
        ast_node_table.register_reserved_word(reserved_word, node_def);
    });
};
