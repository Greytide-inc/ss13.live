// Based on /tg/station's code/modules/library/lib_machines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10422, "/obj/machinery/computer/libraryconsole", "/obj/machinery/computer", {
	icon_screen: "library",
	icon_keyboard: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/libraryconsole"),
	clockwork: 1,
	name: "library visitor console",
	icon_state: "oldcomp",
});

// lib_machines.dm:31
rt.def("/obj/machinery/computer/libraryconsole/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// lib_machines.dm:36
rt.def("/obj/machinery/computer/libraryconsole/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	yield* user.set_machine(this);
	let dat: Value = "<font color=red><b>ERROR</b>: Unable to contact External Archive. Please contact your system administrator for assistance.</font><BR>";
	(popup = (yield* new_(T("/datum/browser"), user, "publiclibrary", this.name, 600, 400))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

rt.type(10423, "/obj/machinery/computer/libraryconsole/bookmanagement", "/obj/machinery/computer/libraryconsole", {
	arcanecheckout: 0,
	buffer_book: null,
	buffer_mob: null,
	checkouts: null,
	inventory: null,
	checkoutperiod: 5,
	scanner: null,
	cooldown: 0,
	screenstate: 0,
	verb_say: "beeps",
	verb_ask: "beeps",
	verb_exclaim: "beeps",
	name: "book inventory management console",
});

// lib_machines.dm:172
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.checkouts = list();

	this.inventory = list();
	return f.dot;
});

// lib_machines.dm:197
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!this.circuit) return f.dot;
	this.circuit.name = "Book Inventory Management Console (Machine Board)";
	this.circuit.build_path = T("/obj/machinery/computer/libraryconsole/bookmanagement");
	return f.dot;
}, true);

// lib_machines.dm:203
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/interact", function* interact(f: Frame, user: Value) {
	let b: Value = null, timetaken: Value = null, timedue: Value = null, popup: Value = null;
	let $e: any;
	yield* user.set_machine(this);
	let dat: Value = "";
	if (this.screenstate === 0) {
		dat += fmt("<A href='?src=＃;switchscreen=1'>1. View General Inventory</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=2'>2. View Checked Out Inventory</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=3'>3. Check out a Book</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=6'>6. Upload Scanned Title to Newscaster</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=7'>7. Print Corporate Materials</A><BR>", [this]);
		if (this.emagged) {
			dat += fmt("<A href='?src=＃;switchscreen=8'>8. Access the Forbidden Lore Vault</A><BR>", [this]);
		}
		if (this.arcanecheckout) {
			yield* this.print_forbidden_lore(user);
			this.arcanecheckout = 0;
		}
	} else if (this.screenstate === 1) {
		dat += "<H3>Inventory</H3><BR>";
		for (b of each(this.inventory, T("/obj/item/weapon/book"))) {
			dat += fmt("＀ <A href='?src=＃;delbook=＃'>(Delete)</A><BR>", [b.name, this, b]);
		}
		dat += fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [this]);
	} else if (this.screenstate === 2) {
		dat += "<h3>Checked Out Books</h3><BR>";
		b = null;
		for (b of each(this.checkouts, T("/datum/borrowbook"))) {
			timetaken = rt.worldTime(f) - b.getdate;
			timetaken /= 600;
			timetaken = round(timetaken);
			timedue = b.duedate - rt.worldTime(f);
			timedue /= 600;
			if (timedue <= 0) {
				timedue = `<font color=red><b>(OVERDUE)</b> ${timedue}</font>`;
			} else {
				timedue = round(timedue);
			}
			dat += `"${b.bookname}", Checked out to: ${b.mobname}<BR>--- Taken: ${timetaken} minutes ago, Due: in ${timedue} minutes<BR>`;
			dat += fmt("<A href='?src=＃;checkin=＃'>(Check In)</A><BR><BR>", [this, b]);
		}
		dat += fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [this]);
	} else if (this.screenstate === 3) {
		dat += "<h3>Check Out a Book</h3><BR>";
		dat += `Book: ${this.buffer_book} `;
		dat += fmt("<A href='?src=＃;editbook=1'>[Edit]</A><BR>", [this]);
		dat += `Recipient: ${this.buffer_mob} `;
		dat += fmt("<A href='?src=＃;editmob=1'>[Edit]</A><BR>", [this]);
		dat += `Checkout Date : ${rt.worldTime(f) / 600}<BR>`;
		dat += `Due Date: ${(rt.worldTime(f) + this.checkoutperiod) / 600}<BR>`;
		dat += fmt("(Checkout Period: ＀ minutes) (<A href='?src=＃;increasetime=1'>+</A>/<A href='?src=＃;decreasetime=1'>-</A>)", [this.checkoutperiod, this, this]);
		dat += fmt("<A href='?src=＃;checkout=1'>(Commit Entry)</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [this]);
	} else if (this.screenstate === 6) {
		dat += "<h3>Post Title to Newscaster</h3>";
		if (!this.scanner) {
			this.scanner = this.findscanner(9);
		}
		if (!this.scanner) {
			dat += "<FONT color=red>No scanner found within wireless network range.</FONT><BR>";
		} else if (!this.scanner.cache) {
			dat += "<FONT color=red>No data found in scanner memory.</FONT><BR>";
		} else {
			dat += `<TT>Post ${this.scanner.cache.name} to station newscasters?</TT>`;
			dat += fmt("<A href='?src=＃;newspost=1'>[Post]</A><BR>", [this]);
		}
		dat += fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [this]);
	} else if (this.screenstate === 7) {
		dat += "<h3>NTGanda(tm) Universal Printing Module</h3>";
		dat += "What would you like to print?<BR>";
		dat += fmt("<A href='?src=＃;printbible=1'>[Bible]</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;printposter=1'>[Poster]</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [this]);
	} else if (this.screenstate === 8) {
		dat += "<h3>Accessing Forbidden Lore Vault v 1.3</h3>";
		dat += "Are you absolutely sure you want to proceed? EldritchTomes Inc. takes no responsibilities for loss of sanity resulting from this action.<p>";
		dat += fmt("<A href='?src=＃;arccheckout=1'>Yes.</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;switchscreen=0'>No.</A><BR>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "library", this.name, 600, 400))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// lib_machines.dm:317
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/findscanner", function findscanner(f: Frame, viewrange: Value) {
	let S: Value = null;
	for (S of each(range(viewrange, rt.getStep(f, this, 0)), T("/obj/machinery/libraryscanner"))) {
		return S;
	}
	return null;
});

// lib_machines.dm:322
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/print_forbidden_lore", function* print_forbidden_lore(f: Frame, user: Value) {
	let $1: any, $2: any;
	let spook: Value = pick("blood", "brass");
	let _T: Value = rt.getStep(f, this, 0);
	if (spook == "blood") {
		yield* new_(T("/obj/item/weapon/tome"), _T);
	} else {
		yield* new_(T("/obj/item/clockwork/slab"), _T);
	}
	let $0: any = user;
	if (spook == "blood") {
		$1 = "dusty old tome";
	} else {
		$1 = "strange metal tablet";
	}
	if (spook == "brass") {
		$2 = " And how did it print something made of metal?";
	} else {
		$2 = "";
	}
	to_chat($0, `<span class='warning'>Your sanity barely endures the seconds spent in the vault's browsing window. The only thing to remind you of this when you stop browsing is a ${$1} sitting on the desk. You don't really remember printing it.${$2}</span>`);
	user.visible_message(`${user} stares at the blank screen for a few moments, ${user.p_their()} expression frozen in fear. When ${user.p_they()} finally awaken${user.p_s()} from it, ${user.p_they()} look${user.p_s()} a lot older.`, 2);
	return f.dot;
}, true);

// lib_machines.dm:333
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let scanner: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/barcodescanner"))) {
		(scanner = W).computer = this;
		to_chat(user, `${scanner}'s associated machine has been set to ${this}.`);
		this.audible_message(`${this} lets out a low, short blip.`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// lib_machines.dm:342
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!(this.density && !this.emagged)) return f.dot;
	this.emagged = 1;
	return f.dot;
});

// lib_machines.dm:346
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let b: Value = null, channelexists: Value = null, FC: Value = null, B: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		rt.op(f, "Browse", [], [f.usr, null, "window=library"], false);
		onclose(f.usr, "library");
		return f.dot;
	}
	if (rt.at(href_list, "switchscreen")) {
		const item = rt.at(href_list, "switchscreen");
		if (item === "0") {
			this.screenstate = 0;
		} else if (item === "1") {
			this.screenstate = 1;
		} else if (item === "2") {
			this.screenstate = 2;
		} else if (item === "3") {
			this.screenstate = 3;
		} else if (item === "6") {
			this.screenstate = 6;
		} else if (item === "7") {
			this.screenstate = 7;
		} else if (item === "8") {
			this.screenstate = 8;
		}
	}
	if (rt.at(href_list, "arccheckout")) {
		if (this.emagged) {
			this.arcanecheckout = 1;
		}
		this.screenstate = 0;
	}
	if (rt.at(href_list, "increasetime")) {
		this.checkoutperiod += 1;
	}
	if (rt.at(href_list, "decreasetime")) {
		this.checkoutperiod -= 1;
		if (this.checkoutperiod < 1) {
			this.checkoutperiod = 1;
		}
	}
	if (rt.at(href_list, "editbook")) {
		this.buffer_book = copytext(sanitize((yield* g.op(f, "Prompt", [3], [null, null, null, "Enter the book's title:", null]))), 1, 1024);
	}
	if (rt.at(href_list, "editmob")) {
		this.buffer_mob = copytext(sanitize((yield* g.op(f, "Prompt", [3], [null, null, null, "Enter the recipient's name:", null]))), 1, 42);
	}
	if (rt.at(href_list, "checkout")) {
		(b = (yield* new_(T("/datum/borrowbook")))).bookname = sanitize(this.buffer_book);
		b.mobname = sanitize(this.buffer_mob);
		b.getdate = rt.worldTime(f);
		b.duedate = rt.worldTime(f) + this.checkoutperiod * 600;
		this.checkouts.Add(b);
	}
	if (rt.at(href_list, "checkin")) {
		if ((b = rt.locateIn(f, rt.at(href_list, "checkin"), this.checkouts)) && rt.istype(b, T("/datum/borrowbook"))) {
			yield* this.checkouts.Remove(b);
		}
	}
	if (rt.at(href_list, "delbook")) {
		if ((b = rt.locateIn(f, rt.at(href_list, "delbook"), this.inventory)) && rt.istype(b, T("/obj/item/weapon/book"))) {
			yield* this.inventory.Remove(b);
		}
	}
	if (rt.at(href_list, "newspost")) {
		if (!GLOB.news_network) {
			yield* alert("No news network found on station. Aborting.");
		}
		channelexists = 0;
		for (FC of each(GLOB.news_network.network_channels, T("/datum/newscaster/feed_channel"))) {
			if (FC.channel_name == "Nanotrasen Book Club") {
				channelexists = 1;
				break;
			}
		}
		if (!channelexists) {
			GLOB.news_network.CreateFeedChannel("Nanotrasen Book Club", "Library", null);
		}
		yield* GLOB.news_network.SubmitArticle(this.scanner.cache.dat, `${this.scanner.cache.name}`, "Nanotrasen Book Club", null);
		yield* alert("Upload complete. Your uploaded title is now available on station newscasters.");
	}
	if (rt.at(href_list, "printbible")) {
		if (this.cooldown < rt.worldTime(f)) {
			B = (yield* new_(T("/obj/item/weapon/storage/book/bible"), this.loc));
			if (GLOB.SSreligion.bible_icon_state && GLOB.SSreligion.bible_item_state) {
				B.icon_state = GLOB.SSreligion.bible_icon_state;
				B.item_state = GLOB.SSreligion.bible_item_state;
				B.name = GLOB.SSreligion.bible_name;
				B.deity_name = GLOB.SSreligion.deity;
			}
			this.cooldown = rt.worldTime(f) + 60;
		} else {
			yield* this.say("Printer currently unavailable, please wait a moment.");
		}
	}
	if (rt.at(href_list, "printposter")) {
		if (this.cooldown < rt.worldTime(f)) {
			yield* new_(T("/obj/item/weapon/poster/random_official"), this.loc);
			this.cooldown = rt.worldTime(f) + 60;
		} else {
			yield* this.say("Printer currently unavailable, please wait a moment.");
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(10924, "/obj/machinery/libraryscanner", "/obj/machinery", {
	cache: null,
	anchored: 1,
	name: "scanner control interface",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "bigscanner",
	density: 1,
});

// lib_machines.dm:506
rt.def("/obj/machinery/libraryscanner/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/book"))) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		O.loc = this;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// lib_machines.dm:514
rt.def("/obj/machinery/libraryscanner/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	yield* f.usr.set_machine(this);
	let dat: Value = "";
	if (this.cache) {
		dat += "<FONT color=#005500>Data stored in memory.</FONT><BR>";
	} else {
		dat += "No data stored in memory.<BR>";
	}
	dat += fmt("<A href='?src=＃;scan=1'>[Scan]</A>", [this]);
	if (this.cache) {
		dat += fmt("       <A href='?src=＃;clear=1'>[Clear Memory]</A><BR><BR><A href='?src=＃;eject=1'>[Remove Book]</A>", [this, this]);
	} else {
		dat += "<BR>";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "scanner", this.name, 600, 400))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// lib_machines.dm:531
rt.def("/obj/machinery/libraryscanner/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let B: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		rt.op(f, "Browse", [], [f.usr, null, "window=scanner"], false);
		onclose(f.usr, "scanner");
		return f.dot;
	}
	if (rt.at(href_list, "scan")) {
		rt.forList(f, 0, this.contents, T("/obj/item/weapon/book"));
		if (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			this.cache = B;
		}
		rt.endFor(f, 0);
	}
	if (rt.at(href_list, "clear")) {
		this.cache = null;
	}
	if (rt.at(href_list, "eject")) {
		B = null;
		for (B of each(this.contents, T("/obj/item/weapon/book"))) {
			B.loc = this.loc;
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(10925, "/obj/machinery/bookbinder", "/obj/machinery", {
	busy: 0,
	anchored: 1,
	name: "book binder",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "binder",
	density: 1,
});

// lib_machines.dm:562
rt.def("/obj/machinery/bookbinder/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/paper"))) {
		yield* this.bind_book(user, O);
	} else if (yield* this.default_unfasten_wrench(user, O)) {
		return 1;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// lib_machines.dm:573
rt.def("/obj/machinery/bookbinder/proc/bind_book", function* bind_book(f: Frame, user: Value, _P: Value) {
	let B: Value = null;
	if (this.stat) {
		return f.dot;
	}
	if (this.busy) {
		to_chat(user, "<span class='warning'>The book binder is busy. Please wait for completion of previous operation.</span>");
		return f.dot;
	}
	if (!(yield* user.drop_item())) {
		return f.dot;
	}
	_P.loc = this;
	user.visible_message(`${user} loads some paper into ${this}.`, `You load some paper into ${this}.`);
	this.audible_message(`${this} begins to hum as it warms up its printing drums.`);
	this.busy = 1;
	yield* sleep(rand(200, 400));
	this.busy = 0;
	if (!_P) return f.dot;
	if (!this.stat) {
		this.visible_message(`${this} whirs as it prints and binds a new book.`);
		(B = (yield* new_(T("/obj/item/weapon/book"), this.loc))).dat = _P.info;
		B.name = "Print Job #" + `${rand(100, 999)}`;
		B.icon_state = `book${rand(1, 7)}`;
		yield* qdel(_P);
	} else {
		_P.loc = this.loc;
	}
	return f.dot;
}, true);
