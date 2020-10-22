/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : debugger_statement.js
* Created at  : 2019-03-01
* Updated at  : 2020-06-11
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

const { statement }           = require("../enums/states_enum");
const { STATEMENT }           = require("../enums/precedence_enum");
const { is_terminator }       = require("../../helpers");
const { terminal_definition } = require("../../common");

module.exports = {
	id         : "Debugger statement",
	type       : "Statement",
	precedence : STATEMENT,

    is         : (_, { current_state: s }) => s === statement,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        let terminator = null;
        parser.prepare_next_state();
        if (is_terminator(parser)) {
            terminator = terminal_definition.generate_new_node(parser);
        }

        node.keyword    = keyword;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || keyword).end;

        parser.terminate(node);
    }
};
