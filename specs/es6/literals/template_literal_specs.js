/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : template_literal_specs.js
* Created at  : 2019-12-12
* Updated at  : 2019-12-13
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

const expect          = require("expect.js");
const parser          = require("../parser.js");
const test_source     = require("../../helpers/test_source");
const precedence_enum = require("../../../src/es6/enums/precedence_enum");

const {
    test_range,
    test_for_each,
    test_declaration,
} = require("../../helpers");

const test_source1 = `\`
    abc
\``;

const test_source2 = `\`
    abc
    xyz
\``;

const test_source3 = `\`
\${ some_var }
\``;

const test_source4 = `\`
abc
\${ some_var }
\``;

const test_source5 = `\`
\${ some_var }
abc
\``;

const test_source6 = `\`
abc
\${ some_var }
abc
\``;

const test_source7 = `\`abc\``;

describe("Template literal >", () => {
    const test_cases = [
        {
            code   : test_source1,
            source : test_source1,

            parts (parts) {
                expect(parts.length).to.be(1);
                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(2);
                expect(parts[0].end.column).to.be(8);
            },

            start : { line : 1, column : 1 },
            end   : { line : 3, column : 1 },
        },
        {
            code   : test_source2,
            source : test_source2,

            parts (parts) {
                expect(parts.length).to.be(1);
                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(3);
                expect(parts[0].end.column).to.be(8);
            },

            start : { line : 1, column : 1 },
            end   : { line : 4, column : 1 },
        },
        {
            code   : test_source3,
            source : test_source3,

            parts (parts) {
                expect(parts.length).to.be(3);

                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(1);
                expect(parts[0].end.column).to.be(2);

                expect(parts[1].start.line).to.be(2);
                expect(parts[1].start.column).to.be(1);
                expect(parts[1].end.line).to.be(2);
                expect(parts[1].end.column).to.be(13);

                expect(parts[2].start.line).to.be(2);
                expect(parts[2].start.column).to.be(14);
                expect(parts[2].end.line).to.be(2);
                expect(parts[2].end.column).to.be(14);
            },

            start : { line : 1, column : 1 },
            end   : { line : 3, column : 1 },
        },
        {
            code   : test_source4,
            source : test_source4,

            parts (parts) {
                expect(parts.length).to.be(3);

                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(2);
                expect(parts[0].end.column).to.be(4);

                expect(parts[1].start.line).to.be(3);
                expect(parts[1].start.column).to.be(1);
                expect(parts[1].end.line).to.be(3);
                expect(parts[1].end.column).to.be(13);

                expect(parts[2].start.line).to.be(3);
                expect(parts[2].start.column).to.be(14);
                expect(parts[2].end.line).to.be(3);
                expect(parts[2].end.column).to.be(14);
            },

            start : { line : 1, column : 1 },
            end   : { line : 4, column : 1 },
        },
        {
            code   : test_source5,
            source : test_source5,

            parts (parts) {
                expect(parts.length).to.be(3);

                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(1);
                expect(parts[0].end.column).to.be(2);

                expect(parts[1].start.line).to.be(2);
                expect(parts[1].start.column).to.be(1);
                expect(parts[1].end.line).to.be(2);
                expect(parts[1].end.column).to.be(13);

                expect(parts[2].start.line).to.be(2);
                expect(parts[2].start.column).to.be(14);
                expect(parts[2].end.line).to.be(3);
                expect(parts[2].end.column).to.be(4);
            },

            start : { line : 1, column : 1 },
            end   : { line : 4, column : 1 },
        },
        {
            code   : test_source6,
            source : test_source6,

            parts (parts) {
                expect(parts.length).to.be(3);

                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(2);
                expect(parts[0].end.column).to.be(4);

                expect(parts[1].start.line).to.be(3);
                expect(parts[1].start.column).to.be(1);
                expect(parts[1].end.line).to.be(3);
                expect(parts[1].end.column).to.be(13);

                expect(parts[2].start.line).to.be(3);
                expect(parts[2].start.column).to.be(14);
                expect(parts[2].end.line).to.be(4);
                expect(parts[2].end.column).to.be(4);
            },

            start : { line : 1, column : 1 },
            end   : { line : 5, column : 1 },
        },
        {
            code   : test_source7,
            source : test_source7,

            parts (parts) {
                expect(parts.length).to.be(1);

                expect(parts[0].start.line).to.be(1);
                expect(parts[0].start.column).to.be(2);
                expect(parts[0].end.line).to.be(1);
                expect(parts[0].end.column).to.be(4);
            },

            start : { line : 1, column : 1 },
            end   : { line : 1, column : 5 },
        },
    ];

    test_for_each(test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        parser.prepare_next_state("expression");

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            node = parser.generate_next_node();
        } catch (e) {}

        it("should be has correct parts", () => {
            test_case.parts(node.body);
        });

        it(`should be in correct range`, () => {
            expect(streamer.substring_from_token(node)).to.be(test_case.code);
            expect(node.start.column).to.be(test_case.start.column);
            expect(node.start.line).to.be(test_case.start.line);
            expect(node.end.line).to.be(test_case.end.line);
            expect(node.end.column).to.be(test_case.end.column);
        });
    });
});
