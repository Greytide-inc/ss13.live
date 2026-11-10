// Based on /tg/station's code/modules/surgery/organs/augments_arms.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(9488, "/obj/item/organ/cyberimp/arm", "/obj/item/organ/cyberimp", {
	items_list: null,
	holder: null,
	name: "arm-mounted implant",
	desc: "You shouldn't see this! Adminhelp and report this as an issue on github!",
	zone: "r_arm",
	slot: "r_arm_device",
	icon_state: "implant-toolkit",
	w_class: 3,
	actions_types: null,
});

// augments_arms.dm:10
rt.def("/obj/item/organ/cyberimp/arm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.items_list = list();

	this.actions_types = list(T("/datum/action/item_action/organ_action/toggle"));
	return f.dot;
});

// augments_arms.dm:18
rt.def("/obj/item/organ/cyberimp/arm/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (ispath(this.holder)) {
		this.holder = (yield* new_(this.holder, this));
	}
	yield* this.update_icon();
	this.slot = this.zone + "_device";
	this.items_list = (yield* this.contents.Copy());
	return f.dot;
}, true);

// augments_arms.dm:27
rt.def("/obj/item/organ/cyberimp/arm/proc/update_icon", function update_icon(f: Frame) {
	if (this.zone == "r_arm") {
		this.transform = null;
	} else {
		this.transform = matrix(-1, 0, 0, 0, 1, 0);
	}
	return f.dot;
});

// augments_arms.dm:33
rt.def("/obj/item/organ/cyberimp/arm/proc/examine", function examine(f: Frame, user: Value) {
	let $2: any;
	parent_proc();
	let $0: any = user;
	let $1: any = this;
	if (this.zone == "r_arm") {
		$2 = "right";
	} else {
		$2 = "left";
	}
	to_chat($0, `<span class='info'>${$1} is assembled in the ${$2} arm configuration. You can use a screwdriver to reassemble it.</span>`);
	return f.dot;
}, false);

// augments_arms.dm:37
rt.def("/obj/item/organ/cyberimp/arm/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let $0: any, $1: any, $2: any;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.zone == "r_arm") {
			this.zone = "l_arm";
		} else {
			this.zone = "r_arm";
		}
		this.slot = this.zone + "_device";
		$0 = user;
		$1 = this;
		if (this.zone == "r_arm") {
			$2 = "right";
		} else {
			$2 = "left";
		}
		to_chat($0, `<span class='notice'>You modify ${$1} to be installed on the ${$2} arm.</span>`);
		yield* this.update_icon();
	} else {
		if (!rt.istype(W, T("/obj/item/weapon/card/emag"))) return f.dot;
		yield* this.emag_act();
	}
	return f.dot;
}, true);

// augments_arms.dm:50
rt.def("/obj/item/organ/cyberimp/arm/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* this.Retract();
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9489, "/obj/item/organ/cyberimp/arm/gun", "/obj/item/organ/cyberimp/arm", {});

// augments_arms.dm:57
rt.def("/obj/item/organ/cyberimp/arm/gun/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (prob(15 / severity) && this.owner) {
		to_chat(this.owner, `<span class='warning'>${this} is hit by EMP!</span>`);
		yield* this.Retract();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// augments_arms.dm:64
rt.def("/obj/item/organ/cyberimp/arm/proc/Retract", function* Retract(f: Frame) {
	let F: Value = null;
	let $4: any;
	if (!this.holder || rt.isIn(f, this.holder, this)) {
		return f.dot;
	}
	let $0: any = this.owner;
	let $1: any = this.owner;
	let $2: any = this.holder;
	let $3: any = this.owner.p_their();
	if (this.zone == "r_arm") {
		$4 = "right";
	} else {
		$4 = "left";
	}
	$1 = `<span class='notice'>${$1} retracts ${$2} back into ${$3} ${$4} arm.</span>`;
	$2 = this.holder;
	if (this.zone == "r_arm") {
		$3 = "right";
	} else {
		$3 = "left";
	}
	$0.visible_message($1, `<span class='notice'>${$2} snaps back into your ${$3} arm.</span>`, "<span class='italics'>You hear a short mechanical noise.</span>");
	if (rt.istype(this.holder, T("/obj/item/device/assembly/flash/armimplant"))) {
		(F = this.holder).set_light(0);
	}
	yield* this.owner.transferItemToLoc(this.holder, this, 1);
	this.holder = null;
	playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	return f.dot;
}, true);

// augments_arms.dm:80
rt.def("/obj/item/organ/cyberimp/arm/proc/Extend", function* Extend(f: Frame, item: Value) {
	let F: Value = null, arm_item: Value = null, result: Value = null;
	let $0: any;
	if (!rt.isIn(f, item, this)) {
		return f.dot;
	}
	this.holder = item;
	(rt.modField(f, this.holder, "flags", 2, rt.bitOr));
	this.holder.resistance_flags = 115;
	this.holder.slot_flags = null;
	this.holder.w_class = WEIGHT_CLASS_HUGE;
	this.holder.materials = null;
	if (rt.istype(this.holder, T("/obj/item/device/assembly/flash/armimplant"))) {
		(F = this.holder).set_light(7);
	}
	if (arm_item = this.owner.get_active_held_item()) {
		if (!(yield* this.owner.dropItemToGround(arm_item))) {
			to_chat(this.owner, `<span class='warning'>Your ${arm_item} interferes with ${this}!</span>`);
			return f.dot;
		} else {
			to_chat(this.owner, `<span class='notice'>You drop ${arm_item} to activate ${this}!</span>`);
		}
	}
	if (this.zone == "r_arm") {
		$0 = (yield* this.owner.put_in_r_hand(this.holder));
	} else {
		$0 = (yield* this.owner.put_in_l_hand(this.holder));
	}
	if (!(result = $0)) {
		to_chat(this.owner, `<span class='warning'>Your ${this} fails to activate!</span>`);
		return f.dot;
	}
	this.owner.swap_hand(result);
	$0 = this.owner;
	let $1: any = this.owner;
	let $2: any = this.holder;
	let $3: any = this.owner.p_their();
	$1 = `<span class='notice'>${$1} extends ${$2} from ${$3} ${this.zone == "r_arm" ? "right" : "left"} arm.</span>`;
	$2 = this.holder;
	if (this.zone == "r_arm") {
		$3 = "right";
	} else {
		$3 = "left";
	}
	$0.visible_message($1, `<span class='notice'>You extend ${$2} from your ${$3} arm.</span>`, "<span class='italics'>You hear a short mechanical noise.</span>");
	playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1);
	return f.dot;
}, true);

// augments_arms.dm:118
rt.def("/obj/item/organ/cyberimp/arm/proc/ui_action_click", function* ui_action_click(f: Frame) {
	let choise: Value = null;
	if (this.crit_fail || !this.holder && !rt.len(f, this.contents)) {
		to_chat(this.owner, "<span class='warning'>The implant doesn't respond. It seems to be broken...</span>");
		return f.dot;
	}
	if (rt.istype(this.owner.get_active_held_item(), T("/obj/item/weapon/card/emag")) && (yield* this.emag_act())) {
		return f.dot;
	}
	if (!this.holder || rt.isIn(f, this.holder, this)) {
		this.holder = null;
		if (rt.len(f, this.contents) == 1) {
			yield* this.Extend(rt.index(this.contents, 1));
		} else {
			choise = (yield* g.op(f, "Prompt", [1], [null, null, "Arm Implant", "Activate which item?", this.items_list]));
			if (this.owner && this.owner == f.usr && this.owner.stat != 2 && rt.isIn(f, this, this.owner.internal_organs) && !this.holder && rt.istype(choise, T("/obj/item")) && rt.isIn(f, choise, this.contents)) {
				yield* this.Extend(choise);
			}
		}
	} else {
		yield* this.Retract();
	}
	return f.dot;
}, true);

// augments_arms.dm:140
rt.def("/obj/item/organ/cyberimp/arm/gun/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let $0: any, $1: any, $2: any;
	if (prob(30 / severity) && this.owner && !this.crit_fail) {
		yield* this.Retract();
		$0 = this.owner;
		$1 = this.owner;
		if (this.zone == "r_arm") {
			$2 = "right";
		} else {
			$2 = "left";
		}
		$0.visible_message(`<span class='danger'>A loud bang comes from ${$1}'s ${$2} arm!</span>`);
		playsound(rt.getStep(f, this.owner, 0), rt.rsc("sound/weapons/flashbang.ogg"), 100, 1);
		$0 = this.owner;
		if (this.zone == "r_arm") {
			$1 = "right";
		} else {
			$1 = "left";
		}
		to_chat($0, `<span class='userdanger'>You feel an explosion erupt inside your ${$1} arm as your implant breaks!</span>`);
		yield* this.owner.adjust_fire_stacks(20);
		yield* this.owner.IgniteMob();
		yield* this.owner.adjustFireLoss(25);
		this.crit_fail = 1;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(9490, "/obj/item/organ/cyberimp/arm/gun/laser", "/obj/item/organ/cyberimp/arm/gun", {
	name: "arm-mounted laser implant",
	desc: "A variant of the arm cannon implant that fires lethal laser beams. The cannon emerges from the subject's arm and remains inside when not in use.",
	icon_state: "arm_laser",
	origin_tech: "materials=4;combat=4;biotech=4;powerstorage=4;syndicate=3",
	contents: null,
});

// augments_arms.dm:158
rt.def("/obj/item/organ/cyberimp/arm/gun/laser/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/gun/energy/laser/mounted"))));
	return f.dot;
}, true);

rt.type(9492, "/obj/item/organ/cyberimp/arm/gun/taser", "/obj/item/organ/cyberimp/arm/gun", {
	name: "arm-mounted taser implant",
	desc: "A variant of the arm cannon implant that fires electrodes and disabler shots. The cannon emerges from the subject's arm and remains inside when not in use.",
	icon_state: "arm_taser",
	origin_tech: "materials=5;combat=5;biotech=4;powerstorage=4",
	contents: null,
});

// augments_arms.dm:169
rt.def("/obj/item/organ/cyberimp/arm/gun/taser/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/gun/energy/e_gun/advtaser/mounted"))));
	return f.dot;
}, true);

rt.type(9494, "/obj/item/organ/cyberimp/arm/toolset", "/obj/item/organ/cyberimp/arm", {
	name: "integrated toolset implant",
	desc: "A stripped-down version of engineering cyborg toolset, designed to be installed on subject's arm. Contains all neccessary tools.",
	origin_tech: "materials=3;engineering=4;biotech=3;powerstorage=4",
	contents: null,
});

// augments_arms.dm:179
rt.def("/obj/item/organ/cyberimp/arm/toolset/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/screwdriver/cyborg"))), (yield* new_(T("/obj/item/weapon/wrench/cyborg"))), (yield* new_(T("/obj/item/weapon/weldingtool/largetank/cyborg"))), (yield* new_(T("/obj/item/weapon/crowbar/cyborg"))), (yield* new_(T("/obj/item/weapon/wirecutters/cyborg"))), (yield* new_(T("/obj/item/device/multitool/cyborg"))));
	return f.dot;
}, true);

// augments_arms.dm:186
rt.def("/obj/item/organ/cyberimp/arm/toolset/proc/emag_act", function* emag_act(f: Frame) {
	if (!rt.locateIn(f, T("/obj/item/weapon/kitchen/knife/combat/cyborg"), this.items_list)) {
		to_chat(f.usr, `<span class='notice'>You unlock ${this}'s integrated knife!</span>`);
		this.items_list += (yield* new_(T("/obj/item/weapon/kitchen/knife/combat/cyborg"), this));
		return 1;
	}
	return 0;
}, true);

rt.type(9496, "/obj/item/organ/cyberimp/arm/esword", "/obj/item/organ/cyberimp/arm", {
	name: "arm-mounted energy blade",
	desc: "An illegal, and highly dangerous cybernetic implant that can project a deadly blade of concentrated enregy.",
	contents: null,
	origin_tech: "materials=4;combat=5;biotech=3;powerstorage=2;syndicate=5",
});

// augments_arms.dm:195
rt.def("/obj/item/organ/cyberimp/arm/esword/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/melee/energy/blade/hardlight"))));
	return f.dot;
}, true);

rt.type(9497, "/obj/item/organ/cyberimp/arm/medibeam", "/obj/item/organ/cyberimp/arm", {
	name: "integrated medical beamgun",
	desc: "A cybernetic implant that allows the user to project a healing beam from their hand.",
	contents: null,
	origin_tech: "materials=5;combat=2;biotech=5;powerstorage=4;syndicate=1",
});

// augments_arms.dm:201
rt.def("/obj/item/organ/cyberimp/arm/medibeam/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/gun/medbeam"))));
	return f.dot;
}, true);

rt.type(9498, "/obj/item/organ/cyberimp/arm/flash", "/obj/item/organ/cyberimp/arm", {
	name: "integrated high-intensity photon projector",
	desc: "An integrated projector mounted onto a user's arm, that is able to be used as a powerful flash.",
	contents: null,
	origin_tech: "materials=4;combat=3;biotech=4;magnets=4;powerstorage=3",
});

// augments_arms.dm:207
rt.def("/obj/item/organ/cyberimp/arm/flash/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/device/assembly/flash/armimplant"))));
	return f.dot;
}, true);

// augments_arms.dm:211
rt.def("/obj/item/organ/cyberimp/arm/flash/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), this.items_list)) return f.dot;
	(F = rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), this.items_list)).I = this;
	return f.dot;
}, true);

rt.type(9499, "/obj/item/organ/cyberimp/arm/baton", "/obj/item/organ/cyberimp/arm", {
	name: "arm electrification implant",
	desc: "An illegal combat implant that allows the user to administer disabling shocks from their arm.",
	contents: null,
	origin_tech: "materials=3;combat=5;biotech=4;powerstorage=4;syndicate=3",
});

// augments_arms.dm:219
rt.def("/obj/item/organ/cyberimp/arm/baton/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/borg/stun"))));
	return f.dot;
}, true);

rt.type(9500, "/obj/item/organ/cyberimp/arm/combat", "/obj/item/organ/cyberimp/arm", {
	name: "combat cybernetics implant",
	desc: "A powerful cybernetic implant that contains combat modules built into the user's arm",
	contents: null,
	origin_tech: "materials=5;combat=7;biotech=5;powerstorage=5;syndicate=6;programming=5",
});

// augments_arms.dm:225
rt.def("/obj/item/organ/cyberimp/arm/combat/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/melee/energy/blade/hardlight"))), (yield* new_(T("/obj/item/weapon/gun/medbeam"))), (yield* new_(T("/obj/item/borg/stun"))), (yield* new_(T("/obj/item/device/assembly/flash/armimplant"))));
	return f.dot;
}, true);

// augments_arms.dm:229
rt.def("/obj/item/organ/cyberimp/arm/combat/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), this.items_list)) return f.dot;
	(F = rt.locateIn(f, T("/obj/item/device/assembly/flash/armimplant"), this.items_list)).I = this;
	return f.dot;
}, true);

rt.type(9501, "/obj/item/organ/cyberimp/arm/surgery", "/obj/item/organ/cyberimp/arm", {
	name: "surgical toolset implant",
	desc: "A set of surgical tools hidden behind a concealed panel on the user's arm",
	contents: null,
	origin_tech: "materials=3;engineering=3;biotech=3;programming=2;magnets=3",
});

// augments_arms.dm:237
rt.def("/obj/item/organ/cyberimp/arm/surgery/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.contents = list((yield* new_(T("/obj/item/weapon/retractor"))), (yield* new_(T("/obj/item/weapon/hemostat"))), (yield* new_(T("/obj/item/weapon/cautery"))), (yield* new_(T("/obj/item/weapon/surgicaldrill"))), (yield* new_(T("/obj/item/weapon/scalpel"))), (yield* new_(T("/obj/item/weapon/circular_saw"))), (yield* new_(T("/obj/item/weapon/surgical_drapes"))));
	return f.dot;
}, true);
