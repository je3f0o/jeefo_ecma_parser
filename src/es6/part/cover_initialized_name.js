/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : cover_initialized_name.js
* Created at  : 2019-08-28
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

const { COVER_INITIALIZED_NAME } = require("../enums/precedence_enum");
const { initializer_definition } = require("../nodes");
const {
    cover_initialized_name : cover
} = require("../enums/states_enum");

module.exports = {
    id         : "Cover initialized name",
    type       : "Expression",
    precedence : COVER_INITIALIZED_NAME,

    is         : (token, parser) => parser.current_state === cover,
    initialize : (node, token, parser) => {
        parser.change_state("reference_id");
        const identifier_reference = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        const initializer = initializer_definition.generate_new_node(parser);

        node.identifier_reference = identifier_reference;
        node.initializer          = initializer;
        node.start                = identifier_reference.start;
        node.end                  = initializer.end;
    }
};
