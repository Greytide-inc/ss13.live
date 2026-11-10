// Based on /tg/station's code/controllers/subsystem/pai.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(33, "/datum/controller/subsystem/pai", "/datum/controller/subsystem", {
	candidates: null,
	ghost_spam: 0,
	spam_delay: 100,
	pai_card_list: null,
	name: "pAI",
	flags: 3,
});

// pai.dm:1
rt.def("/datum/controller/subsystem/pai/proc/New", function* New(f: Frame) {
	if (GLOB.SSpai != this) {
		if (rt.istype(GLOB.SSpai, T("/datum/controller/subsystem/pai"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSpai);
		}
		GLOB.SSpai = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// pai.dm:6
rt.def("/datum/controller/subsystem/pai/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.candidates = list();

	this.pai_card_list = list();
	return f.dot;
});

// pai.dm:12
rt.def("/datum/controller/subsystem/pai/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let candidate: Value = null, card: Value = null, pai: Value = null, p: Value = null;
	let $e: any;
	if (rt.at(href_list, "download")) {
		candidate = rt.locateIn(f, rt.at(href_list, "candidate"), rt.world());
		if ((card = rt.locateIn(f, rt.at(href_list, "device"), rt.world())).pai) {
			return f.dot;
		}
		if (rt.istype(card, T("/obj/item/device/paicard")) && rt.istype(candidate, T("/datum/paiCandidate"))) {
			// The window is the card holder's: a far player can't push a candidate into someone's card.
			if (!(get_dist(card, f.usr) <= 1)) {
				return f.dot;
			}
			if (this.check_ready(candidate) != candidate) {
				return 0;
			}
			pai = (yield* new_(T("/mob/living/silicon/pai"), card));
			if (!candidate.name) {
				pai.name = pick(GLOB.ninja_names);
			} else {
				pai.name = candidate.name;
			}
			pai.real_name = pai.name;
			pai.key = candidate.key;
			card.setPersonality(pai);
			GLOB.SSticker.mode.update_cult_icons_removed(card.pai.mind);
			GLOB.SSticker.mode.update_rev_icons_removed(card.pai.mind);
			this.candidates -= candidate;
			rt.op(f, "Browse", [], [f.usr, null, "window=findPai"], false);
		}
	}
	if (!rt.at(href_list, "new")) return f.dot;
	candidate = rt.locateIn(f, rt.at(href_list, "candidate"), rt.world());
	// A candidate is its player's own: an href could name another player's and rewrite or ready it.
	if (!rt.istype(candidate, T("/datum/paiCandidate")) || candidate.key != f.usr.key) {
		return f.dot;
	}
	let option: Value = rt.at(href_list, "option");
	let t: Value = "";
	if (option === "name") {
		if (t = (yield* g.op(f, "Prompt", [2], [null, candidate.name, "pAI Name", "Enter a name for your pAI", null]))) {
			candidate.name = copytext(sanitize(t), 1, 42);
		}
	} else if (option === "desc") {
		if (t = (yield* g.op(f, "Prompt", [64], [null, candidate.description, "pAI Description", "Enter a description for your pAI", null]))) {
			candidate.description = copytext(sanitize(t), 1, 1024);
		}
	} else if (option === "role") {
		if (t = (yield* g.op(f, "Prompt", [2], [null, candidate.role, "pAI Role", "Enter a role for your pAI", null]))) {
			candidate.role = copytext(sanitize(t), 1, 1024);
		}
	} else if (option === "ooc") {
		if (t = (yield* g.op(f, "Prompt", [64], [null, candidate.comments, "pAI OOC Comments", "Enter any OOC comments", null]))) {
			candidate.comments = copytext(sanitize(t), 1, 1024);
		}
	} else if (option === "save") {
		candidate.savefile_save(f.usr);
	} else if (option === "load") {
		yield* candidate.savefile_load(f.usr);
		if (candidate.name) {
			candidate.name = copytext(sanitize(candidate.name), 1, 42);
		}
		if (candidate.description) {
			candidate.description = copytext(sanitize(candidate.description), 1, 1024);
		}
		if (candidate.role) {
			candidate.role = copytext(sanitize(candidate.role), 1, 1024);
		}
		if (candidate.comments) {
			candidate.comments = copytext(sanitize(candidate.comments), 1, 1024);
		}
	} else if (option === "submit") {
		if (candidate) {
			candidate.ready = 1;
			for (p of each(this.pai_card_list, T("/obj/item/device/paicard"))) {
				if (!p.pai) {
					p.alertUpdate();
				}
			}
		}
		rt.op(f, "Browse", [], [f.usr, null, "window=paiRecruit"], false);
		return f.dot;
	}
	this.recruitWindow(f.usr);
	return f.dot;
}, true);

// pai.dm:84
rt.def("/datum/controller/subsystem/pai/proc/recruitWindow", function recruitWindow(f: Frame, M: Value) {
	let candidate: Value = null, c: Value = null;
	for (c of each(this.candidates, T("/datum/paiCandidate"))) {
		if (c.key == M.key) {
			candidate = c;
		}
	}
	if (!candidate) {
		(candidate = new_(T("/datum/paiCandidate"))).key = M.key;
		this.candidates.Add(candidate);
	}
	let dat: Value = "";
	dat += "\n\t\t\t<style type=\"text/css\">\n\n\t\t\tp.top {\n\t\t\t\tbackground-color: #AAAAAA; color: black;\n\t\t\t}\n\n\t\t\ttr.d0 td {\n\t\t\t\tbackground-color: #CC9999; color: black;\n\t\t\t}\n\t\t\ttr.d1 td {\n\t\t\t\tbackground-color: #9999CC; color: black;\n\t\t\t}\n\t\t\t</style>\n\t\t\t";
	dat += "<p class=\"top\">Please configure your pAI personality's options. Remember, what you enter here could determine whether or not the user requesting a personality chooses you!</p>";
	dat += "<table>";
	dat += `<tr class="d0"><td>Name:</td><td>${candidate.name}</td></tr>`;
	dat += fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=name;new=1;candidate=＃'>[Edit]</a></td><td>What you plan to call yourself. Suggestions: Any character name you would choose for a station character OR an AI.</td></tr>", [this, candidate]);
	dat += `<tr class="d0"><td>Description:</td><td>${candidate.description}</td></tr>`;
	dat += fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=desc;new=1;candidate=＃'>[Edit]</a></td><td>What sort of pAI you typically play; your mannerisms, your quirks, etc. This can be as sparse or as detailed as you like.</td></tr>", [this, candidate]);
	dat += `<tr class="d0"><td>Preferred Role:</td><td>${candidate.role}</td></tr>`;
	dat += fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=role;new=1;candidate=＃'>[Edit]</a></td><td>Do you like to partner with sneaky social ninjas? Like to help security hunt down thugs? Enjoy watching an engineer's back while he saves the station yet again? This doesn't have to be limited to just station jobs. Pretty much any general descriptor for what you'd like to be doing works here.</td></tr>", [this, candidate]);
	dat += `<tr class="d0"><td>OOC Comments:</td><td>${candidate.comments}</td></tr>`;
	dat += fmt("<tr class=\"d1\"><td><a href='byond://?src=＃;option=ooc;new=1;candidate=＃'>[Edit]</a></td><td>Anything you'd like to address specifically to the player reading this in an OOC manner. \"I prefer more serious RP.\", \"I'm still learning the interface!\", etc. Feel free to leave this blank if you want.</td></tr>", [this, candidate]);
	dat += "</table>";
	dat += "<br>";
	dat += fmt("<h3><a href='byond://?src=＃;option=submit;new=1;candidate=＃'>Submit Personality</a></h3><br>", [this, candidate]);
	dat += fmt("<a href='byond://?src=＃;option=save;new=1;candidate=＃'>Save Personality</a><br>", [this, candidate]);
	dat += fmt("<a href='byond://?src=＃;option=load;new=1;candidate=＃'>Load Personality</a><br>", [this, candidate]);
	rt.op(f, "Browse", [], [M, dat, "window=paiRecruit"], false);
	return f.dot;
});

// pai.dm:137
rt.def("/datum/controller/subsystem/pai/proc/check_ready", function check_ready(f: Frame, C: Value) {
	let O: Value = null;
	if (!C.ready) {
		return 0;
	}
	for (O of each(GLOB.player_list, T("/mob/dead/observer"))) {
		if (O.key == C.key) {
			return C;
		}
	}
	return 0;
});

// pai.dm:145
rt.def("/datum/controller/subsystem/pai/proc/findPAI", function* findPAI(f: Frame, p: Value, user: Value) {
	let G: Value = null, c: Value = null, c_2: Value = null;
	if (!this.ghost_spam) {
		this.ghost_spam = 1;
		for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
			if (!G.key || !G.client) {
				continue;
			}
			if (!rt.isIn(f, "pAI", G.client.prefs.be_special)) {
				continue;
			}
			to_chat(G, `<span class='ghostalert'>${user} is requesting a pAI personality! Use the pAI button to submit yourself as one.</span>`);
		}
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/controller/subsystem/pai/proc/spam_again"))), this.spam_delay);
	}
	let available: Value = list();
	for (c of each(GLOB.SSpai.candidates, T("/datum/paiCandidate"))) {
		available.Add(this.check_ready(c));
	}
	let dat: Value = "";
	dat += "\n\t\t\t<style type=\"text/css\">\n\n\t\t\tp.top {\n\t\t\t\tbackground-color: #AAAAAA; color: black;\n\t\t\t}\n\n\t\t\ttr.d0 td {\n\t\t\t\tbackground-color: #CC9999; color: black;\n\t\t\t}\n\t\t\ttr.d1 td {\n\t\t\t\tbackground-color: #9999CC; color: black;\n\t\t\t}\n\t\t\ttr.d2 td {\n\t\t\t\tbackground-color: #99CC99; color: black;\n\t\t\t}\n\t\t\t</style>\n\t\t\t";
	dat += "<p class=\"top\">Requesting AI personalities from central database... If there are no entries, or if a suitable entry is not listed, check again later as more personalities may be added.</p>";
	dat += "<table>";
	for (c_2 of each(available, T("/datum/paiCandidate"))) {
		dat += `<tr class="d0"><td>Name:</td><td>${c_2.name}</td></tr>`;
		dat += `<tr class="d1"><td>Description:</td><td>${c_2.description}</td></tr>`;
		dat += `<tr class="d0"><td>Preferred Role:</td><td>${c_2.role}</td></tr>`;
		dat += `<tr class="d1"><td>OOC Comments:</td><td>${c_2.comments}</td></tr>`;
		dat += fmt("<tr class=\"d2\"><td><a href='byond://?src=＃;download=1;candidate=＃;device=＃'>[Download ＀]</a></td><td></td></tr>", [this, c_2, p, c_2.name]);
	}
	dat += "</table>";
	rt.op(f, "Browse", [], [user, dat, "window=findPai"], false);
	return f.dot;
}, true);
