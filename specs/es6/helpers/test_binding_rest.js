/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_binding_rest.js
* Created at  : 2019-08-17
* Updated at  : 2019-08-17
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
    expect(node.id).to.be("Binding rest element");
    expect(node.type).to.be("Expression");
    expect(node.precedence).to.be(-1);

    test_substring(spec.ellipsis, streamer, node.ellipsis);
    test_substring(spec.identifier, streamer, node.identifier);
    test_substring(spec.str, streamer, node);
};
