// Based on /tg/station's code/game/gamemodes/changeling/powers/revive.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11248, "/obj/effect/proc_holder/changeling/revive", "/obj/effect/proc_holder/changeling", {
	helptext: "Does not regrow lost organs or a missing head.",
	req_stat: 2,
	always_keep: 1,
	ignores_fakedeath: 1,
	name: "Revive",
	desc: "We regenerate, healing all damage from our form.",
});

// revive.dm:11
rt.def("/obj/effect/proc_holder/changeling/revive/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	(rt.modField(f, user, "status_flags", 16769023, rt.bitAnd));
	user.tod = null;
	yield* user.revive({ full_heal: 1 });
	let missing: Value = user.get_missing_limbs();
	missing -= "head";
	if (rt.len(f, missing)) {
		playsound(user, rt.rsc("sound/magic/demon_consume.ogg"), 50, 1);
		user.visible_message(`<span class='warning'>${user}'s missing limbs reform, making a loud, grotesque sound!</span>`, "<span class='userdanger'>Your limbs regrow, making a loud, crunchy sound and giving you great pain!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
		yield* user.emote("scream");
		yield* user.regenerate_limbs(0, list("head"));
		yield* user.regenerate_organs();
	}
	to_chat(user, "<span class='notice'>We have revived ourselves.</span>");
	user.mind.changeling.purchasedpowers -= this;
	return 1;
}, true);

// revive.dm:32
rt.def("/obj/effect/proc_holder/changeling/revive/proc/can_be_used_by", function can_be_used_by(f: Frame, user: Value) {
	if (user.stat != 2 && !rt.bitAnd(user.status_flags, FAKEDEATH)) {
		user.mind.changeling.purchasedpowers -= this;
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false);
