/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : strict.js
* Created at  : 2020-08-29
* Updated at  : 2020-09-14
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

let undefined = 123;
console.log("start", undefined);
function fn (t) {
    console.log(undefined, t === undefined);
}
fn();
console.log("end", undefined);

const o = {};

//for (let in []);
//for (var i = 123 in []);

const object_define_property = v => console.log("Object", v);

object_define_property(o, "onpreparation", {
    get () { return 1; },
    set (a, value) {
        if (typeof value !== "function") {
            throw new TypeError(
                "Assigned onpreparation is not a function"
            );
        }
    }
});

let s;
s = () => {
}
,
object_define_property(5);


(1,
2
)

3

var e
    ,f = 1
var e,
    f = 2

//if (1) function fn1 () {}

//for (;false;) label: class A {}
//for (;false;) label: function fn () {}

/*
throw
      1;
*/
console.log(f);

o
.
p;

let a;
a = 1
+
2;

console.log(a);
