// Based on /tg/station's code/game/objects/items/robot/robot_parts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(9859, "/obj/item/robot_suit", "/obj/item", {
	l_arm: null,
	r_arm: null,
	l_leg: null,
	r_leg: null,
	chest: null,
	head: null,
	created_name: "",
	forced_ai: null,
	locomotion: 1,
	lawsync: 1,
	aisync: 1,
	panel_locked: 1,
	name: "cyborg endoskeleton",
	desc: "A complex metal backbone with standard limb sockets and pseudomuscle anchors.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "robo_suit",
});

// robot_parts.dm:26
rt.def("/obj/item/robot_suit/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.updateicon();
	return f.dot;
}, true);

rt.type(9860, "/obj/item/robot_suit/prebuilt", "/obj/item/robot_suit", {});

// robot_parts.dm:30
rt.def("/obj/item/robot_suit/prebuilt/proc/New", function* New(f: Frame) {
	this.l_arm = (yield* new_(T("/obj/item/bodypart/l_arm/robot"), this));
	this.r_arm = (yield* new_(T("/obj/item/bodypart/r_arm/robot"), this));
	this.l_leg = (yield* new_(T("/obj/item/bodypart/l_leg/robot"), this));
	this.r_leg = (yield* new_(T("/obj/item/bodypart/r_leg/robot"), this));
	this.head = (yield* new_(T("/obj/item/bodypart/head/robot"), this));
	this.head.flash1 = (yield* new_(T("/obj/item/device/assembly/flash/handheld"), this.head));
	this.head.flash2 = (yield* new_(T("/obj/item/device/assembly/flash/handheld"), this.head));
	this.chest = (yield* new_(T("/obj/item/bodypart/chest/robot"), this));
	this.chest.wired = 1;
	this.chest.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/high/plus"), this.chest));
	yield* parent_proc();
	return f.dot;
}, true);

// robot_parts.dm:43
rt.def("/obj/item/robot_suit/proc/updateicon", function updateicon(f: Frame) {
	this.cut_overlays();
	if (this.l_arm) {
		this.add_overlay(`${this.l_arm.icon_state}+o`);
	}
	if (this.r_arm) {
		this.add_overlay(`${this.r_arm.icon_state}+o`);
	}
	if (this.chest) {
		this.add_overlay(`${this.chest.icon_state}+o`);
	}
	if (this.l_leg) {
		this.add_overlay(`${this.l_leg.icon_state}+o`);
	}
	if (this.r_leg) {
		this.add_overlay(`${this.r_leg.icon_state}+o`);
	}
	if (!this.head) return f.dot;
	this.add_overlay(`${this.head.icon_state}+o`);
	return f.dot;
});

// robot_parts.dm:58
rt.def("/obj/item/robot_suit/proc/check_completion", function check_completion(f: Frame) {
	if (this.l_arm && this.r_arm) {
		if (this.l_leg && this.r_leg) {
			if (this.chest && this.head) {
				return 1;
			}
		}
	}
	return 0;
});

// robot_parts.dm:67
rt.def("/obj/item/robot_suit/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null, B: Value = null, holding_this: Value = null, CH: Value = null, HD: Value = null, X: Value = null, BM: Value = null, O: Value = null, O_1: Value = null;
	if (rt.istype(W, T("/obj/item/stack/sheet/metal"))) {
		M = W;
		if (!this.l_arm && !this.r_arm && !this.l_leg && !this.r_leg && !this.chest && !this.head) {
			if (yield* M.use(1)) {
				(B = (yield* new_(T("/obj/item/weapon/ed209_assembly")))).loc = rt.getStep(f, this, 0);
				to_chat(user, "<span class='notice'>You arm the robot frame.</span>");
				holding_this = (user.get_inactive_held_item() == this ? 1 : 0);
				yield* qdel(this);
				if (holding_this) {
					yield* user.put_in_inactive_hand(B);
				}
			} else {
				to_chat(user, "<span class='warning'>You need one sheet of metal to start building ED-209!</span>");
				return f.dot;
			}
		}
	} else if (rt.istype(W, T("/obj/item/bodypart/l_leg/robot"))) {
		if (this.l_leg) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		W.icon_state = rt.initial(f, W, "icon_state");
		W.cut_overlays();
		this.l_leg = W;
		this.updateicon();
	} else if (rt.istype(W, T("/obj/item/bodypart/r_leg/robot"))) {
		if (this.r_leg) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		W.icon_state = rt.initial(f, W, "icon_state");
		W.cut_overlays();
		this.r_leg = W;
		this.updateicon();
	} else if (rt.istype(W, T("/obj/item/bodypart/l_arm/robot"))) {
		if (this.l_arm) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		W.icon_state = rt.initial(f, W, "icon_state");
		W.cut_overlays();
		this.l_arm = W;
		this.updateicon();
	} else if (rt.istype(W, T("/obj/item/bodypart/r_arm/robot"))) {
		if (this.r_arm) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		W.icon_state = rt.initial(f, W, "icon_state");
		W.cut_overlays();
		this.r_arm = W;
		this.updateicon();
	} else if (rt.istype(W, T("/obj/item/bodypart/chest/robot"))) {
		CH = W;
		if (this.chest) {
			return f.dot;
		}
		if (CH.wired && CH.cell) {
			if (!(yield* user.transferItemToLoc(CH, this))) {
				return f.dot;
			}
			CH.icon_state = rt.initial(f, CH, "icon_state");
			CH.cut_overlays();
			this.chest = CH;
			this.updateicon();
		} else if (!CH.wired) {
			to_chat(user, "<span class='warning'>You need to attach wires to it first!</span>");
		} else {
			to_chat(user, "<span class='warning'>You need to attach a cell to it first!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/bodypart/head/robot"))) {
		HD = W;
		for (X of each(HD.contents)) {
			if (rt.istype(X, T("/obj/item/organ"))) {
				to_chat(user, `<span class='warning'>There are organs inside ${HD}!</span>`);
				return f.dot;
			}
		}
		if (this.head) {
			return f.dot;
		}
		if (HD.flash2 && HD.flash1) {
			if (!(yield* user.transferItemToLoc(HD, this))) {
				return f.dot;
			}
			HD.icon_state = rt.initial(f, HD, "icon_state");
			HD.cut_overlays();
			this.head = HD;
			this.updateicon();
		} else {
			to_chat(user, "<span class='warning'>You need to attach a flash to it first!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (this.check_completion()) {
			yield* this.Interact(user);
		} else {
			to_chat(user, "<span class='warning'>The endoskeleton must be assembled before debugging can begin!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/device/mmi"))) {
		M = W;
		if (this.check_completion()) {
			if (!isturf(this.loc)) {
				to_chat(user, `<span class='warning'>You can't put ${M} in, the frame has to be standing on the ground to be perfectly precise!</span>`);
				return f.dot;
			}
			if (!M.brainmob) {
				to_chat(user, `<span class='warning'>Sticking an empty ${M.name} into the frame would sort of defeat the purpose!</span>`);
				return f.dot;
			}
			if (!(BM = M.brainmob).key || !BM.mind) {
				to_chat(user, "<span class='warning'>The MMI indicates that their mind is completely unresponsive; there's no point!</span>");
				return f.dot;
			}
			if (!BM.client) {
				to_chat(user, "<span class='warning'>The MMI indicates that their mind is currently inactive; it might change!</span>");
				return f.dot;
			}
			if (BM.stat == 2 || M.brain && M.brain.damaged_brain) {
				to_chat(user, "<span class='warning'>Sticking a dead brain into the frame would sort of defeat the purpose!</span>");
				return f.dot;
			}
			if (jobban_isbanned(BM, "Cyborg")) {
				to_chat(user, `<span class='warning'>This ${M.name} does not seem to fit!</span>`);
				return f.dot;
			}
			if (!(yield* user.temporarilyRemoveItemFromInventory(W))) {
				return f.dot;
			}
			if (!(O = (yield* new_(T("/mob/living/silicon/robot"), rt.getStep(f, this.loc, 0))))) {
				return f.dot;
			}
			if (M.laws && M.laws.id != "default") {
				this.aisync = 0;
				this.lawsync = 0;
				O.laws = M.laws;
				M.laws.associate(O);
			}
			O.invisibility = 0;
			O.custom_name = this.created_name;
			O.locked = this.panel_locked;
			if (!this.aisync) {
				this.lawsync = 0;
				O.connected_ai = null;
			} else {
				O.notify_ai(NEW_BORG);
				if (this.forced_ai) {
					O.connected_ai = this.forced_ai;
				}
			}
			if (!this.lawsync) {
				O.lawupdate = 0;
				if (M.laws.id == "default") {
					yield* O.make_laws();
				}
			}
			yield* GLOB.SSticker.mode.remove_antag_for_borging(BM.mind);
			if (!rt.istype(M.laws, T("/datum/ai_laws/ratvar"))) {
				yield* remove_servant_of_ratvar(BM, 1);
			}
			yield* BM.mind.transfer_to(O);
			if (O.mind && O.mind.special_role) {
				O.mind.store_memory("As a cyborg, you must obey your silicon laws and master AI above all else. Your objectives will consider you to be dead.");
				to_chat(O, "<span class='userdanger'>You have been robotized!</span>");
				to_chat(O, "<span class='danger'>You must obey your silicon laws and master AI above all else. Your objectives will consider you to be dead.</span>");
			}
			O.job = "Cyborg";
			O.cell = this.chest.cell;
			this.chest.cell.loc = O;
			this.chest.cell = null;
			yield* W.forceMove(O);
			if (O.mmi) {
				yield* qdel(O.mmi);
			}
			O.mmi = W;
			O.updatename();
			yield* this.forceMove(O);
			O.robot_suit = this;
			if (!this.locomotion) {
				O.lockcharge = 1;
				yield* O.update_canmove();
				to_chat(O, "<span class='warning'>Error: Servo motors unresponsive.</span>");
			}
		} else {
			to_chat(user, "<span class='warning'>The MMI must go in after everything else!</span>");
		}
	} else if (rt.istype(W, T("/obj/item/borg/upgrade/ai"))) {
		M = W;
		if (this.check_completion()) {
			if (!isturf(this.loc)) {
				to_chat(user, `<span class='warning'>You cannot install${M}, the frame has to be standing on the ground to be perfectly precise!</span>`);
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				to_chat(user, `<span class='warning'>${M} is stuck to your hand!</span>`);
				return f.dot;
			}
			yield* qdel(M);
			O_1 = (yield* new_(T("/mob/living/silicon/robot/shell"), rt.getStep(f, this, 0)));
			if (!this.aisync) {
				this.lawsync = 0;
				O_1.connected_ai = null;
			} else {
				if (this.forced_ai) {
					O_1.connected_ai = this.forced_ai;
				}
				O_1.notify_ai(AI_SHELL);
			}
			if (!this.lawsync) {
				O_1.lawupdate = 0;
				yield* O_1.make_laws();
			}
			O_1.cell = this.chest.cell;
			this.chest.cell.loc = O_1;
			this.chest.cell = null;
			O_1.locked = this.panel_locked;
			O_1.job = "Cyborg";
			yield* this.forceMove(O_1);
			O_1.robot_suit = this;
			if (!this.locomotion) {
				O_1.lockcharge = 1;
				yield* O_1.update_canmove();
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		to_chat(user, `<span class='warning'>You need to use a multitool to name ${this}!</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// robot_parts.dm:292
rt.def("/obj/item/robot_suit/proc/Interact", function* Interact(f: Frame, user: Value) {
	let popup: Value = null;
	let $1: any;
	let $0: any = this;
	if (this.created_name) {
		$1 = `${this.created_name}`;
	} else {
		$1 = "Default Cyborg";
	}
	let t1: Value = fmt("Designation: <A href='?src=＃;Name=1'>＀</a><br>\n", [$0, $1]);
	$0 = this;
	if (this.forced_ai) {
		$1 = `${this.forced_ai.name}`;
	} else {
		$1 = "Automatic";
	}
	t1 += fmt("Master AI: <A href='?src=＃;Master=1'>＀</a><br><br>\n", [$0, $1]);
	t1 += fmt("LawSync Port: <A href='?src=＃;Law=1'>＀</a><br>\n", [this, this.lawsync ? "Open" : "Closed"]);
	t1 += fmt("AI Connection Port: <A href='?src=＃;AI=1'>＀</a><br>\n", [this, this.aisync ? "Open" : "Closed"]);
	t1 += fmt("Servo Motor Functions: <A href='?src=＃;Loco=1'>＀</a><br>\n", [this, this.locomotion ? "Unlocked" : "Locked"]);
	t1 += fmt("Panel Lock: <A href='?src=＃;Panel=1'>＀</a><br>\n", [this, this.panel_locked ? "Engaged" : "Disengaged"]);
	(popup = (yield* new_(T("/datum/browser"), user, "robotdebug", "Cyborg Boot Debug", 310, 220))).set_content(t1);
	yield* popup.open();
	return f.dot;
}, true);

// robot_parts.dm:304
rt.def("/obj/item/robot_suit/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let item_in_hand: Value = null, new_name: Value = null;
	if (f.usr.incapacitated() || !this.Adjacent(f.usr)) {
		return f.dot;
	}
	let living_user: Value = f.usr;
	if (!rt.istype((item_in_hand = living_user.get_active_held_item()), T("/obj/item/device/multitool"))) {
		to_chat(living_user, "<span class='warning'>You need a multitool!</span>");
		return f.dot;
	}
	if (rt.at(href_list, "Name")) {
		new_name = reject_bad_name((yield* g.op(f, "Prompt", [2], [this.created_name, "Cyborg Debug", "Enter new designation. Set to blank to reset to default.", f.usr, null])), 1);
		if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr) {
			return f.dot;
		}
		if (new_name) {
			this.created_name = new_name;
		} else {
			this.created_name = "";
		}
	} else if (rt.at(href_list, "Master")) {
		this.forced_ai = (yield* select_active_ai(f.usr));
		if (!this.forced_ai) {
			to_chat(f.usr, "<span class='error'>No active AIs detected.</span>");
		}
	} else if (rt.at(href_list, "Law")) {
		this.lawsync = (!this.lawsync ? 1 : 0);
	} else if (rt.at(href_list, "AI")) {
		this.aisync = (!this.aisync ? 1 : 0);
	} else if (rt.at(href_list, "Loco")) {
		this.locomotion = (!this.locomotion ? 1 : 0);
	} else if (rt.at(href_list, "Panel")) {
		this.panel_locked = (!this.panel_locked ? 1 : 0);
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.Interact(f.usr);
	return f.dot;
}, true);
