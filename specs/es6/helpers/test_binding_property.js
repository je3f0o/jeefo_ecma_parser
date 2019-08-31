/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_binding_property.js
* Created at  : 2019-08-12
* Updated at  : 2019-08-16
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

const expect                  = require("expect.js");
const test_substring          = require("../../helpers/test_substring");
const test_array_binding      = require("../helpers/test_array_binding");
const test_object_binding     = require("../helpers/test_object_binding");
const test_binding_identifier = require("../helpers/test_binding_identifier");

module.exports = (spec, node, streamer) => {
    expect(node.id).to.be("Binding property");
    expect(node.type).to.be("Expression");
    expect(node.precedence).to.be(-1);

    test_substring(spec.name      , streamer , node.property_name);
    test_substring(spec.delimiter , streamer , node.delimiter);
    test_substring(spec.str       , streamer , node);

    switch (spec.element.id) {
        case "Array binding pattern" :
            test_array_binding(spec.element, node.binding_element, streamer);
            break;
        case "Object binding pattern" :
            test_object_binding(spec.element, node.binding_element, streamer);
            break;
        default:
            test_binding_identifier(spec.element, node.binding_element, streamer);
    }
};
