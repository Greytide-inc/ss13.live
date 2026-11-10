// Based on /tg/station's code/game/objects/items/weapons/scrolls.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(7342, "/obj/item/weapon/teleportation_scroll", "/obj/item/weapon", {
	uses: 4,
	throw_speed: 3,
	throw_range: 7,
	name: "scroll of teleportation",
	desc: "A scroll for moving around.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll",
	w_class: 2,
	item_state: "paper",
	origin_tech: "bluespace=6",
	resistance_flags: 4,
});

// scrolls.dm:22
rt.def("/obj/item/weapon/teleportation_scroll/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.set_machine(this);
	let dat: Value = "<B>Teleportation Scroll:</B><BR>";
	dat += `Number of uses: ${this.uses}<BR>`;
	dat += "<HR>";
	dat += "<B>Four uses, use them wisely:</B><BR>";
	dat += fmt("<A href='byond://?src=＃;spell_teleport=1'>Teleport</A><BR>", [this]);
	dat += "Kind regards,<br>Wizards Federation<br><br>P.S. Don't forget to bring your gear, you'll need it to cast most spells.<HR>";
	rt.op(f, "Browse", [], [user, dat, "window=scroll"], false);
	onclose(user, "scroll");
	return f.dot;
}, true);

// scrolls.dm:34
rt.def("/obj/item/weapon/teleportation_scroll/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let H: Value = null;
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained() || this.loc != f.usr) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		return 1;
	}
	if ((H = f.usr).is_holding(this)) {
		yield* H.set_machine(this);
		if (rt.at(href_list, "spell_teleport")) {
			if (this.uses) {
				yield* this.teleportscroll(H);
			}
		}
	}
	if (H) {
		yield* this.attack_self(H);
	}
	return f.dot;
}, true);

// scrolls.dm:53
rt.def("/obj/item/weapon/teleportation_scroll/proc/teleportscroll", function* teleportscroll(f: Frame, user: Value) {
	let A: Value = null, smoke: Value = null, _T: Value = null;
	A = (yield* g.op(f, "Prompt", [1], [A, "BOOYEA", "Area to jump to", user, GLOB.teleportlocs]));
	if (!this || !this || this.gc_destroyed || !user || !user.is_holding(this) || user.incapacitated() || !A || !this.uses) {
		return f.dot;
	}
	let thearea: Value = rt.index(GLOB.teleportlocs, A);
	yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(2, user.loc);
	yield* smoke.attach(user);
	yield* smoke.start();
	let L: Value = list();
	for (_T of each(get_area_turfs(thearea.type), T("/turf"))) {
		if (!is_blocked_turf(_T)) {
			L += _T;
		}
	}
	if (!rt.len(f, L)) {
		to_chat(user, "The spell matrix was unable to locate a suitable teleport destination for an unknown reason. Sorry.");
		return f.dot;
	}
	yield* user.forceMove(pick(L));
	yield* smoke.start();
	this.uses--;
	return f.dot;
}, true);
