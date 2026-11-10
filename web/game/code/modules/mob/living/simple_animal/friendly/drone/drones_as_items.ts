// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10123, "/obj/item/drone_shell", "/obj/item", {
	drone_type: rt.typePath("/mob/living/simple_animal/drone"),
	origin_tech: "programming=2;biotech=4",
	name: "drone shell",
	desc: "A shell of a maintenance drone, an expendable robot built to perform station repairs.",
	icon: rt.rsc("icons/mob/drone.dmi"),
	icon_state: "drone_maint_hat",
});

// drones_as_items.dm:20
rt.def("/obj/item/drone_shell/proc/New", function* New(f: Frame) {
	let A: Value = null;
	yield* parent_proc();
	if (A = get_area(this)) {
		yield* notify_ghosts(fmt("A drone shell has been created in ％！.", [A.name]), { source: this, action: "attack", flashwindow: 0 });
	}
	(rt.modGl("poi_list", this, rt.bitOr));
	return f.dot;
}, true);

// drones_as_items.dm:27
rt.def("/obj/item/drone_shell/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// drones_as_items.dm:31
rt.def("/obj/item/drone_shell/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let be_drone: Value = null, D: Value = null;
	if (jobban_isbanned(user, "drone")) {
		return f.dot;
	}
	if (!GLOB.SSticker.mode) {
		to_chat(user, "Can't become a drone before the game has started.");
		return f.dot;
	}
	if ((be_drone = (yield* alert("Become a drone? (Warning, You can no longer be cloned!)", null, "Yes", "No"))) == "No" || !this || this.gc_destroyed || !rt.istype(user, T("/mob/dead/observer"))) {
		return f.dot;
	}
	(D = (yield* new_(this.drone_type, rt.getStep(f, this.loc, 0)))).admin_spawned = this.admin_spawned;
	D.key = user.key;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(8201, "/obj/item/clothing/head/drone_holder", "/obj/item/clothing/head", {
	drone: null,
	name: "drone (hiding)",
	desc: "This drone is scared and has curled up into a ball.",
	icon: rt.rsc("icons/mob/drone.dmi"),
	icon_state: "drone_maint_hat",
});

// drones_as_items.dm:60
rt.def("/obj/item/clothing/head/drone_holder/proc/uncurl", function* uncurl(f: Frame) {
	let L: Value = null;
	if (!this.drone) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/mob/living"))) {
		to_chat((L = this.loc), `<span class='warning'>${this.drone} is trying to escape!</span>`);
		if (!(yield* do_after(this.drone, 50, { target: L }))) {
			return f.dot;
		}
		yield* L.dropItemToGround(this);
	}
	this.contents -= this.drone;
	this.drone.loc = rt.getStep(f, this, 0);
	yield* this.drone.reset_perspective();
	yield* this.drone.setDir(2);
	this.drone.visible_message(`<span class='warning'>${this.drone} uncurls!</span>`);
	this.drone = null;
	yield* qdel(this);
	return f.dot;
}, true);

// drones_as_items.dm:80
rt.def("/obj/item/clothing/head/drone_holder/proc/relaymove", function* relaymove(f: Frame) {
	yield* this.uncurl();
	return f.dot;
}, true);

// drones_as_items.dm:83
rt.def("/obj/item/clothing/head/drone_holder/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.uncurl();
	return f.dot;
}, true);

// drones_as_items.dm:87
rt.def("/obj/item/clothing/head/drone_holder/proc/updateVisualAppearence", function updateVisualAppearence(f: Frame, D: Value) {
	if (!D) {
		return f.dot;
	}
	this.icon_state = `${D.visualAppearence}_hat`;
	f.dot = this.icon_state;
	return f.dot;
});
