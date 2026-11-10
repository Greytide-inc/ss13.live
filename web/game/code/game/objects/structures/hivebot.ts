// Based on /tg/station's code/game/objects/structures/hivebot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12780, "/obj/structure/hivebot_beacon", "/obj/structure", {
	bot_type: "norm",
	bot_amt: 10,
	anchored: 1,
	name: "beacon",
	desc: "Some odd beacon thing.",
	icon: rt.rsc("icons/mob/hivebot.dmi"),
	icon_state: "def_radar-off",
	density: 1,
});

// hivebot.dm:12
rt.def("/obj/structure/hivebot_beacon/proc/New", function* New(f: Frame) {
	let smoke: Value = null;
	yield* parent_proc();
	yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(2, this.loc);
	yield* smoke.start();
	this.visible_message(`<span class='boldannounce'>The ${this} warps in!</span>`);
	playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 25, 1);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/hivebot_beacon/proc/warpbots"))), rand(10, 600));
	return f.dot;
}, true);

// hivebot.dm:21
rt.def("/obj/structure/hivebot_beacon/proc/warpbots", function* warpbots(f: Frame) {
	this.icon_state = "def_radar";
	this.visible_message(`<span class='danger'>The ${this} turns on!</span>`);
	while (this.bot_amt > 0) {
		this.bot_amt--;
		if (this.bot_type === "norm") {
			yield* new_(T("/mob/living/simple_animal/hostile/hivebot"), rt.getStep(f, this, 0));
		} else if (this.bot_type === "range") {
			yield* new_(T("/mob/living/simple_animal/hostile/hivebot/range"), rt.getStep(f, this, 0));
		} else if (this.bot_type === "rapid") {
			yield* new_(T("/mob/living/simple_animal/hostile/hivebot/rapid"), rt.getStep(f, this, 0));
		}
	}
	yield* sleep(100);
	this.visible_message(`<span class='boldannounce'>The ${this} warps out!</span>`);
	playsound(this.loc, rt.rsc("sound/effects/empulse.ogg"), 25, 1);
	yield* qdel(this);
	return f.dot;
}, true);
