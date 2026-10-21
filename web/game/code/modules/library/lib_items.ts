// From code/modules/library/lib_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12942, "/obj/structure/bookcase", "/obj/structure", {
	state: 0,
	allowed_books: null,
	anchored: 0,
	name: "bookcase",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "bookempty",
	density: 1,
	opacity: 0,
	resistance_flags: 4,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// /obj/structure/bookcase/proc/<init>  (code/modules/library/lib_items.dm:25)
rt.def("/obj/structure/bookcase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed_books", rt.list(T("/obj/item/weapon/book"), T("/obj/item/weapon/spellbook"), T("/obj/item/weapon/storage/book")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 0]));
	return f.dot;
});

// /obj/structure/bookcase/proc/Initialize  (code/modules/library/lib_items.dm:29)
rt.def("/obj/structure/bookcase/proc/Initialize", function Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) {
		return live(f.dot);
	}
	rt.setSv(f, "state", 2);
	rt.setSv(f, "icon_state", "book-0");
	rt.setSv(f, "anchored", 1);
	I = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/book")) ? 1 : 0))) {
			rt.setFv(f, "loc", live(I), live(f.src));
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/bookcase/proc/attackby  (code/modules/library/lib_items.dm:42)  may sleep
rt.def("/obj/structure/bookcase/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null, B: Value = null, _T: Value = null, newname: Value = null;
	let $0: any, $e: any;
	f.vars = () => [W, B, _T, newname, $0, $e];
	$0 = rt.sv(f, "state");
	if ($0 === 0) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wrench the frame into place.</span>"]);
				rt.setSv(f, "anchored", 1);
				rt.setSv(f, "state", 1);
			}
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pry the frame apart.</span>"]);
				yield* g.srcCall(f, "deconstruct", 1);
			}
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/wood")) ? 1 : 0))) {
			if (rt.ge((yield* g.callName(f, (W = live(f.args[0])), "get_amount", [])), 2)) {
				yield* g.callName(f, live(W), "use", [2]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add a shelf.</span>"]);
				rt.setSv(f, "state", 2);
				rt.setSv(f, "icon_state", "book-0");
			}
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unwrench the frame.</span>"]);
			rt.setSv(f, "anchored", 0);
			rt.setSv(f, "state", 0);
		}
	} else if ($0 === 2) {
		if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.sv(f, "allowed_books")])))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(f.args[0]), live(f.src));
			yield* g.srcCall(f, "update_icon");
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/books")) ? 1 : 0))) {
				B = live(f.args[0]);
				_T = null;
				rt.forList(f, 0, rt.fv(f, "contents", live(B)), T("/obj/item"));
				while (($e = rt.next(f, 0)) !== undefined) {
					_T = $e;
					if ((truthy((rt.istype(live(_T), T("/obj/item/weapon/book")) ? 1 : 0)) || truthy((rt.istype(live(_T), T("/obj/item/weapon/spellbook")) ? 1 : 0)))) {
						yield* g.callName(f, live(B), "remove_from_storage", [live(_T), live(f.src)]);
					}
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You empty ％！ into ％！.</span>", [live(f.args[0]), live(f.src)])]);
				yield* g.srcCall(f, "update_icon");
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
					if (!truthy((newname = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like to title this bookshelf?"]))))) {
						return live(f.dot);
					} else {
						rt.setSv(f, "name", fmt("bookcase (＀)", [(yield* g.call(f, P("/proc/sanitize"), null, [live(newname)]))]));
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
						if (truthy(rt.len(f, rt.sv(f, "contents")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to remove the books first!</span>"]);
						} else {
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pry the shelf out.</span>"]);
							yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.sv(f, "loc"), 2]);
							rt.setSv(f, "state", 1);
							rt.setSv(f, "icon_state", "bookempty");
						}
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/bookcase/proc/attack_hand  (code/modules/library/lib_items.dm:103)  may sleep
rt.def("/obj/structure/bookcase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null;
	f.vars = () => [user, choice];
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	if (!truthy((choice = (yield* g.op(f, "Prompt", [5], [null, null, null, "Which book would you like to remove from the shelf?", rt.sv(f, "contents")]))))) return f.dot;
	if ((((!truthy(rt.fv(f, "canmove", live(f.usr))) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(user), "get_active_held_item", [])))) {
			yield* g.callName(f, live(user), "put_in_hands", [live(choice)]);
		}
	} else {
		rt.setFv(f, "loc", live(choice), rt.getStep(f, live(f.src), 0));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/bookcase/proc/deconstruct  (code/modules/library/lib_items.dm:117)  may sleep
rt.def("/obj/structure/bookcase/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [disassembled, B, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.sv(f, "loc"), 4]);
	B = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/book"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		yield* g.callName(f, live(B), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/bookcase/proc/update_icon  (code/modules/library/lib_items.dm:124)
rt.def("/obj/structure/bookcase/proc/update_icon", function update_icon(f: Frame) {
	if (rt.lt(rt.len(f, rt.sv(f, "contents")), 5)) {
		rt.setSv(f, "icon_state", fmt("book-＀", [rt.len(f, rt.sv(f, "contents"))]));
	} else {
		rt.setSv(f, "icon_state", "book-5");
	}
	return f.dot;
});

rt.type(12944, "/obj/structure/bookcase/manuals/medical", "/obj/structure/bookcase/manuals", {
	name: "medical manuals bookcase",
});

// /obj/structure/bookcase/manuals/medical/proc/New  (code/modules/library/lib_items.dm:134)  may sleep
rt.def("/obj/structure/bookcase/manuals/medical/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/medical_cloning"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(12945, "/obj/structure/bookcase/manuals/engineering", "/obj/structure/bookcase/manuals", {
	name: "engineering manuals bookcase",
});

// /obj/structure/bookcase/manuals/engineering/proc/New  (code/modules/library/lib_items.dm:143)  may sleep
rt.def("/obj/structure/bookcase/manuals/engineering/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/wiki/engineering_construction"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/engineering_particle_accelerator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/wiki/engineering_hacking"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/wiki/engineering_guide"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/engineering_singularity_safety"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/robotics_cyborgs"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(12946, "/obj/structure/bookcase/manuals/research_and_development", "/obj/structure/bookcase/manuals", {
	name: "１R&D manuals bookcase",
});

// /obj/structure/bookcase/manuals/research_and_development/proc/New  (code/modules/library/lib_items.dm:157)  may sleep
rt.def("/obj/structure/bookcase/manuals/research_and_development/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/book/manual/research_and_development"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(7281, "/obj/item/weapon/book", "/obj/item/weapon", {
	dat: null,
	due_date: 0,
	author: null,
	unique: 0,
	title: null,
	window_size: null,
	throw_speed: 1,
	throw_range: 5,
	name: "book",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book",
	w_class: 3,
	attack_verb: null,
	resistance_flags: 4,
});

// /obj/item/weapon/book/proc/attack_self  (code/modules/library/lib_items.dm:182)
rt.def("/obj/item/weapon/book/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (truthy(rt.call(f, P("/proc/is_blind"), null, [live(user)]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>As you are trying to read, you suddenly feel very stupid!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You skim through the book but can't comprehend any of it.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "dat"))) {
		$0 = live(user);
		$1 = add(fmt("<TT><I>Penned by ＀.</I></TT> <BR>", [rt.sv(f, "author")]), fmt("＀", [rt.sv(f, "dat")]));
		if (rt.sv(f, "window_size") !== null) {
			$2 = fmt(";size=＀", [rt.sv(f, "window_size")]);
		} else {
			$2 = "";
		}
		rt.op(f, "Browse", [], [$0, $1, fmt("window=book＀", [$2])], false);
		rt.callName(f, live(user), "visible_message", [fmt("＀ opens a book titled \"＀\" and begins reading intently.", [live(user), rt.sv(f, "title")])]);
		rt.call(f, P("/proc/onclose"), null, [live(user), "book"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This book is completely blank!</span>"]);
	}
	return f.dot;
});

// /obj/item/weapon/book/proc/attackby  (code/modules/library/lib_items.dm:197)  may sleep
rt.def("/obj/item/weapon/book/proc/attackby", function* attackby(f: Frame) {
	let choice: Value = null, newtitle: Value = null, content: Value = null, newauthor: Value = null, scanner: Value = null, b: Value = null, book: Value = null, B: Value = null;
	let $0: any, $e: any;
	f.vars = () => [choice, newtitle, content, newauthor, scanner, b, book, B, $0, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/is_blind"), null, [live(f.args[1])])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'> As you are trying to write on the book, you suddenly feel very stupid!</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "unique"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>These pages don't seem to take the ink well! Looks like you can't modify it.</span>"]);
			return live(f.dot);
		}
		$0 = (choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "What would you like to change?", rt.list("Title", "Contents", "Author", "Cancel")])));
		if ($0 === "Title") {
			if (rt.gt(rt.length((newtitle = (yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Write a new title:"]))])))), 20)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "That title won't fit on the cover!"]);
				return live(f.dot);
			}
			if (!truthy(live(newtitle))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "That title is invalid."]);
				return live(f.dot);
			} else {
				rt.setSv(f, "name", live(newtitle));
				rt.setSv(f, "title", live(newtitle));
			}
		} else if ($0 === "Contents") {
			if (!truthy((content = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Write your book's contents (HTML NOT allowed):", "", "", 8192]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The content is invalid."]);
				return live(f.dot);
			} else {
				rt.modSrcVar(f, "dat", live(content), add);
			}
		} else if ($0 === "Author") {
			if (!truthy((newauthor = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Write the author's name:"]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The name is invalid."]);
				return live(f.dot);
			} else {
				rt.setSv(f, "author", live(newauthor));
			}
		} else {
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/barcodescanner")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "computer", (scanner = live(f.args[0]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'No associated computer found!'", [live(f.args[0])])]);
			} else {
				$0 = rt.fv(f, "mode", live(scanner));
				if ($0 === 0) {
					rt.setFv(f, "book", live(scanner), live(f.src));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'Book stored in buffer.'", [live(f.args[0])])]);
				} else if ($0 === 1) {
					rt.setFv(f, "book", live(scanner), live(f.src));
					rt.setFv(f, "buffer_book", rt.fv(f, "computer", live(scanner)), rt.sv(f, "name"));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'Book stored in buffer. Book title stored in associated computer buffer.'", [live(f.args[0])])]);
				} else if ($0 === 2) {
					rt.setFv(f, "book", live(scanner), live(f.src));
					b = null;
					rt.forList(f, 0, rt.gv(f, "checkouts", rt.fv(f, "computer", live(scanner))), T("/datum/borrowbook"));
					while (($e = rt.next(f, 0)) !== undefined) {
						b = $e;
						if (isEqual(rt.fv(f, "bookname", live(b)), rt.sv(f, "name"))) {
							yield* g.callName(f, rt.gv(f, "checkouts", rt.fv(f, "computer", live(scanner))), "Remove", [live(b)]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'Book stored in buffer. Book has been checked in.'", [live(f.args[0])])]);
							return live(f.dot);
						}
					}
					rt.endFor(f, 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'Book stored in buffer. No active check-out record found for current title.'", [live(f.args[0])])]);
				} else if ($0 === 3) {
					rt.setFv(f, "book", live(scanner), live(f.src));
					book = null;
					rt.forList(f, 0, rt.gv(f, "inventory", rt.fv(f, "computer", live(scanner))), T("/obj/item/weapon"));
					while (($e = rt.next(f, 0)) !== undefined) {
						book = $e;
						if (isEqual(live(book), live(f.src))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'Book stored in buffer. Title already present in inventory, aborting to avoid duplicate entry.'", [live(f.args[0])])]);
							return live(f.dot);
						}
					}
					rt.endFor(f, 0);
					yield* g.callName(f, rt.gv(f, "inventory", rt.fv(f, "computer", live(scanner))), "Add", [live(f.src)]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s screen flashes: 'Book stored in buffer. Title added to general inventory.'", [live(f.args[0])])]);
				}
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/kitchen/knife")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to carve out ＀...</span>", [rt.sv(f, "title")])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 30, "target", live(f.src)], rt.Args.Named)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You carve out the pages from ＀! You didn't want to read it anyway.</span>", [rt.sv(f, "title")])]);
					rt.setFv(f, "name", (B = (yield* g.new_(f, T("/obj/item/weapon/storage/book"), []))), rt.fv(f, "name", live(f.src)));
					rt.setFv(f, "title", live(B), rt.fv(f, "title", live(f.src)));
					rt.setFv(f, "icon_state", live(B), rt.fv(f, "icon_state", live(f.src)));
					if (truthy((yield* g.callName(f, live(f.args[1]), "is_holding", [live(f.src)])))) {
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
						yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(B)]);
						return live(f.dot);
					} else {
						rt.setFv(f, "loc", live(B), rt.fv(f, "loc", live(f.src)));
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
						return live(f.dot);
					}
				}
				return live(f.dot);
			} else {
				yield* g.callSuper(f, [], rt.Args.Same);
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(7513, "/obj/item/weapon/barcodescanner", "/obj/item/weapon", {
	computer: null,
	book: null,
	mode: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "barcode scanner",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "scanner",
	w_class: 1,
});

// /obj/item/weapon/barcodescanner/proc/attack_self  (code/modules/library/lib_items.dm:300)
rt.def("/obj/item/weapon/barcodescanner/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let modedesc: Value = null;
	let $0: any;
	f.vars = () => [modedesc, $0];
	if (rt.gt((rt.modSrcVar(f, "mode", 1, add)), 3)) {
		rt.setSv(f, "mode", 0);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ Status Display:", [live(f.src)])]);
	modedesc = null;
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		modedesc = "Scan book to local buffer.";
	} else if ($0 === 1) {
		modedesc = "Scan book to local buffer and set associated computer buffer to match.";
	} else if ($0 === 2) {
		modedesc = "Scan book to local buffer, attempt to check in scanned book.";
	} else if ($0 === 3) {
		modedesc = "Scan book to local buffer, attempt to add book to general inventory.";
	} else {
		modedesc = "ERROR";
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt(" - Mode ＀ : ＀", [rt.sv(f, "mode"), live(modedesc)])]);
	if (truthy(rt.sv(f, "computer"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<font color=green>Computer has been associated with this unit.</font>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<font color=red>No associated computer found. Only local scans will function properly.</font>"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), "\n"]);
	return f.dot;
});
