// From code/modules/paperwork/photocopier.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10974, "/obj/machinery/photocopier", "/obj/machinery", {
	copy: null,
	photocopy: null,
	doccopy: null,
	copies: 1,
	toner: 40,
	maxcopies: 10,
	greytoggle: "Greyscale",
	ass: null,
	busy: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 30,
	active_power_usage: 200,
	power_channel: 1,
	name: "photocopier",
	desc: "Used to copy important documents and anatomy studies.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "photocopier",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
	integrity_failure: 100,
});

// /obj/machinery/photocopier/proc/attack_ai  (code/modules/paperwork/photocopier.dm:35)  may sleep
rt.def("/obj/machinery/photocopier/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/photocopier/proc/attack_paw  (code/modules/paperwork/photocopier.dm:38)  may sleep
rt.def("/obj/machinery/photocopier/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/photocopier/proc/attack_hand  (code/modules/paperwork/photocopier.dm:41)  may sleep
rt.def("/obj/machinery/photocopier/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null;
	f.vars = () => [user, dat];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "Photocopier<BR><BR>";
	if ((((truthy(rt.sv(f, "copy")) || truthy(rt.sv(f, "photocopy"))) || truthy(rt.sv(f, "doccopy"))) || (truthy(rt.sv(f, "ass")) && isEqual(rt.fv(f, "loc", rt.sv(f, "ass")), rt.fv(f, "loc", live(f.src)))))) {
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;remove=1'>Remove Paper</a><BR>", [live(f.src)]), add);
		if (truthy(rt.sv(f, "toner"))) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;copy=1'>Copy</a><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("Printing: ＀ copies.", [rt.sv(f, "copies")]), add);
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;min=1'>-</a> ", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;add=1'>+</a><BR><BR>", [live(f.src)]), add);
			if (truthy(rt.sv(f, "photocopy"))) {
				dat = rt.modify(live(dat), fmt("Printing in <a href='byond://?src=＃;colortoggle=1'>＀</a><BR><BR>", [live(f.src), rt.sv(f, "greytoggle")]), add);
			}
		}
	} else {
		if (truthy(rt.sv(f, "toner"))) {
			dat = rt.modify(live(dat), "Please insert paper to copy.<BR><BR>", add);
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;aipic=1'>Print photo from database</a><BR><BR>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), fmt("Current toner level: ＀", [rt.sv(f, "toner")]), add);
	if (!truthy(rt.sv(f, "toner"))) {
		dat = rt.modify(live(dat), "<BR>Please insert a new toner cartridge!", add);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=copier"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "copier"]);
	return f.dot;
}, true);

// /obj/machinery/photocopier/proc/Topic  (code/modules/paperwork/photocopier.dm:64)  may sleep
rt.def("/obj/machinery/photocopier/proc/Topic", function* Topic(f: Frame) {
	let i: Value = null, copy_as_paper: Value = null, E: Value = null, C: Value = null, c: Value = null, copied: Value = null, p: Value = null, I: Value = null, img: Value = null, temp_img: Value = null, p_2: Value = null, small_img: Value = null, ic: Value = null, nametemp: Value = null, find: Value = null, selection: Value = null, tempAI: Value = null, t: Value = null, p_4: Value = null, q: Value = null, I_5: Value = null, img_6: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [i, copy_as_paper, E, C, c, copied, p, I, img, temp_img, p_2, small_img, ic, nametemp, find, selection, tempAI, t, p_4, q, I_5, img_6, $0, $1, $2, $3, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "copy"))) {
		if (truthy(rt.sv(f, "copy"))) {
			i = null;
			i = 0;
			while (rt.lt(live(i), rt.sv(f, "copies"))) {
				if (((rt.gt(rt.sv(f, "toner"), 0) && !truthy(rt.sv(f, "busy"))) && truthy(rt.sv(f, "copy")))) {
					copy_as_paper = 1;
					if (truthy((rt.istype(rt.sv(f, "copy"), T("/obj/item/weapon/paper/contract/employment")) ? 1 : 0))) {
						E = rt.sv(f, "copy");
						if (truthy((C = (yield* g.new_(f, T("/obj/item/weapon/paper/contract/employment"), [rt.sv(f, "loc"), rt.gv(f, "current", rt.fv(f, "target", live(E)))]))))) {
							copy_as_paper = 0;
						}
					}
					if (truthy(live(copy_as_paper))) {
						c = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.sv(f, "loc")]));
						if (rt.gt(rt.length(rt.fv(f, "info", rt.sv(f, "copy"))), 0)) {
							if (rt.gt(rt.sv(f, "toner"), 10)) {
								rt.setFv(f, "info", live(c), "<font color = #101010>");
							} else {
								rt.setFv(f, "info", live(c), "<font color = #808080>");
							}
							copied = (yield* g.call(f, P("/proc/replacetext"), null, [(copied = (yield* g.call(f, P("/proc/replacetext"), null, [(copied = rt.fv(f, "info", rt.sv(f, "copy"))), fmt("<font face=\"＀\" color=", ["Verdana"]), fmt("<font face=\"＀\" nocolor=", ["Verdana"])]))), fmt("<font face=\"＀\" color=", ["Comic Sans MS"]), fmt("<font face=\"＀\" nocolor=", ["Comic Sans MS"])]));
							rt.modField(f, live(c), "info", live(copied), add);
							rt.modField(f, live(c), "info", "</font>", add);
							rt.setFv(f, "name", live(c), rt.fv(f, "name", rt.sv(f, "copy")));
							rt.setFv(f, "fields", live(c), rt.fv(f, "fields", rt.sv(f, "copy")));
							yield* g.callName(f, live(c), "update_icon", []);
							yield* g.callName(f, live(c), "updateinfolinks", []);
							rt.setFv(f, "stamps", live(c), rt.fv(f, "stamps", rt.sv(f, "copy")));
							if (truthy(rt.fv(f, "stamped", rt.sv(f, "copy")))) {
								rt.setFv(f, "stamped", live(c), (yield* g.callName(f, rt.fv(f, "stamped", rt.sv(f, "copy")), "Copy", [])));
							}
							yield* g.callName(f, live(c), "copy_overlays", [rt.sv(f, "copy"), 1]);
							rt.incSrcVar(f, "toner", -1, true);
						}
					}
					rt.setSv(f, "busy", 1);
					yield* g.call(f, P("/proc/sleep"), null, [15]);
					rt.setSv(f, "busy", 0);
				} else {
					break;
				}
				i = rt.inc(live(i), 1);
			}
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			if (truthy(rt.sv(f, "photocopy"))) {
				i = null;
				i = 0;
				while (rt.lt(live(i), rt.sv(f, "copies"))) {
					blk228: {
						if (((rt.ge(rt.sv(f, "toner"), 5) && !truthy(rt.sv(f, "busy"))) && truthy(rt.sv(f, "photocopy")))) {
							p = (yield* g.new_(f, T("/obj/item/weapon/photo"), [rt.sv(f, "loc")]));
							I = (yield* g.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", rt.sv(f, "photocopy")), rt.fv(f, "icon_state", rt.sv(f, "photocopy"))]));
							img = (yield* g.call(f, P("/proc/icon"), null, [rt.fv(f, "img", rt.sv(f, "photocopy"))]));
							if (isEqual(rt.sv(f, "greytoggle"), "Greyscale")) {
								if (rt.gt(rt.sv(f, "toner"), 10)) {
									yield* g.callName(f, live(I), "MapColors", ["#4d4d4d", "#969696", "#1c1c1c", "#000000"]);
									yield* g.callName(f, live(img), "MapColors", ["#4d4d4d", "#969696", "#1c1c1c", "#000000"]);
								} else {
									yield* g.callName(f, live(I), "MapColors", ["#4d4d4d", "#969696", "#1c1c1c", "#646464"]);
									yield* g.callName(f, live(img), "MapColors", ["#4d4d4d", "#969696", "#1c1c1c", "#646464"]);
								}
								(rt.modSrcVar(f, "toner", 5, subtract));
							} else {
								if (isEqual(rt.sv(f, "greytoggle"), "Color")) {
									if (rt.ge(rt.sv(f, "toner"), 10)) {
										(rt.modSrcVar(f, "toner", 10, subtract));
									} else {
										break blk228;
									}
								}
							}
							rt.setFv(f, "icon", live(p), live(I));
							rt.setFv(f, "img", live(p), live(img));
							rt.setFv(f, "name", live(p), rt.fv(f, "name", rt.sv(f, "photocopy")));
							rt.setFv(f, "desc", live(p), rt.fv(f, "desc", rt.sv(f, "photocopy")));
							rt.setFv(f, "scribble", live(p), rt.fv(f, "scribble", rt.sv(f, "photocopy")));
							rt.setFv(f, "pixel_x", live(p), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
							rt.setFv(f, "pixel_y", live(p), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
							rt.setFv(f, "blueprints", live(p), rt.fv(f, "blueprints", rt.sv(f, "photocopy")));
							rt.setSv(f, "busy", 1);
							yield* g.call(f, P("/proc/sleep"), null, [15]);
							rt.setSv(f, "busy", 0);
						} else {
							break;
						}
					}
					i = rt.inc(live(i), 1);
				}
			} else {
				if (truthy(rt.sv(f, "doccopy"))) {
					i = null;
					i = 0;
					while (rt.lt(live(i), rt.sv(f, "copies"))) {
						if (((rt.gt(rt.sv(f, "toner"), 5) && !truthy(rt.sv(f, "busy"))) && truthy(rt.sv(f, "doccopy")))) {
							yield* g.new_(f, T("/obj/item/documents/photocopy"), [rt.sv(f, "loc"), rt.sv(f, "doccopy")]);
							(rt.modSrcVar(f, "toner", 6, subtract));
							rt.setSv(f, "busy", 1);
							yield* g.call(f, P("/proc/sleep"), null, [15]);
							rt.setSv(f, "busy", 0);
						} else {
							break;
						}
						i = rt.inc(live(i), 1);
					}
					yield* g.srcCall(f, "updateUsrDialog");
				} else {
					if (truthy(rt.sv(f, "ass"))) {
						i = null;
						i = 0;
						while (rt.lt(live(i), rt.sv(f, "copies"))) {
							temp_img = null;
							if ((truthy((rt.istype(rt.sv(f, "ass"), T("/mob/living/carbon/human")) ? 1 : 0)) && (truthy((yield* g.callName(f, rt.sv(f, "ass"), "get_item_by_slot", [14]))) || truthy((yield* g.callName(f, rt.sv(f, "ass"), "get_item_by_slot", [13])))))) {
								$0 = live(f.usr);
								if (isEqual(rt.sv(f, "ass"), live(f.usr))) {
									$1 = "your";
								} else {
									$1 = rt.sv(f, "ass");
								}
								if (isEqual(rt.sv(f, "ass"), live(f.usr))) {
									$2 = "";
								} else {
									$2 = "'s";
								}
								if (isEqual(rt.sv(f, "ass"), live(f.usr))) {
									$3 = "your";
								} else {
									$3 = "their";
								}
								yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You feel kind of silly, copying ＀＀ ass with ＀ clothes on.</span>", [$1, $2, $3])]);
								break;
							}
							if (((rt.ge(rt.sv(f, "toner"), 5) && !truthy(rt.sv(f, "busy"))) && truthy((yield* g.srcCall(f, "check_ass"))))) {
								if ((truthy((rt.istype(rt.sv(f, "ass"), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "ass"), T("/mob/living/simple_animal/hostile/alien")) ? 1 : 0)))) {
									temp_img = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/ass/assalien.png")]));
								} else {
									if (truthy((rt.istype(rt.sv(f, "ass"), T("/mob/living/carbon/human")) ? 1 : 0))) {
										if (isEqual(rt.fv(f, "gender", rt.sv(f, "ass")), "male")) {
											temp_img = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/ass/assmale.png")]));
										} else {
											if (isEqual(rt.fv(f, "gender", rt.sv(f, "ass")), "female")) {
												temp_img = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/ass/assfemale.png")]));
											} else {
												temp_img = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/ass/assmale.png")]));
											}
										}
									} else {
										if (truthy((rt.istype(rt.sv(f, "ass"), T("/mob/living/simple_animal/drone")) ? 1 : 0))) {
											temp_img = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/ass/assdrone.png")]));
										} else {
											break;
										}
									}
								}
								rt.setFv(f, "desc", (p_2 = (yield* g.new_(f, T("/obj/item/weapon/photo"), [rt.sv(f, "loc")]))), fmt("You see ＀'s ass on the photo.", [rt.sv(f, "ass")]));
								rt.setFv(f, "pixel_x", live(p_2), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
								rt.setFv(f, "pixel_y", live(p_2), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
								rt.setFv(f, "img", live(p_2), live(temp_img));
								small_img = (yield* g.call(f, P("/proc/icon"), null, [live(temp_img)]));
								ic = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/items.dmi"), "photo"]));
								yield* g.callName(f, live(small_img), "Scale", [8, 8]);
								yield* g.callName(f, live(ic), "Blend", [live(small_img), 3, 13, 13]);
								rt.setFv(f, "icon", live(p_2), live(ic));
								(rt.modSrcVar(f, "toner", 5, subtract));
								rt.setSv(f, "busy", 1);
								yield* g.call(f, P("/proc/sleep"), null, [15]);
								rt.setSv(f, "busy", 0);
							} else {
								break;
							}
							i = rt.inc(live(i), 1);
						}
					}
				}
			}
		}
		yield* g.srcCall(f, "updateUsrDialog");
	} else {
		if (truthy(rt.at(live(f.args[1]), "remove"))) {
			if (truthy(rt.sv(f, "copy"))) {
				yield* g.srcCall(f, "remove_photocopy", rt.sv(f, "copy"), live(f.usr));
				rt.setSv(f, "copy", null);
			} else {
				if (truthy(rt.sv(f, "photocopy"))) {
					yield* g.srcCall(f, "remove_photocopy", rt.sv(f, "photocopy"), live(f.usr));
					rt.setSv(f, "photocopy", null);
				} else {
					if (truthy(rt.sv(f, "doccopy"))) {
						yield* g.srcCall(f, "remove_photocopy", rt.sv(f, "doccopy"), live(f.usr));
						rt.setSv(f, "doccopy", null);
					} else {
						if (truthy((yield* g.srcCall(f, "check_ass")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ass"), "<span class='notice'>You feel a slight pressure on your ass.</span>"]);
						}
					}
				}
			}
			yield* g.srcCall(f, "updateUsrDialog");
		} else {
			if (truthy(rt.at(live(f.args[1]), "min"))) {
				if (rt.gt(rt.sv(f, "copies"), 1)) {
					rt.incSrcVar(f, "copies", -1, true);
					yield* g.srcCall(f, "updateUsrDialog");
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "add"))) {
					if (rt.lt(rt.sv(f, "copies"), rt.sv(f, "maxcopies"))) {
						rt.incSrcVar(f, "copies", 1, true);
						yield* g.srcCall(f, "updateUsrDialog");
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "aipic"))) {
						if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) {
							return live(f.dot);
						}
						if ((rt.ge(rt.sv(f, "toner"), 5) && !truthy(rt.sv(f, "busy")))) {
							nametemp = rt.list();
							find = null;
							selection = null;
							if (isEqual(rt.getLen(f, rt.gv(f, "aipictures", rt.gv(f, "aicamera", (tempAI = live(f.usr))))), 0)) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldannounce'>No images saved</span>"]);
								return live(f.dot);
							}
							t = null;
							rt.forList(f, 0, rt.gv(f, "aipictures", rt.fv(f, "aicamera", live(tempAI))), T("/datum/picture"));
							while (($e = rt.next(f, 0)) !== undefined) {
								t = $e;
								nametemp = rt.modify(live(nametemp), rt.index(rt.fv(f, "fields", live(t)), "name"), add);
							}
							rt.endFor(f, 0);
							find = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", live(nametemp)]));
							p_4 = (yield* g.new_(f, T("/obj/item/weapon/photo"), [rt.sv(f, "loc")]));
							q = null;
							rt.forList(f, 0, rt.gv(f, "aipictures", rt.fv(f, "aicamera", live(tempAI))), T("/datum/picture"));
							while (($e = rt.next(f, 0)) !== undefined) {
								q = $e;
								if (isEqual(rt.index(rt.fv(f, "fields", live(q)), "name"), live(find))) {
									selection = live(q);
									break;
								}
							}
							rt.endFor(f, 0);
							I_5 = rt.index(rt.fv(f, "fields", live(selection)), "icon");
							img_6 = rt.index(rt.fv(f, "fields", live(selection)), "img");
							rt.setFv(f, "icon", live(p_4), live(I_5));
							rt.setFv(f, "img", live(p_4), live(img_6));
							rt.setFv(f, "desc", live(p_4), rt.index(rt.fv(f, "fields", live(selection)), "desc"));
							rt.setFv(f, "blueprints", live(p_4), rt.index(rt.fv(f, "fields", live(selection)), "blueprints"));
							rt.setFv(f, "pixel_x", live(p_4), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
							rt.setFv(f, "pixel_y", live(p_4), (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
							(rt.modSrcVar(f, "toner", 5, subtract));
							rt.setSv(f, "busy", 1);
							yield* g.call(f, P("/proc/sleep"), null, [15]);
							rt.setSv(f, "busy", 0);
						}
						yield* g.srcCall(f, "updateUsrDialog");
					} else {
						if (!truthy(rt.at(live(f.args[1]), "colortoggle"))) return f.dot;
						if (isEqual(rt.sv(f, "greytoggle"), "Greyscale")) {
							rt.setSv(f, "greytoggle", "Color");
						} else {
							rt.setSv(f, "greytoggle", "Greyscale");
						}
						yield* g.srcCall(f, "updateUsrDialog");
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/photocopier/proc/do_insertion  (code/modules/paperwork/photocopier.dm:245)  may sleep
rt.def("/obj/machinery/photocopier/proc/do_insertion", function* do_insertion(f: Frame, O: Value, user: Value) {
	f.vars = () => [O, user];
	rt.setFv(f, "loc", live(O), live(f.src));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class ='notice'>You insert ＀ into ＀.</span>", [live(O), live(f.src)])]);
	yield* g.call(f, P("/proc/flick"), null, ["photocopier1", live(f.src)]);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/photocopier/proc/remove_photocopy  (code/modules/paperwork/photocopier.dm:250)  may sleep
rt.def("/obj/machinery/photocopier/proc/remove_photocopy", function* remove_photocopy(f: Frame, O: Value, user: Value) {
	f.vars = () => [O, user];
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(user)));
		yield* g.callName(f, live(user), "put_in_hands", [live(O)]);
	} else {
		rt.setFv(f, "loc", live(O), rt.fv(f, "loc", live(f.src)));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ out of ＀.</span>", [live(O), live(f.src)])]);
	return f.dot;
}, true);

// /obj/machinery/photocopier/proc/attackby  (code/modules/paperwork/photocopier.dm:258)  may sleep
rt.def("/obj/machinery/photocopier/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "copier_empty")))) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/paper/contract/infernal")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ smokes, smelling of brimstone!</span>", [live(f.src)])]);
				(rt.modSrcVar(f, "resistance_flags", 4, rt.bitOr));
				yield* g.srcCall(f, "fire_act");
			} else {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setSv(f, "copy", live(f.args[0]));
				yield* g.srcCall(f, "do_insertion", live(f.args[0]), live(f.args[1]));
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is already something in ＀!</span>", [live(f.src)])]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0))) {
			if (truthy((yield* g.srcCall(f, "copier_empty")))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setSv(f, "photocopy", live(f.args[0]));
				yield* g.srcCall(f, "do_insertion", live(f.args[0]), live(f.args[1]));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is already something in ＀!</span>", [live(f.src)])]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/documents")) ? 1 : 0))) {
				if (truthy((yield* g.srcCall(f, "copier_empty")))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "doccopy", live(f.args[0]));
					yield* g.srcCall(f, "do_insertion", live(f.args[0]), live(f.args[1]));
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is already something in ＀!</span>", [live(f.src)])]);
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/toner")) ? 1 : 0))) {
					if (rt.le(rt.sv(f, "toner"), 0)) {
						if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
						rt.setSv(f, "toner", 40);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
						yield* g.srcCall(f, "updateUsrDialog");
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This cartridge is not yet ready for replacement! Use up the rest of the toner.</span>"]);
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
						if (truthy((yield* g.srcCall(f, "isinspace")))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There's nothing to fasten ＀ to!</span>", [live(f.src)])]);
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
						$0 = live(f.args[1]);
						if (truthy(rt.sv(f, "anchored"))) {
							$1 = "unwrenching";
						} else {
							$1 = "wrenching";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>You start ＀ ＀...</span>", [$1, live(f.src)])]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
							if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
								return live(f.dot);
							}
							$0 = live(f.args[1]);
							if (truthy(rt.sv(f, "anchored"))) {
								$1 = "unwrench";
							} else {
								$1 = "wrench";
							}
							yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ＀.</span>", [$1, live(f.src)])]);
							rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
						}
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/areaeditor/blueprints")) ? 1 : 0))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The Blueprint is too large to put into the copier. You need to find something else to record the document</span>"]);
						} else {
							return (yield* g.callSuper(f, [], rt.Args.Same));
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/photocopier/proc/obj_break  (code/modules/paperwork/photocopier.dm:318)  may sleep
rt.def("/obj/machinery/photocopier/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (!rt.gt(rt.sv(f, "toner"), 0)) return f.dot;
	yield* g.new_(f, T("/obj/effect/decal/cleanable/oil"), [rt.getStep(f, live(f.src), 0)]);
	rt.setSv(f, "toner", 0);
	return f.dot;
}, true);

// /obj/machinery/photocopier/proc/MouseDrop_T  (code/modules/paperwork/photocopier.dm:324)  may sleep
rt.def("/obj/machinery/photocopier/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	yield* g.srcCall(f, "check_ass");
	if ((((((((!truthy((rt.istype(live(target), T("/mob")) ? 1 : 0)) || truthy(rt.fv(f, "anchored", live(target)))) || truthy(rt.fv(f, "buckled", live(target)))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || !truthy((yield* g.srcCall(f, "Adjacent", live(target))))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src), 1])))) || isEqual(live(target), rt.sv(f, "ass"))) || truthy((yield* g.srcCall(f, "copier_blocked"))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (isEqual(live(target), live(user))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ starts climbing onto the photocopier!", [live(user)]), "<span class='notice'>You start climbing onto the photocopier...</span>"]);
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ starts putting ＀ onto the photocopier!</span>", [live(user), live(target)]), fmt("<span class='notice'>You start putting ＀ onto the photocopier...</span>", [live(target)])]);
	}
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(f.src)], rt.Args.Named)))) {
		if ((((!truthy(live(target)) || (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target))))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((yield* g.srcCall(f, "Adjacent", live(target)))))) {
			return live(f.dot);
		}
		if (isEqual(live(target), live(user))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ climbs onto the photocopier!", [live(user)]), "<span class='notice'>You climb onto the photocopier.</span>"]);
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ puts ＀ onto the photocopier!</span>", [live(user), live(target)]), fmt("<span class='notice'>You put ＀ onto the photocopier.</span>", [live(target)])]);
		}
		rt.setFv(f, "loc", live(target), rt.getStep(f, live(f.src), 0));
		rt.setSv(f, "ass", live(target));
		if (truthy(rt.sv(f, "photocopy"))) {
			rt.setFv(f, "loc", rt.sv(f, "photocopy"), rt.fv(f, "loc", live(f.src)));
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is shoved out of the way by ＀!</span>", [rt.sv(f, "photocopy"), rt.sv(f, "ass")]));
			rt.setSv(f, "photocopy", null);
		} else {
			if (truthy(rt.sv(f, "copy"))) {
				rt.setFv(f, "loc", rt.sv(f, "copy"), rt.fv(f, "loc", live(f.src)));
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ is shoved out of the way by ＀!</span>", [rt.sv(f, "copy"), rt.sv(f, "ass")]));
				rt.setSv(f, "copy", null);
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/photocopier/proc/check_ass  (code/modules/paperwork/photocopier.dm:357)  may sleep
rt.def("/obj/machinery/photocopier/proc/check_ass", function* check_ass(f: Frame) {
	if (!truthy(rt.sv(f, "ass"))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "loc", rt.sv(f, "ass")), rt.fv(f, "loc", live(f.src)))) {
		rt.setSv(f, "ass", null);
		yield* g.srcCall(f, "updateUsrDialog");
		return 0;
	} else {
		if (truthy((rt.istype(rt.sv(f, "ass"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if ((!truthy((yield* g.callName(f, rt.sv(f, "ass"), "get_item_by_slot", [14]))) && !truthy((yield* g.callName(f, rt.sv(f, "ass"), "get_item_by_slot", [13]))))) {
				return 1;
			} else {
				return 0;
			}
		} else {
			return 1;
		}
	}
	return f.dot;
}, true);

// /obj/machinery/photocopier/proc/copier_blocked  (code/modules/paperwork/photocopier.dm:372)
rt.def("/obj/machinery/photocopier/proc/copier_blocked", function copier_blocked(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "density", rt.sv(f, "loc")))) {
		return 1;
	}
	AM = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (isEqual(live(AM), live(f.src))) {
			continue;
		}
		if (truthy(rt.fv(f, "density", live(AM)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/machinery/photocopier/proc/copier_empty  (code/modules/paperwork/photocopier.dm:384)  may sleep
rt.def("/obj/machinery/photocopier/proc/copier_empty", function* copier_empty(f: Frame) {
	if (((truthy(rt.sv(f, "copy")) || truthy(rt.sv(f, "photocopy"))) || truthy((yield* g.srcCall(f, "check_ass"))))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
}, true);
