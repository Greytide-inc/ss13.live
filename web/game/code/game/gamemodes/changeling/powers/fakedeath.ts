// From code/game/gamemodes/changeling/powers/fakedeath.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11229, "/obj/effect/proc_holder/changeling/fakedeath", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 15,
	dna_cost: 0,
	req_dna: 1,
	req_stat: 2,
	name: "Reviving Stasis",
	desc: "We fall into a stasis, allowing us to regenerate and trick our enemies.",
});

// /obj/effect/proc_holder/changeling/fakedeath/proc/sting_action  (code/game/gamemodes/changeling/powers/fakedeath.dm:11)  may sleep
rt.def("/obj/effect/proc_holder/changeling/fakedeath/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We begin our stasis, preparing energy to arise once more.</span>"]);
	if (!isEqual(rt.fv(f, "stat", live(user)), 2)) {
		yield* g.callName(f, live(user), "emote", ["deathgasp"]);
		rt.setFv(f, "tod", live(user), (yield* g.call(f, P("/proc/worldtime2text"), null, [])));
	}
	(rt.modField(f, live(user), "status_flags", 8192, rt.bitOr));
	yield* g.callName(f, live(user), "update_stat", []);
	yield* g.callName(f, live(user), "update_canmove", []);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/changeling/fakedeath/proc/ready_to_regenerate"), live(user)])), 400, 1]);
	return 1;
}, true);

// /obj/effect/proc_holder/changeling/fakedeath/proc/ready_to_regenerate  (code/game/gamemodes/changeling/powers/fakedeath.dm:23)  may sleep
rt.def("/obj/effect/proc_holder/changeling/fakedeath/proc/ready_to_regenerate", function* ready_to_regenerate(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((truthy(live(user)) && truthy(rt.fv(f, "mind", live(user)))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(user))))) && truthy(rt.gv(f, "purchasedpowers", rt.gv(f, "changeling", rt.fv(f, "mind", live(user))))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We are ready to revive.</span>"]);
	rt.modField(f, rt.gv(f, "changeling", rt.fv(f, "mind", live(user))), "purchasedpowers", (yield* g.new_(f, T("/obj/effect/proc_holder/changeling/revive"), [null])), add);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/effect/proc_holder/changeling/fakedeath/proc/can_sting  (code/game/gamemodes/changeling/powers/fakedeath.dm:28)  may sleep
rt.def("/obj/effect/proc_holder/changeling/fakedeath/proc/can_sting", function* can_sting(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(f.args[0])), 8192))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We are already reviving.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "stat", live(f.args[0])))) {
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Are we sure we wish to fake our own death?", null, "Yes", "No"]));
		if ($0 === "No") {
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });
