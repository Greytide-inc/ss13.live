// From code/modules/library/lib_machines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10422, "/obj/machinery/computer/libraryconsole", "/obj/machinery/computer", {
	icon_screen: "library",
	icon_keyboard: null,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/libraryconsole"),
	clockwork: 1,
	name: "library visitor console",
	icon_state: "oldcomp",
});

// /obj/machinery/computer/libraryconsole/proc/attack_hand  (code/modules/library/lib_machines.dm:31)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/libraryconsole/proc/interact  (code/modules/library/lib_machines.dm:36)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [user, dat, popup];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<font color=red><b>ERROR</b>: Unable to contact External Archive. Please contact your system administrator for assistance.</font><BR>";
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "publiclibrary", rt.sv(f, "name"), 600, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
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

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/<init>  (code/modules/library/lib_machines.dm:172)
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "checkouts", rt.list());
	$0 = $0;
	rt.setSv(f, "inventory", rt.list());
	return f.dot;
});

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/New  (code/modules/library/lib_machines.dm:197)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "circuit"))) return f.dot;
	rt.setFv(f, "name", rt.sv(f, "circuit"), "Book Inventory Management Console (Machine Board)");
	rt.setFv(f, "build_path", rt.sv(f, "circuit"), T("/obj/machinery/computer/libraryconsole/bookmanagement"));
	return f.dot;
}, true);

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/interact  (code/modules/library/lib_machines.dm:203)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, b: Value = null, timetaken: Value = null, timedue: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, dat, b, timetaken, timedue, popup, $0, $e];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "";
	$0 = rt.sv(f, "screenstate");
	if ($0 === 0) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=1'>1. View General Inventory</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=2'>2. View Checked Out Inventory</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=3'>3. Check out a Book</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=6'>6. Upload Scanned Title to Newscaster</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=7'>7. Print Corporate Materials</A><BR>", [live(f.src)]), add);
		if (truthy(rt.fv(f, "emagged", live(f.src)))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=8'>8. Access the Forbidden Lore Vault</A><BR>", [live(f.src)]), add);
		}
		if (truthy(rt.fv(f, "arcanecheckout", live(f.src)))) {
			yield* g.srcCall(f, "print_forbidden_lore", live(user));
			rt.setFv(f, "arcanecheckout", live(f.src), 0);
		}
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), "<H3>Inventory</H3><BR>", add);
		b = null;
		rt.forList(f, 0, rt.sv(f, "inventory"), T("/obj/item/weapon/book"));
		while (($e = rt.next(f, 0)) !== undefined) {
			b = $e;
			dat = rt.modify(live(dat), fmt("＀ <A href='?src=＃;delbook=＃'>(Delete)</A><BR>", [rt.fv(f, "name", live(b)), live(f.src), live(b)]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [live(f.src)]), add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), "<h3>Checked Out Books</h3><BR>", add);
		b = null;
		rt.forList(f, 0, rt.sv(f, "checkouts"), T("/datum/borrowbook"));
		while (($e = rt.next(f, 0)) !== undefined) {
			b = $e;
			timetaken = subtract(rt.worldTime(f), rt.fv(f, "getdate", live(b)));
			(timetaken = rt.modify(live(timetaken), 600, divide));
			timetaken = (yield* g.call(f, P("/proc/round"), null, [live(timetaken)]));
			timedue = subtract(rt.fv(f, "duedate", live(b)), rt.worldTime(f));
			(timedue = rt.modify(live(timedue), 600, divide));
			if (rt.le(live(timedue), 0)) {
				timedue = fmt("<font color=red><b>(OVERDUE)</b> ＀</font>", [live(timedue)]);
			} else {
				timedue = (yield* g.call(f, P("/proc/round"), null, [live(timedue)]));
			}
			dat = rt.modify(live(dat), fmt("\"＀\", Checked out to: ＀<BR>--- Taken: ＀ minutes ago, Due: in ＀ minutes<BR>", [rt.fv(f, "bookname", live(b)), rt.fv(f, "mobname", live(b)), live(timetaken), live(timedue)]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;checkin=＃'>(Check In)</A><BR><BR>", [live(f.src), live(b)]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [live(f.src)]), add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), "<h3>Check Out a Book</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("Book: ＀ ", [rt.fv(f, "buffer_book", live(f.src))]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;editbook=1'>[Edit]</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("Recipient: ＀ ", [rt.fv(f, "buffer_mob", live(f.src))]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;editmob=1'>[Edit]</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("Checkout Date : ＀<BR>", [divide(rt.worldTime(f), 600)]), add);
		dat = rt.modify(live(dat), fmt("Due Date: ＀<BR>", [divide(add(rt.worldTime(f), rt.sv(f, "checkoutperiod")), 600)]), add);
		dat = rt.modify(live(dat), fmt("(Checkout Period: ＀ minutes) (<A href='?src=＃;increasetime=1'>+</A>/<A href='?src=＃;decreasetime=1'>-</A>)", [rt.sv(f, "checkoutperiod"), live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;checkout=1'>(Commit Entry)</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [live(f.src)]), add);
	} else if ($0 === 6) {
		dat = rt.modify(live(dat), "<h3>Post Title to Newscaster</h3>", add);
		if (!truthy(rt.sv(f, "scanner"))) {
			rt.setSv(f, "scanner", (yield* g.srcCall(f, "findscanner", 9)));
		}
		if (!truthy(rt.sv(f, "scanner"))) {
			dat = rt.modify(live(dat), "<FONT color=red>No scanner found within wireless network range.</FONT><BR>", add);
		} else {
			if (!truthy(rt.fv(f, "cache", rt.sv(f, "scanner")))) {
				dat = rt.modify(live(dat), "<FONT color=red>No data found in scanner memory.</FONT><BR>", add);
			} else {
				dat = rt.modify(live(dat), fmt("<TT>Post ＀ to station newscasters?</TT>", [rt.gv(f, "name", rt.fv(f, "cache", rt.sv(f, "scanner")))]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;newspost=1'>[Post]</A><BR>", [live(f.src)]), add);
			}
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [live(f.src)]), add);
	} else if ($0 === 7) {
		dat = rt.modify(live(dat), "<h3>NTGanda(tm) Universal Printing Module</h3>", add);
		dat = rt.modify(live(dat), "What would you like to print?<BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;printbible=1'>[Bible]</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;printposter=1'>[Poster]</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=0'>(Return to main menu)</A><BR>", [live(f.src)]), add);
	} else if ($0 === 8) {
		dat = rt.modify(live(dat), "<h3>Accessing Forbidden Lore Vault v 1.3</h3>", add);
		dat = rt.modify(live(dat), "Are you absolutely sure you want to proceed? EldritchTomes Inc. takes no responsibilities for loss of sanity resulting from this action.<p>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;arccheckout=1'>Yes.</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;switchscreen=0'>No.</A><BR>", [live(f.src)]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "library", rt.sv(f, "name"), 600, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/findscanner  (code/modules/library/lib_machines.dm:317)
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/findscanner", function findscanner(f: Frame, viewrange: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	S = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [live(viewrange), rt.getStep(f, live(f.src), 0)]), T("/obj/machinery/libraryscanner"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		return live(S);
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/print_forbidden_lore  (code/modules/library/lib_machines.dm:322)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/print_forbidden_lore", function* print_forbidden_lore(f: Frame, user: Value) {
	let spook: Value = null, _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, spook, _T, $0, $1, $2];
	spook = rt.op(f, "PickUnweighted", [2], ["blood", "brass"]);
	_T = rt.getStep(f, live(f.src), 0);
	if (isEqual(live(spook), "blood")) {
		yield* g.new_(f, T("/obj/item/weapon/tome"), [live(_T)]);
	} else {
		yield* g.new_(f, T("/obj/item/clockwork/slab"), [live(_T)]);
	}
	$0 = live(user);
	if (isEqual(live(spook), "blood")) {
		$1 = "dusty old tome";
	} else {
		$1 = "strange metal tablet";
	}
	if (isEqual(live(spook), "brass")) {
		$2 = " And how did it print something made of metal?";
	} else {
		$2 = "";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>Your sanity barely endures the seconds spent in the vault's browsing window. The only thing to remind you of this when you stop browsing is a ＀ sitting on the desk. You don't really remember printing it.＀</span>", [$1, $2])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ stares at the blank screen for a few moments, ＀ expression frozen in fear. When ＀ finally awaken＀ from it, ＀ look＀ a lot older.", [live(user), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_they", [])), (yield* g.callName(f, live(user), "p_s", [])), (yield* g.callName(f, live(user), "p_they", [])), (yield* g.callName(f, live(user), "p_s", []))]), 2]);
	return f.dot;
}, true);

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/attackby  (code/modules/library/lib_machines.dm:333)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/attackby", function* attackby(f: Frame) {
	let scanner: Value = null;
	f.vars = () => [scanner];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/barcodescanner")) ? 1 : 0))) {
		rt.setFv(f, "computer", (scanner = live(f.args[0])), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀'s associated machine has been set to ＀.", [live(scanner), live(f.src)])]);
		yield* g.srcCall(f, "audible_message", fmt("＀ lets out a low, short blip.", [live(f.src)]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/emag_act  (code/modules/library/lib_machines.dm:342)
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!(truthy(rt.sv(f, "density")) && !truthy(rt.sv(f, "emagged")))) return f.dot;
	rt.setSv(f, "emagged", 1);
	return f.dot;
});

// /obj/machinery/computer/libraryconsole/bookmanagement/proc/Topic  (code/modules/library/lib_machines.dm:346)  may sleep
rt.def("/obj/machinery/computer/libraryconsole/bookmanagement/proc/Topic", function* Topic(f: Frame) {
	let b: Value = null, channelexists: Value = null, FC: Value = null, B_0: Value = null;
	let $0: any, $e: any;
	f.vars = () => [b, channelexists, FC, B_0, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=library"], false);
		yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "library"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "switchscreen"))) {
		$0 = rt.at(live(f.args[1]), "switchscreen");
		if ($0 === "0") {
			rt.setSv(f, "screenstate", 0);
		} else if ($0 === "1") {
			rt.setSv(f, "screenstate", 1);
		} else if ($0 === "2") {
			rt.setSv(f, "screenstate", 2);
		} else if ($0 === "3") {
			rt.setSv(f, "screenstate", 3);
		} else if ($0 === "6") {
			rt.setSv(f, "screenstate", 6);
		} else if ($0 === "7") {
			rt.setSv(f, "screenstate", 7);
		} else if ($0 === "8") {
			rt.setSv(f, "screenstate", 8);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "arccheckout"))) {
		if (truthy(rt.fv(f, "emagged", live(f.src)))) {
			rt.setFv(f, "arcanecheckout", live(f.src), 1);
		}
		rt.setFv(f, "screenstate", live(f.src), 0);
	}
	if (truthy(rt.at(live(f.args[1]), "increasetime"))) {
		rt.modSrcVar(f, "checkoutperiod", 1, add);
	}
	if (truthy(rt.at(live(f.args[1]), "decreasetime"))) {
		(rt.modSrcVar(f, "checkoutperiod", 1, subtract));
		if (rt.lt(rt.sv(f, "checkoutperiod"), 1)) {
			rt.setSv(f, "checkoutperiod", 1);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "editbook"))) {
		rt.setSv(f, "buffer_book", (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, null, null, "Enter the book's title:", null]))])), 1, 1024])));
	}
	if (truthy(rt.at(live(f.args[1]), "editmob"))) {
		rt.setSv(f, "buffer_mob", (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, null, null, "Enter the recipient's name:", null]))])), 1, 42])));
	}
	if (truthy(rt.at(live(f.args[1]), "checkout"))) {
		rt.setFv(f, "bookname", (b = (yield* g.new_(f, T("/datum/borrowbook"), []))), (yield* g.call(f, P("/proc/sanitize"), null, [rt.sv(f, "buffer_book")])));
		rt.setFv(f, "mobname", live(b), (yield* g.call(f, P("/proc/sanitize"), null, [rt.sv(f, "buffer_mob")])));
		rt.setFv(f, "getdate", live(b), rt.worldTime(f));
		rt.setFv(f, "duedate", live(b), add(rt.worldTime(f), multiply(rt.sv(f, "checkoutperiod"), 600)));
		yield* g.callName(f, rt.sv(f, "checkouts"), "Add", [live(b)]);
	}
	if (truthy(rt.at(live(f.args[1]), "checkin"))) {
		if ((truthy((b = rt.locateIn(f, rt.at(live(f.args[1]), "checkin"), rt.sv(f, "checkouts")))) && truthy((rt.istype(live(b), T("/datum/borrowbook")) ? 1 : 0)))) {
			yield* g.callName(f, rt.sv(f, "checkouts"), "Remove", [live(b)]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "delbook"))) {
		if ((truthy((b = rt.locateIn(f, rt.at(live(f.args[1]), "delbook"), rt.sv(f, "inventory")))) && truthy((rt.istype(live(b), T("/obj/item/weapon/book")) ? 1 : 0)))) {
			yield* g.callName(f, rt.sv(f, "inventory"), "Remove", [live(b)]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "newspost"))) {
		if (!truthy(rt.gl("news_network"))) {
			yield* g.call(f, P("/proc/alert"), null, ["No news network found on station. Aborting."]);
		}
		channelexists = 0;
		FC = null;
		rt.forList(f, 0, rt.fv(f, "network_channels", rt.gl("news_network")), T("/datum/newscaster/feed_channel"));
		while (($e = rt.next(f, 0)) !== undefined) {
			FC = $e;
			if (isEqual(rt.fv(f, "channel_name", live(FC)), "Nanotrasen Book Club")) {
				channelexists = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(channelexists))) {
			yield* g.callName(f, rt.gl("news_network"), "CreateFeedChannel", ["Nanotrasen Book Club", "Library", null]);
		}
		yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [rt.gv(f, "dat", rt.fv(f, "cache", rt.sv(f, "scanner"))), fmt("＀", [rt.gv(f, "name", rt.fv(f, "cache", rt.sv(f, "scanner")))]), "Nanotrasen Book Club", null]);
		yield* g.call(f, P("/proc/alert"), null, ["Upload complete. Your uploaded title is now available on station newscasters."]);
	}
	if (truthy(rt.at(live(f.args[1]), "printbible"))) {
		if (rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
			B_0 = (yield* g.new_(f, T("/obj/item/weapon/storage/book/bible"), [rt.fv(f, "loc", live(f.src))]));
			if ((truthy(rt.fv(f, "bible_icon_state", rt.gl("SSreligion"))) && truthy(rt.fv(f, "bible_item_state", rt.gl("SSreligion"))))) {
				rt.setFv(f, "icon_state", live(B_0), rt.fv(f, "bible_icon_state", rt.gl("SSreligion")));
				rt.setFv(f, "item_state", live(B_0), rt.fv(f, "bible_item_state", rt.gl("SSreligion")));
				rt.setFv(f, "name", live(B_0), rt.fv(f, "bible_name", rt.gl("SSreligion")));
				rt.setFv(f, "deity_name", live(B_0), rt.fv(f, "deity", rt.gl("SSreligion")));
			}
			rt.setSv(f, "cooldown", add(rt.worldTime(f), 60));
		} else {
			yield* g.srcCall(f, "say", "Printer currently unavailable, please wait a moment.");
		}
	}
	if (truthy(rt.at(live(f.args[1]), "printposter"))) {
		if (rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
			yield* g.new_(f, T("/obj/item/weapon/poster/random_official"), [rt.fv(f, "loc", live(f.src))]);
			rt.setSv(f, "cooldown", add(rt.worldTime(f), 60));
		} else {
			yield* g.srcCall(f, "say", "Printer currently unavailable, please wait a moment.");
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(10924, "/obj/machinery/libraryscanner", "/obj/machinery", {
	cache: null,
	anchored: 1,
	name: "scanner control interface",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "bigscanner",
	density: 1,
});

// /obj/machinery/libraryscanner/proc/attackby  (code/modules/library/lib_machines.dm:506)  may sleep
rt.def("/obj/machinery/libraryscanner/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/book")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/libraryscanner/proc/attack_hand  (code/modules/library/lib_machines.dm:514)  may sleep
rt.def("/obj/machinery/libraryscanner/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [user, dat, popup];
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	dat = "";
	if (truthy(rt.sv(f, "cache"))) {
		dat = rt.modify(live(dat), "<FONT color=#005500>Data stored in memory.</FONT><BR>", add);
	} else {
		dat = rt.modify(live(dat), "No data stored in memory.<BR>", add);
	}
	dat = rt.modify(live(dat), fmt("<A href='?src=＃;scan=1'>[Scan]</A>", [live(f.src)]), add);
	if (truthy(rt.sv(f, "cache"))) {
		dat = rt.modify(live(dat), fmt("       <A href='?src=＃;clear=1'>[Clear Memory]</A><BR><BR><A href='?src=＃;eject=1'>[Remove Book]</A>", [live(f.src), live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "<BR>", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "scanner", rt.sv(f, "name"), 600, 400]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/libraryscanner/proc/Topic  (code/modules/library/lib_machines.dm:531)  may sleep
rt.def("/obj/machinery/libraryscanner/proc/Topic", function* Topic(f: Frame) {
	let B: Value = null;
	let $e: any;
	f.vars = () => [B, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=scanner"], false);
		yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "scanner"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "scan"))) {
		B = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/book"));
		if (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			rt.setSv(f, "cache", live(B));
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.at(live(f.args[1]), "clear"))) {
		rt.setSv(f, "cache", null);
	}
	if (truthy(rt.at(live(f.args[1]), "eject"))) {
		B = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/book"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			rt.setFv(f, "loc", live(B), rt.fv(f, "loc", live(f.src)));
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(10925, "/obj/machinery/bookbinder", "/obj/machinery", {
	busy: 0,
	anchored: 1,
	name: "book binder",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "binder",
	density: 1,
});

// /obj/machinery/bookbinder/proc/attackby  (code/modules/library/lib_machines.dm:562)  may sleep
rt.def("/obj/machinery/bookbinder/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0))) {
		yield* g.srcCall(f, "bind_book", live(f.args[1]), live(f.args[0]));
	} else {
		if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
			return 1;
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/bookbinder/proc/bind_book  (code/modules/library/lib_machines.dm:573)  may sleep
rt.def("/obj/machinery/bookbinder/proc/bind_book", function* bind_book(f: Frame, user: Value, _P: Value) {
	let B: Value = null;
	f.vars = () => [user, _P, B];
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The book binder is busy. Please wait for completion of previous operation.</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(_P), live(f.src));
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ loads some paper into ＀.", [live(user), live(f.src)]), fmt("You load some paper into ＀.", [live(f.src)])]);
	yield* g.srcCall(f, "audible_message", fmt("＀ begins to hum as it warms up its printing drums.", [live(f.src)]));
	rt.setSv(f, "busy", 1);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [200, 400]))]);
	rt.setSv(f, "busy", 0);
	if (!truthy(live(_P))) return f.dot;
	if (!truthy(rt.sv(f, "stat"))) {
		yield* g.srcCall(f, "visible_message", fmt("＀ whirs as it prints and binds a new book.", [live(f.src)]));
		rt.setFv(f, "dat", (B = (yield* g.new_(f, T("/obj/item/weapon/book"), [rt.fv(f, "loc", live(f.src))]))), rt.fv(f, "info", live(_P)));
		rt.setFv(f, "name", live(B), add("Print Job #", fmt("＀", [(yield* g.call(f, P("/proc/rand"), null, [100, 999]))])));
		rt.setFv(f, "icon_state", live(B), fmt("book＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 7]))]));
		yield* g.call(f, P("/proc/qdel"), null, [live(_P)]);
	} else {
		rt.setFv(f, "loc", live(_P), rt.sv(f, "loc"));
	}
	return f.dot;
}, true);
