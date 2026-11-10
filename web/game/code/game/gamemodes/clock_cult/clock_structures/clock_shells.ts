// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/clock_shells.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12158, "/obj/structure/destructible/clockwork/shell", "/obj/structure/destructible/clockwork", {
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/clockwork"),
	spawn_message: " is an error and you should yell at whoever spawned this shell.",
	construction_value: 0,
	anchored: 0,
	density: 0,
	resistance_flags: 99,
});

// clock_shells.dm:11
rt.def("/obj/structure/destructible/clockwork/shell/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.istype(I, T("/obj/item/device/mmi/posibrain/soul_vessel"))) {
		if (!is_servant_of_ratvar(user)) {
			yield* parent_proc();
			return 0;
		}
		if (!(S = I).brainmob) {
			to_chat(user, `<span class='warning'>${S} is inactive! Turn it on or capture a mind first.</span>`);
			return 0;
		}
		if (S.brainmob && (!S.brainmob.client || !S.brainmob.mind)) {
			to_chat(user, `<span class='warning'>${S}'s trapped consciousness appears inactive!</span>`);
			return 0;
		}
		user.visible_message(`<span class='notice'>${user} places ${S} in ${this}, where it fuses to the shell.</span>`, `<span class='brass'>You place ${S} in ${this}, fusing it to the shell.</span>`);
		(A = (yield* new_(this.mobtype, rt.getStep(f, this, 0)))).visible_message(`<span class='brass'>${this}${this.spawn_message}</span>`);
		yield* S.brainmob.mind.transfer_to(A);
		$0 = A;
		$1 = null;
		if (findtext(A.name, rt.initial(f, A, "name"))) {
			$2 = `${rt.initial(f, A, "name")}`;
		} else {
			$2 = `${A.name}`;
		}
		yield* $0.fully_replace_character_name($1, `${$2} (${S.brainmob.name})`);
		yield* user.drop_item();
		yield* qdel(S);
		yield* qdel(this);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);
