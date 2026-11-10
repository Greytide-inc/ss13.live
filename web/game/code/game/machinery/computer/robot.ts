// Based on /tg/station's code/game/machinery/computer/robot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10407, "/obj/machinery/computer/robotics", "/obj/machinery/computer", {
	temp: null,
	icon_screen: "robot",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/robotics"),
	light_color: "#E17DE1",
	name: "robotics control console",
	desc: "Used to remotely lockdown or detonate linked Cyborgs.",
	req_access: null,
});

// robot.dm:9
rt.def("/obj/machinery/computer/robotics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(29);
	return f.dot;
});

// robot.dm:16
rt.def("/obj/machinery/computer/robotics/proc/can_control", function can_control(f: Frame, user: Value, R: Value) {
	if (!rt.istype(R, T("/mob/living/silicon/robot"))) {
		return 0;
	}
	if (rt.istype(user, T("/mob/living/silicon/ai"))) {
		if (R.connected_ai != user) {
			return 0;
		}
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if (R != user) {
			return 0;
		}
	}
	if (R.scrambledcodes) {
		return 0;
	}
	return 1;
});

// robot.dm:29
rt.def("/obj/machinery/computer/robotics/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// robot.dm:34
rt.def("/obj/machinery/computer/robotics/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, R: Value = null, D: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (this.z > 6) {
		to_chat(user, "<span class='boldannounce'>Unable to establish a connection</span>:  You're too far away from the station!");
		return f.dot;
	}
	yield* user.set_machine(this);
	let robots: Value = 0;
	for (R of each(GLOB.mob_list, T("/mob/living/silicon/robot"))) {
		if (!this.can_control(user, R)) {
			continue;
		}
		robots++;
		dat += `${R.name} |`;
		if (R.stat) {
			dat += " Not Responding |";
		} else if (!R.canmove) {
			dat += " Locked Down |";
		} else {
			dat += " Operating Normally |";
		}
		if (R.canmove) {
			if (R.cell) {
				dat += ` Battery Installed (${R.cell.charge}/${R.cell.maxcharge}) |`;
			} else {
				dat += " No Cell Installed |";
			}
		}
		if (R.module) {
			dat += ` Module Installed (${R.module.name}) |`;
		} else {
			dat += " No Module Installed |";
		}
		if (R.connected_ai) {
			dat += ` Slaved to ${R.connected_ai.name} |`;
		} else {
			dat += " Independent from AI |";
		}
		if (rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
			if (is_servant_of_ratvar(user) && user != R) {
				dat += fmt("<A href='?src=＃;convert=＃'>(<font color=#BE8700><i>Convert</i></font>)</A> ", [this, R]);
			} else if ((rt.istype(user, T("/mob/living/silicon")) && is_special_character(user) || IsAdminGhost(user)) && !R.emagged && (user != R || R.syndicate)) {
				dat += fmt("<A href='?src=＃;magbot=＃'>(<font color=blue><i>Hack</i></font>)</A> ", [this, R]);
			}
		}
		$0 = this;
		$1 = R;
		if (R.canmove) {
			$2 = "Lockdown";
		} else {
			$2 = "Release";
		}
		dat += fmt("<A href='?src=＃;stopbot=＃'>(<font color=green><i>＀</i></font>)</A> ", [$0, $1, $2]);
		dat += fmt("<A href='?src=＃;killbot=＃'>(<font color=red><i>Destroy</i></font>)</A>", [this, R]);
		dat += "<BR>";
	}
	if (!robots) {
		dat += "No Cyborg Units detected within access parameters.";
		dat += "<BR>";
	}
	let drones: Value = 0;
	for (D of each(GLOB.mob_list, T("/mob/living/simple_animal/drone"))) {
		if (D.hacked) {
			continue;
		}
		drones++;
		dat += `${D.name} |`;
		if (D.stat) {
			dat += " Not Responding |";
		}
		dat += fmt("<A href='?src=＃;killdrone=＃'>(<font color=red><i>Destroy</i></font>)</A>", [this, D]);
		dat += "<BR>";
	}
	if (!drones) {
		dat += "No Drone Units detected within access parameters.";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Cyborg Control Console", 400, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// robot.dm:98
rt.def("/obj/machinery/computer/robotics/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let R: Value = null, choice: Value = null, _T: Value = null, D: Value = null, s: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "temp")) {
		this.temp = null;
	} else if (rt.at(href_list, "killbot")) {
		if (yield* this.allowed(f.usr)) {
			R = rt.locateIn(f, rt.at(href_list, "killbot"), GLOB.silicon_mobs);
			if (this.can_control(f.usr, R)) {
				if ((choice = (yield* g.op(f, "Prompt", [0], [null, null, null, `Are you certain you wish to detonate ${R.name}?`, list("Confirm", "Abort")]))) == "Confirm" && this.can_control(f.usr, R) && !(yield* parent_proc())) {
					if (R.syndicate && R.emagged) {
						to_chat(R, "Extreme danger.  Termination codes detected.  Scrambling security codes and automatic AI unlink triggered.");
						if (R.connected_ai) {
							to_chat(R.connected_ai, `<br><br><span class='alert'>ALERT - Cyborg detonation detected: ${R.name}</span><br>`);
						}
						yield* R.ResetSecurityCodes();
					} else {
						_T = rt.getStep(f, R, 0);
						message_admins(`<span class='notice'>${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} detonated ${key_name(R, R.client)}${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}!</span>`);
						log_game(`<span class='notice'>${key_name(f.usr)} detonated ${key_name(R)}!</span>`);
						if (R.connected_ai) {
							to_chat(R.connected_ai, `<br><br><span class='alert'>ALERT - Cyborg detonation detected: ${R.name}</span><br>`);
						}
						yield* R.self_destruct();
					}
				}
			}
		} else {
			to_chat(f.usr, "<span class='danger'>Access Denied.</span>");
		}
	} else if (rt.at(href_list, "stopbot")) {
		if (yield* this.allowed(f.usr)) {
			R = rt.locateIn(f, rt.at(href_list, "stopbot"), GLOB.silicon_mobs);
			if (this.can_control(f.usr, R)) {
				$0 = null;
				$1 = null;
				$2 = null;
				if (R.canmove) {
					$3 = "lock down";
				} else {
					$3 = "release";
				}
				if ((choice = (yield* g.op(f, "Prompt", [0], [$0, $1, $2, `Are you certain you wish to ${$3} ${R.name}?`, list("Confirm", "Abort")]))) == "Confirm" && this.can_control(f.usr, R) && !(yield* parent_proc())) {
					$0 = `${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`;
					if (R.canmove) {
						$1 = "locked down";
					} else {
						$1 = "released";
					}
					message_admins(`<span class='notice'>${$0} ${$1} ${key_name(R, R.client)}${`${key_name_admin(R)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [R])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [R])}`}!</span>`);
					$0 = key_name(f.usr);
					if (R.canmove) {
						$1 = "locked down";
					} else {
						$1 = "released";
					}
					log_game(`${$0} ${$1} ${key_name(R)}!`);
					yield* R.SetLockdown((!R.lockcharge ? 1 : 0));
					$0 = R;
					if (!R.lockcharge) {
						$1 = "<span class='notice'>Your lockdown has been lifted!";
					} else {
						$1 = "<span class='alert'>You have been locked down!";
					}
					to_chat($0, `${$1}</span>`);
					if (R.connected_ai) {
						$0 = R.connected_ai;
						if (!R.lockcharge) {
							$1 = "<span class='notice'>NOTICE - Cyborg lockdown lifted";
						} else {
							$1 = "<span class='alert'>ALERT - Cyborg lockdown detected";
						}
						to_chat($0, fmt("＀: <a href='?src=＃;track=＀'>＀</a></span><br>", [$1, R.connected_ai, html_encode(R.name), R.name]));
					}
				}
			}
		} else {
			to_chat(f.usr, "<span class='danger'>Access Denied.</span>");
		}
	} else if (rt.at(href_list, "magbot")) {
		if (rt.istype(f.usr, T("/mob/living/silicon")) && is_special_character(f.usr) || IsAdminGhost(f.usr)) {
			if (rt.istype((R = rt.locateIn(f, rt.at(href_list, "magbot"), GLOB.silicon_mobs)), T("/mob/living/silicon/robot")) && !R.emagged && (R.syndicate && R == f.usr || R.connected_ai == f.usr || IsAdminGhost(f.usr)) && !R.scrambledcodes && this.can_control(f.usr, R)) {
				log_game(`${key_name(f.usr)} emagged ${R.name} using robotic console!`);
				message_admins(`${key_name_admin(f.usr)} emagged cyborg ${key_name_admin(R)} using robotic console!`);
				yield* R.SetEmagged(1);
				if (is_special_character(R)) {
					R.verbs += P("/mob/living/silicon/robot/proc/ResetSecurityCodes");
				}
			}
		}
	} else if (rt.at(href_list, "convert")) {
		if (rt.istype(f.usr, T("/mob/living/silicon")) && is_special_character(f.usr)) {
			if (rt.istype((R = rt.locateIn(f, rt.at(href_list, "convert"), GLOB.silicon_mobs)), T("/mob/living/silicon/robot")) && !is_servant_of_ratvar(R) && is_servant_of_ratvar(f.usr) && R.connected_ai == f.usr) {
				log_game(`${key_name(f.usr)} converted ${R.name} using robotic console!`);
				message_admins(`${key_name_admin(f.usr)} converted cyborg ${key_name_admin(R)} using robotic console!`);
				yield* add_servant_of_ratvar(R);
			}
		}
	} else if (rt.at(href_list, "killdrone")) {
		if (yield* this.allowed(f.usr)) {
			if ((D = rt.locateIn(f, rt.at(href_list, "killdrone"), rt.world())).hacked) {
				to_chat(f.usr, `<span class='danger'>ERROR: ${D} is not responding to external commands.</span>`);
			} else {
				yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, D);
				yield* s.start();
				D.visible_message(fmt("<span class='danger'>％！ self destructs!</span>", [D]));
				yield* D.gib();
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
