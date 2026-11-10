// Based on /tg/station's code/modules/mob/living/carbon/alien/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// say.dm:2
rt.def("/mob/living/proc/alien_talk", function alien_talk(f: Frame, message: Value, shown_name: Value) {
	let S: Value = null, link: Value = null;
	shown_name ??= this.real_name;
	log_say(`${key_name(this)} : ${message}`);
	if (!(message = trim(message))) {
		return f.dot;
	}
	let message_a: Value = this.say_quote(message, this.get_spans());
	let rendered: Value = `<i><span class='alien'>Hivemind, <span class='name'>${shown_name}</span> <span class='message'>${message_a}</span></span></i>`;
	for (S of each(GLOB.player_list, T("/mob"))) {
		if (!S.stat && S.hivecheck()) {
			to_chat(S, rendered);
		}
		if (rt.isIn(f, S, GLOB.dead_mob_list)) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [S, this]);
			to_chat(S, `${link} ${rendered}`);
		}
	}
	return f.dot;
});

// say.dm:16
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/alien_talk", function alien_talk(f: Frame, message: Value, shown_name: Value) {
	shown_name ??= this.name;
	shown_name = `<FONT size = 3>${shown_name}</FONT>`;
	parent_proc(message, shown_name);
	return f.dot;
});

// say.dm:20
rt.def("/mob/living/carbon/proc/hivecheck", function hivecheck(f: Frame) {
	let N: Value = null;
	if (!((N = this.getorgan(T("/obj/item/organ/alien/hivenode"))) && !N.recent_queen_death)) return f.dot;
	return N;
});
