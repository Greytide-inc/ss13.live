// From code/modules/spells/spell_types/mime.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11364, "/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall", "/obj/effect/proc_holder/spell/aoe_turf/conjure", {
	summon_lifespan: 300,
	cast_sound: null,
	name: "Invisible Wall",
	desc: "The mime's performance transmutates into physical reality.",
	school: "mime",
	panel: "Mime",
	summon_type: null,
	invocation_type: "emote",
	invocation_emote_self: "<span class='notice'>You form a wall in front of yourself.</span>",
	charge_max: 300,
	clothes_req: 0,
	range: 0,
	human_req: 1,
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall/proc/<init>  (code/modules/spells/spell_types/mime.dm:6)
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "summon_type", rt.list(T("/obj/effect/forcefield/mime")));
	return f.dot;
});

// /obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall/proc/Click  (code/modules/spells/spell_types/mime.dm:20)  may sleep
rt.def("/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall/proc/Click", function* Click(f: Frame) {
	if ((truthy(live(f.usr)) && truthy(rt.fv(f, "mind", live(f.usr))))) {
		if (!truthy(rt.gv(f, "miming", rt.fv(f, "mind", live(f.usr))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You must dedicate yourself to silence first.</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "invocation", fmt("<B>＀</B> looks as if a wall is in front of ＀.", [rt.fv(f, "real_name", live(f.usr)), (yield* g.callName(f, live(f.usr), "p_them", []))]));
	} else {
		rt.setSv(f, "invocation_type", "none");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11328, "/obj/effect/proc_holder/spell/targeted/mime/speak", "/obj/effect/proc_holder/spell/targeted/mime", {
	include_user: 1,
	name: "Speech",
	desc: "Make or break a vow of silence.",
	school: "mime",
	panel: "Mime",
	clothes_req: 0,
	human_req: 1,
	charge_max: 3000,
	range: -1,
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
});

// /obj/effect/proc_holder/spell/targeted/mime/speak/proc/Click  (code/modules/spells/spell_types/mime.dm:45)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/mime/speak/proc/Click", function* Click(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(live(f.usr))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "miming", rt.gv(f, "mind", (H = live(f.usr)))))) {
		rt.setSv(f, "still_recharging_msg", "<span class='warning'>You can't break your vow of silence that fast!</span>");
	} else {
		rt.setSv(f, "still_recharging_msg", "<span class='warning'>You'll have to wait before you can give your vow of silence again!</span>");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/mime/speak/proc/cast  (code/modules/spells/spell_types/mime.dm:57)
rt.def("/obj/effect/proc_holder/spell/targeted/mime/speak/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [user, H, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	H = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		rt.setFv(f, "miming", rt.fv(f, "mind", live(H)), (!truthy(rt.gv(f, "miming", rt.fv(f, "mind", live(H)))) ? 1 : 0));
		if (truthy(rt.gv(f, "miming", rt.fv(f, "mind", live(H))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You make a vow of silence.</span>"]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You break your vow of silence.</span>"]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(11315, "/obj/effect/proc_holder/spell/targeted/forcewall/mime", "/obj/effect/proc_holder/spell/targeted/forcewall", {
	include_user: 1,
	name: "Invisible Blockade",
	desc: "Form an invisible three tile wide blockade.",
	wall_type: rt.typePath("/obj/effect/forcefield/mime/advanced"),
	invocation_type: "emote",
	invocation_emote_self: "<span class='notice'>You form a blockade in front of yourself.</span>",
	charge_max: 600,
	sound: null,
	clothes_req: 0,
	range: -1,
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
});

// /obj/effect/proc_holder/spell/targeted/forcewall/mime/proc/Click  (code/modules/spells/spell_types/mime.dm:82)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/forcewall/mime/proc/Click", function* Click(f: Frame) {
	if ((truthy(live(f.usr)) && truthy(rt.fv(f, "mind", live(f.usr))))) {
		if (!truthy(rt.gv(f, "miming", rt.fv(f, "mind", live(f.usr))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You must dedicate yourself to silence first.</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "invocation", fmt("<B>＀</B> looks as if a blockade is in front of ＀.", [rt.fv(f, "real_name", live(f.usr)), (yield* g.callName(f, live(f.usr), "p_them", []))]));
	} else {
		rt.setSv(f, "invocation_type", "none");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(11381, "/obj/effect/proc_holder/spell/aimed/finger_guns", "/obj/effect/proc_holder/spell/aimed", {
	school: "mime",
	charge_max: 300,
	clothes_req: 0,
	invocation_type: "emote",
	invocation_emote_self: "<span class='dangers'>You fire your finger gun!</span>",
	range: 20,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet2"),
	projectile_amount: 3,
	sound: null,
	active_msg: "You draw your fingers!",
	deactive_msg: "You put your fingers at ease. Another time.",
	action_icon_state: "mime",
	action_background_icon_state: "bg_mime",
	base_icon_state: "mime",
	name: "Finger Guns",
	desc: "Shoot a mimed bullet from your fingers that stuns and does some damage.",
	panel: "Mime",
	active: 0,
});

// /obj/effect/proc_holder/spell/aimed/finger_guns/proc/Click  (code/modules/spells/spell_types/mime.dm:114)  may sleep
rt.def("/obj/effect/proc_holder/spell/aimed/finger_guns/proc/Click", function* Click(f: Frame) {
	let owner: Value = null;
	f.vars = () => [owner];
	if (truthy((yield* g.callName(f, (owner = live(f.usr)), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='warning'>You can't properly point your fingers while incapacitated.</span>"]);
		return live(f.dot);
	}
	if ((truthy(live(f.usr)) && truthy(rt.fv(f, "mind", live(f.usr))))) {
		if (!truthy(rt.gv(f, "miming", rt.fv(f, "mind", live(f.usr))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You must dedicate yourself to silence first.</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "invocation", fmt("<B>＀</B> fires ＀ finger gun!", [rt.fv(f, "real_name", live(f.usr)), (yield* g.callName(f, live(f.usr), "p_their", []))]));
	} else {
		rt.setSv(f, "invocation_type", "none");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
