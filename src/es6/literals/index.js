/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-24
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

module.exports = ast_node_table => {
    ast_node_table.remove_node_defs([
        { expression : "Array literal" },
    ]);

    [
        "array",
        //"object",
        "template",
    ].forEach(path => {
        const node_def = require(`./${ path }_literal`);
        ast_node_table.register_node_definition(node_def);
    });
};
