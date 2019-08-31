/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : numeric_literal_specs.js
* Created at  : 2019-02-05
* Updated at  : 2019-08-05
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what is Number literal and unit test every single case.
*             : Make sure it is working correctly.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const expect          = require("expect.js");
const parser          = require("../parser.js");
const test_source     = require("../../helpers/test_source");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Numeric literal >", () => {
    const source = "3.14";

    test_source(source, () => {
        parser.tokenizer.init(source);
        parser.prepare_next_state("expression");

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            node = parser.generate_next_node();
        } catch (e) {}

        it(`cursor index should be move ${ source.length } characters to right`, () => {
            expect(streamer.get_current_character()).to.be('4');
            expect(streamer.cursor.position.index).to.be(source.length - 1);
        });

        it("should be in correct range", () => {
            expect(node.value).to.be(source);
            expect(node.number_type).to.be("Decimal");
            expect(streamer.substring_from_token(node)).to.be(source);
        });

        it("should be Numeric literal", () => {
            expect(node.id).to.be("Numeric literal");
        });

        it("should be Primitive", () => {
            expect(node.type).to.be("Primitive");
            expect(node.precedence).to.be(precedence_enum.PRIMITIVE);
        });
    });
});
