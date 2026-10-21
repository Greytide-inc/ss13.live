// From code/modules/surgery/bodyparts/head.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10198, "/obj/item/bodypart/head", "/obj/item/bodypart", {
	brainmob: null,
	brain: null,
	real_name: "",
	hair_color: "000",
	hair_style: "Bald",
	hair_alpha: 255,
	facial_hair_color: "000",
	facial_hair_style: "Shaved",
	eyes: null,
	lip_style: null,
	lip_color: "white",
	max_damage: 200,
	body_zone: "head",
	body_part: 1,
	w_class: 4,
	slowdown: 1,
	throw_range: 2,
	px_x: 0,
	px_y: -8,
	name: "head",
	desc: "Didn't make sense not to live for fun, your brain gets smart but your head gets dumb.",
	icon: rt.rsc("icons/mob/human_parts.dmi"),
	icon_state: "default_human_head",
});

// /obj/item/bodypart/head/proc/drop_organs  (code/modules/surgery/bodyparts/head.dm:35)  may sleep
rt.def("/obj/item/bodypart/head/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	let _T: Value = null, I: Value = null, AP: Value = null;
	let $e: any;
	f.vars = () => [user, _T, I, AP, $e];
	_T = rt.getStep(f, live(f.src), 0);
	if (!isEqual(rt.sv(f, "status"), 2)) {
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/misc/splort.ogg"), 50, 1, -1]);
	}
	I = null;
	rt.forList(f, 0, live(f.src), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), rt.sv(f, "brain"))) {
			if (truthy(live(user))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ saws ＀ open and pulls out a brain!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You saw ＀ open and pull out a brain.</span>", [live(f.src)])]);
			}
			if (truthy(rt.sv(f, "brainmob"))) {
				rt.setFv(f, "container", rt.sv(f, "brainmob"), null);
				rt.setFv(f, "loc", rt.sv(f, "brainmob"), rt.sv(f, "brain"));
				rt.setFv(f, "brainmob", rt.sv(f, "brain"), rt.sv(f, "brainmob"));
				rt.setSv(f, "brainmob", null);
			}
			rt.setFv(f, "loc", rt.sv(f, "brain"), live(_T));
			rt.setSv(f, "brain", null);
			yield* g.srcCall(f, "update_icon_dropped");
		} else {
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/reagent_containers/pill")) ? 1 : 0))) {
				AP = null;
				rt.forList(f, 1, rt.fv(f, "actions", live(I)), T("/datum/action/item_action/hands_free/activate_pill"));
				while (($e = rt.next(f, 1)) !== undefined) {
					AP = $e;
					yield* g.call(f, P("/proc/qdel"), null, [live(AP)]);
				}
				rt.endFor(f, 1);
			}
			yield* g.callName(f, live(I), "forceMove", [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/bodypart/head/proc/update_limb  (code/modules/surgery/bodyparts/head.dm:59)
rt.def("/obj/item/bodypart/head/proc/update_limb", function update_limb(f: Frame) {
	let C: Value = null, H: Value = null, S: Value = null;
	f.vars = () => [C, H, S];
	C = null;
	if (truthy(live(f.args[1]))) {
		C = live(f.args[1]);
	} else {
		C = rt.sv(f, "owner");
	}
	rt.setSv(f, "real_name", rt.fv(f, "real_name", live(C)));
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(C)), 64))) {
		rt.setSv(f, "real_name", "Unknown");
		rt.setSv(f, "hair_style", "Bald");
		rt.setSv(f, "facial_hair_style", "Shaved");
		rt.setSv(f, "lip_style", null);
	} else {
		if (!truthy(rt.sv(f, "animal_origin"))) {
			H = live(C);
			S = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
			if ((truthy(rt.fv(f, "facial_hair_style", live(H))) && truthy((rt.isIn(f, 3, rt.fv(f, "species_traits", live(S))) ? 1 : 0)))) {
				rt.setSv(f, "facial_hair_style", rt.fv(f, "facial_hair_style", live(H)));
				if (truthy(rt.fv(f, "hair_color", live(S)))) {
					if (isEqual(rt.fv(f, "hair_color", live(S)), "mutcolor")) {
						rt.setSv(f, "facial_hair_color", rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor"));
					} else {
						rt.setSv(f, "facial_hair_color", rt.fv(f, "hair_color", live(S)));
					}
				} else {
					rt.setSv(f, "facial_hair_color", rt.fv(f, "facial_hair_color", live(H)));
				}
				rt.setSv(f, "hair_alpha", rt.fv(f, "hair_alpha", live(S)));
			} else {
				rt.setSv(f, "facial_hair_style", "Shaved");
				rt.setSv(f, "facial_hair_color", "000");
				rt.setSv(f, "hair_alpha", 255);
			}
			if ((truthy(rt.fv(f, "hair_style", live(H))) && truthy((rt.isIn(f, 2, rt.fv(f, "species_traits", live(S))) ? 1 : 0)))) {
				rt.setSv(f, "hair_style", rt.fv(f, "hair_style", live(H)));
				if (truthy(rt.fv(f, "hair_color", live(S)))) {
					if (isEqual(rt.fv(f, "hair_color", live(S)), "mutcolor")) {
						rt.setSv(f, "hair_color", rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor"));
					} else {
						rt.setSv(f, "hair_color", rt.fv(f, "hair_color", live(S)));
					}
				} else {
					rt.setSv(f, "hair_color", rt.fv(f, "hair_color", live(H)));
				}
				rt.setSv(f, "hair_alpha", rt.fv(f, "hair_alpha", live(S)));
			} else {
				rt.setSv(f, "hair_style", "Bald");
				rt.setSv(f, "hair_color", "000");
				rt.setSv(f, "hair_alpha", rt.initial(f, live(f.src), "hair_alpha"));
			}
			if ((truthy(rt.fv(f, "lip_style", live(H))) && truthy((rt.isIn(f, 5, rt.fv(f, "species_traits", live(S))) ? 1 : 0)))) {
				rt.setSv(f, "lip_style", rt.fv(f, "lip_style", live(H)));
				rt.setSv(f, "lip_color", rt.fv(f, "lip_color", live(H)));
			} else {
				rt.setSv(f, "lip_style", null);
				rt.setSv(f, "lip_color", "white");
			}
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["dropping_limb", "source"] });

// /obj/item/bodypart/head/proc/update_icon_dropped  (code/modules/surgery/bodyparts/head.dm:114)
rt.def("/obj/item/bodypart/head/proc/update_icon_dropped", function update_icon_dropped(f: Frame) {
	let standing: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [standing, I, $e];
	if (!truthy(rt.getLen(f, (standing = rt.callSrc(f, "get_limb_icon", [1]))))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, live(standing), T("/image"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "pixel_x", live(I), rt.sv(f, "px_x"));
		rt.setFv(f, "pixel_y", live(I), rt.sv(f, "px_y"));
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "add_overlay", [live(standing)]);
	return f.dot;
});

// /obj/item/bodypart/head/proc/get_limb_icon  (code/modules/surgery/bodyparts/head.dm:124)
rt.def("/obj/item/bodypart/head/proc/get_limb_icon", function get_limb_icon(f: Frame) {
	let S: Value = null, facial_overlay: Value = null, hair_overlay: Value = null, lips_overlay: Value = null, eyes_overlay: Value = null;
	f.vars = () => [S, facial_overlay, hair_overlay, lips_overlay, eyes_overlay];
	rt.callSrc(f, "cut_overlays", []);
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	S = null;
	if (!isEqual(rt.sv(f, "status"), 2)) {
		if (truthy(rt.sv(f, "facial_hair_style"))) {
			if (truthy((S = rt.index(rt.gl("facial_hair_styles_list"), rt.sv(f, "facial_hair_style"))))) {
				rt.setFv(f, "color", (facial_overlay = rt.call(f, P("/proc/image"), null, [rt.fv(f, "icon", live(S)), fmt("＀", [rt.fv(f, "icon_state", live(S))]), -8, 2])), add("#", rt.sv(f, "facial_hair_color")));
				rt.setFv(f, "alpha", live(facial_overlay), rt.sv(f, "hair_alpha"));
				f.dot = rt.modify(live(f.dot), live(facial_overlay), add);
			}
		}
		f.dot = rt.modify(live(f.dot), (hair_overlay = rt.call(f, P("/proc/image"), null, ["layer", -8, "dir", 2], rt.Args.Named)), add);
		if (!truthy(rt.sv(f, "brain"))) {
			if (isEqual(rt.sv(f, "animal_origin"), "alien")) {
				rt.setFv(f, "icon", live(hair_overlay), rt.rsc("icons/mob/animal_parts.dmi"));
				rt.setFv(f, "icon_state", live(hair_overlay), "debrained_alien");
			} else {
				if (isEqual(rt.sv(f, "animal_origin"), "larva")) {
					rt.setFv(f, "icon", live(hair_overlay), rt.rsc("icons/mob/animal_parts.dmi"));
					rt.setFv(f, "icon_state", live(hair_overlay), "debrained_larva");
				} else {
					if (!truthy((rt.isIn(f, 12, rt.sv(f, "species_flags_list")) ? 1 : 0))) {
						rt.setFv(f, "icon", live(hair_overlay), rt.rsc("icons/mob/human_face.dmi"));
						rt.setFv(f, "icon_state", live(hair_overlay), "debrained");
					}
				}
			}
		} else {
			if (truthy(rt.sv(f, "hair_style"))) {
				if (truthy((S = rt.index(rt.gl("hair_styles_list"), rt.sv(f, "hair_style"))))) {
					rt.setFv(f, "icon", live(hair_overlay), rt.sv(f, "icon"));
					rt.setFv(f, "icon_state", live(hair_overlay), fmt("＀", [rt.fv(f, "icon_state", live(S))]));
					rt.setFv(f, "color", live(hair_overlay), add("#", rt.sv(f, "hair_color")));
					rt.setFv(f, "alpha", live(hair_overlay), rt.sv(f, "hair_alpha"));
				}
			}
		}
	}
	if (truthy(rt.sv(f, "lip_style"))) {
		rt.setFv(f, "color", (lips_overlay = rt.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human_face.dmi"), fmt("lips_＀", [rt.sv(f, "lip_style")]), -22, 2])), rt.sv(f, "lip_color"));
		f.dot = rt.modify(live(f.dot), live(lips_overlay), add);
	}
	f.dot = rt.modify(live(f.dot), (eyes_overlay = rt.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/human_face.dmi"), "eyes", -22, 2])), add);
	if (!truthy(rt.sv(f, "eyes"))) {
		rt.setFv(f, "icon_state", live(eyes_overlay), "eyes_missing");
	} else {
		if (!truthy(rt.fv(f, "eye_color", rt.sv(f, "eyes")))) return f.dot;
		rt.setFv(f, "color", live(eyes_overlay), add("#", rt.fv(f, "eye_color", rt.sv(f, "eyes"))));
	}
	return f.dot;
}, false, { args: ["dropped"] });
