# jeefo_javascript_parser

"ECMA Script 5" and "ECMA Script 6" Abstract syntax tree parser written in
NodeJS.

Very fast execution and clean code design.

## Goal

There are many existed parsers do not get any information about comma separator
or delimiter characters like (, ), {, }, etc...
So I wanted to write a parser do not lose a single non whitespace character from
the source code. Also I don't want to get complicated AST objects has leading
comments, trailing comments and inner comments... Which is very confusing in
some complicated statements. In this javascript parser AST objects has only
`pre_comment`. All `pre_comment`s are attached to next statement or next
token. Which is very useful for parsing documentations like function declaration
or function expressions. The only way to get individual AST comment object is
source code ends with comment.

## Install

`npm i jeefo_javascript_parser` or `yarn add jeefo_javascript_parser`

## Dependencies

- @jeefo/parser

## Documantation

Coming soon...

## Author

- Д.Батхишиг (A.K.A [https://github.com/je3f0o](je3f0o))

## Maintainer

- [https://github.com/je3f0o](https://github.com/je3f0o) (je3f0o@gmail.com)

## References

- [https://www.ecma-international.org/ecma-262/5.1](https://www.ecma-international.org/ecma-262/5.1)

## LICENSE
The MIT License
Copyright (c) 2017 - jeefo_javascript_parser
