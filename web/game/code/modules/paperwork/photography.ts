// Based on /tg/station's code/modules/paperwork/photography.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


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

// photography.dm:42
rt.def("/obj/item/weapon/photo/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.examinate(this);
	return f.dot;
}, true);

// photography.dm:46
rt.def("/obj/item/weapon/photo/proc/attackby", function* attackby(f: Frame) {
	let txt: Value = null;
	if (rt.istype(f.args[0], T("/obj/item/weapon/pen")) || rt.istype(f.args[0], T("/obj/item/toy/crayon"))) {
		txt = copytext((txt = sanitize((yield* g.op(f, "Prompt", [2], [null, "Photo Writing", "What would you like to write on the back?", f.args[1], null])))), 1, 128);
		if (this.loc == f.args[1] && f.args[1].stat == 0) {
			this.scribble = txt;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["P", "user", "params"] });

// photography.dm:55
rt.def("/obj/item/weapon/photo/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (get_dist(this, user) <= 1) {
		this.show(user);
	} else {
		to_chat(user, "<span class='warning'>You need to get closer to get a good look at this photo!</span>");
	}
	return f.dot;
}, false);

// photography.dm:64
rt.def("/obj/item/weapon/photo/proc/show", function show(f: Frame, user: Value) {
	rt.op(f, "BrowseResource", [], [user, this.img, "tmp_photo.png"], false);
	let $0: any = user;
	let $1: any = `<html><head><title>${this.name}</title></head>` + "<body style='overflow:hidden;margin:0;text-align:center'>" + "<img src='tmp_photo.png' width='192' style='-ms-interpolation-mode:nearest-neighbor' />";
	$1 = $1 + `${this.scribble ? `<br>Written on the back:<br><i>${this.scribble}</i>` : ""}` + "</body></html>";
	rt.op(f, "Browse", [], [$0, $1, `window=book;size=192x${this.scribble ? 400 : 192}`], false);
	onclose(user, `${this.name}`);
	return f.dot;
});

// photography.dm:78
rt.def("/obj/item/weapon/photo/verb/rename", function* rename(f: Frame) {
	let n_name: Value = copytext(sanitize((yield* g.op(f, "Prompt", [2], [null, "Photo Labelling", "What would you like to label the photo?", f.usr, null]))), 1, 42);
	if ((this.loc == f.usr || this.loc.loc && this.loc.loc == f.usr) && f.usr.stat == 0 && f.usr.canmove && !f.usr.restrained()) {
		this.name = `photo${n_name ? `- '${n_name}'` : null}`;
	}
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true, { verb: { name: "Rename photo", category: "Object", src: 11 } });

// photography.dm:85
rt.def("/obj/item/weapon/photo/proc/photocreate", function photocreate(f: Frame, inicon: Value, inimg: Value, indesc: Value, inblueprints: Value) {
	this.icon = inicon;
	this.img = inimg;
	this.desc = indesc;
	this.blueprints = inblueprints;
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

// photography.dm:98
rt.def("/obj/item/weapon/storage/photo_album/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.can_hold = list(T("/obj/item/weapon/photo"));
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

// photography.dm:118
rt.def("/obj/item/device/camera/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.aipictures = list();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// photography.dm:123
rt.def("/obj/item/device/camera/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let C: Value = null;
	yield* parent_proc();
	if (!(C = rt.locateIn(f, T("/obj/item/device/camera"), this.contents))) return f.dot;
	this.pictures_max = C.pictures_max;
	this.pictures_left = C.pictures_left;
	this.visible_message(`${C} has been imbued with godlike power!`);
	yield* qdel(C);
	return f.dot;
}, true);

rt.type(9427, "/obj/item/device/camera/siliconcam/robot_camera", "/obj/item/device/camera/siliconcam", {
	name: "Cyborg photo camera",
});

// photography.dm:159
rt.def("/obj/item/device/camera/siliconcam/robot_camera/verb/borgprinting", function* borgprinting(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	yield* this.borgprint();
	return f.dot;
}, true, { verb: { name: "Print Image", category: "Robot Commands", src: 11 } });

// photography.dm:168
rt.def("/obj/item/device/camera/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/device/camera_film"))) {
		if (this.pictures_left) {
			to_chat(user, `<span class='notice'>${this} still has some film in it!</span>`);
			return f.dot;
		}
		if (!(yield* user.temporarilyRemoveItemFromInventory(I))) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You insert ${I} into ${this}.</span>`);
		yield* qdel(I);
		this.pictures_left = this.pictures_max;
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// photography.dm:182
rt.def("/obj/item/device/camera/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `It has ${this.pictures_left} photos left.`);
	return f.dot;
}, false);

// photography.dm:187
rt.def("/obj/item/device/camera/proc/camera_get_icon", function camera_get_icon(f: Frame, turfs: Value, center: Value) {
	let _T: Value = null, A: Value = null, O: Value = null, j: Value = null, i: Value = null, c: Value = null, c2: Value = null, A_4: Value = null, img: Value = null, L: Value = null, offX: Value = null, offY: Value = null, _T_4: Value = null;
	let $e: any;
	let atoms: Value = list();
	for (_T of each(turfs, T("/turf"))) {
		atoms.Add(_T);
		A = null;
		for (A of each(_T, T("/atom/movable"))) {
			if (A.invisibility) {
				if (this.see_ghosts && rt.istype(A, T("/mob/dead/observer"))) {
					if ((O = A).orbiting) {
						continue;
					}
				} else {
					continue;
				}
			}
			atoms.Add(A);
		}
	}
	let sorted: Value = list();
	rt.forRange(f, 0, 1, rt.len(f, atoms), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		c = rt.index(atoms, i);
		j = rt.len(f, sorted);
		while (j > 0) {
			if ((c2 = rt.index(sorted, j)).layer <= c.layer) {
				break;
			}
			j--;
		}
		sorted.Insert(j + 1, c);
	}
	rt.endFor(f, 0);
	let res: Value = icon(rt.rsc("icons/effects/96x96.dmi"), "");
	for (A_4 of each(sorted, T("/atom"))) {
		img = getFlatIcon(A_4);
		if (rt.istype(A_4, T("/mob/living"))) {
			if ((L = A_4).lying) {
				img.Turn(L.lying);
			}
		}
		offX = 32 * (A_4.x - center.x) + A_4.pixel_x + 33;
		offY = 32 * (A_4.y - center.y) + A_4.pixel_y + 33;
		if (rt.istype(A_4, T("/atom/movable"))) {
			offX += A_4.step_x;
			offY += A_4.step_y;
		}
		res.Blend(img, blendMode2iconMode(A_4.blend_mode), offX, offY);
		if (rt.istype(A_4, T("/obj/item/areaeditor/blueprints"))) {
			this.blueprints = 1;
		}
	}
	for (_T_4 of each(turfs, T("/turf"))) {
		res.Blend(getFlatIcon(_T_4.loc), blendMode2iconMode(_T_4.blend_mode), 32 * (_T_4.x - center.x) + 33, 32 * (_T_4.y - center.y) + 33);
	}
	return res;
});

// photography.dm:238
rt.def("/obj/item/device/camera/proc/camera_get_mobs", function camera_get_mobs(f: Frame, the_turf: Value) {
	let mob_detail: Value = null, M: Value = null, O: Value = null, holding: Value = null, L: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	for (M of each(the_turf, T("/mob"))) {
		if (M.invisibility) {
			if (this.see_ghosts && rt.istype(M, T("/mob/dead/observer"))) {
				if ((O = M).orbiting) {
					continue;
				}
				if (!mob_detail) {
					mob_detail = "You can see a g-g-g-g-ghooooost! ";
				} else {
					mob_detail += "You can also see a g-g-g-g-ghooooost!";
				}
			} else {
				continue;
			}
		}
		holding = list();
		if (rt.istype(M, T("/mob/living"))) {
			L = M;
			I = null;
			for (I of each(L.held_items, T("/obj/item"))) {
				if (!holding) {
					holding += fmt("＀ ＀ holding ＇！", [L.p_they(1), L.p_are(), I]);
				} else {
					holding += fmt(" and ＇！", [I]);
				}
			}
			holding = holding.Join();
			if (!mob_detail) {
				$0 = L;
				if (L.health < L.maxHealth * 0.75) {
					$1 = ` - ${L} looks hurt`;
				} else {
					$1 = "";
				}
				if (holding) {
					$2 = ` ${holding}`;
				} else {
					$2 = ".";
				}
				mob_detail = `You can see ${$0} on the photo${$1}.${$2}. `;
			} else {
				$0 = L;
				if (L.health < L.maxHealth * 0.75) {
					$1 = ` - ${L} looks hurt`;
				} else {
					$1 = "";
				}
				if (holding) {
					$2 = ` ${holding}`;
				} else {
					$2 = ".";
				}
				mob_detail += `You can also see ${$0} on the photo${$1}.${$2}.`;
			}
		}
	}
	return mob_detail;
});

// photography.dm:273
rt.def("/obj/item/device/camera/proc/captureimage", function* captureimage(f: Frame, target: Value, user: Value, flag: Value) {
	let seen: Value = null, _T: Value = null, temp: Value = null;
	let mobs: Value = "";
	let isAi: Value = (rt.istype(user, T("/mob/living/silicon/ai")) ? 1 : 0);
	if (!isAi) {
		if (user.client) {
			seen = get_hear(rt.world().view, user.client.eye);
		} else {
			seen = get_hear(rt.world().view, user);
		}
	} else {
		seen = get_hear(rt.world().view, target);
	}
	let turfs: Value = list();
	for (_T of each(range(1, target), T("/turf"))) {
		if (rt.isIn(f, _T, seen)) {
			if (isAi && !GLOB.cameranet.checkTurfVis(_T)) {
				continue;
			}
			turfs += _T;
			mobs += this.camera_get_mobs(_T);
		}
	}
	(temp = icon(rt.rsc("icons/effects/96x96.dmi"), "")).Blend("#000", 3);
	temp.Blend(this.camera_get_icon(turfs, target), 3);
	if (!rt.istype(user, T("/mob/living/silicon"))) {
		yield* this.printpicture(user, temp, mobs, flag);
	} else {
		this.aipicture(user, temp, mobs, isAi, this.blueprints);
	}
	return f.dot;
}, true);

// photography.dm:306
rt.def("/obj/item/device/camera/proc/printpicture", function* printpicture(f: Frame, user: Value, temp: Value, mobs: Value, flag: Value) {
	let _P: Value = (yield* new_(T("/obj/item/weapon/photo"), rt.getStep(f, this, 0)));
	if (get_dist(this, user) <= 1) {
		yield* user.put_in_hands(_P);
	}
	let small_img: Value = icon(temp);
	let ic: Value = icon(rt.rsc("icons/obj/items.dmi"), "photo");
	small_img.Scale(8, 8);
	ic.Blend(small_img, 3, 13, 13);
	_P.icon = ic;
	_P.img = temp;
	_P.desc = mobs;
	_P.pixel_x = rand(-10, 10);
	_P.pixel_y = rand(-10, 10);
	if (!this.blueprints) return f.dot;
	_P.blueprints = 1;
	this.blueprints = 0;
	return f.dot;
}, true);

// photography.dm:326
rt.def("/obj/item/device/camera/proc/aipicture", function aipicture(f: Frame, user: Value, temp: Value, mobs: Value, isAi: Value) {
	let small_img: Value = rt.call(f, P("/proc/icon"), null, [temp]);
	let ic: Value = rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/items.dmi"), "photo"]);
	small_img.Scale(8, 8);
	ic.Blend(small_img, 3, 13, 13);
	let icon: Value = ic;
	let img: Value = temp;
	let desc: Value = mobs;
	let pixel_x: Value = rand(-10, 10);
	let pixel_y: Value = rand(-10, 10);
	let injectblueprints: Value = 1;
	if (this.blueprints) {
		injectblueprints = 1;
		this.blueprints = 0;
	}
	if (isAi) {
		this.injectaialbum(icon, img, desc, pixel_x, pixel_y, injectblueprints);
	} else {
		this.injectmasteralbum(icon, img, desc, pixel_x, pixel_y, injectblueprints);
	}
	return f.dot;
});

rt.type(4176, "/datum/picture", "/datum", {
	name: "image",
	fields: null,
});

// photography.dm:350
rt.def("/datum/picture/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.fields = list();
	return f.dot;
});

// photography.dm:355
rt.def("/obj/item/device/camera/proc/injectaialbum", function injectaialbum(f: Frame, icon: Value, img: Value, desc: Value, pixel_x: Value, pixel_y: Value, blueprintsinject: Value) {
	let picture: Value = null, _P: Value = null;
	let numberer: Value = 1;
	for (picture of each(this.aipictures, T("/datum"))) {
		numberer++;
	}
	rt.setAt((_P = new_(T("/datum/picture"))).fields, "name", `Image ${numberer} (taken by ${this.loc.name})`);
	rt.setAt(_P.fields, "icon", icon);
	rt.setAt(_P.fields, "img", img);
	rt.setAt(_P.fields, "desc", desc);
	rt.setAt(_P.fields, "pixel_x", pixel_x);
	rt.setAt(_P.fields, "pixel_y", pixel_y);
	rt.setAt(_P.fields, "blueprints", blueprintsinject);
	this.aipictures += _P;
	to_chat(f.usr, "<span class='unconscious'>Image recorded</span>");
	return f.dot;
});

// photography.dm:372
rt.def("/obj/item/device/camera/proc/injectmasteralbum", function injectmasteralbum(f: Frame, icon: Value, img: Value, desc: Value, pixel_x: Value, pixel_y: Value, blueprintsinject: Value) {
	let C: Value = null, picture: Value = null, _P: Value = null;
	let numberer: Value = 1;
	if ((C = this.loc).connected_ai) {
		for (picture of each(C.connected_ai.aicamera.aipictures, T("/datum"))) {
			numberer++;
		}
		rt.setAt((_P = new_(T("/datum/picture"))).fields, "name", `Image ${numberer} (taken by ${this.loc.name})`);
		rt.setAt(_P.fields, "icon", icon);
		rt.setAt(_P.fields, "img", img);
		rt.setAt(_P.fields, "desc", desc);
		rt.setAt(_P.fields, "pixel_x", pixel_x);
		rt.setAt(_P.fields, "pixel_y", pixel_y);
		rt.setAt(_P.fields, "blueprints", blueprintsinject);
		C.connected_ai.aicamera.aipictures += _P;
		to_chat(f.usr, "<span class='unconscious'>Image recorded and saved to remote database</span>");
	} else {
		this.injectaialbum(icon, img, desc, pixel_x, pixel_y, blueprintsinject);
	}
	return f.dot;
});

rt.type(9425, "/obj/item/device/camera/siliconcam", "/obj/item/device/camera", {
	in_camera_mode: 0,
	name: "silicon photo camera",
});

// photography.dm:390
rt.def("/obj/item/device/camera/siliconcam/proc/selectpicture", function* selectpicture(f: Frame, targetloc: Value) {
	let t: Value = null, q: Value = null;
	let nametemp: Value = list();
	if (rt.len(f, targetloc.aipictures) == 0) {
		to_chat(f.usr, "<span class='boldannounce'>No images saved</span>");
		return f.dot;
	}
	for (t of each(targetloc.aipictures, T("/datum/picture"))) {
		nametemp += rt.index(t.fields, "name");
	}
	let find: Value = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", nametemp]));
	for (q of each(targetloc.aipictures, T("/datum/picture"))) {
		if (rt.index(q.fields, "name") == find) {
			return q;
		}
	}
	return f.dot;
}, true);

// photography.dm:403
rt.def("/obj/item/device/camera/siliconcam/proc/viewpichelper", function* viewpichelper(f: Frame, targetloc: Value) {
	let selection: Value = null;
	let _P: Value = (yield* new_(T("/obj/item/weapon/photo")));
	if (selection = (yield* this.selectpicture(targetloc))) {
		_P.photocreate(rt.index(selection.fields, "icon"), rt.index(selection.fields, "img"), rt.index(selection.fields, "desc"));
		_P.pixel_x = rt.index(selection.fields, "pixel_x");
		_P.pixel_y = rt.index(selection.fields, "pixel_y");
		yield* _P.show(f.usr);
		to_chat(f.usr, _P.desc);
	}
	yield* qdel(_P);
	return f.dot;
}, true);

// photography.dm:415
rt.def("/obj/item/device/camera/siliconcam/proc/viewpictures", function* viewpictures(f: Frame, user: Value) {
	let C: Value = null, Cinfo: Value = null, Ainfo: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		C = this.loc;
		if (C.connected_ai) {
			yield* this.viewpichelper((Cinfo = C.connected_ai.aicamera));
		} else {
			yield* this.viewpichelper((Cinfo = C.aicamera));
		}
	} else {
		yield* this.viewpichelper((Ainfo = this));
	}
	return f.dot;
}, true);

// photography.dm:429
rt.def("/obj/item/device/camera/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	if (!this.on || !this.pictures_left || !isturf(target.loc)) {
		return f.dot;
	}
	yield* this.captureimage(target, user, flag);
	playsound(this.loc, pick(rt.rsc("sound/items/polaroid1.ogg"), rt.rsc("sound/items/polaroid2.ogg")), 75, 1, -3);
	this.pictures_left--;
	to_chat(user, `<span class='notice'>${this.pictures_left} photos left.</span>`);
	this.icon_state = "camera_off";
	this.on = 0;
	rt.spawnTail(f, 64, "/obj/item/device/camera/proc/afterattack: spawn at modules/paperwork/photography.dm:440", target, user, flag);
	return f.dot;
}, true);

// a spawn(64) body of /obj/item/device/camera/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/camera/proc/afterattack: spawn at modules/paperwork/photography.dm:440", function* (f: Frame, target: Value, user: Value, flag: Value) {
	this.icon_state = "camera";
	this.on = 1;
	return null;
});

// photography.dm:446
rt.def("/obj/item/device/camera/siliconcam/proc/toggle_camera_mode", function toggle_camera_mode(f: Frame) {
	if (this.in_camera_mode) {
		this.camera_mode_off();
	} else {
		this.camera_mode_on();
	}
	return f.dot;
});

// photography.dm:451
rt.def("/obj/item/device/camera/siliconcam/proc/camera_mode_off", function camera_mode_off(f: Frame) {
	this.in_camera_mode = 0;
	to_chat(f.usr, "<B>Camera Mode deactivated</B>");
	return f.dot;
});

// photography.dm:455
rt.def("/obj/item/device/camera/siliconcam/proc/camera_mode_on", function camera_mode_on(f: Frame) {
	this.in_camera_mode = 1;
	to_chat(f.usr, "<B>Camera Mode activated</B>");
	return f.dot;
});

// photography.dm:459
rt.def("/obj/item/device/camera/siliconcam/robot_camera/proc/borgprint", function* borgprint(f: Frame) {
	let selection: Value = null, targetcam: Value = null, t: Value = null, q: Value = null, p: Value = null;
	let nametemp: Value = list();
	let C: Value = this.loc;
	if (C.toner < 20) {
		to_chat(f.usr, "Insufficent toner to print image.");
		return f.dot;
	}
	if (C.connected_ai) {
		targetcam = C.connected_ai.aicamera;
	} else {
		targetcam = C.aicamera;
	}
	if (rt.len(f, targetcam.aipictures) == 0) {
		to_chat(f.usr, "<span class='userdanger'>No images saved</span>");
		return f.dot;
	}
	for (t of each(targetcam.aipictures, T("/datum/picture"))) {
		nametemp += rt.index(t.fields, "name");
	}
	let find: Value = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", nametemp]));
	for (q of each(targetcam.aipictures, T("/datum/picture"))) {
		if (rt.index(q.fields, "name") == find) {
			selection = q;
			break;
		}
	}
	(p = (yield* new_(T("/obj/item/weapon/photo"), C.loc))).photocreate(rt.index(selection.fields, "icon"), rt.index(selection.fields, "img"), rt.index(selection.fields, "desc"), rt.index(selection.fields, "blueprints"));
	p.pixel_x = rand(-10, 10);
	p.pixel_y = rand(-10, 10);
	C.toner -= 20;
	this.visible_message(`${C.name} spits out a photograph from a narrow slot on its chassis.`);
	to_chat(f.usr, "<span class='notice'>You print a photograph.</span>");
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

// photography.dm:495
rt.def("/obj/item/wallframe/picture/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// photography.dm:502
rt.def("/obj/item/wallframe/picture/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (rt.istype(I, T("/obj/item/weapon/photo"))) {
		if (!this.displayed) {
			if (!(yield* user.transferItemToLoc(I, this))) {
				return f.dot;
			}
			this.displayed = I;
			yield* this.update_icon();
		} else {
			to_chat(user, fmt("<span class=notice>＄！ already contains a photo.</span>", [this]));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// photography.dm:513
rt.def("/obj/item/wallframe/picture/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.get_inactive_held_item() != this) {
		yield* parent_proc();
		return f.dot;
	}
	if (!rt.len(f, this.contents)) return f.dot;
	let I: Value = pick(this.contents);
	yield* user.put_in_hands(I);
	to_chat(user, fmt("<span class='notice'>You carefully remove the photo from ％！.</span>", [this]));
	this.displayed = null;
	yield* this.update_icon();
	return f.dot;
}, true);

// photography.dm:524
rt.def("/obj/item/wallframe/picture/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.examinate(this);
	return f.dot;
}, true);

// photography.dm:527
rt.def("/obj/item/wallframe/picture/proc/examine", function examine(f: Frame, user: Value) {
	if (user.is_holding(this) && this.displayed) {
		this.displayed.show(user);
	} else {
		parent_proc();
	}
	return f.dot;
}, false);

// photography.dm:533
rt.def("/obj/item/wallframe/picture/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.displayed) return f.dot;
	this.add_overlay(getFlatIcon(this.displayed));
	return f.dot;
});

// photography.dm:538
rt.def("/obj/item/wallframe/picture/proc/after_attach", function* after_attach(f: Frame, O: Value) {
	let PF: Value = null, I: Value = null;
	yield* parent_proc();
	(PF = O).copy_overlays(this);
	if (this.displayed) {
		PF.framed = this.displayed;
	}
	if (!rt.len(f, this.contents)) return f.dot;
	yield* (I = pick(this.contents)).forceMove(PF);
	return f.dot;
}, true);

rt.type(12699, "/obj/structure/sign/picture_frame", "/obj/structure/sign", {
	framed: null,
	name: "picture frame",
	desc: "Every time you look it makes you laugh.",
	icon: rt.rsc("icons/obj/decals.dmi"),
	icon_state: "frame-empty",
});

// photography.dm:556
rt.def("/obj/structure/sign/picture_frame/proc/New", function* New(f: Frame, loc: Value, dir: Value, building: Value) {
	let $0: any;
	yield* parent_proc();
	if (dir) {
		yield* this.setDir(dir);
	}
	if (!building) return f.dot;
	if (rt.bitAnd(dir, 3)) {
		$0 = 0;
	} else if (dir == 4) {
		$0 = -30;
	} else {
		$0 = 30;
	}
	this.pixel_x = $0;
	if (rt.bitAnd(dir, 3)) {
		if (dir == 1) {
			$0 = -30;
		} else {
			$0 = 30;
		}
	} else {
		$0 = 0;
	}
	this.pixel_y = $0;
	return f.dot;
}, true);

// photography.dm:564
rt.def("/obj/structure/sign/picture_frame/proc/examine", function examine(f: Frame, user: Value) {
	if (get_dist(this, user) <= 1 && this.framed) {
		this.framed.show(user);
	} else {
		parent_proc();
	}
	return f.dot;
}, false);

// photography.dm:570
rt.def("/obj/structure/sign/picture_frame/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _P: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver")) || rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You start unsecuring ${this.name}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			to_chat(user, `<span class='notice'>You unsecure ${this.name}.</span>`);
		}
		yield* this.deconstruct();
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/weapon/photo"))) {
		if (!this.framed) {
			_P = I;
			if (!(yield* user.transferItemToLoc(_P, this))) {
				return f.dot;
			}
			this.framed = _P;
			yield* this.update_icon();
		} else {
			to_chat(user, fmt("<span class=notice>＄！ already contains a photo.</span>", [this]));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// photography.dm:593
rt.def("/obj/structure/sign/picture_frame/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!this.framed) return f.dot;
	this.framed.show(user);
	return f.dot;
});

// photography.dm:596
rt.def("/obj/structure/sign/picture_frame/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.framed) return f.dot;
	this.add_overlay(getFlatIcon(this.framed));
	return f.dot;
});

// photography.dm:601
rt.def("/obj/structure/sign/picture_frame/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null, I: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		F = (yield* new_(T("/obj/item/wallframe/picture"), this.loc));
		if (this.framed) {
			F.displayed = this.framed;
			this.framed = null;
		}
		if (rt.len(f, this.contents)) {
			yield* (I = pick(this.contents)).forceMove(F);
		}
		yield* F.update_icon();
	}
	yield* qdel(this);
	return f.dot;
}, true);
