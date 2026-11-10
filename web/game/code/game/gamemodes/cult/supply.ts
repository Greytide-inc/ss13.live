// Based on /tg/station's code/game/gamemodes/cult/supply.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(6564, "/obj/item/weapon/paper/talisman/supply", "/obj/item/weapon/paper/talisman", {
	possible_summons: null,
	cultist_name: "Supply Talisman",
	cultist_desc: "A multi-use talisman that can create various objects. Intended to increase the cult's strength early on.",
	invocation: null,
	uses: 3,
});

// supply.dm:7
rt.def("/obj/item/weapon/paper/talisman/supply/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_summons = list(T("/datum/cult_supply/tome"), T("/datum/cult_supply/metal"), T("/datum/cult_supply/talisman/teleport"), T("/datum/cult_supply/talisman/emp"), T("/datum/cult_supply/talisman/stun"), T("/datum/cult_supply/talisman/veil"), T("/datum/cult_supply/soulstone"), T("/datum/cult_supply/construct_shell"));
	return f.dot;
});

// supply.dm:19
rt.def("/obj/item/weapon/paper/talisman/supply/proc/invoke", function* invoke(f: Frame, user: Value, successfuluse: Value) {
	let s: Value = null, S: Value = null, popup: Value = null;
	successfuluse ??= 1;
	let dat: Value = list();
	dat += `<B>There are ${this.uses} bloody runes on the parchment.</B><BR>`;
	dat += "Please choose the chant to be imbued into the fabric of reality.<BR>";
	dat += "<HR>";
	for (s of each(this.possible_summons)) {
		S = s;
		dat += fmt("<a href='?src=＃;id=＀'>＀</a> - ＀<br>", [this, rt.initial(f, S, "id"), rt.initial(f, S, "invocation"), rt.initial(f, S, "desc")]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "talisman", "", 400, 400))).set_content(dat.Join(""));
	yield* popup.open();
	return 0;
}, true);

// supply.dm:32
rt.def("/obj/item/weapon/paper/talisman/supply/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let match: Value = null, s: Value = null, S: Value = null, AM: Value = null;
	rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), `${f.usr}, ${href}, ${href_list}`], false);
	if (!this || this.gc_destroyed || f.usr.incapacitated() || !(get_dist(this, f.usr) <= 1)) {
		return f.dot;
	}
	let id: Value = rt.at(href_list, "id");
	for (s of each(this.possible_summons)) {
		if (rt.initial(f, (S = s), "id") == id) {
			match = S;
			break;
		}
	}
	if (!match) {
		to_chat(f.usr, "<span class='userdanger'>The fabric of reality quivers in agony.</span>");
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	let summon_type: Value = rt.initial(f, match, "summon_type");
	if (rt.istype((AM = (yield* new_(summon_type, _T))), T("/obj/item"))) {
		yield* f.usr.put_in_hands(AM);
	}
	this.uses--;
	if (!(this.uses <= 0)) return f.dot;
	to_chat(f.usr, `<span class='warning'>${this} crumbles to dust.</span>`);
	yield* this.burn();
	return f.dot;
}, true);

rt.type(6565, "/obj/item/weapon/paper/talisman/supply/weak", "/obj/item/weapon/paper/talisman/supply", {
	cultist_name: "Lesser Supply Talisman",
	uses: 2,
});

// supply.dm:67
rt.def("/obj/item/weapon/paper/talisman/supply/weak/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	this.possible_summons -= T("/datum/cult_supply/metal");
	return f.dot;
}, true);
