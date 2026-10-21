// From code/modules/library/random_books.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7303, "/obj/item/weapon/book/manual/random", "/obj/item/weapon/book/manual", {});

// /obj/item/weapon/book/manual/random/proc/Initialize  (code/modules/library/random_books.dm:2)  may sleep
rt.def("/obj/item/weapon/book/manual/random/proc/Initialize", function* Initialize(f: Frame) {
	let newtype: Value = null;
	f.vars = () => [newtype];
	yield* g.callSuper(f, [], rt.Args.Same);
	newtype = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/book/manual")])), T("/obj/item/weapon/book/manual")), rt.gl("banned_books"))]);
	yield* g.new_(f, live(newtype), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7305, "/obj/item/weapon/book/random", "/obj/item/weapon/book", {
	amount: 1,
	category: null,
});

// /obj/item/weapon/book/random/proc/Initialize  (code/modules/library/random_books.dm:13)  may sleep
rt.def("/obj/item/weapon/book/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/create_random_books"), null, [rt.sv(f, "amount"), rt.fv(f, "loc", live(f.src)), 1, rt.sv(f, "category")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12947, "/obj/structure/bookcase/random", "/obj/structure/bookcase", {
	category: null,
	book_count: 2,
	anchored: 1,
	state: 2,
});

// /obj/structure/bookcase/random/proc/Initialize  (code/modules/library/random_books.dm:27)  may sleep
rt.def("/obj/structure/bookcase/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "book_count")) || !truthy((yield* g.call(f, P("/proc/isnum"), null, [rt.sv(f, "book_count")]))))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/create_random_books"), null, [(rt.modSrcVar(f, "book_count", rt.op(f, "PickUnweighted", [5], [-1, -1, 0, 1, 1]), add)), live(f.src), 0, rt.sv(f, "category")]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /proc/create_random_books  (code/modules/library/random_books.dm:36)  may sleep
rt.def("/proc/create_random_books", function* create_random_books(f: Frame, amount: Value, location: Value, fail_loud: Value, category: Value) {
	let _P: Value = null, c: Value = null, query_get_random_books: Value = null, B: Value = null;
	let $0: any;
	f.vars = () => [amount, location, fail_loud, category, _P, c, query_get_random_books, B, $0];
	if (live(amount) === null) {
		amount = 2;
	}
	if (live(fail_loud) === null) {
		fail_loud = 0;
	}
	if (live(category) === null) {
		category = null;
	}
	f.dot = rt.list();
	if ((!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(amount)]))) || rt.lt(live(amount), 1))) {
		return live(f.dot);
	}
	if ((truthy(live(fail_loud)) || truthy(rt.op(f, "Prob", [], [5])))) {
		rt.setFv(f, "info", (_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [live(location)]))), "There once was a book from Nantucket<br>But the database failed us, so f*$! it.<br>I tried to be good to you<br>Now this is an I.O.U<br>If you're feeling entitled, well, stuff it!<br><br><font color='gray'>~</font>");
		yield* g.callName(f, live(_P), "update_icon", []);
	}
	return live(f.dot);
}, true);

rt.type(12952, "/obj/structure/bookcase/random/reference", "/obj/structure/bookcase/random", {
	ref_book_prob: 20,
	category: "Reference",
	name: "bookcase (Reference)",
});

// /obj/structure/bookcase/random/reference/proc/Initialize  (code/modules/library/random_books.dm:80)  may sleep
rt.def("/obj/structure/bookcase/random/reference/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	while (rt.gt(rt.sv(f, "book_count"), 0) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "ref_book_prob")]))) {
		rt.incSrcVar(f, "book_count", -1, true);
		yield* g.new_(f, T("/obj/item/weapon/book/manual/random"), [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["mapload"] });
