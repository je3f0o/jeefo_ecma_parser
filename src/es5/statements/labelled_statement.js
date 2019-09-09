/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.12
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { STATEMENT }        = require("../enums/precedence_enum");
const { statement : stmt } = require("../enums/states_enum");
const {
    is_delimiter_token,
    is_identifier_token,
} = require("../../helpers");

module.exports = {
    id         : "Labelled statement",
    type       : "Statement",
	precedence : STATEMENT,

    is : (token, parser) => {
        if (parser.current_state === stmt && is_identifier_token(token)) {
            const next_token = parser.look_ahead();
            return next_token && is_delimiter_token(next_token, ':');
        }
    },
    initialize : (node, token, parser) => {
        parser.change_state("label_identifier");
        const label = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        const delimiter = parser.generate_next_node();

        parser.prepare_next_state(null, true);
        const statement = parser.generate_next_node();

        node.label_identifier = label;
        node.delimiter        = delimiter;
        node.statement        = statement;
        node.start            = label.start;
        node.end              = statement.end;
    }
};
