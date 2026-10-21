// From code/controllers/subsystem/pai.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(33, "/datum/controller/subsystem/pai", "/datum/controller/subsystem", {
	candidates: null,
	ghost_spam: 0,
	spam_delay: 100,
	pai_card_list: null,
	name: "pAI",
	flags: 3,
});

// /datum/controller/subsystem/pai/proc/New  (code/controllers/subsystem/pai.dm:1)  may sleep
rt.def("/datum/controller/subsystem/pai/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSpai"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSpai"), T("/datum/controller/subsystem/pai")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSpai")]);
		}
		rt.setGl("SSpai", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/pai/proc/<init>  (code/controllers/subsystem/pai.dm:6)
rt.def("/datum/controller/subsystem/pai/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "candidates", rt.list());
	$0 = $0;
	rt.setSv(f, "pai_card_list", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/pai/proc/Topic  (code/controllers/subsystem/pai.dm:12)  may sleep
rt.def("/datum/controller/subsystem/pai/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let candidate: Value = null, card: Value = null, pai: Value = null, option: Value = null, t: Value = null, p: Value = null;
	let $0: any, $e: any;
	f.vars = () => [href, href_list, candidate, card, pai, option, t, p, $0, $e];
	if (truthy(rt.at(live(href_list), "download"))) {
		candidate = rt.locateIn(f, rt.at(live(href_list), "candidate"), rt.world());
		if (truthy(rt.gv(f, "pai", (card = rt.locateIn(f, rt.at(live(href_list), "device"), rt.world()))))) {
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(card), T("/obj/item/device/paicard")) ? 1 : 0)) && truthy((rt.istype(live(candidate), T("/datum/paiCandidate")) ? 1 : 0)))) {
			// The window is the card holder's: a far player can't push a candidate into someone's card.
			if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(card), live(f.usr)])), 1)) {
				return live(f.dot);
			}
			if (!isEqual((yield* g.srcCall(f, "check_ready", live(candidate))), live(candidate))) {
				return 0;
			}
			pai = (yield* g.new_(f, T("/mob/living/silicon/pai"), [live(card)]));
			if (!truthy(rt.fv(f, "name", live(candidate)))) {
				rt.setFv(f, "name", live(pai), rt.op(f, "PickUnweighted", [1], [rt.gl("ninja_names")]));
			} else {
				rt.setFv(f, "name", live(pai), rt.fv(f, "name", live(candidate)));
			}
			rt.setFv(f, "real_name", live(pai), rt.fv(f, "name", live(pai)));
			rt.setFv(f, "key", live(pai), rt.fv(f, "key", live(candidate)));
			yield* g.callName(f, live(card), "setPersonality", [live(pai)]);
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_cult_icons_removed", [rt.gv(f, "mind", rt.fv(f, "pai", live(card)))]);
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_removed", [rt.gv(f, "mind", rt.fv(f, "pai", live(card)))]);
			(rt.modSrcVar(f, "candidates", live(candidate), subtract));
			rt.op(f, "Browse", [], [live(f.usr), null, "window=findPai"], false);
		}
	}
	if (!truthy(rt.at(live(href_list), "new"))) return f.dot;
	candidate = rt.locateIn(f, rt.at(live(href_list), "candidate"), rt.world());
	// A candidate is its player's own: an href could name another player's and rewrite or ready it.
	if (!truthy((rt.istype(live(candidate), T("/datum/paiCandidate")) ? 1 : 0)) || !isEqual(rt.fv(f, "key", live(candidate)), rt.fv(f, "key", live(f.usr)))) {
		return live(f.dot);
	}
	option = rt.at(live(href_list), "option");
	t = "";
	$0 = live(option);
	if ($0 === "name") {
		if (truthy((t = (yield* g.op(f, "Prompt", [2], [null, rt.fv(f, "name", live(candidate)), "pAI Name", "Enter a name for your pAI", null]))))) {
			rt.setFv(f, "name", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(t)])), 1, 42])));
		}
	} else if ($0 === "desc") {
		if (truthy((t = (yield* g.op(f, "Prompt", [64], [null, rt.fv(f, "description", live(candidate)), "pAI Description", "Enter a description for your pAI", null]))))) {
			rt.setFv(f, "description", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(t)])), 1, 1024])));
		}
	} else if ($0 === "role") {
		if (truthy((t = (yield* g.op(f, "Prompt", [2], [null, rt.fv(f, "role", live(candidate)), "pAI Role", "Enter a role for your pAI", null]))))) {
			rt.setFv(f, "role", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(t)])), 1, 1024])));
		}
	} else if ($0 === "ooc") {
		if (truthy((t = (yield* g.op(f, "Prompt", [64], [null, rt.fv(f, "comments", live(candidate)), "pAI OOC Comments", "Enter any OOC comments", null]))))) {
			rt.setFv(f, "comments", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(t)])), 1, 1024])));
		}
	} else if ($0 === "save") {
		yield* g.callName(f, live(candidate), "savefile_save", [live(f.usr)]);
	} else if ($0 === "load") {
		yield* g.callName(f, live(candidate), "savefile_load", [live(f.usr)]);
		if (truthy(rt.fv(f, "name", live(candidate)))) {
			rt.setFv(f, "name", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "name", live(candidate))])), 1, 42])));
		}
		if (truthy(rt.fv(f, "description", live(candidate)))) {
			rt.setFv(f, "description", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "description", live(candidate))])), 1, 1024])));
		}
		if (truthy(rt.fv(f, "role", live(candidate)))) {
			rt.setFv(f, "role", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "role", live(candidate))])), 1, 1024])));
		}
		if (truthy(rt.fv(f, "comments", live(candidate)))) {
			rt.setFv(f, "comments", live(candidate), (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [rt.fv(f, "comments", live(candidate))])), 1, 1024])));
		}
	} else if ($0 === "submit") {
		if (truthy(live(candidate))) {
			rt.setFv(f, "ready", live(candidate), 1);
			p = null;
			rt.forList(f, 0, rt.sv(f, "pai_card_list"), T("/obj/item/device/paicard"));
			while (($e = rt.next(f, 0)) !== undefined) {
				p = $e;
				if (!truthy(rt.fv(f, "pai", live(p)))) {
					yield* g.callName(f, live(p), "alertUpdate", []);
				}
			}
			rt.endFor(f, 0);
		}
		rt.op(f, "Browse", [], [live(f.usr), null, "window=paiRecruit"], false);
		return live(f.dot);
	}
	yield* g.srcCall(f, "recruitWindow", live(f.usr));
	return f.dot;
}, true);

// /datum/controller/subsystem/pai/proc/recruitWindow  (code/controllers/subsystem/pai.dm:84)
rt.def("/datum/controller/subsystem/pai/proc/recruitWindow", function recruitWindow(f: Frame, M: Value) {
	let candidate: Value = null, c: Value = null, dat: Value = null;
	let $e: any;
	f.vars = () => [candidate, c, dat, $e];
	candidate = null;
	c = null;
	rt.forList(f, 0, rt.sv(f, "candidates"), T("/datum/paiCandidate"));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if (isEqual(rt.fv(f, "key", live(c)), rt.fv(f, "key", live(M)))) {
			candidate = live(c);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(candidate))) {
		rt.setFv(f, "key", (candidate = rt.new_(f, T("/datum/paiCandidate"), [])), rt.fv(f, "key", live(M)));
		rt.callName(f, rt.sv(f, "candidates"), "Add", [live(candidate)]);
	}
	dat = "";
	dat = rt.modify(live(dat), "\n\t\t\t<style type=\"text/css\">\n\n\t\t\tp.top {\n\t\t\t\tbackground-color: #AAAAAA; color: black;\n\t\t\t}\n\n\t\t\ttr.d0 td {\n\t\t\t\tbackground-color: #CC9999; color: black;\n\t\t\t}\n\t\t\ttr.d1 td {\n\t\t\t\tbackground-color: #9999CC; color: black;\n\t\t\t}\n\t\t\t</style>\n\t\t\t", add);
	dat = rt.modify(live(dat), "<p class=\"top\">Please configure your pAI personality's options. Remember, what you enter here could determine whether or not the user requesting a personality chooses you!</p>", add);
	dat = rt.modify(live(dat), "<table>", add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d0\"><td>Name:</td><td>＀</td></tr>", [rt.fv(f, "name", live(candidate))]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=name;new=1;candidate=＃'>[Edit]</a></td><td>What you plan to call yourself. Suggestions: Any character name you would choose for a station character OR an AI.</td></tr>", [live(f.src), live(candidate)]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d0\"><td>Description:</td><td>＀</td></tr>", [rt.fv(f, "description", live(candidate))]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=desc;new=1;candidate=＃'>[Edit]</a></td><td>What sort of pAI you typically play; your mannerisms, your quirks, etc. This can be as sparse or as detailed as you like.</td></tr>", [live(f.src), live(candidate)]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d0\"><td>Preferred Role:</td><td>＀</td></tr>", [rt.fv(f, "role", live(candidate))]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=role;new=1;candidate=＃'>[Edit]</a></td><td>Do you like to partner with sneaky social ninjas? Like to help security hunt down thugs? Enjoy watching an engineer's back while he saves the station yet again? This doesn't have to be limited to just station jobs. Pretty much any general descriptor for what you'd like to be doing works here.</td></tr>", [live(f.src), live(candidate)]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d0\"><td>OOC Comments:</td><td>＀</td></tr>", [rt.fv(f, "comments", live(candidate))]), add);
	dat = rt.modify(live(dat), fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=ooc;new=1;candidate=＃'>[Edit]</a></td><td>Anything you'd like to address specifically to the player reading this in an OOC manner. \"I prefer more serious RP.\", \"I'm still learning the interface!\", etc. Feel free to leave this blank if you want.</td></tr>", [live(f.src), live(candidate)]), add);
	dat = rt.modify(live(dat), "</table>", add);
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), fmt("<h3><a href='byond://?src=＃;option=submit;new=1;candidate=＃'>Submit Personality</a></h3><br>", [live(f.src), live(candidate)]), add);
	dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;option=save;new=1;candidate=＃'>Save Personality</a><br>", [live(f.src), live(candidate)]), add);
	dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;option=load;new=1;candidate=＃'>Load Personality</a><br>", [live(f.src), live(candidate)]), add);
	rt.op(f, "Browse", [], [live(M), live(dat), "window=paiRecruit"], false);
	return f.dot;
});

// /datum/controller/subsystem/pai/proc/check_ready  (code/controllers/subsystem/pai.dm:137)
rt.def("/datum/controller/subsystem/pai/proc/check_ready", function check_ready(f: Frame, C: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (!truthy(rt.fv(f, "ready", live(C)))) {
		return 0;
	}
	O = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "key", live(O)), rt.fv(f, "key", live(C)))) {
			return live(C);
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/controller/subsystem/pai/proc/findPAI  (code/controllers/subsystem/pai.dm:145)  may sleep
rt.def("/datum/controller/subsystem/pai/proc/findPAI", function* findPAI(f: Frame, p: Value, user: Value) {
	let G: Value = null, available: Value = null, c: Value = null, dat: Value = null, c_2: Value = null;
	let $e: any;
	f.vars = () => [p, user, G, available, c, dat, c_2, $e];
	if (!truthy(rt.sv(f, "ghost_spam"))) {
		rt.setSv(f, "ghost_spam", 1);
		G = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			if ((!truthy(rt.fv(f, "key", live(G))) || !truthy(rt.fv(f, "client", live(G))))) {
				continue;
			}
			if (!truthy((rt.isIn(f, "pAI", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", live(G))))) ? 1 : 0))) {
				continue;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(G), fmt("<span class='ghostalert'>＀ is requesting a pAI personality! Use the pAI button to submit yourself as one.</span>", [live(user)])]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/controller/subsystem/pai/proc/spam_again")])), rt.sv(f, "spam_delay")]);
	}
	available = rt.list();
	c = null;
	rt.forList(f, 0, rt.fv(f, "candidates", rt.gl("SSpai")), T("/datum/paiCandidate"));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		yield* g.callName(f, live(available), "Add", [(yield* g.srcCall(f, "check_ready", live(c)))]);
	}
	rt.endFor(f, 0);
	dat = "";
	dat = rt.modify(live(dat), "\n\t\t\t<style type=\"text/css\">\n\n\t\t\tp.top {\n\t\t\t\tbackground-color: #AAAAAA; color: black;\n\t\t\t}\n\n\t\t\ttr.d0 td {\n\t\t\t\tbackground-color: #CC9999; color: black;\n\t\t\t}\n\t\t\ttr.d1 td {\n\t\t\t\tbackground-color: #9999CC; color: black;\n\t\t\t}\n\t\t\ttr.d2 td {\n\t\t\t\tbackground-color: #99CC99; color: black;\n\t\t\t}\n\t\t\t</style>\n\t\t\t", add);
	dat = rt.modify(live(dat), "<p class=\"top\">Requesting AI personalities from central database... If there are no entries, or if a suitable entry is not listed, check again later as more personalities may be added.</p>", add);
	dat = rt.modify(live(dat), "<table>", add);
	c_2 = null;
	rt.forList(f, 0, live(available), T("/datum/paiCandidate"));
	while (($e = rt.next(f, 0)) !== undefined) {
		c_2 = $e;
		dat = rt.modify(live(dat), fmt("<tr class=\"d0\"><td>Name:</td><td>＀</td></tr>", [rt.fv(f, "name", live(c_2))]), add);
		dat = rt.modify(live(dat), fmt("<tr class=\"d1\"><td>Description:</td><td>＀</td></tr>", [rt.fv(f, "description", live(c_2))]), add);
		dat = rt.modify(live(dat), fmt("<tr class=\"d0\"><td>Preferred Role:</td><td>＀</td></tr>", [rt.fv(f, "role", live(c_2))]), add);
		dat = rt.modify(live(dat), fmt("<tr class=\"d1\"><td>OOC Comments:</td><td>＀</td></tr>", [rt.fv(f, "comments", live(c_2))]), add);
		dat = rt.modify(live(dat), fmt("<tr class=\"d2\"><td><a href='byond://?src=＃;download=1;candidate=＃;device=＃'>[Download ＀]</a></td><td></td></tr>", [live(f.src), live(c_2), live(p), rt.fv(f, "name", live(c_2))]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "</table>", add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=findPai"], false);
	return f.dot;
}, true);
