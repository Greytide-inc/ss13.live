// From code/game/machinery/requests_console.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalreq_console_assistance  (code/game/machinery/requests_console.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalreq_console_assistance", function InitGlobalreq_console_assistance(f: Frame) {
	rt.setGl("req_console_assistance", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "req_console_assistance", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalreq_console_supplies  (code/game/machinery/requests_console.dm:5)
rt.def("/datum/controller/global_vars/proc/InitGlobalreq_console_supplies", function InitGlobalreq_console_supplies(f: Frame) {
	rt.setGl("req_console_supplies", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "req_console_supplies", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalreq_console_information  (code/game/machinery/requests_console.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalreq_console_information", function InitGlobalreq_console_information(f: Frame) {
	rt.setGl("req_console_information", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "req_console_information", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalallConsoles  (code/game/machinery/requests_console.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalallConsoles", function InitGlobalallConsoles(f: Frame) {
	rt.setGl("allConsoles", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "allConsoles", add);
	return f.dot;
});

rt.type(10817, "/obj/machinery/requests_console", "/obj/machinery", {
	department: "Unknown",
	messages: null,
	departmentType: 0,
	newmessagepriority: 0,
	screen: 0,
	silent: 0,
	hackState: 0,
	announcementConsole: 0,
	open: 0,
	announceAuth: 0,
	msgVerified: "",
	msgStamped: "",
	message: "",
	dpt: "",
	priority: -1,
	Radio: null,
	emergency: null,
	receive_ore_updates: 0,
	anchored: 1,
	name: "requests console",
	desc: "A console intended to send requests to different departments on the station.",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "req_comp0",
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
});

// /obj/machinery/requests_console/proc/<init>  (code/game/machinery/requests_console.dm:16)
rt.def("/obj/machinery/requests_console/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "messages", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 70, "bullet", 30, "laser", 30, "energy", 30, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});

// /obj/machinery/requests_console/proc/power_change  (code/game/machinery/requests_console.dm:65)
rt.def("/obj/machinery/requests_console/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/requests_console/proc/update_icon  (code/game/machinery/requests_console.dm:69)
rt.def("/obj/machinery/requests_console/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "set_light", [0]);
	} else {
		rt.callSrc(f, "set_light", [1.399999976158142, 0.699999988079071, "#34D352"]);
	}
	if (truthy(rt.sv(f, "open"))) {
		if (!truthy(rt.sv(f, "hackState"))) {
			rt.setSv(f, "icon_state", "req_comp_open");
		} else {
			rt.setSv(f, "icon_state", "req_comp_rewired");
		}
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
			if (!isEqual(rt.sv(f, "icon_state"), "req_comp_off")) {
				rt.setSv(f, "icon_state", "req_comp_off");
			}
		} else {
			if ((truthy(rt.sv(f, "emergency")) || isEqual(rt.sv(f, "newmessagepriority"), 3))) {
				rt.setSv(f, "icon_state", "req_comp3");
			} else {
				if (isEqual(rt.sv(f, "newmessagepriority"), 2)) {
					rt.setSv(f, "icon_state", "req_comp2");
				} else {
					if (isEqual(rt.sv(f, "newmessagepriority"), 1)) {
						rt.setSv(f, "icon_state", "req_comp1");
					} else {
						rt.setSv(f, "icon_state", "req_comp0");
					}
				}
			}
		}
	}
	return f.dot;
});

// /obj/machinery/requests_console/proc/Initialize  (code/game/machinery/requests_console.dm:92)  may sleep
rt.def("/obj/machinery/requests_console/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", fmt("ÿ\u0016＀ requests console", [rt.sv(f, "department")]));
	rt.modGl("allConsoles", live(f.src), add);
	$0 = rt.sv(f, "departmentType");
	if ($0 === 1) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_assistance")) ? 1 : 0))) {
			rt.modGl("req_console_assistance", rt.sv(f, "department"), add);
		}
	} else if ($0 === 2) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_supplies")) ? 1 : 0))) {
			rt.modGl("req_console_supplies", rt.sv(f, "department"), add);
		}
	} else if ($0 === 3) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_information")) ? 1 : 0))) {
			rt.modGl("req_console_information", rt.sv(f, "department"), add);
		}
	} else if ($0 === 4) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_assistance")) ? 1 : 0))) {
			rt.modGl("req_console_assistance", rt.sv(f, "department"), add);
		}
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_supplies")) ? 1 : 0))) {
			rt.modGl("req_console_supplies", rt.sv(f, "department"), add);
		}
	} else if ($0 === 5) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_assistance")) ? 1 : 0))) {
			rt.modGl("req_console_assistance", rt.sv(f, "department"), add);
		}
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_information")) ? 1 : 0))) {
			rt.modGl("req_console_information", rt.sv(f, "department"), add);
		}
	} else if ($0 === 6) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_supplies")) ? 1 : 0))) {
			rt.modGl("req_console_supplies", rt.sv(f, "department"), add);
		}
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_information")) ? 1 : 0))) {
			rt.modGl("req_console_information", rt.sv(f, "department"), add);
		}
	} else if ($0 === 7) {
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_assistance")) ? 1 : 0))) {
			rt.modGl("req_console_assistance", rt.sv(f, "department"), add);
		}
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_supplies")) ? 1 : 0))) {
			rt.modGl("req_console_supplies", rt.sv(f, "department"), add);
		}
		if (!truthy((rt.isIn(f, fmt("＀", [rt.sv(f, "department")]), rt.gl("req_console_information")) ? 1 : 0))) {
			rt.modGl("req_console_information", rt.sv(f, "department"), add);
		}
	}
	rt.setSv(f, "Radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "listening", rt.sv(f, "Radio"), 0);
	return f.dot;
}, true);

// /obj/machinery/requests_console/proc/Destroy  (code/game/machinery/requests_console.dm:132)  may sleep
rt.def("/obj/machinery/requests_console/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "Radio")]);
	rt.setSv(f, "Radio", null);
	(rt.modGl("allConsoles", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/requests_console/proc/attack_hand  (code/game/machinery/requests_console.dm:137)  may sleep
rt.def("/obj/machinery/requests_console/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, dpt: Value = null, Console: Value = null, messageComposite: Value = null, msg: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, dpt, Console, messageComposite, msg, popup, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	dat = "";
	if (!truthy(rt.sv(f, "open"))) {
		$0 = rt.sv(f, "screen");
		if ($0 === 1) {
			dat = rt.modify(live(dat), "Which department do you need assistance from?<BR><BR>", add);
			dat = rt.modify(live(dat), "<table width='100%'>", add);
			dpt = null;
			rt.forList(f, 0, rt.gl("req_console_assistance"));
			while (($e = rt.next(f, 0)) !== undefined) {
				dpt = $e;
				if (!isEqual(live(dpt), rt.sv(f, "department"))) {
					dat = rt.modify(live(dat), "<tr>", add);
					dat = rt.modify(live(dat), fmt("<td width='55%'>＀</td>", [live(dpt)]), add);
					dat = rt.modify(live(dat), fmt("<td width='45%'><A href='?src=＃;write=＀'>Normal</A> <A href='?src=＃;write=＀;priority=2'>High</A>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)])), live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)]))]), add);
					if (truthy(rt.sv(f, "hackState"))) {
						dat = rt.modify(live(dat), fmt("<A href='?src=＃;write=＀;priority=3'>EXTREME</A>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)]))]), add);
					}
					dat = rt.modify(live(dat), "</td>", add);
					dat = rt.modify(live(dat), "</tr>", add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [live(f.src)]), add);
		} else if ($0 === 2) {
			dat = rt.modify(live(dat), "Which department do you need supplies from?<BR><BR>", add);
			dat = rt.modify(live(dat), "<table width='100%'>", add);
			dpt = null;
			rt.forList(f, 0, rt.gl("req_console_supplies"));
			while (($e = rt.next(f, 0)) !== undefined) {
				dpt = $e;
				if (!isEqual(live(dpt), rt.sv(f, "department"))) {
					dat = rt.modify(live(dat), "<tr>", add);
					dat = rt.modify(live(dat), fmt("<td width='55%'>＀</td>", [live(dpt)]), add);
					dat = rt.modify(live(dat), fmt("<td width='45%'><A href='?src=＃;write=＀'>Normal</A> <A href='?src=＃;write=＀;priority=2'>High</A>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)])), live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)]))]), add);
					if (truthy(rt.sv(f, "hackState"))) {
						dat = rt.modify(live(dat), fmt("<A href='?src=＃;write=＀;priority=3'>EXTREME</A>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)]))]), add);
					}
					dat = rt.modify(live(dat), "</td>", add);
					dat = rt.modify(live(dat), "</tr>", add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [live(f.src)]), add);
		} else if ($0 === 3) {
			dat = rt.modify(live(dat), "Which department would you like to send information to?<BR><BR>", add);
			dat = rt.modify(live(dat), "<table width='100%'>", add);
			dpt = null;
			rt.forList(f, 0, rt.gl("req_console_information"));
			while (($e = rt.next(f, 0)) !== undefined) {
				dpt = $e;
				if (!isEqual(live(dpt), rt.sv(f, "department"))) {
					dat = rt.modify(live(dat), "<tr>", add);
					dat = rt.modify(live(dat), fmt("<td width='55%'>＀</td>", [live(dpt)]), add);
					dat = rt.modify(live(dat), fmt("<td width='45%'><A href='?src=＃;write=＀'>Normal</A> <A href='?src=＃;write=＀;priority=2'>High</A>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)])), live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)]))]), add);
					if (truthy(rt.sv(f, "hackState"))) {
						dat = rt.modify(live(dat), fmt("<A href='?src=＃;write=＀;priority=3'>EXTREME</A>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [live(dpt)]))]), add);
					}
					dat = rt.modify(live(dat), "</td>", add);
					dat = rt.modify(live(dat), "</tr>", add);
				}
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [live(f.src)]), add);
		} else if ($0 === 6) {
			dat = rt.modify(live(dat), "<span class='good'>Message sent.</span><BR><BR>", add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=0'>Continue</A><BR>", [live(f.src)]), add);
		} else if ($0 === 7) {
			dat = rt.modify(live(dat), "<span class='bad'>An error occurred.</span><BR><BR>", add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=0'>Continue</A><BR>", [live(f.src)]), add);
		} else if ($0 === 8) {
			Console = null;
			rt.forList(f, 0, rt.gl("allConsoles"), T("/obj/machinery/requests_console"));
			while (($e = rt.next(f, 0)) !== undefined) {
				Console = $e;
				if (isEqual(rt.fv(f, "department", live(Console)), rt.sv(f, "department"))) {
					rt.setFv(f, "newmessagepriority", live(Console), 0);
					yield* g.callName(f, live(Console), "update_icon", []);
				}
			}
			rt.endFor(f, 0);
			rt.setSv(f, "newmessagepriority", 0);
			yield* g.srcCall(f, "update_icon");
			messageComposite = "";
			msg = null;
			rt.forList(f, 0, rt.sv(f, "messages"));
			while (($e = rt.next(f, 0)) !== undefined) {
				msg = $e;
				messageComposite = add(fmt("<div class='block'>＀</div>", [live(msg)]), live(messageComposite));
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), live(messageComposite), add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=0'><< Back to Main Menu</A><BR>", [live(f.src)]), add);
		} else if ($0 === 9) {
			dat = rt.modify(live(dat), "<B>Message Authentication</B><BR><BR>", add);
			dat = rt.modify(live(dat), fmt("<b>Message for ＀: </b>＀<BR><BR>", [rt.sv(f, "dpt"), rt.sv(f, "message")]), add);
			dat = rt.modify(live(dat), "<div class='notice'>You may authenticate your message now by scanning your ID or your stamp</div><BR>", add);
			if (truthy(rt.sv(f, "msgVerified"))) {
				$0 = rt.sv(f, "msgVerified");
			} else {
				$0 = "<i>Not Validated</i>";
			}
			dat = rt.modify(live(dat), fmt("<b>Validated by:</b> ＀<br>", [$0]), add);
			if (truthy(rt.sv(f, "msgStamped"))) {
				$0 = rt.sv(f, "msgStamped");
			} else {
				$0 = "<i>Not Stamped</i>";
			}
			dat = rt.modify(live(dat), fmt("<b>Stamped by:</b> ＀<br><br>", [$0]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;department=＀'>Send Message</A><BR>", [live(f.src), rt.sv(f, "dpt")]), add);
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=0'><< Discard Message</A><BR>", [live(f.src)]), add);
		} else if ($0 === 10) {
			dat = rt.modify(live(dat), "<h3>Station-wide Announcement</h3>", add);
			if (truthy(rt.sv(f, "announceAuth"))) {
				dat = rt.modify(live(dat), "<div class='notice'>Authentication accepted</div><BR>", add);
			} else {
				dat = rt.modify(live(dat), "<div class='notice'>Swipe your card to authenticate yourself</div><BR>", add);
			}
			if (truthy(rt.sv(f, "message"))) {
				$0 = rt.sv(f, "message");
			} else {
				$0 = "<i>No Message</i>";
			}
			dat = rt.modify(live(dat), fmt("<b>Message: </b>＀<BR>", [$0]), add);
			$0 = live(f.src);
			if (truthy(rt.sv(f, "message"))) {
				$1 = "Edit";
			} else {
				$1 = "Write";
			}
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;writeAnnouncement=1'>＀ Message</A><BR><BR>", [$0, $1]), add);
			if (((truthy(rt.sv(f, "announceAuth")) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.args[0])])))) && truthy(rt.sv(f, "message")))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;sendAnnouncement=1'>Announce Message</A><BR>", [live(f.src)]), add);
			} else {
				dat = rt.modify(live(dat), "<span class='linkOff'>Announce Message</span><BR>", add);
			}
			dat = rt.modify(live(dat), fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [live(f.src)]), add);
		} else {
			rt.setSv(f, "screen", 0);
			rt.setSv(f, "announceAuth", 0);
			if (isEqual(rt.sv(f, "newmessagepriority"), 1)) {
				dat = rt.modify(live(dat), "<div class='notice'>There are new messages</div><BR>", add);
			}
			if (isEqual(rt.sv(f, "newmessagepriority"), 2)) {
				dat = rt.modify(live(dat), "<div class='notice'>There are new <b>PRIORITY</b> messages</div><BR>", add);
			}
			if (isEqual(rt.sv(f, "newmessagepriority"), 3)) {
				dat = rt.modify(live(dat), "<div class='notice'>There are new <b>EXTREME PRIORITY</b> messages</div><BR>", add);
			}
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=8'>View Messages</A><BR><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=1'>Request Assistance</A><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=2'>Request Supplies</A><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=3'>Relay Anonymous Information</A><BR><BR>", [live(f.src)]), add);
			if (!truthy(rt.sv(f, "emergency"))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;emergency=1'>Emergency: Security</A><BR>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;emergency=2'>Emergency: Engineering</A><BR>", [live(f.src)]), add);
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;emergency=3'>Emergency: Medical</A><BR><BR>", [live(f.src)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("<B><font color='red'>＀ has been dispatched to this location.</font></B><BR><BR>", [rt.sv(f, "emergency")]), add);
			}
			if (truthy(rt.sv(f, "announcementConsole"))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;setScreen=10'>Send Station-wide Announcement</A><BR><BR>", [live(f.src)]), add);
			}
			if (truthy(rt.sv(f, "silent"))) {
				dat = rt.modify(live(dat), fmt("Speaker <A href='?src=＃;setSilent=0'>OFF</A>", [live(f.src)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("Speaker <A href='?src=＃;setSilent=1'>ON</A>", [live(f.src)]), add);
			}
		}
		yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "req_console", fmt("＀ Requests Console", [rt.sv(f, "department")]), 450, 440]))), "set_content", [live(dat)]);
		yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
		yield* g.callName(f, live(popup), "open", []);
	}
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/requests_console/proc/Topic  (code/game/machinery/requests_console.dm:267)  may sleep
rt.def("/obj/machinery/requests_console/proc/Topic", function* Topic(f: Frame) {
	let new_message: Value = null, radio_freq: Value = null, log_msg: Value = null, sending: Value = null, pass: Value = null, MS: Value = null, radio_freq_3: Value = null, authentic: Value = null, alert: Value = null, Console: Value = null;
	let $0: any, $e: any;
	f.vars = () => [new_message, radio_freq, log_msg, sending, pass, MS, radio_freq_3, authentic, alert, Console, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy((yield* g.call(f, P("/proc/reject_bad_text"), null, [rt.at(live(f.args[1]), "write")])))) {
		rt.setSv(f, "dpt", (yield* g.call(f, P("/proc/ckey"), null, [rt.at(live(f.args[1]), "write")])));
		if (truthy((new_message = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], ["", "Awaiting Input", "Write your message:", live(f.usr), null]))])), 1, 1024]))))) {
			rt.setSv(f, "message", live(new_message));
			rt.setSv(f, "screen", 9);
			if (rt.lt((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "priority")])), 2)) {
				rt.setSv(f, "priority", -1);
			} else {
				rt.setSv(f, "priority", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "priority")])));
			}
		} else {
			rt.setSv(f, "dpt", "");
			rt.setSv(f, "msgVerified", "");
			rt.setSv(f, "msgStamped", "");
			rt.setSv(f, "screen", 0);
			rt.setSv(f, "priority", -1);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "writeAnnouncement"))) {
		if (truthy((new_message = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], ["", "Awaiting Input", "Write your message:", live(f.usr), null]))])), 1, 1024]))))) {
			rt.setSv(f, "message", live(new_message));
			if (rt.lt((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "priority")])), 2)) {
				rt.setSv(f, "priority", -1);
			} else {
				rt.setSv(f, "priority", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "priority")])));
			}
		} else {
			rt.setSv(f, "message", "");
			rt.setSv(f, "announceAuth", 0);
			rt.setSv(f, "screen", 0);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "sendAnnouncement"))) {
		if (!truthy(rt.sv(f, "announcementConsole"))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/minor_announce"), null, [rt.sv(f, "message"), fmt("＀ Announcement:", [rt.sv(f, "department")])]);
		yield* g.callName(f, rt.gl("news_network"), "SubmitArticle", [rt.sv(f, "message"), rt.sv(f, "department"), "Station Announcements", null]);
		yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ has made a station announcement: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "message")])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has made a station announcement.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
		rt.setSv(f, "announceAuth", 0);
		rt.setSv(f, "message", "");
		rt.setSv(f, "screen", 0);
	}
	if (truthy(rt.at(live(f.args[1]), "emergency"))) {
		if (!truthy(rt.sv(f, "emergency"))) {
			radio_freq = null;
			$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "emergency")]));
			if ($0 === 1) {
				radio_freq = 1359;
				rt.setSv(f, "emergency", "Security");
			} else if ($0 === 2) {
				radio_freq = 1357;
				rt.setSv(f, "emergency", "Engineering");
			} else if ($0 === 3) {
				radio_freq = 1355;
				rt.setSv(f, "emergency", "Medical");
			}
			if (truthy(live(radio_freq))) {
				yield* g.callName(f, rt.sv(f, "Radio"), "set_frequency", [live(radio_freq)]);
				yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), fmt("＀ emergency in ＀!!", [rt.sv(f, "emergency"), rt.sv(f, "department")]), live(radio_freq), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				yield* g.srcCall(f, "update_icon");
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/requests_console/proc/clear_emergency")])), 3000]);
			}
		}
	}
	if ((truthy(rt.at(live(f.args[1]), "department")) && truthy(rt.sv(f, "message")))) {
		log_msg = rt.sv(f, "message");
		sending = rt.sv(f, "message");
		sending = rt.modify(live(sending), "<br>", add);
		if (truthy(rt.sv(f, "msgVerified"))) {
			sending = rt.modify(live(sending), rt.sv(f, "msgVerified"), add);
			sending = rt.modify(live(sending), "<br>", add);
		}
		if (truthy(rt.sv(f, "msgStamped"))) {
			sending = rt.modify(live(sending), rt.sv(f, "msgStamped"), add);
			sending = rt.modify(live(sending), "<br>", add);
		}
		rt.setSv(f, "screen", 7);
		if (truthy(live(sending))) {
			pass = 0;
			MS = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/message_server"));
			while (($e = rt.next(f, 0)) !== undefined) {
				MS = $e;
				if (!truthy(rt.fv(f, "active", live(MS)))) {
					continue;
				}
				yield* g.callName(f, live(MS), "send_rc_message", [rt.at(live(f.args[1]), "department"), rt.sv(f, "department"), live(log_msg), rt.sv(f, "msgStamped"), rt.sv(f, "msgVerified"), rt.sv(f, "priority")]);
				pass = 1;
			}
			rt.endFor(f, 0);
			if (truthy(live(pass))) {
				radio_freq_3 = 0;
				$0 = rt.at(live(f.args[1]), "department");
				if ($0 === "bridge") {
					radio_freq_3 = 1353;
				} else if ($0 === "medbay") {
					radio_freq_3 = 1355;
				} else if ($0 === "science") {
					radio_freq_3 = 1351;
				} else if ($0 === "engineering") {
					radio_freq_3 = 1357;
				} else if ($0 === "security") {
					radio_freq_3 = 1359;
				} else if ($0 === "cargobay") {
					radio_freq_3 = 1347;
				}
				yield* g.callName(f, rt.sv(f, "Radio"), "set_frequency", [live(radio_freq_3)]);
				authentic = null;
				if ((truthy(rt.sv(f, "msgVerified")) || truthy(rt.sv(f, "msgStamped")))) {
					authentic = " (Authenticated)";
				}
				alert = "";
				Console = null;
				rt.forList(f, 0, rt.gl("allConsoles"), T("/obj/machinery/requests_console"));
				while (($e = rt.next(f, 0)) !== undefined) {
					Console = $e;
					if (isEqual((yield* g.call(f, P("/proc/ckey"), null, [rt.fv(f, "department", live(Console))])), (yield* g.call(f, P("/proc/ckey"), null, [rt.at(live(f.args[1]), "department")])))) {
						$0 = rt.sv(f, "priority");
						if ($0 === 2) {
							alert = fmt("PRIORITY Alert in ＀＀", [rt.sv(f, "department"), live(authentic)]);
							yield* g.callName(f, live(Console), "createmessage", [live(f.src), live(alert), live(sending), 2, 1]);
						} else if ($0 === 3) {
							alert = fmt("EXTREME PRIORITY Alert from ＀＀", [rt.sv(f, "department"), live(authentic)]);
							yield* g.callName(f, live(Console), "createmessage", [live(f.src), live(alert), live(sending), 3, 1]);
						} else {
							alert = fmt("Message from ＀＀", [rt.sv(f, "department"), live(authentic)]);
							yield* g.callName(f, live(Console), "createmessage", [live(f.src), live(alert), live(sending), 1, 1]);
						}
						rt.setSv(f, "screen", 6);
					}
				}
				rt.endFor(f, 0);
				if (truthy(live(radio_freq_3))) {
					yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), fmt("＀: <i>＀</i>", [live(alert), rt.sv(f, "message")]), live(radio_freq_3), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				}
				$0 = rt.sv(f, "priority");
				if ($0 === 2) {
					rt.modSrcVar(f, "messages", fmt("<span class='bad'>High Priority</span><BR><b>To:</b> ＀<BR>＀", [rt.sv(f, "dpt"), live(sending)]), add);
				} else {
					rt.modSrcVar(f, "messages", fmt("<b>To: ＀</b><BR>＀", [rt.sv(f, "dpt"), live(sending)]), add);
				}
			} else {
				yield* g.srcCall(f, "say", "NOTICE: No server detected!");
			}
		}
	}
	$0 = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "setScreen")]));
	if (isEqual($0, null)) {
	} else if ($0 === 1) {
		rt.setSv(f, "screen", 1);
	} else if ($0 === 2) {
		rt.setSv(f, "screen", 2);
	} else if ($0 === 3) {
		rt.setSv(f, "screen", 3);
	} else if ($0 === 5) {
		rt.setSv(f, "screen", 5);
	} else if ($0 === 6) {
		rt.setSv(f, "screen", 6);
	} else if ($0 === 7) {
		rt.setSv(f, "screen", 7);
	} else if ($0 === 8) {
		rt.setSv(f, "screen", 8);
	} else if ($0 === 9) {
		rt.setSv(f, "screen", 9);
	} else if ($0 === 10) {
		if (!truthy(rt.sv(f, "announcementConsole"))) {
			return live(f.dot);
		}
		rt.setSv(f, "screen", 10);
	} else {
		rt.setSv(f, "dpt", "");
		rt.setSv(f, "msgVerified", "");
		rt.setSv(f, "msgStamped", "");
		rt.setSv(f, "message", "");
		rt.setSv(f, "priority", -1);
		rt.setSv(f, "screen", 0);
	}
	$0 = rt.at(live(f.args[1]), "setSilent");
	if (isEqual($0, null)) {
	} else if ($0 === "1") {
		rt.setSv(f, "silent", 1);
	} else {
		rt.setSv(f, "silent", 0);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/requests_console/proc/say_mod  (code/game/machinery/requests_console.dm:443)
rt.def("/obj/machinery/requests_console/proc/say_mod", function say_mod(f: Frame) {
	let ending: Value = null;
	f.vars = () => [ending];
	if (isEqual((ending = rt.call(f, P("/proc/copytext"), null, [live(f.args[0]), subtract(rt.length(live(f.args[0])), 2)])), "!!!")) {
		f.dot = "blares";
	} else {
		f.dot = rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["input", "message_mode"] });

// /obj/machinery/requests_console/proc/clear_emergency  (code/game/machinery/requests_console.dm:451)
rt.def("/obj/machinery/requests_console/proc/clear_emergency", function clear_emergency(f: Frame) {
	rt.setSv(f, "emergency", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/requests_console/proc/createmessage  (code/game/machinery/requests_console.dm:455)  may sleep
rt.def("/obj/machinery/requests_console/proc/createmessage", function* createmessage(f: Frame, source: Value, title: Value, message: Value, priority: Value) {
	let linkedsender: Value = null, sender: Value = null;
	let $0: any;
	f.vars = () => [source, title, message, priority, linkedsender, sender, $0];
	linkedsender = null;
	if (truthy((rt.istype(live(source), T("/obj/machinery/requests_console")) ? 1 : 0))) {
		sender = live(source);
		linkedsender = fmt("<a href='?src=＃;write=＀'>＀</a>", [live(f.src), (yield* g.call(f, P("/proc/ckey"), null, [rt.fv(f, "department", live(sender))])), rt.fv(f, "department", live(sender))]);
	} else {
		yield* g.call(f, P("/proc/capitalize"), null, [live(source)]);
		linkedsender = live(source);
	}
	yield* g.call(f, P("/proc/capitalize"), null, [live(title)]);
	$0 = live(priority);
	if ($0 === 2) {
		if (rt.lt(rt.fv(f, "newmessagepriority", live(f.src)), 2)) {
			rt.setFv(f, "newmessagepriority", live(f.src), 2);
			yield* g.callName(f, live(f.src), "update_icon", []);
		}
		if (!truthy(rt.fv(f, "silent", live(f.src)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
			yield* g.srcCall(f, "say", live(title));
			rt.modField(f, live(f.src), "messages", fmt("<span class='bad'>High Priority</span><BR><b>From:</b> ＀<BR>＀", [live(linkedsender), live(message)]), add);
		}
	} else if ($0 === 3) {
		if (rt.lt(rt.fv(f, "newmessagepriority", live(f.src)), 3)) {
			rt.setFv(f, "newmessagepriority", live(f.src), 3);
			yield* g.callName(f, live(f.src), "update_icon", []);
		}
		if (truthy(1)) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
			yield* g.srcCall(f, "say", live(title));
		}
		rt.modField(f, live(f.src), "messages", fmt("<span class='bad'>!!!Extreme Priority!!!</span><BR><b>From:</b> ＀<BR>＀", [live(linkedsender), live(message)]), add);
	} else {
		if (rt.lt(rt.fv(f, "newmessagepriority", live(f.src)), 1)) {
			rt.setFv(f, "newmessagepriority", live(f.src), 1);
			yield* g.callName(f, live(f.src), "update_icon", []);
		}
		if (!truthy(rt.fv(f, "silent", live(f.src)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
			yield* g.srcCall(f, "say", live(title));
		}
		rt.modField(f, live(f.src), "messages", fmt("<b>From:</b> ＀<BR>＀", [live(linkedsender), live(message)]), add);
	}
	return f.dot;
}, true);

// /obj/machinery/requests_console/proc/attackby  (code/game/machinery/requests_console.dm:491)  may sleep
rt.def("/obj/machinery/requests_console/proc/attackby", function* attackby(f: Frame) {
	let ID: Value = null, _T: Value = null;
	f.vars = () => [ID, _T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "open"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the maintenance panel.</span>"]);
			rt.setSv(f, "open", 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the maintenance panel.</span>"]);
			rt.setSv(f, "open", 1);
		}
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "open"))) {
			rt.setSv(f, "hackState", (!truthy(rt.sv(f, "hackState")) ? 1 : 0));
			if (truthy(rt.sv(f, "hackState"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You modify the wiring.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You reset the wiring.</span>"]);
			}
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must open the maintenance panel first!</span>"]);
		}
		return live(f.dot);
	}
	if (truthy((ID = (yield* g.callName(f, live(f.args[0]), "GetID", []))))) {
		if (isEqual(rt.sv(f, "screen"), 9)) {
			rt.setSv(f, "msgVerified", fmt("<font color='green'><b>Verified by ＀ (＀)</b></font>", [rt.fv(f, "registered_name", live(ID)), rt.fv(f, "assignment", live(ID))]));
			yield* g.srcCall(f, "updateUsrDialog");
		}
		if (isEqual(rt.sv(f, "screen"), 10)) {
			if (truthy((rt.isIn(f, 59, rt.fv(f, "access", live(ID))) ? 1 : 0))) {
				rt.setSv(f, "announceAuth", 1);
			} else {
				rt.setSv(f, "announceAuth", 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You are not authorized to send announcements!</span>"]);
			}
			yield* g.srcCall(f, "updateUsrDialog");
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stamp")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "screen"), 9)) {
			rt.setSv(f, "msgStamped", fmt("<span class='boldnotice'>Stamped with the ＀</span>", [rt.gv(f, "name", (_T = live(f.args[0])))]));
			yield* g.srcCall(f, "updateUsrDialog");
		}
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["O", "user", "params"] });
