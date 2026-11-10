// Based on /tg/station's code/game/gamemodes/changeling/powers/fakedeath.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11229, "/obj/effect/proc_holder/changeling/fakedeath", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 15,
	dna_cost: 0,
	req_dna: 1,
	req_stat: 2,
	name: "Reviving Stasis",
	desc: "We fall into a stasis, allowing us to regenerate and trick our enemies.",
});

// fakedeath.dm:11
rt.def("/obj/effect/proc_holder/changeling/fakedeath/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>We begin our stasis, preparing energy to arise once more.</span>");
	if (user.stat != 2) {
		yield* user.emote("deathgasp");
		user.tod = worldtime2text();
	}
	(rt.modField(f, user, "status_flags", FAKEDEATH, rt.bitOr));
	yield* user.update_stat();
	yield* user.update_canmove();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/fakedeath/proc/ready_to_regenerate"), user)), LING_FAKEDEATH_TIME, 1);
	return 1;
}, true);

// fakedeath.dm:23
rt.def("/obj/effect/proc_holder/changeling/fakedeath/proc/ready_to_regenerate", function* ready_to_regenerate(f: Frame, user: Value) {
	if (!(user && user.mind && user.mind.changeling && user.mind.changeling.purchasedpowers)) return f.dot;
	to_chat(user, "<span class='notice'>We are ready to revive.</span>");
	user.mind.changeling.purchasedpowers += (yield* new_(T("/obj/effect/proc_holder/changeling/revive"), null));
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// fakedeath.dm:28
rt.def("/obj/effect/proc_holder/changeling/fakedeath/proc/can_sting", function* can_sting(f: Frame, user: Value) {
	if (rt.bitAnd(user.status_flags, FAKEDEATH)) {
		to_chat(user, "<span class='warning'>We are already reviving.</span>");
		return f.dot;
	}
	if (!user.stat) {
		if ((yield* alert("Are we sure we wish to fake our own death?", null, "Yes", "No")) === "No") {
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);
