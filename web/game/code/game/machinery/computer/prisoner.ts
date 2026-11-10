// Based on /tg/station's code/game/machinery/computer/prisoner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10406, "/obj/machinery/computer/prisoner", "/obj/machinery/computer", {
	id: 0,
	temp: null,
	status: 0,
	timeleft: 60,
	stop: 0,
	screen: 0,
	inserted_id: null,
	icon_screen: "explosive",
	icon_keyboard: "security_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/prisoner"),
	light_color: "#FA8282",
	name: "prisoner management console",
	desc: "Used to manage tracking implants placed inside criminals.",
	req_access: null,
});

// prisoner.dm:6
rt.def("/obj/machinery/computer/prisoner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(2);
	return f.dot;
});

// prisoner.dm:19
rt.def("/obj/machinery/computer/prisoner/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let Tr: Value = null, C: Value = null, _T: Value = null, loc_display: Value = null, M: Value = null, mob_loc: Value = null, popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	if (this.screen == 0) {
		dat += fmt("<HR><A href='?src=＃;lock=1'>Unlock Console</A>", [this]);
	} else if (this.screen == 1) {
		dat += "<H3>Prisoner ID Management</H3>";
		if (this.inserted_id) {
			dat += fmt("<A href='?src=＃;id=eject'>＀</A><br>", [this, this.inserted_id]);
			dat += fmt("Collected Points: ＀. <A href='?src=＃;id=reset'>Reset.</A><br>", [this.inserted_id.points, this]);
			dat += fmt("Card goal: ＀.  <A href='?src=＃;id=setgoal'>Set </A><br>", [this.inserted_id.goal, this]);
			dat += "Space Law recommends quotas of 100 points per minute they would normally serve in the brig.<BR>";
		} else {
			dat += fmt("<A href='?src=＃;id=insert'>Insert Prisoner ID.</A><br>", [this]);
		}
		dat += "<H3>Prisoner Implant Management</H3>";
		dat += "<HR>Chemical Implants<BR>";
		for (C of each(GLOB.tracked_chem_implants, T("/obj/item/weapon/implant/chem"))) {
			if ((Tr = rt.getStep(f, C, 0)) && Tr.z != this.z) {
				continue;
			}
			if (!C.imp_in) {
				continue;
			}
			dat += `ID: ${C.imp_in.name} | Remaining Units: ${C.reagents.total_volume} <BR>`;
			dat += "| Inject: ";
			dat += fmt("<A href='?src=＃;inject1=＃'>(<font class='bad'>(1)</font>)</A>", [this, C]);
			dat += fmt("<A href='?src=＃;inject5=＃'>(<font class='bad'>(5)</font>)</A>", [this, C]);
			dat += fmt("<A href='?src=＃;inject10=＃'>(<font class='bad'>(10)</font>)</A><BR>", [this, C]);
			dat += "********************************<BR>";
		}
		dat += "<HR>Tracking Implants<BR>";
		for (_T of each(GLOB.tracked_implants, T("/obj/item/weapon/implant/tracking"))) {
			if (!rt.istype(_T.imp_in, T("/mob/living"))) {
				continue;
			}
			if ((Tr = rt.getStep(f, _T, 0)) && Tr.z != this.z) {
				continue;
			}
			loc_display = "Unknown";
			M = _T.imp_in;
			if (Tr.z == ZLEVEL_STATION && !rt.istype(M.loc, T("/turf/open/space"))) {
				loc_display = (mob_loc = rt.getStep(f, M, 0)).loc;
			}
			dat += `ID: ${_T.imp_in.name} | Location: ${loc_display}<BR>`;
			dat += fmt("<A href='?src=＃;warn=＃'>(<font class='bad'><i>Message Holder</i></font>)</A> |<BR>", [this, _T]);
			dat += "********************************<BR>";
		}
		dat += fmt("<HR><A href='?src=＃;lock=1'>Lock Console</A>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Prisoner Management Console", 400, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// prisoner.dm:74
rt.def("/obj/machinery/computer/prisoner/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/card/id"))) {
		return (yield* this.attack_hand(user));
	}
	return (yield* parent_proc());
}, true);

// prisoner.dm:80
rt.def("/obj/machinery/computer/prisoner/proc/process", function* process(f: Frame) {
	if (!(yield* parent_proc())) {
		yield* this.updateDialog();
	}
	return f.dot;
}, true, { waitfor: false });

// prisoner.dm:86
rt.def("/obj/machinery/computer/prisoner/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null, num: Value = null, warning: Value = null, I_1: Value = null, R: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon"))) {
		yield* f.usr.set_machine(this);
		if (rt.at(href_list, "id")) {
			if (rt.at(href_list, "id") == "insert" && !this.inserted_id) {
				if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id/prisoner"))) {
					if (!(yield* f.usr.drop_item())) {
						return f.dot;
					}
					I.loc = this;
					this.inserted_id = I;
				} else {
					to_chat(f.usr, "<span class='danger'>No valid ID.</span>");
				}
			} else if (this.inserted_id) {
				const item = rt.at(href_list, "id");
				if (item === "eject") {
					this.inserted_id.loc = rt.getStep(f, this, 0);
					yield* this.inserted_id.verb_pickup();
					this.inserted_id = null;
				} else if (item === "reset") {
					this.inserted_id.points = 0;
				} else if (item === "setgoal") {
					if ((num = round((yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose prisoner's goal:", f.usr, null])))) >= 0) {
						num = min(num, 1000);
						this.inserted_id.goal = num;
					}
				}
			}
		} else if (rt.at(href_list, "inject1")) {
			if ((I = rt.locateIn(f, rt.at(href_list, "inject1"), GLOB.tracked_chem_implants)) && rt.istype(I, T("/obj/item/weapon/implant"))) {
				yield* I.activate(1);
			}
		} else if (rt.at(href_list, "inject5")) {
			if ((I = rt.locateIn(f, rt.at(href_list, "inject5"), GLOB.tracked_chem_implants)) && rt.istype(I, T("/obj/item/weapon/implant"))) {
				yield* I.activate(5);
			}
		} else if (rt.at(href_list, "inject10")) {
			if ((I = rt.locateIn(f, rt.at(href_list, "inject10"), GLOB.tracked_chem_implants)) && rt.istype(I, T("/obj/item/weapon/implant"))) {
				yield* I.activate(10);
			}
		} else if (rt.at(href_list, "lock")) {
			if (yield* this.allowed(f.usr)) {
				this.screen = (!this.screen ? 1 : 0);
			} else {
				to_chat(f.usr, "Unauthorized Access.");
			}
		} else if (rt.at(href_list, "warn")) {
			if (!(warning = copytext(sanitize((yield* g.op(f, "Prompt", [2], ["", "Enter your message here!", "Message:", f.usr, null]))), 1, 1024))) {
				return f.dot;
			}
			if ((I_1 = rt.locateIn(f, rt.at(href_list, "warn"), GLOB.tracked_implants)) && rt.istype(I_1, T("/obj/item/weapon/implant")) && I_1.imp_in) {
				to_chat((R = I_1.imp_in), `<span class='italics'>You hear a voice in your head saying: '${warning}'</span>`);
				log_say(`${f.usr}/${f.usr.ckey} sent an implant message to ${R}/${R.ckey}: '${warning}'`);
			}
		}
		yield* this.add_fingerprint(f.usr);
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
