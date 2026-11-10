// Based on /tg/station's code/modules/research/xenobiology/xenobio_camera.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5105, "/mob/camera/aiEye/remote/xenobio", "/mob/camera/aiEye/remote", {
	allowed_area: null,
	visible_icon: 1,
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "camera_target",
});

// xenobio_camera.dm:9
rt.def("/mob/camera/aiEye/remote/xenobio/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null;
	this.allowed_area = (A = get_area(this.loc)).name;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// xenobio_camera.dm:14
rt.def("/mob/camera/aiEye/remote/xenobio/proc/setLoc", function setLoc(f: Frame, t: Value) {
	let new_area: Value = null;
	if ((new_area = get_area(t)) && new_area.name == this.allowed_area || rt.istype(new_area, T("/area/science/xenobiology"))) {
		return parent_proc();
	}
	return f.dot;
}, false);

rt.type(10353, "/obj/machinery/computer/camera_advanced/xenobio", "/obj/machinery/computer/camera_advanced", {
	slime_place_action: null,
	slime_up_action: null,
	feed_slime_action: null,
	monkey_recycle_action: null,
	stored_slimes: null,
	max_slimes: 5,
	monkeys: 0,
	networks: null,
	light_color: "#E17DE1",
	name: "Slime management console",
	desc: "A computer used for remotely handling slimes.",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/xenobiology"),
	icon_screen: "slime_comp",
	icon_keyboard: "rd_key",
});

// xenobio_camera.dm:23
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.networks = list("SS13");

	this.slime_place_action = (yield* new_(T("/datum/action/innate/slime_place")));

	this.slime_up_action = (yield* new_(T("/datum/action/innate/slime_pick_up")));

	this.feed_slime_action = (yield* new_(T("/datum/action/innate/feed_slime")));

	this.monkey_recycle_action = (yield* new_(T("/datum/action/innate/monkey_recycle")));

	this.stored_slimes = list();
	return f.dot;
}, true);

// xenobio_camera.dm:40
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/CreateEye", function* CreateEye(f: Frame) {
	this.eyeobj = (yield* new_(T("/mob/camera/aiEye/remote/xenobio"), rt.getStep(f, this, 0)));
	this.eyeobj.origin = this;
	this.eyeobj.visible_icon = 1;
	this.eyeobj.icon = rt.rsc("icons/obj/abductor.dmi");
	this.eyeobj.icon_state = "camera_target";
	return f.dot;
}, true);

// xenobio_camera.dm:47
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/GrantActions", function* GrantActions(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.slime_up_action) {
		this.slime_up_action.target = this;
		yield* this.slime_up_action.Grant(user);
		this.actions += this.slime_up_action;
	}
	if (this.slime_place_action) {
		this.slime_place_action.target = this;
		yield* this.slime_place_action.Grant(user);
		this.actions += this.slime_place_action;
	}
	if (this.feed_slime_action) {
		this.feed_slime_action.target = this;
		yield* this.feed_slime_action.Grant(user);
		this.actions += this.feed_slime_action;
	}
	if (!this.monkey_recycle_action) return f.dot;
	this.monkey_recycle_action.target = this;
	yield* this.monkey_recycle_action.Grant(user);
	this.actions += this.monkey_recycle_action;
	return f.dot;
}, true);

// xenobio_camera.dm:70
rt.def("/obj/machinery/computer/camera_advanced/xenobio/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let _P: Value = null, loaded: Value = null, G: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"))) {
		this.monkeys++;
		to_chat(user, `<span class='notice'>You feed ${O} to ${this}. It now has ${this.monkeys} monkey cubes stored.</span>`);
		yield* user.drop_item();
		yield* qdel(O);
		return f.dot;
	} else if (rt.istype(O, T("/obj/item/weapon/storage/bag"))) {
		_P = O;
		loaded = 0;
		for (G of each(_P.contents, T("/obj"))) {
			if (rt.istype(G, T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"))) {
				loaded = 1;
				this.monkeys++;
				yield* qdel(G);
			}
		}
		if (loaded) {
			to_chat(user, `<span class='notice'>You fill ${this} with the monkey cubes stored in ${O}. ${this} now has ${this.monkeys} monkey cubes stored.</span>`);
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(171, "/datum/action/innate/slime_place", "/datum/action/innate", {
	name: "Place Slimes",
	button_icon_state: "slime_down",
});

// xenobio_camera.dm:94
rt.def("/datum/action/innate/slime_place/proc/Activate", function Activate(f: Frame) {
	let S: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	let X: Value = this.target;
	if (GLOB.cameranet.checkTurfVis(remote_eye.loc)) {
		for (S of each(X.stored_slimes, T("/mob/living/simple_animal/slime"))) {
			S.loc = remote_eye.loc;
			S.visible_message(`${S} warps in!`);
			X.stored_slimes -= S;
		}
	} else {
		to_chat(this.owner, "<span class='notice'>Target is not near a camera. Cannot proceed.</span>");
	}
	return f.dot;
});

rt.type(172, "/datum/action/innate/slime_pick_up", "/datum/action/innate", {
	name: "Pick up Slime",
	button_icon_state: "slime_up",
});

// xenobio_camera.dm:113
rt.def("/datum/action/innate/slime_pick_up/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	let X: Value = this.target;
	if (GLOB.cameranet.checkTurfVis(remote_eye.loc)) {
		for (S of each(remote_eye.loc, T("/mob/living/simple_animal/slime"))) {
			if (rt.len(f, X.stored_slimes) >= X.max_slimes) {
				break;
			}
			if (!S.ckey) {
				if (S.buckled) {
					yield* S.Feedstop({ silent: 1 });
				}
				S.visible_message(`${S} vanishes in a flash of light!`);
				S.loc = X;
				X.stored_slimes += S;
			}
		}
	} else {
		to_chat(this.owner, "<span class='notice'>Target is not near a camera. Cannot proceed.</span>");
	}
	return f.dot;
}, true);

rt.type(173, "/datum/action/innate/feed_slime", "/datum/action/innate", {
	name: "Feed Slimes",
	button_icon_state: "monkey_down",
});

// xenobio_camera.dm:138
rt.def("/datum/action/innate/feed_slime/proc/Activate", function* Activate(f: Frame) {
	let food: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	let X: Value = this.target;
	if (GLOB.cameranet.checkTurfVis(remote_eye.loc)) {
		if (X.monkeys >= 1) {
			(food = (yield* new_(T("/mob/living/carbon/monkey"), remote_eye.loc))).LAssailant = C;
			X.monkeys--;
			to_chat(this.owner, `${X} now has ${X.monkeys} monkeys left.`);
		}
	} else {
		to_chat(this.owner, "<span class='notice'>Target is not near a camera. Cannot proceed.</span>");
	}
	return f.dot;
}, true);

rt.type(174, "/datum/action/innate/monkey_recycle", "/datum/action/innate", {
	name: "Recycle Monkeys",
	button_icon_state: "monkey_up",
});

// xenobio_camera.dm:159
rt.def("/datum/action/innate/monkey_recycle/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null;
	if (!this.target || !rt.istype(this.owner, T("/mob/living"))) {
		return f.dot;
	}
	let C: Value = this.owner;
	let remote_eye: Value = C.remote_control;
	let X: Value = this.target;
	if (GLOB.cameranet.checkTurfVis(remote_eye.loc)) {
		for (M of each(remote_eye.loc, T("/mob/living/carbon/monkey"))) {
			if (M.stat) {
				M.visible_message(`${M} vanishes as they are reclaimed for recycling!`);
				X.monkeys = round(X.monkeys + 0.2, 0.1);
				yield* qdel(M);
			}
		}
	} else {
		to_chat(this.owner, "<span class='notice'>Target is not near a camera. Cannot proceed.</span>");
	}
	return f.dot;
}, true);
