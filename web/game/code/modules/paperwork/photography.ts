// From code/modules/paperwork/photography.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7625, "/obj/item/weapon/photo", "/obj/item/weapon", {
	img: null,
	scribble: null,
	blueprints: 0,
	sillynewscastervar: null,
	name: "photo",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "photo",
	item_state: "paper",
	w_class: 1,
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/item/weapon/photo/proc/attack_self  (code/modules/paperwork/photography.dm:42)  may sleep
rt.def("/obj/item/weapon/photo/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/photo/proc/attackby  (code/modules/paperwork/photography.dm:46)  may sleep
rt.def("/obj/item/weapon/photo/proc/attackby", function* attackby(f: Frame) {
	let txt: Value = null;
	f.vars = () => [txt];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		txt = (yield* g.call(f, P("/proc/copytext"), null, [(txt = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, "Photo Writing", "What would you like to write on the back?", live(f.args[1]), null]))]))), 1, 128]));
		if ((isEqual(rt.sv(f, "loc"), live(f.args[1])) && isEqual(rt.fv(f, "stat", live(f.args[1])), 0))) {
			rt.setSv(f, "scribble", live(txt));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// /obj/item/weapon/photo/proc/examine  (code/modules/paperwork/photography.dm:55)
rt.def("/obj/item/weapon/photo/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])]), 1)) {
		rt.callSrc(f, "show", [live(f.args[0])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need to get closer to get a good look at this photo!</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/photo/proc/show  (code/modules/paperwork/photography.dm:64)
rt.def("/obj/item/weapon/photo/proc/show", function show(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.op(f, "BrowseResource", [], [live(user), rt.sv(f, "img"), "tmp_photo.png"], false);
	$0 = live(user);
	$1 = add(add(fmt("<html><head><title>＀</title></head>", [rt.sv(f, "name")]), "<body style='overflow:hidden;margin:0;text-align:center'>"), "<img src='tmp_photo.png' width='192' style='-ms-interpolation-mode:nearest-neighbor' />");
	if (truthy(rt.sv(f, "scribble"))) {
		$2 = fmt("<br>Written on the back:<br><i>＀</i>", [rt.sv(f, "scribble")]);
	} else {
		$2 = "";
	}
	$1 = add(add($1, fmt("＀", [$2])), "</body></html>");
	if (truthy(rt.sv(f, "scribble"))) {
		$2 = 400;
	} else {
		$2 = 192;
	}
	rt.op(f, "Browse", [], [$0, $1, fmt("window=book;size=192x＀", [$2])], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), fmt("＀", [rt.sv(f, "name")])]);
	return f.dot;
});

// /obj/item/weapon/photo/verb/rename  (code/modules/paperwork/photography.dm:78)  may sleep
rt.def("/obj/item/weapon/photo/verb/rename", function* rename(f: Frame) {
	let n_name: Value = null;
	let $0: any;
	f.vars = () => [n_name, $0];
	n_name = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, "Photo Labelling", "What would you like to label the photo?", live(f.usr), null]))])), 1, 42]));
	if (((((isEqual(rt.sv(f, "loc"), live(f.usr)) || (truthy(rt.fv(f, "loc", rt.sv(f, "loc"))) && isEqual(rt.fv(f, "loc", rt.sv(f, "loc")), live(f.usr)))) && isEqual(rt.fv(f, "stat", live(f.usr)), 0)) && truthy(rt.fv(f, "canmove", live(f.usr)))) && !truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		if (truthy(live(n_name))) {
			$0 = fmt("- '＀'", [live(n_name)]);
		} else {
			$0 = null;
		}
		rt.setSv(f, "name", fmt("photo＀", [$0]));
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true, { verb: { name: "Rename photo", category: "Object", src: 11 } });

// /obj/item/weapon/photo/proc/photocreate  (code/modules/paperwork/photography.dm:85)
rt.def("/obj/item/weapon/photo/proc/photocreate", function photocreate(f: Frame, inicon: Value, inimg: Value, indesc: Value, inblueprints: Value) {
	rt.setSv(f, "icon", live(inicon));
	rt.setSv(f, "img", live(inimg));
	rt.setSv(f, "desc", live(indesc));
	rt.setSv(f, "blueprints", live(inblueprints));
	return f.dot;
});

rt.type(5604, "/obj/item/weapon/storage/photo_album", "/obj/item/weapon/storage", {
	name: "photo album",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "album",
	item_state: "briefcase",
	can_hold: null,
	resistance_flags: 4,
});

// /obj/item/weapon/storage/photo_album/proc/<init>  (code/modules/paperwork/photography.dm:98)
rt.def("/obj/item/weapon/storage/photo_album/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/photo")));
	return f.dot;
});

rt.type(9422, "/obj/item/device/camera", "/obj/item/device", {
	pictures_max: 10,
	pictures_left: 10,
	on: 1,
	blueprints: 0,
	aipictures: null,
	see_ghosts: 0,
	flags: 64,
	name: "camera",
	icon: rt.rsc("icons/obj/items.dmi"),
	desc: "A polaroid camera.",
	icon_state: "camera",
	item_state: "electropack",
	w_class: 2,
	slot_flags: 512,
	materials: null,
});

// /obj/item/device/camera/proc/<init>  (code/modules/paperwork/photography.dm:118)
rt.def("/obj/item/device/camera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "aipictures", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/device/camera/proc/CheckParts  (code/modules/paperwork/photography.dm:123)  may sleep
rt.def("/obj/item/device/camera/proc/CheckParts", function* CheckParts(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((C = rt.locateIn(f, T("/obj/item/device/camera"), rt.sv(f, "contents"))))) return f.dot;
	rt.setSv(f, "pictures_max", rt.fv(f, "pictures_max", live(C)));
	rt.setSv(f, "pictures_left", rt.fv(f, "pictures_left", live(C)));
	yield* g.srcCall(f, "visible_message", fmt("＀ has been imbued with godlike power!", [live(C)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	return f.dot;
}, true, { args: ["parts_list"] });

rt.type(9427, "/obj/item/device/camera/siliconcam/robot_camera", "/obj/item/device/camera/siliconcam", {
	name: "Cyborg photo camera",
});

// /obj/item/device/camera/siliconcam/robot_camera/verb/borgprinting  (code/modules/paperwork/photography.dm:159)  may sleep
rt.def("/obj/item/device/camera/siliconcam/robot_camera/verb/borgprinting", function* borgprinting(f: Frame) {
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "borgprint");
	return f.dot;
}, true, { verb: { name: "Print Image", category: "Robot Commands", src: 11 } });

// /obj/item/device/camera/proc/attackby  (code/modules/paperwork/photography.dm:168)  may sleep
rt.def("/obj/item/device/camera/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/camera_film")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "pictures_left"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ still has some film in it!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.setSv(f, "pictures_left", rt.sv(f, "pictures_max"));
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/device/camera/proc/examine  (code/modules/paperwork/photography.dm:182)
rt.def("/obj/item/device/camera/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It has ＀ photos left.", [rt.sv(f, "pictures_left")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/camera/proc/camera_get_icon  (code/modules/paperwork/photography.dm:187)
rt.def("/obj/item/device/camera/proc/camera_get_icon", function camera_get_icon(f: Frame, turfs: Value, center: Value) {
	let atoms: Value = null, _T: Value = null, A: Value = null, O: Value = null, sorted: Value = null, j: Value = null, i: Value = null, c: Value = null, c2: Value = null, res: Value = null, A_4: Value = null, img: Value = null, L: Value = null, offX: Value = null, offY: Value = null, _T_4: Value = null;
	let $e: any;
	f.vars = () => [atoms, _T, A, O, sorted, j, i, c, c2, res, A_4, img, L, offX, offY, _T_4, $e];
	atoms = rt.list();
	_T = null;
	rt.forList(f, 0, live(turfs), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.callName(f, live(atoms), "Add", [live(_T)]);
		A = null;
		rt.forList(f, 1, live(_T), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			if (truthy(rt.fv(f, "invisibility", live(A)))) {
				if ((truthy(rt.sv(f, "see_ghosts")) && truthy((rt.istype(live(A), T("/mob/dead/observer")) ? 1 : 0)))) {
					if (truthy(rt.gv(f, "orbiting", (O = live(A))))) {
						continue;
					}
				} else {
					continue;
				}
			}
			rt.callName(f, live(atoms), "Add", [live(A)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	sorted = rt.list();
	j = null;
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(atoms)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		c = rt.index(live(atoms), live(i));
		j = rt.len(f, live(sorted));
		while (rt.gt(live(j), 0)) {
			if (rt.le(rt.gv(f, "layer", (c2 = rt.index(live(sorted), live(j)))), rt.fv(f, "layer", live(c)))) {
				break;
			}
			j = rt.inc(live(j), -1);
		}
		rt.callName(f, live(sorted), "Insert", [add(live(j), 1), live(c)]);
	}
	rt.endFor(f, 0);
	res = rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/96x96.dmi"), ""]);
	A_4 = null;
	rt.forList(f, 0, live(sorted), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A_4 = $e;
		img = rt.call(f, P("/proc/getFlatIcon"), null, [live(A_4)]);
		if (truthy((rt.istype(live(A_4), T("/mob/living")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "lying", (L = live(A_4))))) {
				rt.callName(f, live(img), "Turn", [rt.fv(f, "lying", live(L))]);
			}
		}
		offX = add(add(multiply(32, subtract(rt.fv(f, "x", live(A_4)), rt.fv(f, "x", live(center)))), rt.fv(f, "pixel_x", live(A_4))), 33);
		offY = add(add(multiply(32, subtract(rt.fv(f, "y", live(A_4)), rt.fv(f, "y", live(center)))), rt.fv(f, "pixel_y", live(A_4))), 33);
		if (truthy((rt.istype(live(A_4), T("/atom/movable")) ? 1 : 0))) {
			offX = rt.modify(live(offX), rt.fv(f, "step_x", live(A_4)), add);
			offY = rt.modify(live(offY), rt.fv(f, "step_y", live(A_4)), add);
		}
		rt.callName(f, live(res), "Blend", [live(img), rt.call(f, P("/proc/blendMode2iconMode"), null, [rt.fv(f, "blend_mode", live(A_4))]), live(offX), live(offY)]);
		if (truthy((rt.istype(live(A_4), T("/obj/item/areaeditor/blueprints")) ? 1 : 0))) {
			rt.setSv(f, "blueprints", 1);
		}
	}
	rt.endFor(f, 0);
	_T_4 = null;
	rt.forList(f, 0, live(turfs), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T_4 = $e;
		rt.callName(f, live(res), "Blend", [rt.call(f, P("/proc/getFlatIcon"), null, [rt.fv(f, "loc", live(_T_4))]), rt.call(f, P("/proc/blendMode2iconMode"), null, [rt.fv(f, "blend_mode", live(_T_4))]), add(multiply(32, subtract(rt.fv(f, "x", live(_T_4)), rt.fv(f, "x", live(center)))), 33), add(multiply(32, subtract(rt.fv(f, "y", live(_T_4)), rt.fv(f, "y", live(center)))), 33)]);
	}
	rt.endFor(f, 0);
	return live(res);
});

// /obj/item/device/camera/proc/camera_get_mobs  (code/modules/paperwork/photography.dm:238)
rt.def("/obj/item/device/camera/proc/camera_get_mobs", function camera_get_mobs(f: Frame, the_turf: Value) {
	let mob_detail: Value = null, M: Value = null, O: Value = null, holding: Value = null, L: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [mob_detail, M, O, holding, L, I, $0, $1, $2, $e];
	mob_detail = null;
	M = null;
	rt.forList(f, 0, live(the_turf), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "invisibility", live(M)))) {
			if ((truthy(rt.sv(f, "see_ghosts")) && truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0)))) {
				if (truthy(rt.gv(f, "orbiting", (O = live(M))))) {
					continue;
				}
				if (!truthy(live(mob_detail))) {
					mob_detail = "You can see a g-g-g-g-ghooooost! ";
				} else {
					mob_detail = rt.modify(live(mob_detail), "You can also see a g-g-g-g-ghooooost!", add);
				}
			} else {
				continue;
			}
		}
		holding = rt.list();
		if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
			L = live(M);
			I = null;
			rt.forList(f, 1, rt.fv(f, "held_items", live(L)), T("/obj/item"));
			while (($e = rt.next(f, 1)) !== undefined) {
				I = $e;
				if (!truthy(live(holding))) {
					holding = rt.modify(live(holding), fmt("＀ ＀ holding ＇！", [rt.callName(f, live(L), "p_they", [1]), rt.callName(f, live(L), "p_are", []), live(I)]), add);
				} else {
					holding = rt.modify(live(holding), fmt(" and ＇！", [live(I)]), add);
				}
			}
			rt.endFor(f, 1);
			holding = rt.callName(f, live(holding), "Join", []);
			if (!truthy(live(mob_detail))) {
				$0 = live(L);
				if (rt.lt(rt.fv(f, "health", live(L)), multiply(rt.fv(f, "maxHealth", live(L)), 0.75))) {
					$1 = fmt(" - ＀ looks hurt", [live(L)]);
				} else {
					$1 = "";
				}
				if (truthy(live(holding))) {
					$2 = fmt(" ＀", [live(holding)]);
				} else {
					$2 = ".";
				}
				mob_detail = fmt("You can see ＀ on the photo＀.＀. ", [$0, $1, $2]);
			} else {
				$0 = live(L);
				if (rt.lt(rt.fv(f, "health", live(L)), multiply(rt.fv(f, "maxHealth", live(L)), 0.75))) {
					$1 = fmt(" - ＀ looks hurt", [live(L)]);
				} else {
					$1 = "";
				}
				if (truthy(live(holding))) {
					$2 = fmt(" ＀", [live(holding)]);
				} else {
					$2 = ".";
				}
				mob_detail = rt.modify(live(mob_detail), fmt("You can also see ＀ on the photo＀.＀.", [$0, $1, $2]), add);
			}
		}
	}
	rt.endFor(f, 0);
	return live(mob_detail);
});

// /obj/item/device/camera/proc/captureimage  (code/modules/paperwork/photography.dm:273)  may sleep
rt.def("/obj/item/device/camera/proc/captureimage", function* captureimage(f: Frame, target: Value, user: Value, flag: Value) {
	let mobs: Value = null, isAi: Value = null, seen: Value = null, turfs: Value = null, _T: Value = null, temp: Value = null;
	let $e: any;
	f.vars = () => [target, user, flag, mobs, isAi, seen, turfs, _T, temp, $e];
	mobs = "";
	isAi = (rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0);
	seen = null;
	if (!truthy(live(isAi))) {
		if (truthy(rt.fv(f, "client", live(user)))) {
			seen = (yield* g.call(f, P("/proc/get_hear"), null, [rt.fv(f, "view", rt.world()), rt.gv(f, "eye", rt.fv(f, "client", live(user)))]));
		} else {
			seen = (yield* g.call(f, P("/proc/get_hear"), null, [rt.fv(f, "view", rt.world()), live(user)]));
		}
	} else {
		seen = (yield* g.call(f, P("/proc/get_hear"), null, [rt.fv(f, "view", rt.world()), live(target)]));
	}
	turfs = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(target)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((rt.isIn(f, live(_T), live(seen)) ? 1 : 0))) {
			if ((truthy(live(isAi)) && !truthy((yield* g.callName(f, rt.gl("cameranet"), "checkTurfVis", [live(_T)]))))) {
				continue;
			}
			turfs = rt.modify(live(turfs), live(_T), add);
			mobs = rt.modify(live(mobs), (yield* g.srcCall(f, "camera_get_mobs", live(_T))), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (temp = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/96x96.dmi"), ""]))), "Blend", ["#000", 3]);
	yield* g.callName(f, live(temp), "Blend", [(yield* g.srcCall(f, "camera_get_icon", live(turfs), live(target))), 3]);
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		yield* g.srcCall(f, "printpicture", live(user), live(temp), live(mobs), live(flag));
	} else {
		yield* g.srcCall(f, "aipicture", live(user), live(temp), live(mobs), live(isAi), rt.sv(f, "blueprints"));
	}
	return f.dot;
}, true);

// /obj/item/device/camera/proc/printpicture  (code/modules/paperwork/photography.dm:306)  may sleep
rt.def("/obj/item/device/camera/proc/printpicture", function* printpicture(f: Frame, user: Value, temp: Value, mobs: Value, flag: Value) {
	let _P: Value = null, small_img: Value = null, ic: Value = null;
	f.vars = () => [user, temp, mobs, flag, _P, small_img, ic];
	_P = (yield* g.new_(f, T("/obj/item/weapon/photo"), [rt.getStep(f, live(f.src), 0)]));
	if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		yield* g.callName(f, live(user), "put_in_hands", [live(_P)]);
	}
	small_img = (yield* g.call(f, P("/proc/icon"), null, [live(temp)]));
	ic = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/items.dmi"), "photo"]));
	yield* g.callName(f, live(small_img), "Scale", [8, 8]);
	yield* g.callName(f, live(ic), "Blend", [live(small_img), 3, 13, 13]);
	rt.setFv(f, "icon", live(_P), live(ic));
	rt.setFv(f, "img", live(_P), live(temp));
	rt.setFv(f, "desc", live(_P), live(mobs));
	rt.setFv(f, "pixel_x", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setFv(f, "pixel_y", live(_P), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	if (!truthy(rt.sv(f, "blueprints"))) return f.dot;
	rt.setFv(f, "blueprints", live(_P), 1);
	rt.setSv(f, "blueprints", 0);
	return f.dot;
}, true);

// /obj/item/device/camera/proc/aipicture  (code/modules/paperwork/photography.dm:326)
rt.def("/obj/item/device/camera/proc/aipicture", function aipicture(f: Frame, user: Value, temp: Value, mobs: Value, isAi: Value) {
	let small_img: Value = null, ic: Value = null, icon: Value = null, img: Value = null, desc: Value = null, pixel_x: Value = null, pixel_y: Value = null, injectblueprints: Value = null;
	f.vars = () => [small_img, ic, icon, img, desc, pixel_x, pixel_y, injectblueprints];
	small_img = rt.call(f, P("/proc/icon"), null, [live(temp)]);
	ic = rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/items.dmi"), "photo"]);
	rt.callName(f, live(small_img), "Scale", [8, 8]);
	rt.callName(f, live(ic), "Blend", [live(small_img), 3, 13, 13]);
	icon = live(ic);
	img = live(temp);
	desc = live(mobs);
	pixel_x = rt.call(f, P("/proc/rand"), null, [-10, 10]);
	pixel_y = rt.call(f, P("/proc/rand"), null, [-10, 10]);
	injectblueprints = 1;
	if (truthy(rt.sv(f, "blueprints"))) {
		injectblueprints = 1;
		rt.setSv(f, "blueprints", 0);
	}
	if (truthy(live(isAi))) {
		rt.callSrc(f, "injectaialbum", [live(icon), live(img), live(desc), live(pixel_x), live(pixel_y), live(injectblueprints)]);
	} else {
		rt.callSrc(f, "injectmasteralbum", [live(icon), live(img), live(desc), live(pixel_x), live(pixel_y), live(injectblueprints)]);
	}
	return f.dot;
});

rt.type(4176, "/datum/picture", "/datum", {
	name: "image",
	fields: null,
});

// /datum/picture/proc/<init>  (code/modules/paperwork/photography.dm:350)
rt.def("/datum/picture/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "fields", rt.list());
	return f.dot;
});

// /obj/item/device/camera/proc/injectaialbum  (code/modules/paperwork/photography.dm:355)
rt.def("/obj/item/device/camera/proc/injectaialbum", function injectaialbum(f: Frame, icon: Value, img: Value, desc: Value, pixel_x: Value, pixel_y: Value, blueprintsinject: Value) {
	let numberer: Value = null, picture: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [numberer, picture, _P, $e];
	numberer = 1;
	picture = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(f.src)), T("/datum"));
	while (($e = rt.next(f, 0)) !== undefined) {
		picture = $e;
		numberer = rt.inc(live(numberer), 1);
	}
	rt.endFor(f, 0);
	rt.setAt(rt.gv(f, "fields", (_P = rt.new_(f, T("/datum/picture"), []))), "name", fmt("Image ＀ (taken by ＀)", [live(numberer), rt.gv(f, "name", rt.fv(f, "loc", live(f.src)))]));
	rt.setAt(rt.fv(f, "fields", live(_P)), "icon", live(icon));
	rt.setAt(rt.fv(f, "fields", live(_P)), "img", live(img));
	rt.setAt(rt.fv(f, "fields", live(_P)), "desc", live(desc));
	rt.setAt(rt.fv(f, "fields", live(_P)), "pixel_x", live(pixel_x));
	rt.setAt(rt.fv(f, "fields", live(_P)), "pixel_y", live(pixel_y));
	rt.setAt(rt.fv(f, "fields", live(_P)), "blueprints", live(blueprintsinject));
	rt.modSrcVar(f, "aipictures", live(_P), add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='unconscious'>Image recorded</span>"]);
	return f.dot;
});

// /obj/item/device/camera/proc/injectmasteralbum  (code/modules/paperwork/photography.dm:372)
rt.def("/obj/item/device/camera/proc/injectmasteralbum", function injectmasteralbum(f: Frame, icon: Value, img: Value, desc: Value, pixel_x: Value, pixel_y: Value, blueprintsinject: Value) {
	let numberer: Value = null, C: Value = null, picture: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [numberer, C, picture, _P, $e];
	numberer = 1;
	if (truthy(rt.gv(f, "connected_ai", (C = rt.fv(f, "loc", live(f.src)))))) {
		picture = null;
		rt.forList(f, 0, rt.gv(f, "aipictures", rt.gv(f, "aicamera", rt.fv(f, "connected_ai", live(C)))), T("/datum"));
		while (($e = rt.next(f, 0)) !== undefined) {
			picture = $e;
			numberer = rt.inc(live(numberer), 1);
		}
		rt.endFor(f, 0);
		rt.setAt(rt.gv(f, "fields", (_P = rt.new_(f, T("/datum/picture"), []))), "name", fmt("Image ＀ (taken by ＀)", [live(numberer), rt.gv(f, "name", rt.fv(f, "loc", live(f.src)))]));
		rt.setAt(rt.fv(f, "fields", live(_P)), "icon", live(icon));
		rt.setAt(rt.fv(f, "fields", live(_P)), "img", live(img));
		rt.setAt(rt.fv(f, "fields", live(_P)), "desc", live(desc));
		rt.setAt(rt.fv(f, "fields", live(_P)), "pixel_x", live(pixel_x));
		rt.setAt(rt.fv(f, "fields", live(_P)), "pixel_y", live(pixel_y));
		rt.setAt(rt.fv(f, "fields", live(_P)), "blueprints", live(blueprintsinject));
		rt.modField(f, rt.gv(f, "aicamera", rt.fv(f, "connected_ai", live(C))), "aipictures", live(_P), add);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='unconscious'>Image recorded and saved to remote database</span>"]);
	} else {
		rt.callSrc(f, "injectaialbum", [live(icon), live(img), live(desc), live(pixel_x), live(pixel_y), live(blueprintsinject)]);
	}
	return f.dot;
});

rt.type(9425, "/obj/item/device/camera/siliconcam", "/obj/item/device/camera", {
	in_camera_mode: 0,
	name: "silicon photo camera",
});

// /obj/item/device/camera/siliconcam/proc/selectpicture  (code/modules/paperwork/photography.dm:390)  may sleep
rt.def("/obj/item/device/camera/siliconcam/proc/selectpicture", function* selectpicture(f: Frame, targetloc: Value) {
	let nametemp: Value = null, find: Value = null, t: Value = null, q: Value = null;
	let $e: any;
	f.vars = () => [targetloc, nametemp, find, t, q, $e];
	nametemp = rt.list();
	find = null;
	if (isEqual(rt.getLen(f, rt.fv(f, "aipictures", live(targetloc))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldannounce'>No images saved</span>"]);
		return live(f.dot);
	}
	t = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(targetloc)), T("/datum/picture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		nametemp = rt.modify(live(nametemp), rt.index(rt.fv(f, "fields", live(t)), "name"), add);
	}
	rt.endFor(f, 0);
	find = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", live(nametemp)]));
	q = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(targetloc)), T("/datum/picture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		q = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(q)), "name"), live(find))) {
			return live(q);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/device/camera/siliconcam/proc/viewpichelper  (code/modules/paperwork/photography.dm:403)  may sleep
rt.def("/obj/item/device/camera/siliconcam/proc/viewpichelper", function* viewpichelper(f: Frame, targetloc: Value) {
	let _P: Value = null, selection: Value = null;
	f.vars = () => [targetloc, _P, selection];
	_P = (yield* g.new_(f, T("/obj/item/weapon/photo"), []));
	if (truthy((selection = (yield* g.srcCall(f, "selectpicture", live(targetloc)))))) {
		yield* g.callName(f, live(_P), "photocreate", [rt.index(rt.fv(f, "fields", live(selection)), "icon"), rt.index(rt.fv(f, "fields", live(selection)), "img"), rt.index(rt.fv(f, "fields", live(selection)), "desc")]);
		rt.setFv(f, "pixel_x", live(_P), rt.index(rt.fv(f, "fields", live(selection)), "pixel_x"));
		rt.setFv(f, "pixel_y", live(_P), rt.index(rt.fv(f, "fields", live(selection)), "pixel_y"));
		yield* g.callName(f, live(_P), "show", [live(f.usr)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), rt.fv(f, "desc", live(_P))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(_P)]);
	return f.dot;
}, true);

// /obj/item/device/camera/siliconcam/proc/viewpictures  (code/modules/paperwork/photography.dm:415)  may sleep
rt.def("/obj/item/device/camera/siliconcam/proc/viewpictures", function* viewpictures(f: Frame, user: Value) {
	let C: Value = null, Cinfo: Value = null, Ainfo: Value = null;
	f.vars = () => [user, C, Cinfo, Ainfo];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		C = rt.fv(f, "loc", live(f.src));
		Cinfo = null;
		if (truthy(rt.fv(f, "connected_ai", live(C)))) {
			yield* g.srcCall(f, "viewpichelper", (Cinfo = rt.gv(f, "aicamera", rt.fv(f, "connected_ai", live(C)))));
		} else {
			yield* g.srcCall(f, "viewpichelper", (Cinfo = rt.fv(f, "aicamera", live(C))));
		}
	} else {
		yield* g.srcCall(f, "viewpichelper", (Ainfo = live(f.src)));
	}
	return f.dot;
}, true);

// /obj/item/device/camera/proc/afterattack  (code/modules/paperwork/photography.dm:429)  may sleep
rt.def("/obj/item/device/camera/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	f.vars = () => [target, user, flag];
	if (((!truthy(rt.sv(f, "on")) || !truthy(rt.sv(f, "pictures_left"))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(target))]))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "captureimage", live(target), live(user), live(flag));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/items/polaroid1.ogg"), rt.rsc("sound/items/polaroid2.ogg")]), 75, 1, -3]);
	rt.incSrcVar(f, "pictures_left", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ photos left.</span>", [rt.sv(f, "pictures_left")])]);
	rt.setSv(f, "icon_state", "camera_off");
	rt.setSv(f, "on", 0);
	rt.spawnTail(f, 64, "/obj/item/device/camera/proc/afterattack: spawn at modules/paperwork/photography.dm:440", target, user, flag);
	return f.dot;
}, true);

// a spawn(64) body of /obj/item/device/camera/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/camera/proc/afterattack: spawn at modules/paperwork/photography.dm:440", function* (f: Frame, target: Value, user: Value, flag: Value) {
	f.vars = () => [target, user, flag];
	rt.setSv(f, "icon_state", "camera");
	rt.setSv(f, "on", 1);
	return null;
});

// /obj/item/device/camera/siliconcam/proc/toggle_camera_mode  (code/modules/paperwork/photography.dm:446)
rt.def("/obj/item/device/camera/siliconcam/proc/toggle_camera_mode", function toggle_camera_mode(f: Frame) {
	if (truthy(rt.sv(f, "in_camera_mode"))) {
		rt.callSrc(f, "camera_mode_off", []);
	} else {
		rt.callSrc(f, "camera_mode_on", []);
	}
	return f.dot;
});

// /obj/item/device/camera/siliconcam/proc/camera_mode_off  (code/modules/paperwork/photography.dm:451)
rt.def("/obj/item/device/camera/siliconcam/proc/camera_mode_off", function camera_mode_off(f: Frame) {
	rt.setFv(f, "in_camera_mode", live(f.src), 0);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<B>Camera Mode deactivated</B>"]);
	return f.dot;
});

// /obj/item/device/camera/siliconcam/proc/camera_mode_on  (code/modules/paperwork/photography.dm:455)
rt.def("/obj/item/device/camera/siliconcam/proc/camera_mode_on", function camera_mode_on(f: Frame) {
	rt.setFv(f, "in_camera_mode", live(f.src), 1);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<B>Camera Mode activated</B>"]);
	return f.dot;
});

// /obj/item/device/camera/siliconcam/robot_camera/proc/borgprint  (code/modules/paperwork/photography.dm:459)  may sleep
rt.def("/obj/item/device/camera/siliconcam/robot_camera/proc/borgprint", function* borgprint(f: Frame) {
	let nametemp: Value = null, find: Value = null, selection: Value = null, C: Value = null, targetcam: Value = null, t: Value = null, q: Value = null, p: Value = null;
	let $e: any;
	f.vars = () => [nametemp, find, selection, C, targetcam, t, q, p, $e];
	nametemp = rt.list();
	find = null;
	selection = null;
	C = rt.fv(f, "loc", live(f.src));
	targetcam = null;
	if (rt.lt(rt.fv(f, "toner", live(C)), 20)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Insufficent toner to print image."]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "connected_ai", live(C)))) {
		targetcam = rt.gv(f, "aicamera", rt.fv(f, "connected_ai", live(C)));
	} else {
		targetcam = rt.fv(f, "aicamera", live(C));
	}
	if (isEqual(rt.getLen(f, rt.fv(f, "aipictures", live(targetcam))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='userdanger'>No images saved</span>"]);
		return live(f.dot);
	}
	t = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(targetcam)), T("/datum/picture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		nametemp = rt.modify(live(nametemp), rt.index(rt.fv(f, "fields", live(t)), "name"), add);
	}
	rt.endFor(f, 0);
	find = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", live(nametemp)]));
	q = null;
	rt.forList(f, 0, rt.fv(f, "aipictures", live(targetcam)), T("/datum/picture"));
	while (($e = rt.next(f, 0)) !== undefined) {
		q = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(q)), "name"), live(find))) {
			selection = live(q);
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (p = (yield* g.new_(f, T("/obj/item/weapon/photo"), [rt.fv(f, "loc", live(C))]))), "photocreate", [rt.index(rt.fv(f, "fields", live(selection)), "icon"), rt.index(rt.fv(f, "fields", live(selection)), "img"), rt.index(rt.fv(f, "fields", live(selection)), "desc"), rt.index(rt.fv(f, "fields", live(selection)), "blueprints")]);
	rt.setFv(f, "pixel_x", live(p), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setFv(f, "pixel_y", live(p), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	(rt.modField(f, live(C), "toner", 20, subtract));
	yield* g.srcCall(f, "visible_message", fmt("＀ spits out a photograph from a narrow slot on its chassis.", [rt.fv(f, "name", live(C))]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You print a photograph.</span>"]);
	return f.dot;
}, true);

rt.type(9550, "/obj/item/wallframe/picture", "/obj/item/wallframe", {
	displayed: null,
	flags: 0,
	name: "picture frame",
	desc: "The perfect showcase for your favorite deathtrap memories.",
	icon: rt.rsc("icons/obj/decals.dmi"),
	materials: null,
	icon_state: "frame-empty",
	result_path: rt.typePath("/obj/structure/sign/picture_frame"),
});

// /obj/item/wallframe/picture/proc/<init>  (code/modules/paperwork/photography.dm:495)
rt.def("/obj/item/wallframe/picture/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/wallframe/picture/proc/attackby  (code/modules/paperwork/photography.dm:502)  may sleep
rt.def("/obj/item/wallframe/picture/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "displayed"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "displayed", live(f.args[0]));
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class=notice>＄！ already contains a photo.</span>", [live(f.src)])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/item/wallframe/picture/proc/attack_hand  (code/modules/paperwork/photography.dm:513)  may sleep
rt.def("/obj/item/wallframe/picture/proc/attack_hand", function* attack_hand(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (!isEqual((yield* g.callName(f, live(f.args[0]), "get_inactive_held_item", [])), live(f.src))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	I = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "contents")]);
	yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(I)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You carefully remove the photo from ％！.</span>", [live(f.src)])]);
	rt.setSv(f, "displayed", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/wallframe/picture/proc/attack_self  (code/modules/paperwork/photography.dm:524)  may sleep
rt.def("/obj/item/wallframe/picture/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/wallframe/picture/proc/examine  (code/modules/paperwork/photography.dm:527)
rt.def("/obj/item/wallframe/picture/proc/examine", function examine(f: Frame) {
	if ((truthy(rt.callName(f, live(f.args[0]), "is_holding", [live(f.src)])) && truthy(rt.sv(f, "displayed")))) {
		rt.callName(f, rt.sv(f, "displayed"), "show", [live(f.args[0])]);
	} else {
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/wallframe/picture/proc/update_icon  (code/modules/paperwork/photography.dm:533)
rt.def("/obj/item/wallframe/picture/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "displayed"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/getFlatIcon"), null, [rt.sv(f, "displayed")])]);
	return f.dot;
});

// /obj/item/wallframe/picture/proc/after_attach  (code/modules/paperwork/photography.dm:538)  may sleep
rt.def("/obj/item/wallframe/picture/proc/after_attach", function* after_attach(f: Frame) {
	let PF: Value = null, I: Value = null;
	f.vars = () => [PF, I];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (PF = live(f.args[0])), "copy_overlays", [live(f.src)]);
	if (truthy(rt.sv(f, "displayed"))) {
		rt.setFv(f, "framed", live(PF), rt.sv(f, "displayed"));
	}
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	yield* g.callName(f, (I = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "contents")])), "forceMove", [live(PF)]);
	return f.dot;
}, true, { args: ["O"] });

rt.type(12699, "/obj/structure/sign/picture_frame", "/obj/structure/sign", {
	framed: null,
	name: "picture frame",
	desc: "Every time you look it makes you laugh.",
	icon: rt.rsc("icons/obj/decals.dmi"),
	icon_state: "frame-empty",
});

// /obj/structure/sign/picture_frame/proc/New  (code/modules/paperwork/photography.dm:556)  may sleep
rt.def("/obj/structure/sign/picture_frame/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	if (truthy(rt.bitAnd(live(f.args[1]), 3))) {
		$0 = 0;
	} else {
		if (isEqual(live(f.args[1]), 4)) {
			$0 = -30;
		} else {
			$0 = 30;
		}
	}
	rt.setSv(f, "pixel_x", $0);
	if (truthy(rt.bitAnd(live(f.args[1]), 3))) {
		if (isEqual(live(f.args[1]), 1)) {
			$0 = -30;
		} else {
			$0 = 30;
		}
	} else {
		$0 = 0;
	}
	rt.setSv(f, "pixel_y", $0);
	return f.dot;
}, true, { args: ["loc", "dir", "building"] });

// /obj/structure/sign/picture_frame/proc/examine  (code/modules/paperwork/photography.dm:564)
rt.def("/obj/structure/sign/picture_frame/proc/examine", function examine(f: Frame) {
	if ((rt.le(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])]), 1) && truthy(rt.sv(f, "framed")))) {
		rt.callName(f, rt.sv(f, "framed"), "show", [live(f.args[0])]);
	} else {
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/sign/picture_frame/proc/attackby  (code/modules/paperwork/photography.dm:570)  may sleep
rt.def("/obj/structure/sign/picture_frame/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start unsecuring ＀...</span>", [rt.sv(f, "name")])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unsecure ＀.</span>", [rt.sv(f, "name")])]);
		}
		yield* g.srcCall(f, "deconstruct");
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "framed"))) {
				_P = live(f.args[0]);
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(_P), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "framed", live(_P));
				yield* g.srcCall(f, "update_icon");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class=notice>＄！ already contains a photo.</span>", [live(f.src)])]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/sign/picture_frame/proc/attack_hand  (code/modules/paperwork/photography.dm:593)
rt.def("/obj/structure/sign/picture_frame/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "framed"))) return f.dot;
	rt.callName(f, rt.sv(f, "framed"), "show", [live(user)]);
	return f.dot;
});

// /obj/structure/sign/picture_frame/proc/update_icon  (code/modules/paperwork/photography.dm:596)
rt.def("/obj/structure/sign/picture_frame/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "framed"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/getFlatIcon"), null, [rt.sv(f, "framed")])]);
	return f.dot;
});

// /obj/structure/sign/picture_frame/proc/deconstruct  (code/modules/paperwork/photography.dm:601)  may sleep
rt.def("/obj/structure/sign/picture_frame/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null, I: Value = null;
	f.vars = () => [disassembled, F, I];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		F = (yield* g.new_(f, T("/obj/item/wallframe/picture"), [rt.sv(f, "loc")]));
		if (truthy(rt.sv(f, "framed"))) {
			rt.setFv(f, "displayed", live(F), rt.sv(f, "framed"));
			rt.setSv(f, "framed", null);
		}
		if (truthy(rt.len(f, rt.sv(f, "contents")))) {
			yield* g.callName(f, (I = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "contents")])), "forceMove", [live(F)]);
		}
		yield* g.callName(f, live(F), "update_icon", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
