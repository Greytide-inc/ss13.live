// Based on /tg/station's code/game/objects/structures/spirit_board.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12875, "/obj/structure/spirit_board", "/obj/structure", {
	virgin: 1,
	next_use: 0,
	planchette: "A",
	lastuser: null,
	anchored: 0,
	name: "spirit board",
	desc: "A wooden board with letters etched into it, used in seances.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "spirit_board",
	density: 1,
});

// spirit_board.dm:14
rt.def("/obj/structure/spirit_board/proc/examine", function examine(f: Frame) {
	this.desc = `${rt.initial(f, this, "desc")} The planchette is sitting at "${this.planchette}".`;
	parent_proc();
	return f.dot;
});

// spirit_board.dm:18
rt.def("/obj/structure/spirit_board/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.spirit_board_pick_letter(user);
	return f.dot;
}, true);

// spirit_board.dm:24
rt.def("/obj/structure/spirit_board/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	yield* this.spirit_board_pick_letter(user);
	return f.dot;
}, true);

// spirit_board.dm:28
rt.def("/obj/structure/spirit_board/proc/spirit_board_pick_letter", function* spirit_board_pick_letter(f: Frame, M: Value) {
	let msg: Value = null;
	if (!this.spirit_board_checks(M)) {
		return 0;
	}
	if (this.virgin) {
		this.virgin = 0;
		yield* notify_ghosts(`Someone has begun playing with a ${this.name} in ${get_area(this)}!`, { source: this });
	}
	this.planchette = (yield* g.op(f, "Prompt", [1], [null, null, "Seance!", "Choose the letter.", list("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")]));
	if (!this.planchette || !this.Adjacent(M) || this.next_use > rt.worldTime(f)) {
		return f.dot;
	}
	add_logs(M, this, "picked a letter on", ` which was "${this.planchette}".`);
	this.next_use = rt.worldTime(f) + rand(30, 50);
	this.lastuser = M.ckey;
	this.visible_message((msg = `<span class='notice'>The planchette slowly moves... and stops at the letter "${this.planchette}".</span>`), "", msg);
	return f.dot;
}, true);

// spirit_board.dm:48
rt.def("/obj/structure/spirit_board/proc/spirit_board_checks", function spirit_board_checks(f: Frame, M: Value) {
	let _T: Value = null, L: Value = null;
	let bonus: Value = 0;
	if (M.ckey == this.lastuser) {
		bonus = 10;
	}
	if (this.next_use - bonus > rt.worldTime(f)) {
		return 0;
	}
	let light_amount: Value = 0;
	if ((light_amount = (_T = rt.getStep(f, this, 0)).get_lumcount()) > 0.2) {
		to_chat(M, `<span class='warning'>It's too bright here to use ${this.name}!</span>`);
		return 0;
	}
	let users_in_range: Value = 0;
	for (L of each(orange(1, this), T("/mob/living"))) {
		if (L.ckey && L.client) {
			if (rt.worldTime(f) - L.client.inactivity < rt.worldTime(f) - 300 || L.stat != 0 || L.restrained()) {
				to_chat(M, `<span class='warning'>${L} doesn't seem to be paying attention...</span>`);
			} else {
				users_in_range++;
			}
		}
	}
	if (users_in_range < 2) {
		to_chat(M, `<span class='warning'>There aren't enough people to use the ${this.name}!</span>`);
		return 0;
	}
	return 1;
});
