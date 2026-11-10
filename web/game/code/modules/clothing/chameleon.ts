// Based on /tg/station's code/modules/clothing/chameleon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(236, "/datum/action/item_action/chameleon/drone/randomise", "/datum/action/item_action/chameleon/drone", {
	name: "Randomise Headgear",
	button_icon_state: "random",
});

// chameleon.dm:8
rt.def("/datum/action/item_action/chameleon/drone/randomise/proc/Trigger", function* Trigger(f: Frame) {
	let X: Value = null, Z: Value = null;
	if (!(yield* this.IsAvailable())) {
		return f.dot;
	}
	if (rt.istype(this.target, T("/obj/item/clothing/head/chameleon/drone"))) {
		yield* (X = this.target).chameleon_action.random_look(this.owner);
	}
	if (rt.istype(this.target, T("/obj/item/clothing/mask/chameleon/drone"))) {
		yield* (Z = this.target).chameleon_action.random_look(this.owner);
	}
	return 1;
}, true);

rt.type(237, "/datum/action/item_action/chameleon/drone/togglehatmask", "/datum/action/item_action/chameleon/drone", {
	name: "Toggle Headgear Mode",
});

// chameleon.dm:26
rt.def("/datum/action/item_action/chameleon/drone/togglehatmask/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (rt.istype(this.target, T("/obj/item/clothing/head/chameleon/drone"))) {
		this.button_icon_state = "drone_camogear_helm";
	}
	if (!rt.istype(this.target, T("/obj/item/clothing/mask/chameleon/drone"))) return f.dot;
	this.button_icon_state = "drone_camogear_mask";
	return f.dot;
}, true);

// chameleon.dm:34
rt.def("/datum/action/item_action/chameleon/drone/togglehatmask/proc/Trigger", function* Trigger(f: Frame) {
	let D: Value = null, new_headgear: Value = null;
	if (!(yield* this.IsAvailable())) {
		return f.dot;
	}
	if (rt.istype(this.owner, T("/mob/living/simple_animal/drone"))) {
		D = this.owner;
	} else {
		return f.dot;
	}
	let old_headgear: Value = this.target;
	if (rt.istype(old_headgear, T("/obj/item/clothing/head/chameleon/drone"))) {
		new_headgear = (yield* new_(T("/obj/item/clothing/mask/chameleon/drone")));
	} else if (rt.istype(old_headgear, T("/obj/item/clothing/mask/chameleon/drone"))) {
		new_headgear = (yield* new_(T("/obj/item/clothing/head/chameleon/drone")));
	} else {
		to_chat(this.owner, "<span class='warning'>You shouldn't be able to toggle a camogear helmetmask if you're not wearing it</span>");
	}
	if (new_headgear) {
		yield* D.dropItemToGround(this.target, 1);
		yield* qdel(old_headgear);
		yield* D.equip_to_slot(new_headgear, slot_head);
	}
	return 1;
}, true);

rt.type(238, "/datum/action/item_action/chameleon/change", "/datum/action/item_action/chameleon", {
	chameleon_blacklist: null,
	chameleon_list: null,
	chameleon_type: null,
	chameleon_name: "Item",
	emp_timer: null,
	name: "Chameleon Change",
});

// chameleon.dm:71
rt.def("/datum/action/item_action/chameleon/change/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.chameleon_blacklist = list();

	this.chameleon_list = list();
	return f.dot;
});

// chameleon.dm:80
rt.def("/datum/action/item_action/chameleon/change/proc/initialize_disguises", function initialize_disguises(f: Frame) {
	let V: Value = null, I: Value = null, chameleon_item_name: Value = null;
	if (this.button) {
		this.button.name = `Change ${this.chameleon_name} Appearance`;
	}
	(rt.modSrcVar(f, "chameleon_blacklist", typecacheof(this.target.type), rt.bitOr));
	for (V of each(typesof(this.chameleon_type))) {
		if (ispath(V) && ispath(V, T("/obj/item"))) {
			I = V;
			if (rt.index(this.chameleon_blacklist, V) || rt.bitAnd(rt.initial(f, I, "flags"), 128)) {
				continue;
			}
			if (!rt.initial(f, I, "icon_state") || !rt.initial(f, I, "item_state")) {
				continue;
			}
			chameleon_item_name = `${rt.initial(f, I, "name")} (${rt.initial(f, I, "icon_state")})`;
			rt.setAt(this.chameleon_list, chameleon_item_name, I);
		}
	}
	return f.dot;
});

// chameleon.dm:97
rt.def("/datum/action/item_action/chameleon/change/proc/select_look", function* select_look(f: Frame, user: Value) {
	let picked_item: Value = null, picked_name: Value = null;
	if (!(picked_name = (yield* g.op(f, "Prompt", [1], [null, picked_name, `Chameleon ${this.chameleon_name}`, `Select ${this.chameleon_name} to change into`, this.chameleon_list])))) {
		return f.dot;
	}
	if (!(picked_item = rt.index(this.chameleon_list, picked_name))) {
		return f.dot;
	}
	yield* this.update_look(user, picked_item);
	return f.dot;
}, true);

// chameleon.dm:106
rt.def("/datum/action/item_action/chameleon/change/proc/random_look", function* random_look(f: Frame, user: Value) {
	let picked_name: Value = pick(this.chameleon_list);
	if (user) {
		yield* this.update_look(user, rt.index(this.chameleon_list, picked_name));
	} else {
		this.update_item(rt.index(this.chameleon_list, picked_name));
	}
	return f.dot;
}, true);

// chameleon.dm:120
rt.def("/datum/action/item_action/chameleon/change/proc/update_look", function* update_look(f: Frame, user: Value, picked_item: Value) {
	let CG: Value = null, C: Value = null;
	if (rt.istype(this.target, T("/obj/item/weapon/gun/energy/laser/chameleon"))) {
		yield* (CG = this.target).get_chameleon_projectile(picked_item);
	}
	if (rt.istype(user, T("/mob/living"))) {
		if ((C = user).stat != 0) {
			return f.dot;
		}
		this.update_item(picked_item);
		yield* this.update_item_icon();
	}
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

// chameleon.dm:133
rt.def("/datum/action/item_action/chameleon/change/proc/update_item", function update_item(f: Frame, picked_item: Value) {
	let I: Value = null, CL: Value = null, PCL: Value = null;
	this.target.name = rt.initial(f, picked_item, "name");
	this.target.desc = rt.initial(f, picked_item, "desc");
	this.target.icon_state = rt.initial(f, picked_item, "icon_state");
	if (rt.istype(this.target, T("/obj/item"))) {
		(I = this.target).item_state = rt.initial(f, picked_item, "item_state");
		I.item_color = rt.initial(f, picked_item, "item_color");
		if (rt.istype(I, T("/obj/item/clothing")) && rt.istype(picked_item, T("/obj/item/clothing"))) {
			CL = I;
			PCL = picked_item;
			CL.flags_cover = rt.initial(f, PCL, "flags_cover");
		}
	}
	this.target.icon = rt.initial(f, picked_item, "icon");
	return f.dot;
});

// chameleon.dm:147
rt.def("/datum/action/item_action/chameleon/change/proc/Trigger", function* Trigger(f: Frame) {
	if (!(yield* this.IsAvailable())) {
		return f.dot;
	}
	yield* this.select_look(this.owner);
	return 1;
}, true);

// chameleon.dm:154
rt.def("/datum/action/item_action/chameleon/change/proc/emp_randomise", function* emp_randomise(f: Frame) {
	if (rt.istype(this.target, T("/obj/item/weapon/gun/energy/laser/chameleon"))) {
		return f.dot;
	}
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSprocessing.processing += this;
	}
	yield* this.random_look(this.owner);
	this.emp_timer = rt.worldTime(f) + EMP_RANDOMISE_TIME;
	return f.dot;
}, true);

// chameleon.dm:162
rt.def("/datum/action/item_action/chameleon/change/proc/process", function* process(f: Frame) {
	if (rt.worldTime(f) > this.emp_timer) {
		this.isprocessing = 0;
		GLOB.SSprocessing.processing -= this;
		return f.dot;
	}
	yield* this.random_look(this.owner);
	return f.dot;
}, true, { waitfor: false });

// chameleon.dm:168
rt.def("/datum/action/item_action/chameleon/change/proc/update_item_icon", function* update_item_icon(f: Frame) {
	let flags: Value = null;
	let I: Value = this.target;
	let M: Value = this.owner;
	if (rt.bitAnd((flags = I.slot_flags), SLOT_OCLOTHING)) {
		yield* M.update_inv_wear_suit();
	}
	if (rt.bitAnd(flags, SLOT_ICLOTHING)) {
		yield* M.update_inv_w_uniform();
	}
	if (rt.bitAnd(flags, SLOT_GLOVES)) {
		M.update_inv_gloves();
	}
	if (rt.bitAnd(flags, SLOT_EYES)) {
		M.update_inv_glasses();
	}
	if (rt.bitAnd(flags, SLOT_EARS)) {
		M.update_inv_ears();
	}
	if (rt.bitAnd(flags, SLOT_MASK)) {
		yield* M.update_inv_wear_mask();
	}
	if (rt.bitAnd(flags, SLOT_HEAD)) {
		yield* M.update_inv_head();
	}
	if (rt.bitAnd(flags, SLOT_FEET)) {
		M.update_inv_shoes();
	}
	if (rt.bitAnd(flags, SLOT_ID)) {
		M.update_inv_wear_id();
	}
	if (rt.bitAnd(flags, SLOT_BELT)) {
		M.update_inv_belt();
	}
	if (rt.bitAnd(flags, SLOT_BACK)) {
		M.update_inv_back();
	}
	if (!rt.bitAnd(flags, SLOT_NECK)) return f.dot;
	M.update_inv_neck();
	return f.dot;
}, true);

rt.type(8343, "/obj/item/clothing/under/chameleon", "/obj/item/clothing/under", {
	chameleon_action: null,
	name: "black jumpsuit",
	icon_state: "black",
	item_state: "bl_suit",
	item_color: "black",
	desc: "It's a plain jumpsuit. It has a small dial on the wrist.",
	origin_tech: "syndicate=2",
	sensor_mode: 0,
	random_sensor: 0,
	resistance_flags: 0,
	armor: null,
});

// chameleon.dm:208
rt.def("/obj/item/clothing/under/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:213
rt.def("/obj/item/clothing/under/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/under");
	this.chameleon_action.chameleon_name = "Jumpsuit";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(list(T("/obj/item/clothing/under"), T("/obj/item/clothing/under/color"), T("/obj/item/clothing/under/rank"), T("/obj/item/clothing/under/changeling")), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:221
rt.def("/obj/item/clothing/under/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(7832, "/obj/item/clothing/suit/chameleon", "/obj/item/clothing/suit", {
	chameleon_action: null,
	name: "armor",
	desc: "A slim armored vest that protects against most types of damage.",
	icon_state: "armor",
	item_state: "armor",
	blood_overlay_type: "armor",
	origin_tech: "syndicate=2",
	resistance_flags: 0,
	armor: null,
});

// chameleon.dm:231
rt.def("/obj/item/clothing/suit/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:236
rt.def("/obj/item/clothing/suit/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/suit");
	this.chameleon_action.chameleon_name = "Suit";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(list(T("/obj/item/clothing/suit/armor/abductor"), T("/obj/item/clothing/suit/changeling")), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:244
rt.def("/obj/item/clothing/suit/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(8216, "/obj/item/clothing/glasses/chameleon", "/obj/item/clothing/glasses", {
	chameleon_action: null,
	name: "Optical Meson Scanner",
	desc: "Used by engineering and mining staff to see basic structural and terrain layouts through walls, regardless of lighting condition.",
	icon_state: "meson",
	item_state: "meson",
	origin_tech: "syndicate=2",
	resistance_flags: 0,
	armor: null,
});

// chameleon.dm:253
rt.def("/obj/item/clothing/glasses/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:258
rt.def("/obj/item/clothing/glasses/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/glasses");
	this.chameleon_action.chameleon_name = "Glasses";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/clothing/glasses/changeling"), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:266
rt.def("/obj/item/clothing/glasses/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(7692, "/obj/item/clothing/gloves/chameleon", "/obj/item/clothing/gloves", {
	chameleon_action: null,
	desc: "These gloves will protect the wearer from electric shock.",
	name: "insulated gloves",
	icon_state: "yellow",
	item_state: "ygloves",
	resistance_flags: 0,
	armor: null,
});

// chameleon.dm:275
rt.def("/obj/item/clothing/gloves/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:280
rt.def("/obj/item/clothing/gloves/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/gloves");
	this.chameleon_action.chameleon_name = "Gloves";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(list(T("/obj/item/clothing/gloves"), T("/obj/item/clothing/gloves/color"), T("/obj/item/clothing/gloves/changeling")), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:288
rt.def("/obj/item/clothing/gloves/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(8086, "/obj/item/clothing/head/chameleon", "/obj/item/clothing/head", {
	chameleon_action: null,
	name: "grey cap",
	desc: "It's a baseball hat in a tasteful grey colour.",
	icon_state: "greysoft",
	item_color: "grey",
	resistance_flags: 0,
	armor: null,
});

// chameleon.dm:297
rt.def("/obj/item/clothing/head/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:302
rt.def("/obj/item/clothing/head/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/head");
	this.chameleon_action.chameleon_name = "Hat";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/clothing/head/changeling"), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:310
rt.def("/obj/item/clothing/head/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(8087, "/obj/item/clothing/head/chameleon/drone", "/obj/item/clothing/head/chameleon", {
	flags: 2,
	armor: null,
});

// chameleon.dm:316
rt.def("/obj/item/clothing/head/chameleon/drone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// chameleon.dm:320
rt.def("/obj/item/clothing/head/chameleon/drone/proc/New", function* New(f: Frame) {
	let togglehatmask_action: Value = null, randomise_action: Value = null;
	yield* parent_proc();
	yield* this.chameleon_action.random_look();
	yield* (togglehatmask_action = (yield* new_(T("/datum/action/item_action/chameleon/drone/togglehatmask"), this))).UpdateButtonIcon();
	yield* (randomise_action = (yield* new_(T("/datum/action/item_action/chameleon/drone/randomise"), this))).UpdateButtonIcon();
	return f.dot;
}, true);

rt.type(8535, "/obj/item/clothing/mask/chameleon", "/obj/item/clothing/mask", {
	vchange: 1,
	chameleon_action: null,
	flags: 4104,
	name: "gas mask",
	desc: "A face-covering mask that can be connected to an air supply. While good for concealing your identity, it isn't good for blocking gas flow.",
	icon_state: "gas_alt",
	item_state: "gas_alt",
	resistance_flags: 0,
	armor: null,
	flags_inv: 736,
	gas_transfer_coefficient: 0.01,
	permeability_coefficient: 0.01,
	flags_cover: 10,
});

// chameleon.dm:333
rt.def("/obj/item/clothing/mask/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:346
rt.def("/obj/item/clothing/mask/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/mask");
	this.chameleon_action.chameleon_name = "Mask";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/clothing/mask/changeling"), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:354
rt.def("/obj/item/clothing/mask/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

// chameleon.dm:357
rt.def("/obj/item/clothing/mask/chameleon/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.vchange = (!this.vchange ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>The voice changer is now ${this.vchange ? "on" : "off"}!</span>`);
	return f.dot;
});

rt.type(8536, "/obj/item/clothing/mask/chameleon/drone", "/obj/item/clothing/mask/chameleon", {
	flags: 2,
	vchange: 0,
	armor: null,
});

// chameleon.dm:364
rt.def("/obj/item/clothing/mask/chameleon/drone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]);
	return f.dot;
});

// chameleon.dm:369
rt.def("/obj/item/clothing/mask/chameleon/drone/proc/New", function* New(f: Frame) {
	let togglehatmask_action: Value = null, randomise_action: Value = null;
	yield* parent_proc();
	yield* this.chameleon_action.random_look();
	yield* (togglehatmask_action = (yield* new_(T("/datum/action/item_action/chameleon/drone/togglehatmask"), this))).UpdateButtonIcon();
	yield* (randomise_action = (yield* new_(T("/datum/action/item_action/chameleon/drone/randomise"), this))).UpdateButtonIcon();
	return f.dot;
}, true);

// chameleon.dm:377
rt.def("/obj/item/clothing/mask/chameleon/drone/proc/attack_self", function attack_self(f: Frame, user: Value) {
	to_chat(user, `<span class='notice'>The ${this} does not have a voice changer.</span>`);
	return f.dot;
});

rt.type(8486, "/obj/item/clothing/shoes/chameleon", "/obj/item/clothing/shoes", {
	chameleon_action: null,
	flags: 1024,
	name: "black shoes",
	icon_state: "black",
	item_color: "black",
	desc: "A pair of black shoes.",
	permeability_coefficient: 0.05,
	origin_tech: "syndicate=2",
	resistance_flags: 0,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
	armor: null,
});

// chameleon.dm:389
rt.def("/obj/item/clothing/shoes/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

// chameleon.dm:394
rt.def("/obj/item/clothing/shoes/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/clothing/shoes");
	this.chameleon_action.chameleon_name = "Shoes";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/clothing/shoes/changeling"), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:402
rt.def("/obj/item/clothing/shoes/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(5141, "/obj/item/weapon/gun/energy/laser/chameleon", "/obj/item/weapon/gun/energy/laser", {
	chameleon_action: null,
	chameleon_projectile_vars: null,
	chameleon_ammo_vars: null,
	chameleon_gun_vars: null,
	projectile_copy_vars: null,
	ammo_copy_vars: null,
	gun_copy_vars: null,
	badmin_mode: 0,
	name: "practice laser gun",
	desc: "A modified version of the basic laser gun, this one fires less concentrated energy bolts designed for target practice.",
	clumsy_check: 0,
	needs_permit: 0,
	ammo_type: null,
	pin: rt.typePath("/obj/item/device/firing_pin"),
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/bluespace"),
}, { global: { blacklisted_vars: 728 } });

// chameleon.dm:407
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/chameleon"));
	return f.dot;
});

// chameleon.dm:424
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/weapon/gun");
	this.chameleon_action.chameleon_name = "Gun";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(T("/obj/item/weapon/gun/magic"), { ignore_root_path: 0 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:432
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.projectile_copy_vars = list("name", "icon", "icon_state", "item_state", "speed", "color", "hitsound", "forcedodge", "impact_effect_type", "range", "suppressed", "hitsound_wall", "impact_effect_type", "pass_flags");
	this.chameleon_projectile_vars = rt.alist(f, ["name", "practice laser", "icon", rt.rsc("icons/obj/projectiles.dmi"), "icon_state", "laser"]);
	this.gun_copy_vars = list("fire_sound", "burst_size", "fire_delay");
	this.chameleon_gun_vars = list();
	this.ammo_copy_vars = list("firing_effect_type");
	this.chameleon_ammo_vars = list();
	yield* this.recharge_newshot();
	yield* this.get_chameleon_projectile(T("/obj/item/weapon/gun/energy/laser"));
	return f.dot;
}, true);

// chameleon.dm:446
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/reset_chameleon_vars", function* reset_chameleon_vars(f: Frame) {
	let v: Value = null;
	this.chameleon_ammo_vars = list();
	this.chameleon_gun_vars = list();
	this.chameleon_projectile_vars = list();
	if (this.chambered) {
		for (v of each(this.ammo_copy_vars)) {
			if (rt.isIn(f, v, GLOB.blacklisted_vars)) {
				continue;
			}
			rt.setAt(this.chambered.vars, v, rt.initial(f, this.chambered.vars, v));
		}
	}
	v = null;
	for (v of each(this.gun_copy_vars)) {
		if (rt.isIn(f, v, GLOB.blacklisted_vars)) {
			continue;
		}
		rt.setAt(this.vars, v, rt.initial(f, this.vars, v));
	}
	yield* qdel(this.chambered.BB);
	this.chambered.BB = null;
	yield* this.chambered.newshot();
	return f.dot;
}, true);

// chameleon.dm:462
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_ammo", function* set_chameleon_ammo(f: Frame, AC: Value, passthrough: Value, reset: Value) {
	let V: Value = null, _P: Value = null;
	passthrough ??= 1;
	reset ??= 0;
	if (!rt.istype(AC, T("/obj/item/ammo_casing"))) {
		CRASH(`${AC} is not /obj/item/ammo_casing!`);
		return 0;
	}
	for (V of each(this.ammo_copy_vars)) {
		if (rt.index(AC.vars, V)) {
			rt.setAt(this.chameleon_ammo_vars, V, rt.index(AC.vars, V));
			if (this.chambered && rt.index(this.chambered.vars, V)) {
				rt.setAt(this.chambered.vars, V, rt.index(AC.vars, V));
			}
		}
	}
	if (!passthrough) return f.dot;
	yield* this.set_chameleon_projectile((_P = AC.BB));
	return f.dot;
}, true);

// chameleon.dm:475
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_projectile", function* set_chameleon_projectile(f: Frame, _P: Value) {
	let V: Value = null, AC: Value = null;
	if (!rt.istype(_P, T("/obj/item/projectile"))) {
		CRASH(`${_P} is not /obj/item/projectile!`);
		return 0;
	}
	this.chameleon_projectile_vars = rt.alist(f, ["name", "practice laser", "icon", rt.rsc("icons/obj/projectiles.dmi"), "icon_state", "laser", "nodamage", 1]);
	for (V of each(this.projectile_copy_vars)) {
		if (rt.index(_P.vars, V)) {
			rt.setAt(this.chameleon_projectile_vars, V, rt.index(_P.vars, V));
		}
	}
	if (rt.istype(this.chambered, T("/obj/item/ammo_casing/energy/chameleon"))) {
		(AC = this.chambered).projectile_vars = (yield* this.chameleon_projectile_vars.Copy());
	}
	if (!this.badmin_mode) return f.dot;
	yield* qdel(this.chambered.BB);
	this.chambered.projectile_type = _P.type;
	yield* this.chambered.newshot();
	return f.dot;
}, true);

// chameleon.dm:491
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/set_chameleon_gun", function* set_chameleon_gun(f: Frame, G: Value, passthrough: Value) {
	let V: Value = null, BG: Value = null, AB: Value = null, AC: Value = null, MG: Value = null, AC_1: Value = null, EG: Value = null, AC_0: Value = null;
	passthrough ??= 1;
	if (!rt.istype(G, T("/obj/item/weapon/gun"))) {
		CRASH(`${G} is not /obj/item/weapon/gun!`);
		return 0;
	}
	for (V of each(this.gun_copy_vars)) {
		if (rt.index(this.vars, V) && rt.index(G.vars, V)) {
			rt.setAt(this.chameleon_gun_vars, V, rt.index(G.vars, V));
			rt.setAt(this.vars, V, rt.index(G.vars, V));
		}
	}
	if (!passthrough) return f.dot;
	if (rt.istype(G, T("/obj/item/weapon/gun/ballistic"))) {
		BG = G;
		AB = (yield* new_(BG.mag_type, G));
		yield* qdel(BG);
		if (!rt.istype(AB, T("/obj/item/ammo_box")) || !AB.ammo_type) {
			yield* qdel(AB);
			return 0;
		}
		yield* this.set_chameleon_ammo((AC = (yield* new_(AB.ammo_type, G))));
	} else if (rt.istype(G, T("/obj/item/weapon/gun/magic"))) {
		MG = G;
		yield* this.set_chameleon_ammo((AC_1 = (yield* new_(MG.ammo_type, G))));
	} else if (rt.istype(G, T("/obj/item/weapon/gun/energy"))) {
		if (rt.istype((EG = G).ammo_type, T("/list")) && rt.len(f, EG.ammo_type)) {
			yield* this.set_chameleon_ammo((AC_1 = rt.index(EG.ammo_type, 1)));
		}
	} else {
		if (!rt.istype(G, T("/obj/item/weapon/gun/syringe"))) return f.dot;
		yield* this.set_chameleon_ammo((AC_0 = (yield* new_(T("/obj/item/ammo_casing/syringegun"), this))));
	}
	return f.dot;
}, true);

// chameleon.dm:522
rt.def("/obj/item/weapon/gun/energy/laser/chameleon/proc/get_chameleon_projectile", function* get_chameleon_projectile(f: Frame, guntype: Value) {
	let G: Value = null;
	yield* this.reset_chameleon_vars();
	yield* this.set_chameleon_gun((G = (yield* new_(guntype, this))));
	yield* qdel(G);
	return f.dot;
}, true);

rt.type(5502, "/obj/item/weapon/storage/backpack/chameleon", "/obj/item/weapon/storage/backpack", {
	chameleon_action: null,
	name: "backpack",
});

// chameleon.dm:532
rt.def("/obj/item/weapon/storage/backpack/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/weapon/storage/backpack");
	this.chameleon_action.chameleon_name = "Backpack";
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:539
rt.def("/obj/item/weapon/storage/backpack/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(5331, "/obj/item/weapon/storage/belt/chameleon", "/obj/item/weapon/storage/belt", {
	chameleon_action: null,
	name: "toolbelt",
	desc: "Holds tools.",
	silent: 1,
});

// chameleon.dm:548
rt.def("/obj/item/weapon/storage/belt/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/weapon/storage/belt");
	this.chameleon_action.chameleon_name = "Belt";
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:555
rt.def("/obj/item/weapon/storage/belt/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(9202, "/obj/item/device/radio/headset/chameleon", "/obj/item/device/radio/headset", {
	chameleon_action: null,
	name: "radio headset",
});

// chameleon.dm:562
rt.def("/obj/item/device/radio/headset/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/device/radio/headset");
	this.chameleon_action.chameleon_name = "Headset";
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:569
rt.def("/obj/item/device/radio/headset/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);

rt.type(9332, "/obj/item/device/pda/chameleon", "/obj/item/device/pda", {
	chameleon_action: null,
	name: "PDA",
});

// chameleon.dm:576
rt.def("/obj/item/device/pda/chameleon/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this));
	this.chameleon_action.chameleon_type = T("/obj/item/device/pda");
	this.chameleon_action.chameleon_name = "PDA";
	this.chameleon_action.chameleon_blacklist = (yield* typecacheof(list(T("/obj/item/device/pda/heads"), T("/obj/item/device/pda/ai"), T("/obj/item/device/pda/ai/pai")), { only_root_path: 1 }));
	this.chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// chameleon.dm:584
rt.def("/obj/item/device/pda/chameleon/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.chameleon_action.emp_randomise();
	return f.dot;
}, true);
