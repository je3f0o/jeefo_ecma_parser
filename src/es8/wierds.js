
let yield = 3.14;
//  ^^^^^
// Hey! yield гэж reserved keyword биш билүү?

let await = yield;
//  ^^^^^   ^^^^^
// Okay, await хүртэл reserved keyword биш гэж үү?

// Let's do something crazy...
let {} = {}; // WTF ???
let [] = []; // Энэ яаж зөв syntax болдог байна аа?

{
let async_fn = async () => {};
async function await () {
            // ^^^^^ Async function-ий нэр await байж болно. WTF??? 😲
    return await async_fn();
}

function * yield () {
        // ^^^^^ Generator function-ий нэр yield байж болно. Really?
    yield yield yield yield yield; // You are kidding me! 😁
}
}

// За бүр солиотой код бичье...
let o = {
    while () {}, if () {}, function () {}, let () {}, const () {},
    3.14 () {},
    null () {},
    undefined () {}, // Ok, Би бууж өглөө!!!
}
