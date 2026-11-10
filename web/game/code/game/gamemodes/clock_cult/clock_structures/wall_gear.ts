// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/wall_gear.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12165, "/obj/structure/destructible/clockwork/wall_gear", "/obj/structure/destructible/clockwork", {
	unanchored_icon: "wall_gear",
	construction_value: 3,
	name: "massive gear",
	icon_state: "wall_gear",
	climbable: 1,
	max_integrity: 100,
	obj_integrity: 100,
	layer: 2.9,
	desc: "A massive brass gear. You could probably secure or unsecure it with a wrench, or just climb over it.",
	break_message: "<span class='warning'>The gear breaks apart into shards of alloy!</span>",
	debris: null,
});

// wall_gear.dm:13
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/large"), 1, T("/obj/item/clockwork/alloy_shards/medium"), 4, T("/obj/item/clockwork/alloy_shards/small"), 2]);
	return f.dot;
});

// wall_gear.dm:21
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* new_(T("/obj/effect/temp_visual/ratvar/gear"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

// wall_gear.dm:28
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null, _T: Value = null, brass_floor: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		yield* this.default_unfasten_wrench(user, I, 10);
		return 1;
	} else if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.anchored) {
			to_chat(user, `<span class='warning'>${this} needs to be unsecured to disassemble it!</span>`);
		} else {
			playsound(this, I.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} starts to disassemble ${this}.</span>`, `<span class='notice'>You start to disassemble ${this}...</span>`);
			if ((yield* do_after(user, 30 * I.toolspeed, { target: this })) && !this.anchored) {
				to_chat(user, `<span class='notice'>You disassemble ${this}.</span>`);
				yield* this.deconstruct(1);
			}
		}
		return 1;
	} else if (rt.istype(I, T("/obj/item/stack/tile/brass"))) {
		if ((W = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one brass sheet to do this!</span>");
			return f.dot;
		}
		if (rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/closed/wall"))) {
			to_chat(user, "<span class='warning'>There is already a wall present!</span>");
			return f.dot;
		}
		if (!rt.istype(_T, T("/turf/open/floor"))) {
			to_chat(user, `<span class='warning'>A floor must be present to build a ${this.anchored ? "false " : ""}wall!</span>`);
			return f.dot;
		}
		if (rt.locateIn(f, T("/obj/structure/falsewall"), _T.contents)) {
			to_chat(user, "<span class='warning'>There is already a false wall present!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${W} to ${this}...</span>`);
		if (yield* do_after(user, 20, { target: this })) {
			brass_floor = 0;
			if (rt.istype(_T, T("/turf/open/floor/clockwork"))) {
				brass_floor = 1;
			}
			if (yield* W.use(2 - brass_floor)) {
				if (this.anchored) {
					yield* _T.ChangeTurf(T("/turf/closed/wall/clockwork"));
				} else {
					yield* _T.ChangeTurf(T("/turf/open/floor/clockwork"));
					yield* new_(T("/obj/structure/falsewall/brass"), _T);
				}
				yield* qdel(this);
			} else {
				to_chat(user, `<span class='warning'>You need more brass to make a ${this.anchored ? "false " : ""}wall!</span>`);
			}
		}
		return 1;
	}
	return (yield* parent_proc());
}, true);

// wall_gear.dm:74
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/deconstruct", function* deconstruct(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT) && f.args[0]) {
		yield* new_(T("/obj/item/stack/tile/brass"), this.loc, 3);
	}
	return (yield* parent_proc());
}, true, { args: ["disassembled"] });
