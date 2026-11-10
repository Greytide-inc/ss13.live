// Based on /tg/station's code/modules/mob/living/simple_animal/bot/construction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7562, "/obj/item/weapon/bucket_sensor", "/obj/item/weapon", {
	created_name: "Cleanbot",
	throw_speed: 2,
	throw_range: 5,
	desc: "It's a bucket. With a sensor attached.",
	name: "proxy bucket",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "bucket_proxy",
	force: 3,
	throwforce: 5,
	w_class: 3,
});

// construction.dm:17
rt.def("/obj/item/weapon/bucket_sensor/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, A: Value = null, t: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/bodypart/l_arm/robot")) || rt.istype(W, T("/obj/item/bodypart/r_arm/robot"))) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
			return f.dot;
		}
		yield* qdel(W);
		_T = rt.getStep(f, this.loc, 0);
		(A = (yield* new_(T("/mob/living/simple_animal/bot/cleanbot"), _T))).name = this.created_name;
		to_chat(user, "<span class='notice'>You add the robot arm to the bucket and sensor assembly. Beep boop!</span>");
		yield* qdel(this);
	} else {
		if (!rt.istype(W, T("/obj/item/weapon/pen"))) return f.dot;
		if (!(t = (yield* stripped_input(user, "Enter new robot name", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
	}
	return f.dot;
}, true);

rt.type(7563, "/obj/item/weapon/ed209_assembly", "/obj/item/weapon", {
	build_step: 0,
	created_name: "ED-209 Security Robot",
	lasercolor: "",
	name: "１ED-209 assembly",
	desc: "Some sort of bizarre assembly.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "ed209_frame",
	item_state: "ed209_frame",
});

// construction.dm:49
rt.def("/obj/item/weapon/ed209_assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let t: Value = null, newcolor: Value = null, WT: Value = null, coil: Value = null, newname: Value = null, _T: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (!(t = (yield* stripped_input(user, "Enter new robot name", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
		return f.dot;
	}
	if (this.build_step === 0 || this.build_step === 1) {
		if (rt.istype(W, T("/obj/item/bodypart/l_leg/robot")) || rt.istype(W, T("/obj/item/bodypart/r_leg/robot"))) {
			if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
				return f.dot;
			}
			yield* qdel(W);
			this.build_step++;
			to_chat(user, `<span class='notice'>You add the robot leg to ${this}.</span>`);
			this.name = "legs/frame assembly";
			if (this.build_step == 1) {
				this.item_state = "ed209_leg";
				this.icon_state = "ed209_leg";
			} else {
				this.item_state = "ed209_legs";
				this.icon_state = "ed209_legs";
			}
		}
	} else if (this.build_step === 2) {
		newcolor = "";
		if (rt.istype(W, T("/obj/item/clothing/suit/redtag"))) {
			newcolor = "r";
		} else if (rt.istype(W, T("/obj/item/clothing/suit/bluetag"))) {
			newcolor = "b";
		}
		if (newcolor || rt.istype(W, T("/obj/item/clothing/suit/armor/vest"))) {
			if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
				return f.dot;
			}
			this.lasercolor = newcolor;
			yield* qdel(W);
			this.build_step++;
			to_chat(user, `<span class='notice'>You add the armor to ${this}.</span>`);
			this.name = "vest/legs/frame assembly";
			this.item_state = `${this.lasercolor}ed209_shell`;
			this.icon_state = `${this.lasercolor}ed209_shell`;
		}
	} else if (this.build_step === 3) {
		if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
			if (yield* (WT = W).remove_fuel(0, user)) {
				this.build_step++;
				this.name = "shielded frame assembly";
				to_chat(user, `<span class='notice'>You weld the vest to ${this}.</span>`);
			}
		}
	} else if (this.build_step === 4) {
		if (this.lasercolor === "b") {
			if (!rt.istype(W, T("/obj/item/clothing/head/helmet/bluetaghelm"))) {
				return f.dot;
			}
		} else if (this.lasercolor === "r") {
			if (!rt.istype(W, T("/obj/item/clothing/head/helmet/redtaghelm"))) {
				return f.dot;
			}
		} else if (this.lasercolor === "") {
			if (!rt.istype(W, T("/obj/item/clothing/head/helmet"))) {
				return f.dot;
			}
		}
		if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
			return f.dot;
		}
		yield* qdel(W);
		this.build_step++;
		to_chat(user, `<span class='notice'>You add the helmet to ${this}.</span>`);
		this.name = "covered and shielded frame assembly";
		this.item_state = `${this.lasercolor}ed209_hat`;
		this.icon_state = `${this.lasercolor}ed209_hat`;
	} else if (this.build_step === 5) {
		if (rt.istype(W, T("/obj/item/device/assembly/prox_sensor"))) {
			if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
				return f.dot;
			}
			yield* qdel(W);
			this.build_step++;
			to_chat(user, `<span class='notice'>You add the prox sensor to ${this}.</span>`);
			this.name = "covered, shielded and sensored frame assembly";
			this.item_state = `${this.lasercolor}ed209_prox`;
			this.icon_state = `${this.lasercolor}ed209_prox`;
		}
	} else if (this.build_step === 6) {
		if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
			if ((coil = W).get_amount() < 1) {
				to_chat(user, "<span class='warning'>You need one length of cable to wire the ED-209!</span>");
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You start to wire ${this}...</span>`);
			if (yield* do_after(user, 40, { target: this })) {
				if (coil.get_amount() >= 1 && this.build_step == 6) {
					yield* coil.use(1);
					this.build_step = 7;
					to_chat(user, "<span class='notice'>You wire the ED-209 assembly.</span>");
					this.name = "wired ED-209 assembly";
				}
			}
		}
	} else if (this.build_step === 7) {
		newname = "";
		if (this.lasercolor === "b") {
			if (!rt.istype(W, T("/obj/item/weapon/gun/energy/laser/bluetag"))) {
				return f.dot;
			}
			newname = "bluetag ED-209 assembly";
		} else if (this.lasercolor === "r") {
			if (!rt.istype(W, T("/obj/item/weapon/gun/energy/laser/redtag"))) {
				return f.dot;
			}
			newname = "redtag ED-209 assembly";
		} else if (this.lasercolor === "") {
			if (!rt.istype(W, T("/obj/item/weapon/gun/energy/e_gun/advtaser"))) {
				return f.dot;
			}
			newname = "taser ED-209 assembly";
		} else {
			return f.dot;
		}
		if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
			return f.dot;
		}
		this.name = newname;
		this.build_step++;
		to_chat(user, `<span class='notice'>You add ${W} to ${this}.</span>`);
		this.item_state = `${this.lasercolor}ed209_taser`;
		this.icon_state = `${this.lasercolor}ed209_taser`;
		yield* qdel(W);
	} else if (this.build_step === 8) {
		if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, W.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You start attaching the gun to the frame...</span>");
			if (yield* do_after(user, 40 * W.toolspeed, 0, this, 1)) {
				this.build_step++;
				this.name = `armed ${this.name}`;
				to_chat(user, "<span class='notice'>Taser gun attached.</span>");
			}
		}
	} else if (this.build_step === 9) {
		if (!rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) return f.dot;
		if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
			return f.dot;
		}
		this.build_step++;
		to_chat(user, "<span class='notice'>You complete the ED-209.</span>");
		yield* new_(T("/mob/living/simple_animal/bot/ed209"), (_T = rt.getStep(f, this, 0)), this.created_name, this.lasercolor);
		yield* qdel(W);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// construction.dm:220
rt.def("/obj/item/weapon/storage/toolbox/mechanical/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.args[0], T("/obj/item/stack/tile/plasteel"))) {
		yield* parent_proc();
		return f.dot;
	}
	if (rt.len(f, this.contents) >= 1) {
		to_chat(f.args[1], "<span class='warning'>They won't fit in, as there is already stuff inside!</span>");
		return f.dot;
	}
	if (yield* f.args[0].use(10)) {
		if (f.args[1].s_active) {
			yield* f.args[1].s_active.close(f.args[1]);
		}
		B = (yield* new_(T("/obj/item/weapon/toolbox_tiles")));
		yield* f.args[1].put_in_hands(B);
		to_chat(f.args[1], "<span class='notice'>You add the tiles into the empty toolbox. They protrude from the top.</span>");
		yield* qdel(this);
	} else {
		to_chat(f.args[1], "<span class='warning'>You need 10 floor tiles to start building a floorbot!</span>");
		return f.dot;
	}
	return f.dot;
}, true, { args: ["T", "user", "params"] });

rt.type(7564, "/obj/item/weapon/toolbox_tiles", "/obj/item/weapon", {
	created_name: "Floorbot",
	throw_speed: 2,
	throw_range: 5,
	desc: "It's a toolbox with tiles sticking out the top",
	name: "tiles and toolbox",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "toolbox_tiles",
	force: 3,
	throwforce: 10,
	w_class: 3,
});

// construction.dm:238
rt.def("/obj/item/weapon/toolbox_tiles/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let B: Value = null, t: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/device/assembly/prox_sensor"))) {
		yield* qdel(W);
		(B = (yield* new_(T("/obj/item/weapon/toolbox_tiles_sensor")))).created_name = this.created_name;
		yield* user.put_in_hands(B);
		to_chat(user, "<span class='notice'>You add the sensor to the toolbox and tiles.</span>");
		yield* qdel(this);
	} else {
		if (!rt.istype(W, T("/obj/item/weapon/pen"))) return f.dot;
		if (!(t = (yield* stripped_input(user, "Enter new robot name", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
	}
	return f.dot;
}, true);

rt.type(7565, "/obj/item/weapon/toolbox_tiles_sensor", "/obj/item/weapon", {
	created_name: "Floorbot",
	throw_speed: 2,
	throw_range: 5,
	desc: "It's a toolbox with tiles sticking out the top and a sensor attached",
	name: "tiles, toolbox and sensor arrangement",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "toolbox_tiles_sensor",
	force: 3,
	throwforce: 10,
	w_class: 3,
});

// construction.dm:257
rt.def("/obj/item/weapon/toolbox_tiles_sensor/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, A: Value = null, t: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/bodypart/l_arm/robot")) || rt.istype(W, T("/obj/item/bodypart/r_arm/robot"))) {
		yield* qdel(W);
		_T = rt.getStep(f, user.loc, 0);
		(A = (yield* new_(T("/mob/living/simple_animal/bot/floorbot"), _T))).name = this.created_name;
		to_chat(user, "<span class='notice'>You add the robot arm to the odd looking toolbox assembly. Boop beep!</span>");
		yield* qdel(this);
	} else {
		if (!rt.istype(W, T("/obj/item/weapon/pen"))) return f.dot;
		if (!(t = (yield* stripped_input(user, "Enter new robot name", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
	}
	return f.dot;
}, true);

rt.type(7566, "/obj/item/weapon/firstaid_arm_assembly", "/obj/item/weapon", {
	build_step: 0,
	created_name: "Medibot",
	skin: null,
	name: "incomplete medibot assembly",
	desc: "A first aid kit with a robot arm permanently grafted to it.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "firstaid_arm",
	w_class: 3,
});

// construction.dm:286
rt.def("/obj/item/weapon/firstaid_arm_assembly/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.spawnTail(f, 5, "/obj/item/weapon/firstaid_arm_assembly/proc/New: spawn at modules/mob/living/simple_animal/bot/construction.dm:287");
	return f.dot;
}, true);

// a spawn(5) body of /obj/item/weapon/firstaid_arm_assembly/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/firstaid_arm_assembly/proc/New: spawn at modules/mob/living/simple_animal/bot/construction.dm:287", function* (f: Frame) {
	if (this.skin) {
		this.add_overlay(`kit_skin_${this.skin}`);
	}
	return null;
});

rt.type(5568, "/obj/item/weapon/storage/firstaid", "/obj/item/weapon/storage", {
	empty: 0,
	throw_speed: 3,
	throw_range: 7,
	name: "first-aid kit",
	desc: "It's an emergency medical kit for those serious boo-boos.",
	icon_state: "firstaid",
});

// construction.dm:293
rt.def("/obj/item/weapon/storage/firstaid/proc/attackby", function* attackby(f: Frame, S: Value, user: Value, params: Value) {
	if (!rt.istype(S, T("/obj/item/bodypart/l_arm/robot")) && !rt.istype(S, T("/obj/item/bodypart/r_arm/robot"))) {
		return (yield* parent_proc());
	}
	if (rt.len(f, this.contents) >= 1) {
		to_chat(user, `<span class='warning'>You need to empty ${this} out first!</span>`);
		return f.dot;
	}
	let A: Value = (yield* new_(T("/obj/item/weapon/firstaid_arm_assembly")));
	if (rt.istype(this, T("/obj/item/weapon/storage/firstaid/fire"))) {
		A.skin = "ointment";
	} else if (rt.istype(this, T("/obj/item/weapon/storage/firstaid/toxin"))) {
		A.skin = "tox";
	} else if (rt.istype(this, T("/obj/item/weapon/storage/firstaid/o2"))) {
		A.skin = "o2";
	} else if (rt.istype(this, T("/obj/item/weapon/storage/firstaid/brute"))) {
		A.skin = "brute";
	}
	yield* qdel(S);
	yield* user.put_in_hands(A);
	to_chat(user, "<span class='notice'>You add the robot arm to the first aid kit.</span>");
	yield* qdel(this);
	return f.dot;
}, true);

// construction.dm:318
rt.def("/obj/item/weapon/firstaid_arm_assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let t: Value = null, _T: Value = null, S: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (!(t = (yield* stripped_input(user, "Enter new robot name", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
	} else if (this.build_step === 0) {
		if (rt.istype(W, T("/obj/item/device/healthanalyzer"))) {
			if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
				return f.dot;
			}
			yield* qdel(W);
			this.build_step++;
			to_chat(user, `<span class='notice'>You add the health sensor to ${this}.</span>`);
			this.name = "First aid/robot arm/health analyzer assembly";
			this.add_overlay("na_scanner");
		}
	} else if (this.build_step === 1) {
		if (!rt.istype(W, T("/obj/item/device/assembly/prox_sensor"))) return f.dot;
		if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
			return f.dot;
		}
		yield* qdel(W);
		this.build_step++;
		to_chat(user, "<span class='notice'>You complete the Medibot. Beep boop!</span>");
		_T = rt.getStep(f, this, 0);
		(S = (yield* new_(T("/mob/living/simple_animal/bot/medbot"), _T))).skin = this.skin;
		S.name = this.created_name;
		yield* qdel(this);
	}
	return f.dot;
}, true);

// construction.dm:362
rt.def("/obj/item/clothing/head/helmet/proc/attackby", function* attackby(f: Frame, S: Value, user: Value, params: Value) {
	let A: Value = null;
	yield* parent_proc();
	if (!rt.istype(S, T("/obj/item/device/assembly/signaler"))) {
		yield* parent_proc();
		return f.dot;
	}
	if (this.type != T("/obj/item/clothing/head/helmet/sec")) {
		return f.dot;
	}
	if (this.F) {
		to_chat(user, "<span class='warning'>The mounted flashlight is in the way, remove it first!</span>");
		return f.dot;
	}
	if (S.secured) {
		yield* qdel(S);
		A = (yield* new_(T("/obj/item/weapon/secbot_assembly")));
		yield* user.put_in_hands(A);
		to_chat(user, "<span class='notice'>You add the signaler to the helmet.</span>");
		yield* qdel(this);
	} else {
		return f.dot;
	}
	return f.dot;
}, true);

rt.type(7567, "/obj/item/weapon/secbot_assembly", "/obj/item/weapon", {
	build_step: 0,
	created_name: "Securitron",
	name: "incomplete securitron assembly",
	desc: "Some sort of bizarre assembly made from a proximity sensor, helmet, and signaler.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "helmet_signaler",
	item_state: "helmet",
});

// construction.dm:384
rt.def("/obj/item/weapon/secbot_assembly/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, S: Value = null, t: Value = null;
	yield* parent_proc();
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if (!this.build_step) {
			if (yield* (WT = I).remove_fuel(0, user)) {
				this.build_step++;
				this.add_overlay("hs_hole");
				to_chat(user, `<span class='notice'>You weld a hole in ${this}!</span>`);
			}
		} else if (this.build_step == 1) {
			if (yield* (WT = I).remove_fuel(0, user)) {
				this.build_step--;
				this.cut_overlay("hs_hole");
				to_chat(user, `<span class='notice'>You weld the hole in ${this} shut!</span>`);
			}
		}
	} else if (rt.istype(I, T("/obj/item/device/assembly/prox_sensor")) && this.build_step == 1) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(I))) {
			return f.dot;
		}
		this.build_step++;
		to_chat(user, `<span class='notice'>You add the prox sensor to ${this}!</span>`);
		this.add_overlay("hs_eye");
		this.name = "helmet/signaler/prox sensor assembly";
		yield* qdel(I);
	} else if ((rt.istype(I, T("/obj/item/bodypart/l_arm/robot")) || rt.istype(I, T("/obj/item/bodypart/r_arm/robot"))) && this.build_step == 2) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(I))) {
			return f.dot;
		}
		this.build_step++;
		to_chat(user, `<span class='notice'>You add the robot arm to ${this}!</span>`);
		this.name = "helmet/signaler/prox sensor/robot arm assembly";
		this.add_overlay("hs_arm");
		yield* qdel(I);
	} else if (rt.istype(I, T("/obj/item/weapon/melee/baton")) && this.build_step >= 3) {
		if (!(yield* user.temporarilyRemoveItemFromInventory(I))) {
			return f.dot;
		}
		this.build_step++;
		to_chat(user, "<span class='notice'>You complete the Securitron! Beep boop.</span>");
		(S = (yield* new_(T("/mob/living/simple_animal/bot/secbot"), rt.getStep(f, this, 0)))).name = this.created_name;
		S.baton_type = I.type;
		yield* qdel(I);
		yield* qdel(this);
	} else if (rt.istype(I, T("/obj/item/weapon/pen"))) {
		if (!(t = (yield* stripped_input(user, "Enter new robot name", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/screwdriver"))) return f.dot;
		if (!this.build_step) {
			yield* new_(T("/obj/item/device/assembly/signaler"), rt.getStep(f, this, 0));
			yield* new_(T("/obj/item/clothing/head/helmet/sec"), rt.getStep(f, this, 0));
			to_chat(user, "<span class='notice'>You disconnect the signaler from the helmet.</span>");
			yield* qdel(this);
		} else if (this.build_step == 2) {
			this.cut_overlay("hs_eye");
			yield* new_(T("/obj/item/device/assembly/prox_sensor"), rt.getStep(f, this, 0));
			to_chat(user, `<span class='notice'>You detach the proximity sensor from ${this}.</span>`);
			this.build_step--;
		} else {
			if (this.build_step != 3) return f.dot;
			this.cut_overlay("hs_arm");
			yield* new_(T("/obj/item/bodypart/l_arm/robot"), rt.getStep(f, this, 0));
			to_chat(user, `<span class='notice'>You remove the robot arm from ${this}.</span>`);
			this.build_step--;
		}
	}
	return f.dot;
}, true);
