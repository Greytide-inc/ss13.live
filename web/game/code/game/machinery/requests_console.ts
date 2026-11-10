// Based on /tg/station's code/game/machinery/requests_console.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


// requests_console.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalreq_console_assistance", function InitGlobalreq_console_assistance(f: Frame) {
	GLOB.req_console_assistance = list();
	this.gvars_datum_init_order += "req_console_assistance";
	return f.dot;
});

// requests_console.dm:5
rt.def("/datum/controller/global_vars/proc/InitGlobalreq_console_supplies", function InitGlobalreq_console_supplies(f: Frame) {
	GLOB.req_console_supplies = list();
	this.gvars_datum_init_order += "req_console_supplies";
	return f.dot;
});

// requests_console.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobalreq_console_information", function InitGlobalreq_console_information(f: Frame) {
	GLOB.req_console_information = list();
	this.gvars_datum_init_order += "req_console_information";
	return f.dot;
});

// requests_console.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalallConsoles", function InitGlobalallConsoles(f: Frame) {
	GLOB.allConsoles = list();
	this.gvars_datum_init_order += "allConsoles";
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

// requests_console.dm:16
rt.def("/obj/machinery/requests_console/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.messages = list();
	this.armor = rt.alist(f, ["melee", 70, "bullet", 30, "laser", 30, "energy", 30, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]);
	return f.dot;
});

// requests_console.dm:65
rt.def("/obj/machinery/requests_console/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// requests_console.dm:69
rt.def("/obj/machinery/requests_console/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.set_light(0);
	} else {
		this.set_light(1.4, 0.7, "#34D352");
	}
	if (this.open) {
		if (!this.hackState) {
			this.icon_state = "req_comp_open";
		} else {
			this.icon_state = "req_comp_rewired";
		}
	} else if (rt.bitAnd(this.stat, 2)) {
		if (this.icon_state != "req_comp_off") {
			this.icon_state = "req_comp_off";
		}
	} else if (this.emergency || this.newmessagepriority == 3) {
		this.icon_state = "req_comp3";
	} else if (this.newmessagepriority == 2) {
		this.icon_state = "req_comp2";
	} else if (this.newmessagepriority == 1) {
		this.icon_state = "req_comp1";
	} else {
		this.icon_state = "req_comp0";
	}
	return f.dot;
});

// requests_console.dm:92
rt.def("/obj/machinery/requests_console/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.name = `ÿ\u0016${this.department} requests console`;
	GLOB.allConsoles += this;
	if (this.departmentType === 1) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_assistance)) {
			GLOB.req_console_assistance += this.department;
		}
	} else if (this.departmentType === 2) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_supplies)) {
			GLOB.req_console_supplies += this.department;
		}
	} else if (this.departmentType === 3) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_information)) {
			GLOB.req_console_information += this.department;
		}
	} else if (this.departmentType === 4) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_assistance)) {
			GLOB.req_console_assistance += this.department;
		}
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_supplies)) {
			GLOB.req_console_supplies += this.department;
		}
	} else if (this.departmentType === 5) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_assistance)) {
			GLOB.req_console_assistance += this.department;
		}
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_information)) {
			GLOB.req_console_information += this.department;
		}
	} else if (this.departmentType === 6) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_supplies)) {
			GLOB.req_console_supplies += this.department;
		}
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_information)) {
			GLOB.req_console_information += this.department;
		}
	} else if (this.departmentType === 7) {
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_assistance)) {
			GLOB.req_console_assistance += this.department;
		}
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_supplies)) {
			GLOB.req_console_supplies += this.department;
		}
		if (!rt.isIn(f, `${this.department}`, GLOB.req_console_information)) {
			GLOB.req_console_information += this.department;
		}
	}
	this.Radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.Radio.listening = 0;
	return f.dot;
}, true);

// requests_console.dm:132
rt.def("/obj/machinery/requests_console/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.Radio);
	this.Radio = null;
	GLOB.allConsoles -= this;
	return (yield* parent_proc());
}, true);

// requests_console.dm:137
rt.def("/obj/machinery/requests_console/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dpt: Value = null, Console: Value = null, messageComposite: Value = null, msg: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let dat: Value = "";
	if (!this.open) {
		$0 = this.screen;
		if ($0 === 1) {
			dat += "Which department do you need assistance from?<BR><BR>";
			dat += "<table width='100%'>";
			for (dpt of each(GLOB.req_console_assistance)) {
				if (dpt != this.department) {
					dat += "<tr>";
					dat += `<td width='55%'>${dpt}</td>`;
					dat += fmt("<td width='45%'><A href='?src=＃;write=＀'>Normal</A> <A href='?src=＃;write=＀;priority=2'>High</A>", [this, ckey(dpt), this, ckey(dpt)]);
					if (this.hackState) {
						dat += fmt("<A href='?src=＃;write=＀;priority=3'>EXTREME</A>", [this, ckey(dpt)]);
					}
					dat += "</td>";
					dat += "</tr>";
				}
			}
			dat += "</table>";
			dat += fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [this]);
		} else if ($0 === 2) {
			dat += "Which department do you need supplies from?<BR><BR>";
			dat += "<table width='100%'>";
			dpt = null;
			for (dpt of each(GLOB.req_console_supplies)) {
				if (dpt != this.department) {
					dat += "<tr>";
					dat += `<td width='55%'>${dpt}</td>`;
					dat += fmt("<td width='45%'><A href='?src=＃;write=＀'>Normal</A> <A href='?src=＃;write=＀;priority=2'>High</A>", [this, ckey(dpt), this, ckey(dpt)]);
					if (this.hackState) {
						dat += fmt("<A href='?src=＃;write=＀;priority=3'>EXTREME</A>", [this, ckey(dpt)]);
					}
					dat += "</td>";
					dat += "</tr>";
				}
			}
			dat += "</table>";
			dat += fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [this]);
		} else if ($0 === 3) {
			dat += "Which department would you like to send information to?<BR><BR>";
			dat += "<table width='100%'>";
			dpt = null;
			for (dpt of each(GLOB.req_console_information)) {
				if (dpt != this.department) {
					dat += "<tr>";
					dat += `<td width='55%'>${dpt}</td>`;
					dat += fmt("<td width='45%'><A href='?src=＃;write=＀'>Normal</A> <A href='?src=＃;write=＀;priority=2'>High</A>", [this, ckey(dpt), this, ckey(dpt)]);
					if (this.hackState) {
						dat += fmt("<A href='?src=＃;write=＀;priority=3'>EXTREME</A>", [this, ckey(dpt)]);
					}
					dat += "</td>";
					dat += "</tr>";
				}
			}
			dat += "</table>";
			dat += fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [this]);
		} else if ($0 === 6) {
			dat += "<span class='good'>Message sent.</span><BR><BR>";
			dat += fmt("<A href='?src=＃;setScreen=0'>Continue</A><BR>", [this]);
		} else if ($0 === 7) {
			dat += "<span class='bad'>An error occurred.</span><BR><BR>";
			dat += fmt("<A href='?src=＃;setScreen=0'>Continue</A><BR>", [this]);
		} else if ($0 === 8) {
			for (Console of each(GLOB.allConsoles, T("/obj/machinery/requests_console"))) {
				if (Console.department == this.department) {
					Console.newmessagepriority = 0;
					yield* Console.update_icon();
				}
			}
			this.newmessagepriority = 0;
			yield* this.update_icon();
			messageComposite = "";
			for (msg of each(this.messages)) {
				messageComposite = `<div class='block'>${msg}</div>` + messageComposite;
			}
			dat += messageComposite;
			dat += fmt("<BR><A href='?src=＃;setScreen=0'><< Back to Main Menu</A><BR>", [this]);
		} else if ($0 === 9) {
			dat += "<B>Message Authentication</B><BR><BR>";
			dat += `<b>Message for ${this.dpt}: </b>${rt.sv(f, "message")}<BR><BR>`;
			dat += "<div class='notice'>You may authenticate your message now by scanning your ID or your stamp</div><BR>";
			if (this.msgVerified) {
				$0 = this.msgVerified;
			} else {
				$0 = "<i>Not Validated</i>";
			}
			dat += `<b>Validated by:</b> ${$0}<br>`;
			if (this.msgStamped) {
				$0 = this.msgStamped;
			} else {
				$0 = "<i>Not Stamped</i>";
			}
			dat += `<b>Stamped by:</b> ${$0}<br><br>`;
			dat += fmt("<A href='?src=＃;department=＀'>Send Message</A><BR>", [this, this.dpt]);
			dat += fmt("<BR><A href='?src=＃;setScreen=0'><< Discard Message</A><BR>", [this]);
		} else if ($0 === 10) {
			dat += "<h3>Station-wide Announcement</h3>";
			if (this.announceAuth) {
				dat += "<div class='notice'>Authentication accepted</div><BR>";
			} else {
				dat += "<div class='notice'>Swipe your card to authenticate yourself</div><BR>";
			}
			dat += `<b>Message: </b>${rt.sv(f, "message") ? rt.sv(f, "message") : "<i>No Message</i>"}<BR>`;
			$0 = this;
			if (rt.sv(f, "message")) {
				$1 = "Edit";
			} else {
				$1 = "Write";
			}
			dat += fmt("<A href='?src=＃;writeAnnouncement=1'>＀ Message</A><BR><BR>", [$0, $1]);
			if ((this.announceAuth || IsAdminGhost(user)) && rt.sv(f, "message")) {
				dat += fmt("<A href='?src=＃;sendAnnouncement=1'>Announce Message</A><BR>", [this]);
			} else {
				dat += "<span class='linkOff'>Announce Message</span><BR>";
			}
			dat += fmt("<BR><A href='?src=＃;setScreen=0'><< Back</A><BR>", [this]);
		} else {
			this.screen = 0;
			this.announceAuth = 0;
			if (this.newmessagepriority == 1) {
				dat += "<div class='notice'>There are new messages</div><BR>";
			}
			if (this.newmessagepriority == 2) {
				dat += "<div class='notice'>There are new <b>PRIORITY</b> messages</div><BR>";
			}
			if (this.newmessagepriority == 3) {
				dat += "<div class='notice'>There are new <b>EXTREME PRIORITY</b> messages</div><BR>";
			}
			dat += fmt("<A href='?src=＃;setScreen=8'>View Messages</A><BR><BR>", [this]);
			dat += fmt("<A href='?src=＃;setScreen=1'>Request Assistance</A><BR>", [this]);
			dat += fmt("<A href='?src=＃;setScreen=2'>Request Supplies</A><BR>", [this]);
			dat += fmt("<A href='?src=＃;setScreen=3'>Relay Anonymous Information</A><BR><BR>", [this]);
			if (!this.emergency) {
				dat += fmt("<A href='?src=＃;emergency=1'>Emergency: Security</A><BR>", [this]);
				dat += fmt("<A href='?src=＃;emergency=2'>Emergency: Engineering</A><BR>", [this]);
				dat += fmt("<A href='?src=＃;emergency=3'>Emergency: Medical</A><BR><BR>", [this]);
			} else {
				dat += `<B><font color='red'>${this.emergency} has been dispatched to this location.</font></B><BR><BR>`;
			}
			if (this.announcementConsole) {
				dat += fmt("<A href='?src=＃;setScreen=10'>Send Station-wide Announcement</A><BR><BR>", [this]);
			}
			if (this.silent) {
				dat += fmt("Speaker <A href='?src=＃;setSilent=0'>OFF</A>", [this]);
			} else {
				dat += fmt("Speaker <A href='?src=＃;setSilent=1'>ON</A>", [this]);
			}
		}
		(popup = (yield* new_(T("/datum/browser"), user, "req_console", `${this.department} Requests Console`, 450, 440))).set_content(dat);
		popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
		yield* popup.open();
	}
	return f.dot;
}, true);

// requests_console.dm:267
rt.def("/obj/machinery/requests_console/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let new_message: Value = null, radio_freq: Value = null, log_msg: Value = null, sending: Value = null, pass: Value = null, MS: Value = null, radio_freq_3: Value = null, authentic: Value = null, alert: Value = null, Console: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (reject_bad_text(rt.at(href_list, "write"))) {
		this.dpt = ckey(rt.at(href_list, "write"));
		if (new_message = copytext(reject_bad_text((yield* g.op(f, "Prompt", [2], ["", "Awaiting Input", "Write your message:", f.usr, null]))), 1, 1024)) {
			rt.setSv(f, "message", new_message);
			this.screen = 9;
			if (text2num(rt.at(href_list, "priority")) < 2) {
				this.priority = -1;
			} else {
				this.priority = text2num(rt.at(href_list, "priority"));
			}
		} else {
			this.dpt = "";
			this.msgVerified = "";
			this.msgStamped = "";
			this.screen = 0;
			this.priority = -1;
		}
	}
	if (rt.at(href_list, "writeAnnouncement")) {
		if (new_message = copytext(reject_bad_text((yield* g.op(f, "Prompt", [2], ["", "Awaiting Input", "Write your message:", f.usr, null]))), 1, 1024)) {
			rt.setSv(f, "message", new_message);
			if (text2num(rt.at(href_list, "priority")) < 2) {
				this.priority = -1;
			} else {
				this.priority = text2num(rt.at(href_list, "priority"));
			}
		} else {
			rt.setSv(f, "message", "");
			this.announceAuth = 0;
			this.screen = 0;
		}
	}
	if (rt.at(href_list, "sendAnnouncement")) {
		if (!this.announcementConsole) {
			return f.dot;
		}
		minor_announce(rt.sv(f, "message"), `${this.department} Announcement:`);
		yield* GLOB.news_network.SubmitArticle(rt.sv(f, "message"), this.department, "Station Announcements", null);
		log_say(`${key_name(f.usr)} has made a station announcement: ${rt.sv(f, "message")}`);
		message_admins(`${key_name_admin(f.usr)} has made a station announcement.`);
		this.announceAuth = 0;
		rt.setSv(f, "message", "");
		this.screen = 0;
	}
	if (rt.at(href_list, "emergency")) {
		if (!this.emergency) {
			const text2num_3 = text2num(rt.at(href_list, "emergency"));
			if (text2num_3 === 1) {
				radio_freq = 1359;
				this.emergency = "Security";
			} else if (text2num_3 === 2) {
				radio_freq = 1357;
				this.emergency = "Engineering";
			} else if (text2num_3 === 3) {
				radio_freq = 1355;
				this.emergency = "Medical";
			}
			if (radio_freq) {
				yield* this.Radio.set_frequency(radio_freq);
				yield* this.Radio.talk_into(this, `${this.emergency} emergency in ${this.department}!!`, radio_freq, this.get_spans(), (yield* this.get_default_language()));
				yield* this.update_icon();
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/requests_console/proc/clear_emergency"))), 3000);
			}
		}
	}
	if (rt.at(href_list, "department") && rt.sv(f, "message")) {
		log_msg = rt.sv(f, "message");
		sending = rt.sv(f, "message");
		sending += "<br>";
		if (this.msgVerified) {
			sending += this.msgVerified;
			sending += "<br>";
		}
		if (this.msgStamped) {
			sending += this.msgStamped;
			sending += "<br>";
		}
		this.screen = 7;
		if (sending) {
			pass = 0;
			for (MS of each(GLOB.machines, T("/obj/machinery/message_server"))) {
				if (!MS.active) {
					continue;
				}
				MS.send_rc_message(rt.at(href_list, "department"), this.department, log_msg, this.msgStamped, this.msgVerified, this.priority);
				pass = 1;
			}
			if (pass) {
				radio_freq_3 = 0;
				const item_2 = rt.at(href_list, "department");
				if (item_2 === "bridge") {
					radio_freq_3 = 1353;
				} else if (item_2 === "medbay") {
					radio_freq_3 = 1355;
				} else if (item_2 === "science") {
					radio_freq_3 = 1351;
				} else if (item_2 === "engineering") {
					radio_freq_3 = 1357;
				} else if (item_2 === "security") {
					radio_freq_3 = 1359;
				} else if (item_2 === "cargobay") {
					radio_freq_3 = 1347;
				}
				yield* this.Radio.set_frequency(radio_freq_3);
				if (this.msgVerified || this.msgStamped) {
					authentic = " (Authenticated)";
				}
				alert = "";
				for (Console of each(GLOB.allConsoles, T("/obj/machinery/requests_console"))) {
					if (ckey(Console.department) == ckey(rt.at(href_list, "department"))) {
						if (this.priority === 2) {
							alert = `PRIORITY Alert in ${this.department}${authentic}`;
							yield* Console.createmessage(this, alert, sending, 2, 1);
						} else if (this.priority === 3) {
							alert = `EXTREME PRIORITY Alert from ${this.department}${authentic}`;
							yield* Console.createmessage(this, alert, sending, 3, 1);
						} else {
							alert = `Message from ${this.department}${authentic}`;
							yield* Console.createmessage(this, alert, sending, 1, 1);
						}
						this.screen = 6;
					}
				}
				if (radio_freq_3) {
					yield* this.Radio.talk_into(this, `${alert}: <i>${rt.sv(f, "message")}</i>`, radio_freq_3, this.get_spans(), (yield* this.get_default_language()));
				}
				if (this.priority === 2) {
					this.messages += `<span class='bad'>High Priority</span><BR><b>To:</b> ${this.dpt}<BR>${sending}`;
				} else {
					this.messages += `<b>To: ${this.dpt}</b><BR>${sending}`;
				}
			} else {
				yield* this.say("NOTICE: No server detected!");
			}
		}
	}
	const text2num_2 = text2num(rt.at(href_list, "setScreen"));
	if (text2num_2 == null) {
	} else if (text2num_2 === 1) {
		this.screen = 1;
	} else if (text2num_2 === 2) {
		this.screen = 2;
	} else if (text2num_2 === 3) {
		this.screen = 3;
	} else if (text2num_2 === 5) {
		this.screen = 5;
	} else if (text2num_2 === 6) {
		this.screen = 6;
	} else if (text2num_2 === 7) {
		this.screen = 7;
	} else if (text2num_2 === 8) {
		this.screen = 8;
	} else if (text2num_2 === 9) {
		this.screen = 9;
	} else if (text2num_2 === 10) {
		if (!this.announcementConsole) {
			return f.dot;
		}
		this.screen = 10;
	} else {
		this.dpt = "";
		this.msgVerified = "";
		this.msgStamped = "";
		rt.setSv(f, "message", "");
		this.priority = -1;
		this.screen = 0;
	}
	const item = rt.at(href_list, "setSilent");
	if (item == null) {
	} else if (item === "1") {
		this.silent = 1;
	} else {
		this.silent = 0;
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// requests_console.dm:443
rt.def("/obj/machinery/requests_console/proc/say_mod", function say_mod(f: Frame, input: Value, message_mode: Value) {
	let ending: Value = null;
	if ((ending = copytext(input, rt.length(input) - 2)) == "!!!") {
		f.dot = "blares";
	} else {
		f.dot = parent_proc();
	}
	return f.dot;
}, false);

// requests_console.dm:451
rt.def("/obj/machinery/requests_console/proc/clear_emergency", function clear_emergency(f: Frame) {
	this.emergency = null;
	this.update_icon();
	return f.dot;
});

// requests_console.dm:455
rt.def("/obj/machinery/requests_console/proc/createmessage", function* createmessage(f: Frame, source: Value, title: Value, message: Value, priority: Value) {
	let linkedsender: Value = null, sender: Value = null;
	if (rt.istype(source, T("/obj/machinery/requests_console"))) {
		sender = source;
		linkedsender = fmt("<a href='?src=＃;write=＀'>＀</a>", [this, ckey(sender.department), sender.department]);
	} else {
		capitalize(source);
		linkedsender = source;
	}
	capitalize(title);
	if (priority === 2) {
		if (this.newmessagepriority < 2) {
			this.newmessagepriority = 2;
			yield* this.update_icon();
		}
		if (!this.silent) {
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
			yield* this.say(title);
			rt.modField(f, this, "messages", `<span class='bad'>High Priority</span><BR><b>From:</b> ${linkedsender}<BR>${message}`, add);
		}
	} else if (priority === 3) {
		if (this.newmessagepriority < 3) {
			this.newmessagepriority = 3;
			yield* this.update_icon();
		}
		if (1) {
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
			yield* this.say(title);
		}
		rt.modField(f, this, "messages", `<span class='bad'>!!!Extreme Priority!!!</span><BR><b>From:</b> ${linkedsender}<BR>${message}`, add);
	} else {
		if (this.newmessagepriority < 1) {
			this.newmessagepriority = 1;
			yield* this.update_icon();
		}
		if (!this.silent) {
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
			yield* this.say(title);
		}
		rt.modField(f, this, "messages", `<b>From:</b> ${linkedsender}<BR>${message}`, add);
	}
	return f.dot;
}, true);

// requests_console.dm:491
rt.def("/obj/machinery/requests_console/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let ID: Value = null, _T: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/crowbar"))) {
		if (this.open) {
			to_chat(user, "<span class='notice'>You close the maintenance panel.</span>");
			this.open = 0;
		} else {
			to_chat(user, "<span class='notice'>You open the maintenance panel.</span>");
			this.open = 1;
		}
		yield* this.update_icon();
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/screwdriver"))) {
		if (this.open) {
			this.hackState = (!this.hackState ? 1 : 0);
			if (this.hackState) {
				to_chat(user, "<span class='notice'>You modify the wiring.</span>");
			} else {
				to_chat(user, "<span class='notice'>You reset the wiring.</span>");
			}
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='warning'>You must open the maintenance panel first!</span>");
		}
		return f.dot;
	}
	if (ID = O.GetID()) {
		if (this.screen == 9) {
			this.msgVerified = `<font color='green'><b>Verified by ${ID.registered_name} (${ID.assignment})</b></font>`;
			yield* this.updateUsrDialog();
		}
		if (this.screen == 10) {
			if (rt.isIn(f, 59, ID.access)) {
				this.announceAuth = 1;
			} else {
				this.announceAuth = 0;
				to_chat(user, "<span class='warning'>You are not authorized to send announcements!</span>");
			}
			yield* this.updateUsrDialog();
		}
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/stamp"))) {
		if (this.screen == 9) {
			this.msgStamped = `<span class='boldnotice'>Stamped with the ${(_T = O).name}</span>`;
			yield* this.updateUsrDialog();
		}
		return f.dot;
	}
	return (yield* parent_proc());
}, true);
