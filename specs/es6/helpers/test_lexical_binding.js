/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_lexical_binding.js
* Created at  : 2019-08-14
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

const expect              = require("expect.js");
const test_substring      = require("../../helpers/test_substring");
const test_array_binding  = require("../helpers/test_array_binding");
const test_object_binding = require("../helpers/test_object_binding");

module.exports = (spec, node, streamer) => {
    expect(node.id).to.be("Lexical binding");
    expect(node.type).to.be("Expression");
    expect(node.precedence).to.be(-1);

    test_substring(spec.binding.str, streamer, node.binding);
    if (spec.init) {
        expect(node.initializer).not.to.be(null);
        test_substring(spec.init.str, streamer, node.initializer);
    } else {
        expect(node.initializer).to.be(null);
    }
    test_substring(spec.str, streamer, node);

    switch (spec.binding.id) {
        case "Array binding pattern" :
            test_array_binding(spec.binding, node.binding, streamer);
            break;
        case "Object binding pattern" :
            test_object_binding(spec.binding, node.binding, streamer);
            break;
    }
};
