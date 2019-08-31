/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement_specs.js
* Created at  : 2019-08-12
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

const expect                       = require("expect.js");
const { UnexpectedTokenException } = require("@jeefo/parser");

const parser          = require("../parser.js");
const precedence_enum = require("../../../src/es6/enums/precedence_enum");

const test_array_binding      = require("../helpers/test_array_binding");
const test_object_binding     = require("../helpers/test_object_binding");
const test_lexical_binding    = require("../helpers/test_lexical_binding");
const test_binding_rest_el    = require("../helpers/test_binding_rest");
const test_binding_property   = require("../helpers/test_binding_property");
const test_binding_identifier = require("../helpers/test_binding_identifier");

const {
    test_range,
    test_for_each,
    test_statement,
    test_substring,
} = require("../../helpers");

describe("Variable statement >", () => {
    const test = test_cases => {
        test_for_each(test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "Variable");

            it("should be has correct list", () => {
                test_case.list(node.list, streamer);
            });

            it("should be has correct delimiters", () => {
                test_case.delimiters(node.delimiters);
            });

            test_range(test_case, node, streamer);
        });
    };

    describe("Semicolon terminated >", () => {
        const test_cases = [
            // const {} = {};
            {
                code   : "const {} = {};",
                source : "const {} = {};",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "{} = {}",
                        binding : {
                            id    : "Object binding pattern",
                            str   : "{}",
                            props : props => {
                                expect(props.length).to.be(0);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= {}",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const { prop, } = {};
            {
                code   : "const { prop, } = {};",
                source : "const { prop, } = {};",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "{ prop, } = {}",
                        binding : {
                            id    : "Object binding pattern",
                            str   : "{ prop, }",
                            props : props => {
                                expect(props.length).to.be(1);

                                test_binding_identifier({
                                    str   : "prop",
                                    value : "prop",
                                }, props[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(1);
                            }
                        },
                        init : {
                            str : "= {}",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const { prop = default_value } = {};
            {
                code   : "const { prop = default_value } = {};",
                source : "const { prop = default_value } = {};",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);

                    // Lexical binding
                    test_lexical_binding({
                        str     : "{ prop = default_value } = {}",
                        binding : {
                            id    : "Object binding pattern",
                            str   : "{ prop = default_value }",
                            props : props => {
                                expect(props.length).to.be(1);

                                test_binding_identifier({
                                    str   : "prop = default_value",
                                    value : "prop",
                                    init  : {
                                        str        : "= default_value",
                                        operator   : "=",
                                        expression : "default_value",
                                    }
                                }, props[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= {}",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const { prop:bind_id = default_value } = {};
            {
                code   : "const { prop:bind_id = default_value } = {};",
                source : "const { prop:bind_id = default_value } = {};",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "{ prop:bind_id = default_value } = {}",
                        binding : {
                            id    : "Object binding pattern",
                            str   : "{ prop:bind_id = default_value }",
                            props : props => {
                                expect(props.length).to.be(1);

                                test_binding_property({
                                    str       : "prop:bind_id = default_value",
                                    name      : "prop",
                                    delimiter : ':',
                                    element   : {
                                        id    : "Binding identifier",
                                        str   : "bind_id = default_value",
                                        value : "bind_id",
                                        init  : {
                                            str        : "= default_value",
                                            operator   : "=",
                                            expression : "default_value",
                                        }
                                    }
                                }, props[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= {}",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const { prop:{ nested } } = {};
            {
                code   : "const { prop:{ nested } } = {};",
                source : "const { prop:{ nested } } = {};",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);

                    // Nested Object binding pattern
                    const nested = {
                        str       : "prop:{ nested }",
                        name      : "prop",
                        delimiter : ':',
                        element   : {
                            id    : "Object binding pattern",
                            str   : "{ nested }",
                            props : props => {
                                expect(props.length).to.be(1);

                                test_binding_identifier({
                                    str   : "nested",
                                    value : "nested",
                                }, props[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            },
                        },
                    };

                    // Lexical binding
                    test_lexical_binding({
                        str     : "{ prop:{ nested } } = {}",
                        binding : {
                            id    : "Object binding pattern",
                            str   : "{ prop:{ nested } }",
                            props : props => {
                                expect(props.length).to.be(1);
                                test_binding_property(
                                    nested, props[0], streamer
                                );
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= {}",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const { prop:[] } = {};
            {
                code   : "const { prop:[] } = {};",
                source : "const { prop:[] } = {};",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);

                    // Nested Object binding pattern
                    const nested = {
                        str       : "prop:[]",
                        name      : "prop",
                        delimiter : ':',
                        element   : {
                            id       : "Array binding pattern",
                            str      : "[]",
                            elements : elems => {
                                expect(elems.length).to.be(0);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            },
                        },
                    };

                    // Lexical binding
                    test_lexical_binding({
                        str     : "{ prop:[] } = {}",
                        binding : {
                            id    : "Object binding pattern",
                            str   : "{ prop:[] }",
                            props : props => {
                                expect(props.length).to.be(1);
                                test_binding_property(
                                    nested, props[0], streamer
                                );
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= {}",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [] = [];
            {
                code   : "const [] = [];",
                source : "const [] = [];",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[] = []",
                        binding : {
                            id       : "Array binding pattern",
                            str      : "[]",
                            elements : elems => {
                                expect(elems.length).to.be(0);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= []",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [,] = [];
            {
                code   : "const [,] = [];",
                source : "const [,] = [];",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[,] = []",
                        binding : {
                            id       : "Array binding pattern",
                            str      : "[,]",
                            elements : elems => {
                                expect(elems.length).to.be(0);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(1);
                            }
                        },
                        init : {
                            str : "= []",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [,,] = [];
            {
                code   : "const [,,] = [];",
                source : "const [,,] = [];",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[,,] = []",
                        binding : {
                            id       : "Array binding pattern",
                            str      : "[,,]",
                            elements : elems => {
                                expect(elems.length).to.be(0);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(2);
                            }
                        },
                        init : {
                            str : "= []",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [,id] = [];
            {
                code   : "const [,id] = [];",
                source : "const [,id] = [];",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[,id] = []",
                        binding : {
                            id       : "Array binding pattern",
                            str      : "[,id]",
                            elements : elems => {
                                expect(elems.length).to.be(1);

                                test_binding_identifier({
                                    str   : "id",
                                    value : "id",
                                }, elems[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(1);
                            }
                        },
                        init : {
                            str : "= []",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [id = default_value] = [];
            {
                code   : "const [id = default_value] = [];",
                source : "const [id = default_value] = [];",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[id = default_value] = []",
                        binding : {
                            id    : "Array binding pattern",
                            str   : "[id = default_value]",
                            elements : elems => {
                                expect(elems.length).to.be(1);

                                test_binding_identifier({
                                    str   : "id",
                                    value : "id",
                                    init  : {
                                        str        : "= default_value",
                                        operator   : "=",
                                        expression : "default_value",
                                    }
                                }, elems[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= []",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [id,[],{}] = complicated_array;
            {
                code   : "const [id,[],{}] = complicated_array;",
                source : "const [id,[],{}] = complicated_array;",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[id,[],{}] = complicated_array",
                        binding : {
                            id       : "Array binding pattern",
                            str      : "[id,[],{}]",
                            elements : elems => {
                                expect(elems.length).to.be(3);

                                test_binding_identifier({
                                    str   : "id",
                                    value : "id",
                                }, elems[0], streamer);

                                test_array_binding({
                                    str      : "[]",
                                    elements : elems => {
                                        expect(elems.length).to.be(0);
                                    },
                                    delimiters : delimiters => {
                                        expect(delimiters.length).to.be(0);
                                    },
                                }, elems[1], streamer);

                                test_object_binding({
                                    str   : "{}",
                                    props : props => {
                                        expect(props.length).to.be(0);
                                    },
                                    delimiters : delimiters => {
                                        expect(delimiters.length).to.be(0);
                                    },
                                }, elems[2], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(2);
                            }
                        },
                        init : {
                            str : "= complicated_array",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },

            // const [...rest] = [];
            {
                code   : "const [...rest] = [];",
                source : "const [...rest] = [];",

                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    test_lexical_binding({
                        str     : "[...rest] = []",
                        binding : {
                            id       : "Array binding pattern",
                            str      : "[...rest]",
                            elements : elems => {
                                expect(elems.length).to.be(1);

                                test_binding_rest_el({
                                    str        : "...rest",
                                    ellipsis   : "...",
                                    identifier : "rest"
                                }, elems[0], streamer);
                            },
                            delimiters : delimiters => {
                                expect(delimiters.length).to.be(0);
                            }
                        },
                        init : {
                            str : "= []",
                        },
                    }, list[0], streamer);
                },
                delimiters : delimiters => {
                    expect(delimiters.length).to.be(0);
                },
                terminator : (terminator, streamer) => {
                    test_substring(";", streamer, terminator);
                }
            },
        ];

        test(test_cases);
    });

    describe("Automatic semicolon insertion >", () => {
        return;
        const test_terminator = terminator => {
            expect(terminator).to.be(null);
        };

        const test_cases = [
            // var id
            {
                code   : "var id",
                source : "var id",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    test_substring("id", streamer, list[0]);
                },
                terminator : test_terminator,
            },

            // var\nterminated\nb = 2
            {
                code   : "var\nterminated",
                source : "var\nterminated\nb = 2",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    test_substring("terminated", streamer, list[0]);
                },
                terminator : test_terminator,
            },

            // var pi = 3.14\n, terminated\nb=2;
            {
                code   : "var pi = 3.14\n, terminated",
                source : "var pi = 3.14\n, terminated\nb=2;",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);
                    test_substring("pi = 3.14", streamer, list[0]);
                    test_substring("terminated", streamer, list[1]);
                },
                terminator : test_terminator,
            },

            // var pi = 3.14\n terminated
            {
                code   : "var pi = 3.14",
                source : "var pi = 3.14\n terminated",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    test_substring("pi = 3.14", streamer, list[0]);
                },
                terminator : test_terminator,
            },

            // var a /*a*/, pi /*b*/ = /*c*/ 3.14 + 5  /*comment doesn't matter*/
            {
                code   : "var a /*a*/, pi /*b*/ = /*c*/ 3.14 + 5",
                source : "var a /*a*/, pi /*b*/ = /*c*/ 3.14 + 5 /*comment doesn't matter*/",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);
                    test_substring("a", streamer, list[0]);
                    test_substring("pi /*b*/ = /*c*/ 3.14 + 5", streamer, list[1]);
                },
                terminator : test_terminator,
            },
        ];

        test(test_cases);
    });

    describe("Invalid cases >", () => {
        return;
        const error_test_cases = [
            // var
            {
                source : "var",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var a a
            {
                source : "var a a",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // var a =
            {
                source : "var a =",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var a,
            {
                source : "var a,",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var 3
            {
                source : "var 3",
                error : error => {
                    it("should be throw: Expected identifier instead saw: 3", () => {
                        expect(error.message).to.be("Expected identifier instead saw: 3");
                    });

                    it("should be has token value: 3", () => {
                        expect(error.token.value).to.be("3");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // var a, ,
            {
                source : "var a, ,",
                error : error => {
                    it("should be throw: Expected identifier instead saw: ,", () => {
                        expect(error.message).to.be("Expected identifier instead saw: ,");
                    });

                    it("should be has token value: ,", () => {
                        expect(error.token.value).to.be(",");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },
        ];

        error_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                try {
                    parser.parse_next_node(precedence_enum.TERMINATION);
                    expect("throw").to.be("failed");
                } catch (e) {
                    test_case.error(e);
                }
            });
        });
    });
});
