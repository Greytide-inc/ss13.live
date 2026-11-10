// Based on /tg/station's code/game/objects/structures/door_assembly.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12410, "/obj/structure/door_assembly", "/obj/structure", {
	maker: null,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"),
	state: 0,
	mineral: null,
	typetext: "",
	icontext: "",
	electronics: null,
	airlock_type: rt.typePath("/obj/machinery/door/airlock"),
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass"),
	created_name: null,
	heat_proof_finished: 0,
	material: null,
	anchored: 0,
	name: "airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/public.dmi"),
	icon_state: "construction",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// door_assembly.dm:22
rt.def("/obj/structure/door_assembly/proc/New", function* New(f: Frame) {
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

// door_assembly.dm:368
rt.def("/obj/structure/door_assembly/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let t: Value = null, WT: Value = null, icontype: Value = null, optionlist: Value = null, has_solid: Value = null, has_glass: Value = null, door_check: Value = null, D: Value = null, C: Value = null, ae: Value = null, G: Value = null, M: Value = null, door: Value = null;
	let $e: any;
	if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (!(t = (yield* stripped_input(user, "Enter the name for the door.", this.name, this.created_name, 42)))) {
			return f.dot;
		}
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		this.created_name = t;
	} else if (rt.istype(W, T("/obj/item/weapon/airlock_painter"))) {
		if ((WT = W).can_use(user)) {
			if (this.mineral && this.mineral == "glass") {
				optionlist = list("Public", "Public2", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Science", "Mining");
			} else {
				optionlist = list("Public", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Science", "Mining", "Maintenance", "External", "High Security");
			}
			icontype = (yield* g.op(f, "Prompt", [0], [null, null, "Please select a paintjob for this airlock.", user, optionlist]));
			if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr || !(yield* WT.use(user))) {
				return f.dot;
			}
			has_solid = 0;
			has_glass = 0;
			if (icontype === "Public") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/public.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "";
				this.icontext = "";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Public2") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi");
				this.typetext = "";
				this.icontext = "";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Engineering") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "engineering";
				this.icontext = "eng";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Atmospherics") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "atmos";
				this.icontext = "atmo";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Security") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/security.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "security";
				this.icontext = "sec";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Command") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/command.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "command";
				this.icontext = "com";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Medical") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/medical.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "medical";
				this.icontext = "med";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Research") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/research.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "research";
				this.icontext = "res";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Science") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/science.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "research";
				this.icontext = "res";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Mining") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/mining.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "mining";
				this.icontext = "min";
				has_solid = 1;
				has_glass = 1;
			} else if (icontype === "Maintenance") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
				this.typetext = "maintenance";
				this.icontext = "mai";
				has_solid = 1;
				has_glass = 0;
			} else if (icontype === "External") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/external/external.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi");
				this.typetext = "external";
				this.icontext = "ext";
				has_solid = 1;
				has_glass = 0;
			} else if (icontype === "High Security") {
				this.icon = rt.rsc("icons/obj/doors/airlocks/highsec/highsec.dmi");
				this.overlays_file = rt.rsc("icons/obj/doors/airlocks/highsec/overlays.dmi");
				this.typetext = "highsecurity";
				this.icontext = "highsec";
				has_solid = 1;
				has_glass = 0;
			}
			if (has_solid) {
				this.airlock_type = text2path(`/obj/machinery/door/airlock/${this.typetext}`);
			} else {
				this.airlock_type = T("/obj/machinery/door/airlock");
			}
			if (has_glass) {
				this.glass_type = text2path(`/obj/machinery/door/airlock/glass_${this.typetext}`);
			} else {
				this.glass_type = T("/obj/machinery/door/airlock/glass");
			}
			if (this.mineral && this.mineral != "glass") {
				this.mineral = null;
			}
			to_chat(user, "<span class='notice'>You change the paintjob on the airlock assembly.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && !this.anchored) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			user.visible_message(`<span class='warning'>${user} disassembles the airlock assembly.</span>`, "You start to disassemble the airlock assembly...");
			playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!WT.isOn()) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You disassemble the airlock assembly.</span>");
				yield* this.deconstruct(1);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (!this.anchored) {
			door_check = 1;
			for (D of each(this.loc, T("/obj/machinery/door"))) {
				if (!D.sub_door) {
					door_check = 0;
					break;
				}
			}
			if (door_check) {
				playsound(this.loc, W.usesound, 100, 1);
				user.visible_message(`${user} secures the airlock assembly to the floor.`, "<span class='notice'>You start to secure the airlock assembly to the floor...</span>", "<span class='italics'>You hear wrenching.</span>");
				if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
					if (this.anchored) {
						return f.dot;
					}
					to_chat(user, "<span class='notice'>You secure the airlock assembly.</span>");
					this.name = "secured airlock assembly";
					this.anchored = 1;
				}
			} else {
				to_chat(user, "There is another door here!");
			}
		} else {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`${user} unsecures the airlock assembly from the floor.`, "<span class='notice'>You start to unsecure the airlock assembly from the floor...</span>", "<span class='italics'>You hear wrenching.</span>");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!this.anchored) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You unsecure the airlock assembly.</span>");
				this.name = "airlock assembly";
				this.anchored = 0;
			}
		}
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil")) && this.state == 0 && this.anchored) {
		if ((C = W).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one length of cable to wire the airlock assembly!</span>");
			return f.dot;
		}
		user.visible_message(`${user} wires the airlock assembly.`, "<span class='notice'>You start to wire the airlock assembly...</span>");
		if (yield* do_after(user, 40, { target: this })) {
			if (C.get_amount() < 1 || this.state != 0) {
				return f.dot;
			}
			yield* C.use(1);
			this.state = 1;
			to_chat(user, "<span class='notice'>You wire the airlock assembly.</span>");
			this.name = "wired airlock assembly";
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters")) && this.state == 1) {
		playsound(this.loc, W.usesound, 100, 1);
		user.visible_message(`${user} cuts the wires from the airlock assembly.`, "<span class='notice'>You start to cut the wires from the airlock assembly...</span>");
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			if (this.state != 1) {
				return f.dot;
			}
			to_chat(user, "<span class='notice'>You cut the wires from the airlock assembly.</span>");
			yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, user, 0), 1);
			this.state = 0;
			this.name = "secured airlock assembly";
		}
	} else if (rt.istype(W, T("/obj/item/weapon/electronics/airlock")) && this.state == 1) {
		playsound(this.loc, W.usesound, 100, 1);
		user.visible_message(`${user} installs the electronics into the airlock assembly.`, "<span class='notice'>You start to install electronics into the airlock assembly...</span>");
		if (yield* do_after(user, 40, { target: this })) {
			if (this.state != 1) {
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			W.loc = this;
			to_chat(user, "<span class='notice'>You install the airlock electronics.</span>");
			this.state = 2;
			this.name = "near finished airlock assembly";
			this.electronics = W;
		}
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar")) && this.state == 2) {
		playsound(this.loc, W.usesound, 100, 1);
		user.visible_message(`${user} removes the electronics from the airlock assembly.`, "<span class='notice'>You start to remove electronics from the airlock assembly...</span>");
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			if (this.state != 2) {
				return f.dot;
			}
			to_chat(user, "<span class='notice'>You remove the airlock electronics.</span>");
			this.state = 1;
			this.name = "wired airlock assembly";
			if (!this.electronics) {
				ae = (yield* new_(T("/obj/item/weapon/electronics/airlock"), this.loc));
			} else {
				ae = this.electronics;
				this.electronics = null;
				ae.loc = this.loc;
			}
		}
	} else if (rt.istype(W, T("/obj/item/stack/sheet")) && !this.mineral) {
		if (G = W) {
			if (G.get_amount() >= 1) {
				if (rt.istype(G, T("/obj/item/stack/sheet/rglass")) || rt.istype(G, T("/obj/item/stack/sheet/glass"))) {
					playsound(this.loc, rt.rsc("sound/items/crowbar.ogg"), 100, 1);
					user.visible_message(`${user} adds ${G.name} to the airlock assembly.`, `<span class='notice'>You start to install ${G.name} into the airlock assembly...</span>`);
					if (yield* do_after(user, 40, { target: this })) {
						if (G.get_amount() < 1 || this.mineral) {
							return f.dot;
						}
						if (G.type == T("/obj/item/stack/sheet/rglass")) {
							to_chat(user, "<span class='notice'>You install reinforced glass windows into the airlock assembly.</span>");
							this.heat_proof_finished = 1;
							this.name = "near finished heat-proofed window airlock assembly";
						} else {
							to_chat(user, "<span class='notice'>You install regular glass windows into the airlock assembly.</span>");
							this.name = "near finished window airlock assembly";
						}
						yield* G.use(1);
						this.mineral = "glass";
						this.material = "glass";
						if (rt.isIn(f, this.icontext, list("eng", "atmo", "sec", "com", "med", "res", "min"))) {
							this.airlock_type = text2path(`/obj/machinery/door/airlock/${this.typetext}`);
							this.glass_type = text2path(`/obj/machinery/door/airlock/glass_${this.typetext}`);
						} else {
							this.airlock_type = T("/obj/machinery/door/airlock");
							this.glass_type = T("/obj/machinery/door/airlock/glass");
							this.typetext = "";
							this.icontext = "";
						}
					}
				} else if (rt.istype(G, T("/obj/item/stack/sheet/mineral"))) {
					M = G.sheettype;
					if (G.get_amount() >= 2) {
						playsound(this.loc, rt.rsc("sound/items/crowbar.ogg"), 100, 1);
						user.visible_message(`${user} adds ${G.name} to the airlock assembly.`, `<span class='notice'>You start to install ${G.name} into the airlock assembly...</span>`);
						if (yield* do_after(user, 40, { target: this })) {
							if (G.get_amount() < 2 || this.mineral) {
								return f.dot;
							}
							to_chat(user, `<span class='notice'>You install ${M} plating into the airlock assembly.</span>`);
							yield* G.use(2);
							this.mineral = `${M}`;
							this.name = `near finished ${M} airlock assembly`;
							this.airlock_type = text2path(`/obj/machinery/door/airlock/${M}`);
							this.glass_type = T("/obj/machinery/door/airlock/glass");
						}
					}
				}
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && this.state == 2) {
		playsound(this.loc, W.usesound, 100, 1);
		user.visible_message(`${user} finishes the airlock.`, "<span class='notice'>You start finishing the airlock...</span>");
		if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
			if (this.loc && this.state == 2) {
				to_chat(user, "<span class='notice'>You finish the airlock.</span>");
				if (this.mineral == "glass") {
					door = (yield* new_(this.glass_type, this.loc));
				} else {
					door = (yield* new_(this.airlock_type, this.loc));
				}
				door.electronics = this.electronics;
				door.heat_proof = this.heat_proof_finished;
				if (this.electronics.one_access) {
					door.req_one_access = this.electronics.accesses;
				} else {
					door.req_access = this.electronics.accesses;
				}
				if (this.created_name) {
					door.name = this.created_name;
				}
				this.electronics.loc = door;
				yield* qdel(this);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// door_assembly.dm:690
rt.def("/obj/structure/door_assembly/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (!this.material) {
		this.add_overlay(get_airlock_overlay("fill_construction", this.icon));
	} else {
		this.add_overlay(get_airlock_overlay(`${this.material}_construction`, this.overlays_file));
	}
	this.add_overlay(get_airlock_overlay(`panel_c${this.state + 1}`, this.overlays_file));
	return f.dot;
});

// door_assembly.dm:699
rt.def("/obj/structure/door_assembly/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null, metal_amt: Value = null, mineral_path: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		_T = rt.getStep(f, this, 0);
		metal_amt = 4;
		if (!disassembled) {
			metal_amt = rand(2, 4);
		}
		yield* new_(T("/obj/item/stack/sheet/metal"), _T, metal_amt);
		if (this.mineral) {
			if (this.mineral == "glass") {
				if (disassembled) {
					if (this.heat_proof_finished) {
						yield* new_(T("/obj/item/stack/sheet/rglass"), _T);
					} else {
						yield* new_(T("/obj/item/stack/sheet/glass"), _T);
					}
				} else {
					yield* new_(T("/obj/item/weapon/shard"), _T);
				}
			} else {
				mineral_path = text2path(`/obj/item/stack/sheet/mineral/${this.mineral}`);
				yield* new_(mineral_path, _T, 2);
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
