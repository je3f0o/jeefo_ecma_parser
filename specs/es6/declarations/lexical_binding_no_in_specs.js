/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding_no_in.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-01
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

const expect                       = require("expect.js");
const { UnexpectedTokenException } = require("@jeefo/parser");

const parser = require("../parser.js");
const {
    test_range,
    test_for_each,
    test_declaration,
} = require("../../helpers");

describe("Lexical binding no in >", () => {
    const valid_test_cases = [
        // id,
        {
            code    : "id",
            source  : "id,",
            binding : (node) => {
                expect(node.id).to.be("Identifier");
            },
            initializer : (node) => {
                expect(node).to.be(null);
            }
        },

        // id;
        {
            code    : "id",
            source  : "id;",
            binding : (node) => {
                expect(node.id).to.be("Identifier");
            },
            initializer : (node) => {
                expect(node).to.be(null);
            }
        },

        // id = value,
        {
            code    : "id = value",
            source  : "id = value,",
            binding : (node) => {
                expect(node.id).to.be("Identifier");
            },
            initializer : (node) => {
                expect(node).not.to.be(null);
                expect(node.id).to.be("Initializer");
            }
        },

        // {} = {};
        {
            code    : "{} = {}",
            source  : "{} = {};",
            binding : (node) => {
                expect(node.id).to.be("Object binding pattern");
            },
            initializer : (node) => {
                expect(node).not.to.be(null);
                expect(node.id).to.be("Initializer");
            }
        },

        // [] = [];
        {
            code    : "[] = []",
            source  : "[] = [];",
            binding : (node) => {
                expect(node.id).to.be("Array binding pattern");
            },
            initializer : (node) => {
                expect(node).not.to.be(null);
                expect(node.id).to.be("Initializer");
            }
        },

        // id in expr;
        {
            code    : "id",
            source  : "id in expr",
            binding : (node) => {
                expect(node.id).to.be("Identifier");
            },
            initializer : (node) => {
                expect(node).to.be(null);
            }
        },

        // id of expr;
        {
            code    : "id",
            source  : "id of expr",
            binding : (node) => {
                expect(node.id).to.be("Identifier");
            },
            initializer : (node) => {
                expect(node).to.be(null);
            }
        },
    ];

    test_for_each(valid_test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        parser.prepare_next_state();

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            parser.change_state("lexical_binding_no_in");
            node = parser.generate_next_node();
        } catch (e) {}

        test_declaration("Lexical binding no in", node);

        it("should be has correct binding", () => {
            test_case.binding(node.binding);
        });

        it("should be has correct initializer", () => {
            test_case.initializer(node.initializer);
        });

        test_range(test_case, node, streamer);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // ;
            {
                source  : ";",
                message : "Unexpected token",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // 123 = value
            {
                source  : "123 = value",
                message : "Unexpected token",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // id
            {
                source  : "id",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // [],
            {
                source  : "[],",
                message : "Missing initializer in destructuring declaration",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // {},
            {
                source  : "{},",
                message : "Missing initializer in destructuring declaration",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },
        ];

        test_for_each(error_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            try {
                parser.change_state("lexical_binding_no_in");
                parser.generate_next_node();
                expect("throw").to.be("failed");
            } catch (e) {
                test_case.error(e);
            }
        });
    });
});
