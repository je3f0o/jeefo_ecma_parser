/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_binding_identifier.js
* Created at  : 2019-08-12
* Updated at  : 2019-08-14
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

const expect           = require("expect.js");
//const test_substring   = require("../../helpers/test_substring");
const test_initializer = require("../helpers/test_initializer");

module.exports = (spec, node, streamer) => {
    expect(node.id).to.be("Binding identifier");
    expect(node.type).to.be("Expression");
    expect(node.precedence).to.be(-1);

    expect(node.identifier.value).to.be(spec.value);

    if (spec.init) {
        test_initializer(spec.init, node.initializer, streamer);
    } else {
        expect(node.initializer).to.be(null);
    }
};
