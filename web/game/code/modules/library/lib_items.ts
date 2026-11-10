// Based on /tg/station's code/modules/library/lib_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// lib_items.dm:25
rt.def("/obj/structure/bookcase/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed_books = list(T("/obj/item/weapon/book"), T("/obj/item/weapon/spellbook"), T("/obj/item/weapon/storage/book"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 0]);
	return f.dot;
});

// lib_items.dm:29
rt.def("/obj/structure/bookcase/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let I: Value = null;
	parent_proc();
	if (!mapload) {
		return f.dot;
	}
	this.state = 2;
	this.icon_state = "book-0";
	this.anchored = 1;
	for (I of each(this.loc, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/book"))) {
			I.loc = this;
		}
	}
	this.update_icon();
	return f.dot;
}, false);

// lib_items.dm:42
rt.def("/obj/structure/bookcase/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null, B: Value = null, _T: Value = null, newname: Value = null;
	let $e: any;
	if (this.state === 0) {
		if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, I.usesound, 100, 1);
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You wrench the frame into place.</span>");
				this.anchored = 1;
				this.state = 1;
			}
		}
		if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			playsound(this.loc, I.usesound, 100, 1);
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You pry the frame apart.</span>");
				yield* this.deconstruct(1);
			}
		}
	} else if (this.state === 1) {
		if (rt.istype(I, T("/obj/item/stack/sheet/mineral/wood"))) {
			if ((W = I).get_amount() >= 2) {
				yield* W.use(2);
				to_chat(user, "<span class='notice'>You add a shelf.</span>");
				this.state = 2;
				this.icon_state = "book-0";
			}
		}
		if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, I.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You unwrench the frame.</span>");
			this.anchored = 0;
			this.state = 0;
		}
	} else if (this.state === 2) {
		if (is_type_in_list(I, this.allowed_books)) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			I.loc = this;
			yield* this.update_icon();
		} else if (rt.istype(I, T("/obj/item/weapon/storage/bag/books"))) {
			B = I;
			for (_T of each(B.contents, T("/obj/item"))) {
				if (rt.istype(_T, T("/obj/item/weapon/book")) || rt.istype(_T, T("/obj/item/weapon/spellbook"))) {
					yield* B.remove_from_storage(_T, this);
				}
			}
			to_chat(user, fmt("<span class='notice'>You empty ％！ into ％！.</span>", [I, this]));
			yield* this.update_icon();
		} else if (rt.istype(I, T("/obj/item/weapon/pen"))) {
			if (!(newname = (yield* stripped_input(user, "What would you like to title this bookshelf?")))) {
				return f.dot;
			} else {
				this.name = `bookcase (${sanitize(newname)})`;
			}
		} else if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			if (rt.len(f, this.contents)) {
				to_chat(user, "<span class='warning'>You need to remove the books first!</span>");
			} else {
				playsound(this.loc, I.usesound, 100, 1);
				to_chat(user, "<span class='notice'>You pry the shelf out.</span>");
				yield* new_(T("/obj/item/stack/sheet/mineral/wood"), this.loc, 2);
				this.state = 1;
				this.icon_state = "bookempty";
			}
		} else {
			return (yield* parent_proc());
		}
	}
	return f.dot;
}, true);

// lib_items.dm:103
rt.def("/obj/structure/bookcase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null;
	if (!rt.len(f, this.contents)) return f.dot;
	if (!(choice = (yield* g.op(f, "Prompt", [5], [null, null, null, "Which book would you like to remove from the shelf?", this.contents])))) return f.dot;
	if (!f.usr.canmove || f.usr.stat || f.usr.restrained() || !(get_dist(this.loc, f.usr) <= 1)) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (!user.get_active_held_item()) {
			yield* user.put_in_hands(choice);
		}
	} else {
		choice.loc = rt.getStep(f, this, 0);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// lib_items.dm:117
rt.def("/obj/structure/bookcase/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let B: Value = null;
	disassembled ??= 1;
	yield* new_(T("/obj/item/stack/sheet/mineral/wood"), this.loc, 4);
	for (B of each(this.contents, T("/obj/item/weapon/book"))) {
		yield* B.forceMove(rt.getStep(f, this, 0));
	}
	yield* qdel(this);
	return f.dot;
}, true);

// lib_items.dm:124
rt.def("/obj/structure/bookcase/proc/update_icon", function update_icon(f: Frame) {
	if (rt.len(f, this.contents) < 5) {
		this.icon_state = `book-${rt.len(f, this.contents)}`;
	} else {
		this.icon_state = "book-5";
	}
	return f.dot;
});

rt.type(12944, "/obj/structure/bookcase/manuals/medical", "/obj/structure/bookcase/manuals", {
	name: "medical manuals bookcase",
});

// lib_items.dm:134
rt.def("/obj/structure/bookcase/manuals/medical/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/book/manual/medical_cloning"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(12945, "/obj/structure/bookcase/manuals/engineering", "/obj/structure/bookcase/manuals", {
	name: "engineering manuals bookcase",
});

// lib_items.dm:143
rt.def("/obj/structure/bookcase/manuals/engineering/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/book/manual/wiki/engineering_construction"), this);
	yield* new_(T("/obj/item/weapon/book/manual/engineering_particle_accelerator"), this);
	yield* new_(T("/obj/item/weapon/book/manual/wiki/engineering_hacking"), this);
	yield* new_(T("/obj/item/weapon/book/manual/wiki/engineering_guide"), this);
	yield* new_(T("/obj/item/weapon/book/manual/engineering_singularity_safety"), this);
	yield* new_(T("/obj/item/weapon/book/manual/robotics_cyborgs"), this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(12946, "/obj/structure/bookcase/manuals/research_and_development", "/obj/structure/bookcase/manuals", {
	name: "１R&D manuals bookcase",
});

// lib_items.dm:157
rt.def("/obj/structure/bookcase/manuals/research_and_development/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/book/manual/research_and_development"), this);
	yield* this.update_icon();
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

// lib_items.dm:182
rt.def("/obj/item/weapon/book/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (is_blind(user)) {
		to_chat(user, "<span class='warning'>As you are trying to read, you suddenly feel very stupid!</span>");
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/carbon/monkey"))) {
		to_chat(user, "<span class='notice'>You skim through the book but can't comprehend any of it.</span>");
		return f.dot;
	}
	if (this.dat) {
		rt.op(f, "Browse", [], [user, `<TT><I>Penned by ${this.author}.</I></TT> <BR>` + `${this.dat}`, `window=book${this.window_size !== null ? `;size=${this.window_size}` : ""}`], false);
		user.visible_message(`${user} opens a book titled "${this.title}" and begins reading intently.`);
		onclose(user, "book");
	} else {
		to_chat(user, "<span class='notice'>This book is completely blank!</span>");
	}
	return f.dot;
});

// lib_items.dm:197
rt.def("/obj/item/weapon/book/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let choice: Value = null, newtitle: Value = null, content: Value = null, newauthor: Value = null, scanner: Value = null, b: Value = null, book: Value = null, B: Value = null;
	let $e: any;
	if (rt.istype(I, T("/obj/item/weapon/pen"))) {
		if (is_blind(user)) {
			to_chat(user, "<span class='warning'> As you are trying to write on the book, you suddenly feel very stupid!</span>");
			return f.dot;
		}
		if (this.unique) {
			to_chat(user, "<span class='warning'>These pages don't seem to take the ink well! Looks like you can't modify it.</span>");
			return f.dot;
		}
		const subject = (choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "What would you like to change?", list("Title", "Contents", "Author", "Cancel")])));
		if (subject === "Title") {
			if (rt.length((newtitle = reject_bad_text((yield* stripped_input(f.usr, "Write a new title:"))))) > 20) {
				to_chat(f.usr, "That title won't fit on the cover!");
				return f.dot;
			}
			if (!newtitle) {
				to_chat(f.usr, "That title is invalid.");
				return f.dot;
			} else {
				this.name = newtitle;
				this.title = newtitle;
			}
		} else if (subject === "Contents") {
			if (!(content = (yield* stripped_input(f.usr, "Write your book's contents (HTML NOT allowed):", "", "", 8192)))) {
				to_chat(f.usr, "The content is invalid.");
				return f.dot;
			} else {
				this.dat += content;
			}
		} else if (subject === "Author") {
			if (!(newauthor = (yield* stripped_input(f.usr, "Write the author's name:")))) {
				to_chat(f.usr, "The name is invalid.");
				return f.dot;
			} else {
				this.author = newauthor;
			}
		} else {
			return f.dot;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/barcodescanner"))) {
		if (!(scanner = I).computer) {
			to_chat(user, `${I}'s screen flashes: 'No associated computer found!'`);
		} else if (scanner.mode === 0) {
			scanner.book = this;
			to_chat(user, `${I}'s screen flashes: 'Book stored in buffer.'`);
		} else if (scanner.mode === 1) {
			scanner.book = this;
			scanner.computer.buffer_book = this.name;
			to_chat(user, `${I}'s screen flashes: 'Book stored in buffer. Book title stored in associated computer buffer.'`);
		} else if (scanner.mode === 2) {
			scanner.book = this;
			for (b of each(scanner.computer.checkouts, T("/datum/borrowbook"))) {
				if (b.bookname == this.name) {
					yield* scanner.computer.checkouts.Remove(b);
					to_chat(user, `${I}'s screen flashes: 'Book stored in buffer. Book has been checked in.'`);
					return f.dot;
				}
			}
			to_chat(user, `${I}'s screen flashes: 'Book stored in buffer. No active check-out record found for current title.'`);
		} else if (scanner.mode === 3) {
			scanner.book = this;
			for (book of each(scanner.computer.inventory, T("/obj/item/weapon"))) {
				if (book == this) {
					to_chat(user, `${I}'s screen flashes: 'Book stored in buffer. Title already present in inventory, aborting to avoid duplicate entry.'`);
					return f.dot;
				}
			}
			scanner.computer.inventory.Add(this);
			to_chat(user, `${I}'s screen flashes: 'Book stored in buffer. Title added to general inventory.'`);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/kitchen/knife")) || rt.istype(I, T("/obj/item/weapon/wirecutters"))) {
		to_chat(user, `<span class='notice'>You begin to carve out ${this.title}...</span>`);
		if (yield* do_after(user, 30, { target: this })) {
			to_chat(user, `<span class='notice'>You carve out the pages from ${this.title}! You didn't want to read it anyway.</span>`);
			(B = (yield* new_(T("/obj/item/weapon/storage/book")))).name = this.name;
			B.title = this.title;
			B.icon_state = this.icon_state;
			if (user.is_holding(this)) {
				yield* qdel(this);
				yield* user.put_in_hands(B);
				return f.dot;
			} else {
				B.loc = this.loc;
				yield* qdel(this);
				return f.dot;
			}
		}
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

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

// lib_items.dm:300
rt.def("/obj/item/weapon/barcodescanner/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let modedesc: Value = null;
	if ((this.mode += 1) > 3) {
		this.mode = 0;
	}
	to_chat(user, `${this} Status Display:`);
	if (this.mode === 0) {
		modedesc = "Scan book to local buffer.";
	} else if (this.mode === 1) {
		modedesc = "Scan book to local buffer and set associated computer buffer to match.";
	} else if (this.mode === 2) {
		modedesc = "Scan book to local buffer, attempt to check in scanned book.";
	} else if (this.mode === 3) {
		modedesc = "Scan book to local buffer, attempt to add book to general inventory.";
	} else {
		modedesc = "ERROR";
	}
	to_chat(user, ` - Mode ${this.mode} : ${modedesc}`);
	if (this.computer) {
		to_chat(user, "<font color=green>Computer has been associated with this unit.</font>");
	} else {
		to_chat(user, "<font color=red>No associated computer found. Only local scans will function properly.</font>");
	}
	to_chat(user, "\n");
	return f.dot;
});
