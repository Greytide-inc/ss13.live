// Based on /tg/station's code/modules/library/random_books.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7303, "/obj/item/weapon/book/manual/random", "/obj/item/weapon/book/manual", {});

// random_books.dm:2
rt.def("/obj/item/weapon/book/manual/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	let newtype: Value = pick(typesof(T("/obj/item/weapon/book/manual")) - T("/obj/item/weapon/book/manual") - GLOB.banned_books);
	yield* new_(newtype, this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7305, "/obj/item/weapon/book/random", "/obj/item/weapon/book", {
	amount: 1,
	category: null,
});

// random_books.dm:13
rt.def("/obj/item/weapon/book/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* create_random_books(this.amount, this.loc, 1, this.category);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12947, "/obj/structure/bookcase/random", "/obj/structure/bookcase", {
	category: null,
	book_count: 2,
	anchored: 1,
	state: 2,
});

// random_books.dm:27
rt.def("/obj/structure/bookcase/random/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!this.book_count || !isnum(this.book_count)) {
		yield* this.update_icon();
		return f.dot;
	}
	yield* create_random_books((this.book_count += pick(-1, -1, 0, 1, 1)), this, 0, this.category);
	yield* this.update_icon();
	return f.dot;
}, true);

// random_books.dm:36
rt.def("/proc/create_random_books", function* create_random_books(f: Frame, amount: Value, location: Value, fail_loud: Value, category: Value) {
	let _P: Value = null;
	amount ??= 2;
	fail_loud ??= 0;
	f.dot = list();
	if (!isnum(amount) || amount < 1) {
		return f.dot;
	}
	if (fail_loud || prob(5)) {
		(_P = (yield* new_(T("/obj/item/weapon/paper"), location))).info = "There once was a book from Nantucket<br>But the database failed us, so f*$! it.<br>I tried to be good to you<br>Now this is an I.O.U<br>If you're feeling entitled, well, stuff it!<br><br><font color='gray'>~</font>";
		yield* _P.update_icon();
	}
	return f.dot;
}, true);

rt.type(12952, "/obj/structure/bookcase/random/reference", "/obj/structure/bookcase/random", {
	ref_book_prob: 20,
	category: "Reference",
	name: "bookcase (Reference)",
});

// random_books.dm:80
rt.def("/obj/structure/bookcase/random/reference/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	while (this.book_count > 0 && prob(this.ref_book_prob)) {
		this.book_count--;
		yield* new_(T("/obj/item/weapon/book/manual/random"), this);
	}
	return f.dot;
}, true);
