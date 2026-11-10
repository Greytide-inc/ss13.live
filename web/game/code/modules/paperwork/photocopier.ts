// Based on /tg/station's code/modules/paperwork/photocopier.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// photocopier.dm:35
rt.def("/obj/machinery/photocopier/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// photocopier.dm:38
rt.def("/obj/machinery/photocopier/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// photocopier.dm:41
rt.def("/obj/machinery/photocopier/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	let dat: Value = "Photocopier<BR><BR>";
	if (this.copy || this.photocopy || this.doccopy || this.ass && this.ass.loc == this.loc) {
		dat += fmt("<a href='byond://?src=＃;remove=1'>Remove Paper</a><BR>", [this]);
		if (this.toner) {
			dat += fmt("<a href='byond://?src=＃;copy=1'>Copy</a><BR>", [this]);
			dat += `Printing: ${this.copies} copies.`;
			dat += fmt("<a href='byond://?src=＃;min=1'>-</a> ", [this]);
			dat += fmt("<a href='byond://?src=＃;add=1'>+</a><BR><BR>", [this]);
			if (this.photocopy) {
				dat += fmt("Printing in <a href='byond://?src=＃;colortoggle=1'>＀</a><BR><BR>", [this, this.greytoggle]);
			}
		}
	} else if (this.toner) {
		dat += "Please insert paper to copy.<BR><BR>";
	}
	if (rt.istype(user, T("/mob/living/silicon/ai"))) {
		dat += fmt("<a href='byond://?src=＃;aipic=1'>Print photo from database</a><BR><BR>", [this]);
	}
	dat += `Current toner level: ${this.toner}`;
	if (!this.toner) {
		dat += "<BR>Please insert a new toner cartridge!";
	}
	rt.op(f, "Browse", [], [user, dat, "window=copier"], false);
	onclose(user, "copier");
	return f.dot;
}, true);

// photocopier.dm:64
rt.def("/obj/machinery/photocopier/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let i: Value = null, copy_as_paper: Value = null, E: Value = null, C: Value = null, c: Value = null, copied: Value = null, p: Value = null, I: Value = null, img: Value = null, temp_img: Value = null, p_2: Value = null, small_img: Value = null, ic: Value = null, nametemp: Value = null, find: Value = null, selection: Value = null, tempAI: Value = null, t: Value = null, p_4: Value = null, q: Value = null, I_5: Value = null, img_6: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "copy")) {
		if (this.copy) {
			i = 0;
			while (i < this.copies) {
				if (this.toner > 0 && !this.busy && this.copy) {
					copy_as_paper = 1;
					if (rt.istype(this.copy, T("/obj/item/weapon/paper/contract/employment"))) {
						E = this.copy;
						if (C = (yield* new_(T("/obj/item/weapon/paper/contract/employment"), this.loc, E.target.current))) {
							copy_as_paper = 0;
						}
					}
					if (copy_as_paper) {
						c = (yield* new_(T("/obj/item/weapon/paper"), this.loc));
						if (rt.length(this.copy.info) > 0) {
							if (this.toner > 10) {
								c.info = "<font color = #101010>";
							} else {
								c.info = "<font color = #808080>";
							}
							copied = replacetext((copied = replacetext((copied = this.copy.info), `<font face="${"Verdana"}" color=`, `<font face="${"Verdana"}" nocolor=`)), `<font face="${"Comic Sans MS"}" color=`, `<font face="${"Comic Sans MS"}" nocolor=`);
							c.info += copied;
							c.info += "</font>";
							c.name = this.copy.name;
							c.fields = this.copy.fields;
							yield* c.update_icon();
							c.updateinfolinks();
							c.stamps = this.copy.stamps;
							if (this.copy.stamped) {
								c.stamped = (yield* this.copy.stamped.Copy());
							}
							c.copy_overlays(this.copy, 1);
							this.toner--;
						}
					}
					this.busy = 1;
					yield* sleep(15);
					this.busy = 0;
				} else {
					break;
				}
				i++;
			}
			yield* this.updateUsrDialog();
		} else if (this.photocopy) {
			i = 0;
			while (i < this.copies) {
				blk228: {
					if (this.toner >= 5 && !this.busy && this.photocopy) {
						p = (yield* new_(T("/obj/item/weapon/photo"), this.loc));
						I = icon(this.photocopy.icon, this.photocopy.icon_state);
						img = icon(this.photocopy.img);
						if (this.greytoggle == "Greyscale") {
							if (this.toner > 10) {
								I.MapColors("#4d4d4d", "#969696", "#1c1c1c", "#000000");
								img.MapColors("#4d4d4d", "#969696", "#1c1c1c", "#000000");
							} else {
								I.MapColors("#4d4d4d", "#969696", "#1c1c1c", "#646464");
								img.MapColors("#4d4d4d", "#969696", "#1c1c1c", "#646464");
							}
							this.toner -= 5;
						} else if (this.greytoggle == "Color") {
							if (this.toner >= 10) {
								this.toner -= 10;
							} else {
								break blk228;
							}
						}
						p.icon = I;
						p.img = img;
						p.name = this.photocopy.name;
						p.desc = this.photocopy.desc;
						p.scribble = this.photocopy.scribble;
						p.pixel_x = rand(-10, 10);
						p.pixel_y = rand(-10, 10);
						p.blueprints = this.photocopy.blueprints;
						this.busy = 1;
						yield* sleep(15);
						this.busy = 0;
					} else {
						break;
					}
				}
				i++;
			}
		} else if (this.doccopy) {
			i = 0;
			while (i < this.copies) {
				if (this.toner > 5 && !this.busy && this.doccopy) {
					yield* new_(T("/obj/item/documents/photocopy"), this.loc, this.doccopy);
					this.toner -= 6;
					this.busy = 1;
					yield* sleep(15);
					this.busy = 0;
				} else {
					break;
				}
				i++;
			}
			yield* this.updateUsrDialog();
		} else if (this.ass) {
			i = 0;
			while (i < this.copies) {
				temp_img = null;
				if (rt.istype(this.ass, T("/mob/living/carbon/human")) && (this.ass.get_item_by_slot(slot_w_uniform) || this.ass.get_item_by_slot(slot_wear_suit))) {
					$0 = f.usr;
					if (this.ass == f.usr) {
						$1 = "your";
					} else {
						$1 = this.ass;
					}
					if (this.ass == f.usr) {
						$2 = "";
					} else {
						$2 = "'s";
					}
					if (this.ass == f.usr) {
						$3 = "your";
					} else {
						$3 = "their";
					}
					to_chat($0, `<span class='notice'>You feel kind of silly, copying ${$1}${$2} ass with ${$3} clothes on.</span>`);
					break;
				}
				if (this.toner >= 5 && !this.busy && (yield* this.check_ass())) {
					if (rt.istype(this.ass, T("/mob/living/carbon/alien/humanoid")) || rt.istype(this.ass, T("/mob/living/simple_animal/hostile/alien"))) {
						temp_img = icon(rt.rsc("icons/ass/assalien.png"));
					} else if (rt.istype(this.ass, T("/mob/living/carbon/human"))) {
						if (this.ass.gender == "male") {
							temp_img = icon(rt.rsc("icons/ass/assmale.png"));
						} else if (this.ass.gender == "female") {
							temp_img = icon(rt.rsc("icons/ass/assfemale.png"));
						} else {
							temp_img = icon(rt.rsc("icons/ass/assmale.png"));
						}
					} else if (rt.istype(this.ass, T("/mob/living/simple_animal/drone"))) {
						temp_img = icon(rt.rsc("icons/ass/assdrone.png"));
					} else {
						break;
					}
					(p_2 = (yield* new_(T("/obj/item/weapon/photo"), this.loc))).desc = `You see ${this.ass}'s ass on the photo.`;
					p_2.pixel_x = rand(-10, 10);
					p_2.pixel_y = rand(-10, 10);
					p_2.img = temp_img;
					small_img = icon(temp_img);
					ic = icon(rt.rsc("icons/obj/items.dmi"), "photo");
					small_img.Scale(8, 8);
					ic.Blend(small_img, 3, 13, 13);
					p_2.icon = ic;
					this.toner -= 5;
					this.busy = 1;
					yield* sleep(15);
					this.busy = 0;
				} else {
					break;
				}
				i++;
			}
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "remove")) {
		if (this.copy) {
			yield* this.remove_photocopy(this.copy, f.usr);
			this.copy = null;
		} else if (this.photocopy) {
			yield* this.remove_photocopy(this.photocopy, f.usr);
			this.photocopy = null;
		} else if (this.doccopy) {
			yield* this.remove_photocopy(this.doccopy, f.usr);
			this.doccopy = null;
		} else if (yield* this.check_ass()) {
			to_chat(this.ass, "<span class='notice'>You feel a slight pressure on your ass.</span>");
		}
		yield* this.updateUsrDialog();
	} else if (rt.at(href_list, "min")) {
		if (this.copies > 1) {
			this.copies--;
			yield* this.updateUsrDialog();
		}
	} else if (rt.at(href_list, "add")) {
		if (this.copies < this.maxcopies) {
			this.copies++;
			yield* this.updateUsrDialog();
		}
	} else if (rt.at(href_list, "aipic")) {
		if (!rt.istype(f.usr, T("/mob/living/silicon/ai"))) {
			return f.dot;
		}
		if (this.toner >= 5 && !this.busy) {
			nametemp = list();
			if (rt.len(f, (tempAI = f.usr).aicamera.aipictures) == 0) {
				to_chat(f.usr, "<span class='boldannounce'>No images saved</span>");
				return f.dot;
			}
			for (t of each(tempAI.aicamera.aipictures, T("/datum/picture"))) {
				nametemp += rt.index(t.fields, "name");
			}
			find = (yield* g.op(f, "Prompt", [0], [null, null, null, "Select image (numbered in order taken)", nametemp]));
			p_4 = (yield* new_(T("/obj/item/weapon/photo"), this.loc));
			for (q of each(tempAI.aicamera.aipictures, T("/datum/picture"))) {
				if (rt.index(q.fields, "name") == find) {
					selection = q;
					break;
				}
			}
			I_5 = rt.index(selection.fields, "icon");
			img_6 = rt.index(selection.fields, "img");
			p_4.icon = I_5;
			p_4.img = img_6;
			p_4.desc = rt.index(selection.fields, "desc");
			p_4.blueprints = rt.index(selection.fields, "blueprints");
			p_4.pixel_x = rand(-10, 10);
			p_4.pixel_y = rand(-10, 10);
			this.toner -= 5;
			this.busy = 1;
			yield* sleep(15);
			this.busy = 0;
		}
		yield* this.updateUsrDialog();
	} else {
		if (!rt.at(href_list, "colortoggle")) return f.dot;
		if (this.greytoggle == "Greyscale") {
			this.greytoggle = "Color";
		} else {
			this.greytoggle = "Greyscale";
		}
		yield* this.updateUsrDialog();
	}
	return f.dot;
}, true);

// photocopier.dm:245
rt.def("/obj/machinery/photocopier/proc/do_insertion", function* do_insertion(f: Frame, O: Value, user: Value) {
	O.loc = this;
	to_chat(user, `<span class ='notice'>You insert ${O} into ${this}.</span>`);
	flick("photocopier1", this);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// photocopier.dm:250
rt.def("/obj/machinery/photocopier/proc/remove_photocopy", function* remove_photocopy(f: Frame, O: Value, user: Value) {
	if (!rt.istype(user, T("/mob/living/silicon"))) {
		O.loc = user.loc;
		yield* user.put_in_hands(O);
	} else {
		O.loc = this.loc;
	}
	to_chat(user, `<span class='notice'>You take ${O} out of ${this}.</span>`);
	return f.dot;
}, true);

// photocopier.dm:258
rt.def("/obj/machinery/photocopier/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/paper"))) {
		if (yield* this.copier_empty()) {
			if (rt.istype(O, T("/obj/item/weapon/paper/contract/infernal"))) {
				to_chat(user, `<span class='warning'>${this} smokes, smelling of brimstone!</span>`);
				(rt.modSrcVar(f, "resistance_flags", 4, rt.bitOr));
				yield* this.fire_act();
			} else {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				this.copy = O;
				yield* this.do_insertion(O, user);
			}
		} else {
			to_chat(user, `<span class='warning'>There is already something in ${this}!</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/photo"))) {
		if (yield* this.copier_empty()) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.photocopy = O;
			yield* this.do_insertion(O, user);
		} else {
			to_chat(user, `<span class='warning'>There is already something in ${this}!</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/documents"))) {
		if (yield* this.copier_empty()) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.doccopy = O;
			yield* this.do_insertion(O, user);
		} else {
			to_chat(user, `<span class='warning'>There is already something in ${this}!</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/device/toner"))) {
		if (this.toner <= 0) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* qdel(O);
			this.toner = 40;
			to_chat(user, `<span class='notice'>You insert ${O} into ${this}.</span>`);
			yield* this.updateUsrDialog();
		} else {
			to_chat(user, "<span class='warning'>This cartridge is not yet ready for replacement! Use up the rest of the toner.</span>");
		}
	} else if (rt.istype(O, T("/obj/item/weapon/wrench"))) {
		if (this.isinspace()) {
			to_chat(user, `<span class='warning'>There's nothing to fasten ${this} to!</span>`);
			return f.dot;
		}
		playsound(this.loc, O.usesound, 50, 1);
		to_chat(user, `<span class='warning'>You start ${this.anchored ? "unwrenching" : "wrenching"} ${this}...</span>`);
		if (yield* do_after(user, 20 * O.toolspeed, { target: this })) {
			if (!this || this.gc_destroyed) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You ${this.anchored ? "unwrench" : "wrench"} ${this}.</span>`);
			this.anchored = (!this.anchored ? 1 : 0);
		}
	} else if (rt.istype(O, T("/obj/item/areaeditor/blueprints"))) {
		to_chat(user, "<span class='warning'>The Blueprint is too large to put into the copier. You need to find something else to record the document</span>");
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// photocopier.dm:318
rt.def("/obj/machinery/photocopier/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (!(this.toner > 0)) return f.dot;
	yield* new_(T("/obj/effect/decal/cleanable/oil"), rt.getStep(f, this, 0));
	this.toner = 0;
	return f.dot;
}, true);

// photocopier.dm:324
rt.def("/obj/machinery/photocopier/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	yield* this.check_ass();
	if (!rt.istype(target, T("/mob")) || target.anchored || target.buckled || !this.Adjacent(user) || !this.Adjacent(target) || !user.canUseTopic(this, 1) || target == this.ass || this.copier_blocked()) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (target == user) {
		user.visible_message(`${user} starts climbing onto the photocopier!`, "<span class='notice'>You start climbing onto the photocopier...</span>");
	} else {
		user.visible_message(`<span class='warning'>${user} starts putting ${target} onto the photocopier!</span>`, `<span class='notice'>You start putting ${target} onto the photocopier...</span>`);
	}
	if (yield* do_after(user, 20, { target: this })) {
		if (!target || !target || target.gc_destroyed || !this || this.gc_destroyed || !this.Adjacent(target)) {
			return f.dot;
		}
		if (target == user) {
			user.visible_message(`${user} climbs onto the photocopier!`, "<span class='notice'>You climb onto the photocopier.</span>");
		} else {
			user.visible_message(`<span class='warning'>${user} puts ${target} onto the photocopier!</span>`, `<span class='notice'>You put ${target} onto the photocopier.</span>`);
		}
		target.loc = rt.getStep(f, this, 0);
		this.ass = target;
		if (this.photocopy) {
			this.photocopy.loc = this.loc;
			this.visible_message(`<span class='warning'>${this.photocopy} is shoved out of the way by ${this.ass}!</span>`);
			this.photocopy = null;
		} else if (this.copy) {
			this.copy.loc = this.loc;
			this.visible_message(`<span class='warning'>${this.copy} is shoved out of the way by ${this.ass}!</span>`);
			this.copy = null;
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// photocopier.dm:357
rt.def("/obj/machinery/photocopier/proc/check_ass", function* check_ass(f: Frame) {
	if (!this.ass) {
		return 0;
	}
	if (this.ass.loc != this.loc) {
		this.ass = null;
		yield* this.updateUsrDialog();
		return 0;
	} else if (rt.istype(this.ass, T("/mob/living/carbon/human"))) {
		if (!this.ass.get_item_by_slot(slot_w_uniform) && !this.ass.get_item_by_slot(slot_wear_suit)) {
			return 1;
		} else {
			return 0;
		}
	} else {
		return 1;
	}
}, true);

// photocopier.dm:372
rt.def("/obj/machinery/photocopier/proc/copier_blocked", function copier_blocked(f: Frame) {
	let AM: Value = null;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (this.loc.density) {
		return 1;
	}
	for (AM of each(this.loc, T("/atom/movable"))) {
		if (AM == this) {
			continue;
		}
		if (AM.density) {
			return 1;
		}
	}
	return 0;
});

// photocopier.dm:384
rt.def("/obj/machinery/photocopier/proc/copier_empty", function* copier_empty(f: Frame) {
	if (this.copy || this.photocopy || (yield* this.check_ass())) {
		return 0;
	} else {
		return 1;
	}
}, true);
