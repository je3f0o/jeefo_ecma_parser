/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_array_binding.js
* Created at  : 2019-08-16
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

const expect         = require("expect.js");
const test_substring = require("../../helpers/test_substring");

module.exports = (spec, node, streamer) => {
    expect(node.id).to.be("Array binding pattern");
    expect(node.type).to.be("Expression");
    expect(node.precedence).to.be(-1);

    spec.elements(node.element_list);
    spec.delimiters(node.delimiters);
    test_substring(spec.str, streamer, node);
};
