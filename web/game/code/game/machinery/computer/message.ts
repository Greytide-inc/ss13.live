// Based on /tg/station's code/game/machinery/computer/message.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10388, "/obj/machinery/computer/message_monitor", "/obj/machinery/computer", {
	linkedServer: null,
	spark_system: null,
	noserver: "<span class='alert'>ALERT: No server detected.</span>",
	incorrectkey: "<span class='warning'>ALERT: Incorrect decryption key!</span>",
	defaultmsg: "<span class='notice'>Welcome. Please select an option.</span>",
	rebootmsg: "<span class='warning'>%$&(�: Critical %$$@ Error // !RestArting! <lOadiNg backUp iNput ouTput> - ?pLeaSe wAit!</span>",
	screen: 0,
	hacking: 0,
	message: "<span class='notice'>System bootup complete. Please select an option.</span>",
	auth: 0,
	optioncount: 7,
	customsender: "System Administrator",
	customrecepient: null,
	customjob: "Admin",
	custommessage: "This is a test, please ignore.",
	icon_screen: "comm_logs",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/message_monitor"),
	light_color: "#64C864",
	name: "message monitor console",
	desc: "Used to Monitor the crew's messages, that are sent via PDA. Can also be used to view Request Console messages.",
});

// message.dm:15
rt.def("/obj/machinery/computer/message_monitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spark_system = new_(T("/datum/effect_system/spark_spread"));
	return f.dot;
});

// message.dm:36
rt.def("/obj/machinery/computer/message_monitor/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/screwdriver")) && this.emagged) {
		to_chat(user, "<span class='warning'>It is too hot to mess with!</span>");
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// message.dm:43
rt.def("/obj/machinery/computer/message_monitor/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	let MK: Value = null, time: Value = null;
	if (this.emagged) return f.dot;
	if (this.linkedServer !== null) {
		this.emagged = 1;
		this.screen = 2;
		yield* this.spark_system.set_up(5, 0, this);
		yield* this.spark_system.start();
		(MK = (yield* new_(T("/obj/item/weapon/paper/monitorkey")))).loc = this.loc;
		MK.info += "<br><br><font color='red'>�%@%(*$%&(�&?*(%&�/{}</font>";
		time = 100 * rt.length(this.linkedServer.decryptkey);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/computer/message_monitor/proc/UnmagConsole"))), time);
		rt.setSv(f, "message", this.rebootmsg);
	} else {
		to_chat(user, "<span class='notice'>A no server error appears on the screen.</span>");
	}
	return f.dot;
}, true);

// message.dm:60
rt.def("/obj/machinery/computer/message_monitor/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.linkedServer) return f.dot;
	if (!(GLOB.message_servers && rt.len(f, GLOB.message_servers) > 0)) return f.dot;
	this.linkedServer = rt.index(GLOB.message_servers, 1);
	return f.dot;
}, true);

// message.dm:67
rt.def("/obj/machinery/computer/message_monitor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null, n: Value = null, index: Value = null, pda: Value = null, rc: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.hacking || this.emagged) {
		rt.setSv(f, "message", this.rebootmsg);
	}
	let dat: Value = `<center><font color='blue'${rt.sv(f, "message")}</font>/</center>`;
	if (this.auth) {
		dat += fmt("<h4><dd><A href='?src=＃;auth=1'>&#09;<font color='green'>[Authenticated]</font></a>&#09;/", [this]);
		$0 = this;
		if (this.linkedServer && this.linkedServer.active) {
			$1 = "<font color='green'>[On]</font>";
		} else {
			$1 = "<font color='red'>[Off]</font>";
		}
		dat += fmt(" Server Power: <A href='?src=＃;active=1'>＀</a></h4>", [$0, $1]);
	} else {
		dat += fmt("<h4><dd><A href='?src=＃;auth=1'>&#09;<font color='red'>[Unauthenticated]</font></a>&#09;/", [this]);
		if (this.linkedServer && this.linkedServer.active) {
			$0 = "<font color='green'>[On]</font>";
		} else {
			$0 = "<font color='red'>[Off]</font>";
		}
		dat += ` Server Power: <u>${$0}</u></h4>`;
	}
	if (this.hacking || this.emagged) {
		this.screen = 2;
	} else if (!this.auth || !this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
		if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
			rt.setSv(f, "message", this.noserver);
		}
		this.screen = 0;
	}
	if (this.screen === 0) {
		i = 0;
		dat += fmt("<dd><A href='?src=＃;find=1'>&#09;＀. Link To A Server</a></dd>", [this, ++i]);
		if (this.auth) {
			if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
				dat += "<dd><A>&#09;ERROR: Server not found!</A><br></dd>";
			} else {
				dat += fmt("<dd><A href='?src=＃;view=1'>&#09;＀. View Message Logs </a><br></dd>", [this, ++i]);
				dat += fmt("<dd><A href='?src=＃;viewr=1'>&#09;＀. View Request Console Logs </a></br></dd>", [this, ++i]);
				dat += fmt("<dd><A href='?src=＃;clear=1'>&#09;＀. Clear Message Logs</a><br></dd>", [this, ++i]);
				dat += fmt("<dd><A href='?src=＃;clearr=1'>&#09;＀. Clear Request Console Logs</a><br></dd>", [this, ++i]);
				dat += fmt("<dd><A href='?src=＃;pass=1'>&#09;＀. Set Custom Key</a><br></dd>", [this, ++i]);
				dat += fmt("<dd><A href='?src=＃;msg=1'>&#09;＀. Send Admin Message</a><br></dd>", [this, ++i]);
			}
		} else {
			n = ++i;
			while (n <= this.optioncount) {
				dat += `<dd><font color='blue'>&#09;${n}. ---------------</font><br></dd>`;
				n++;
			}
		}
		if (rt.istype(f.usr, T("/mob/living/silicon")) && is_special_character(f.usr)) {
			dat += fmt("<dd><A href='?src=＃;hack=1'><i><font color='Red'>*&@#. Bruteforce Key</font></i></font></a><br></dd>", [this]);
		} else {
			dat += "<br>";
		}
		if (!this.auth) {
			dat += "<br><hr><dd><span class='notice'>Please authenticate with the server in order to show additional options.</span>";
		} else {
			dat += "<br><hr><dd><span class='warning'>Reg, #514 forbids sending messages to a Head of Staff containing Erotic Rendering Properties.</span>";
		}
	} else if (this.screen === 1) {
		index = 0;
		dat += fmt("<center><A href='?src=＃;back=1'>Back</a> - <A href='?src=＃;refresh=1'>Refresh</center><hr>", [this, this]);
		dat += "<table border='1' width='100%'><tr><th width = '5%'>X</th><th width='15%'>Sender</th><th width='15%'>Recipient</th><th width='300px' word-wrap: break-word>Message</th></tr>";
		for (pda of each(this.linkedServer.pda_msgs, T("/datum/data_pda_msg"))) {
			index++;
			if (index > 3000) {
				break;
			}
			$0 = this;
			$1 = pda;
			$2 = pda.sender;
			$3 = pda.recipient;
			$4 = rt.fv(f, "message", pda);
			if (pda.photo) {
				$5 = fmt("<a href='byond://?src=＃;photo=1'>(Photo)</a>", [pda]);
			} else {
				$5 = "";
			}
			dat += fmt("<tr><td width = '5%'><center><A href='?src=＃;delete=＃' style='color: rgb(255,0,0)'>X</a></center></td><td width='15%'>＀</td><td width='15%'>＀</td><td width='300px'>＀＀</td></tr>", [$0, $1, $2, $3, $4, $5]);
		}
		dat += "</table>";
	} else if (this.screen === 2) {
		if (rt.istype(user, T("/mob/living/silicon/ai")) || rt.istype(user, T("/mob/living/silicon/robot"))) {
			dat += "Brute-forcing for server key.<br> It will take 20 seconds for every character that the password has.";
			dat += "In the meantime, this console can reveal your true intentions if you let someone access it. Make sure no humans enter the room during that time.";
		} else {
			dat += "01000010011100100111010101110100011001010010110<br>\n\t\t\t\t10110011001101111011100100110001101101001011011100110011<br>\n\t\t\t\t10010000001100110011011110111001000100000011100110110010<br>\n\t\t\t\t10111001001110110011001010111001000100000011010110110010<br>\n\t\t\t\t10111100100101110001000000100100101110100001000000111011<br>\n\t\t\t\t10110100101101100011011000010000001110100011000010110101<br>\n\t\t\t\t10110010100100000001100100011000000100000011100110110010<br>\n\t\t\t\t10110001101101111011011100110010001110011001000000110011<br>\n\t\t\t\t00110111101110010001000000110010101110110011001010111001<br>\n\t\t\t\t00111100100100000011000110110100001100001011100100110000<br>\n\t\t\t\t10110001101110100011001010111001000100000011101000110100<br>\n\t\t\t\t00110000101110100001000000111010001101000011001010010000<br>\n\t\t\t\t00111000001100001011100110111001101110111011011110111001<br>\n\t\t\t\t00110010000100000011010000110000101110011001011100010000<br>\n\t\t\t\t00100100101101110001000000111010001101000011001010010000<br>\n\t\t\t\t00110110101100101011000010110111001110100011010010110110<br>\n\t\t\t\t10110010100101100001000000111010001101000011010010111001<br>\n\t\t\t\t10010000001100011011011110110111001110011011011110110110<br>\n\t\t\t\t00110010100100000011000110110000101101110001000000111001<br>\n\t\t\t\t00110010101110110011001010110000101101100001000000111100<br>\n\t\t\t\t10110111101110101011100100010000001110100011100100111010<br>\n\t\t\t\t10110010100100000011010010110111001110100011001010110111<br>\n\t\t\t\t00111010001101001011011110110111001110011001000000110100<br>\n\t\t\t\t10110011000100000011110010110111101110101001000000110110<br>\n\t\t\t\t00110010101110100001000000111001101101111011011010110010<br>\n\t\t\t\t10110111101101110011001010010000001100001011000110110001<br>\n\t\t\t\t10110010101110011011100110010000001101001011101000010111<br>\n\t\t\t\t00010000001001101011000010110101101100101001000000111001<br>\n\t\t\t\t10111010101110010011001010010000001101110011011110010000<br>\n\t\t\t\t00110100001110101011011010110000101101110011100110010000<br>\n\t\t\t\t00110010101101110011101000110010101110010001000000111010<br>\n\t\t\t\t00110100001100101001000000111001001101111011011110110110<br>\n\t\t\t\t10010000001100100011101010111001001101001011011100110011<br>\n\t\t\t\t10010000001110100011010000110000101110100001000000111010<br>\n\t\t\t\t001101001011011010110010100101110";
		}
	} else if (this.screen === 3) {
		dat += fmt("<center><A href='?src=＃;back=1'>Back</a> - <A href='?src=＃;Reset=1'>Reset</a></center><hr>", [this, this]);
		dat += fmt("<table border='1' width='100%'>\n\t\t\t\t\t<tr><td width='20%'><A href='?src=＃;select=Sender'>Sender</a></td>\n\t\t\t\t\t<td width='20%'><A href='?src=＃;select=RecJob'>Sender's Job</a></td>\n\t\t\t\t\t<td width='20%'><A href='?src=＃;select=Recepient'>Recipient</a></td>\n\t\t\t\t\t<td width='300px' word-wrap: break-word><A href='?src=＃;select=Message'>Message</a></td></tr>", [this, this, this, this]);
		$0 = this.customsender;
		$1 = this.customjob;
		if (this.customrecepient) {
			$2 = this.customrecepient.owner;
		} else {

			$2 = "NONE";
		}
		dat += `<tr><td width='20%'>${$0}</td>\n\t\t\t<td width='20%'>${$1}</td>\n\t\t\t<td width='20%'>${$2}</td>\n\t\t\t<td width='300px'>${this.custommessage}</td></tr>`;
		dat += fmt("</table><br><center><A href='?src=＃;select=Send'>Send</a>", [this]);
	} else if (this.screen === 4) {
		index = 0;
		dat += fmt("<center><A href='?src=＃;back=1'>Back</a> - <A href='?src=＃;refresh=1'>Refresh</center><hr>", [this, this]);
		dat += "<table border='1' width='100%'><tr><th width = '5%'>X</th><th width='15%'>Sending Dep.</th><th width='15%'>Receiving Dep.</th>\n\t\t\t<th width='300px' word-wrap: break-word>Message</th><th width='15%'>Stamp</th><th width='15%'>ID Auth.</th><th width='15%'>Priority.</th></tr>";
		for (rc of each(this.linkedServer.rc_msgs, T("/datum/data_rc_msg"))) {
			index++;
			if (index > 3000) {
				break;
			}
			dat += fmt("<tr><td width = '5%'><center><A href='?src=＃;deleter=＃' style='color: rgb(255,0,0)'>X</a></center></td><td width='15%'>＀</td>\n\t\t\t\t<td width='15%'>＀</td><td width='300px'>＀</td><td width='15%'>＀</td><td width='15%'>＀</td><td width='15%'>＀</td></tr>", [this, rc, rc.send_dpt, rc.rec_dpt, rt.fv(f, "message", rc), rc.stamp, rc.id_auth, rc.priority]);
		}
		dat += "</table>";
	}
	rt.setSv(f, "message", this.defaultmsg);
	(popup = (yield* new_(T("/datum/browser"), user, "hologram_console", this.name, 700, 700))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// message.dm:229
rt.def("/obj/machinery/computer/message_monitor/proc/BruteForce", function BruteForce(f: Frame, user: Value) {
	let currentKey: Value = null;
	if (this.linkedServer === null) {
		to_chat(user, "<span class='warning'>Could not complete brute-force: Linked Server Disconnected!</span>");
	} else {
		currentKey = this.linkedServer.decryptkey;
		to_chat(user, `<span class='warning'>Brute-force completed! The key is '${currentKey}'.</span>`);
	}
	this.hacking = 0;
	this.screen = 0;
	return f.dot;
});

// message.dm:238
rt.def("/obj/machinery/computer/message_monitor/proc/UnmagConsole", function UnmagConsole(f: Frame) {
	this.emagged = 0;
	return f.dot;
});

// message.dm:241
rt.def("/obj/machinery/computer/message_monitor/proc/ResetMessage", function ResetMessage(f: Frame) {
	this.customsender = "System Administrator";
	this.customrecepient = null;
	this.custommessage = "This is a test, please ignore.";
	this.customjob = "Admin";
	return f.dot;
});

// message.dm:247
rt.def("/obj/machinery/computer/message_monitor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let dkey: Value = null, newkey: Value = null, sendPDAs: Value = null, PDARec: Value = null, _P: Value = null, H: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (f.usr.contents.Find(this) || get_dist(this, f.usr) <= 1 && isturf(this.loc) || rt.istype(f.usr, T("/mob/living/silicon"))) {
		if (rt.at(href_list, "auth")) {
			if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				this.auth = 0;
				this.screen = 0;
			} else if ((dkey = trim((yield* g.op(f, "Prompt", [3], [null, null, "Please enter the decryption key.", f.usr, null])))) && dkey != "") {
				if (this.linkedServer.decryptkey == dkey) {
					this.auth = 1;
				} else {
					rt.setSv(f, "message", this.incorrectkey);
				}
			}
		}
		if (rt.at(href_list, "active")) {
			if (this.auth) {
				this.linkedServer.active = (!this.linkedServer.active ? 1 : 0);
			}
		}
		if (rt.at(href_list, "find")) {
			if (GLOB.message_servers && rt.len(f, GLOB.message_servers) > 1) {
				this.linkedServer = (yield* g.op(f, "Prompt", [1], [null, "Select a server.", "Please select a server.", f.usr, GLOB.message_servers]));
				rt.setSv(f, "message", "<span class='alert'>NOTICE: Server selected.</span>");
			} else if (GLOB.message_servers && rt.len(f, GLOB.message_servers) > 0) {
				this.linkedServer = rt.index(GLOB.message_servers, 1);
				rt.setSv(f, "message", "<span class='notice'>NOTICE: Only Single Server Detected - Server selected.</span>");
			} else {
				rt.setSv(f, "message", this.noserver);
			}
		}
		if (rt.at(href_list, "view")) {
			if (this.linkedServer === null || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				this.screen = 1;
			}
		}
		if (rt.at(href_list, "clear")) {
			if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				this.linkedServer.pda_msgs = list();
				rt.setSv(f, "message", "<span class='notice'>NOTICE: Logs cleared.</span>");
			}
		}
		if (rt.at(href_list, "clearr")) {
			if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				this.linkedServer.rc_msgs = list();
				rt.setSv(f, "message", "<span class='notice'>NOTICE: Logs cleared.</span>");
			}
		}
		if (rt.at(href_list, "pass")) {
			if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				if ((dkey = trim((yield* g.op(f, "Prompt", [3], [null, null, "Please enter the decryption key.", f.usr, null])))) && dkey != "") {
					if (this.linkedServer.decryptkey == dkey) {
						if (rt.length((newkey = trim((yield* g.op(f, "Prompt", [2], [null, null, "Please enter the new key (3 - 16 characters max):", f.usr, null]))))) <= 3) {
							rt.setSv(f, "message", "<span class='notice'>NOTICE: Decryption key too short!</span>");
						} else if (rt.length(newkey) > 16) {
							rt.setSv(f, "message", "<span class='notice'>NOTICE: Decryption key too long!</span>");
						} else if (newkey && newkey != "") {
							this.linkedServer.decryptkey = newkey;
						}
						rt.setSv(f, "message", "<span class='notice'>NOTICE: Decryption key set.</span>");
					} else {
						rt.setSv(f, "message", this.incorrectkey);
					}
				}
			}
		}
		if (rt.at(href_list, "hack")) {
			if (rt.istype(f.usr, T("/mob/living/silicon")) && is_special_character(f.usr)) {
				this.hacking = 1;
				this.screen = 2;
				rt.spawnTail(f, 100 * rt.length(this.linkedServer.decryptkey), "/obj/machinery/computer/message_monitor/proc/Topic: spawn at game/machinery/computer/message.dm:331", dkey, newkey, sendPDAs, PDARec, _P, H);
			}
		}
		if (rt.at(href_list, "delete")) {
			if (this.screen == 1) {
				if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
					rt.setSv(f, "message", this.noserver);
				} else {
					this.linkedServer.pda_msgs -= rt.locateIn(f, rt.at(href_list, "delete"), rt.world());
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Log Deleted!</span>");
				}
			}
		}
		if (rt.at(href_list, "deleter")) {
			if (this.screen == 4) {
				if (!this.linkedServer || rt.bitAnd(this.linkedServer.stat, 3)) {
					rt.setSv(f, "message", this.noserver);
				} else {
					this.linkedServer.rc_msgs -= rt.locateIn(f, rt.at(href_list, "deleter"), rt.world());
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Log Deleted!</span>");
				}
			}
		}
		if (rt.at(href_list, "msg")) {
			if (this.linkedServer === null || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				this.screen = 3;
			}
		}
		if (rt.at(href_list, "select")) {
			if (this.linkedServer === null || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
				this.screen = 0;
			} else {
				const item = rt.at(href_list, "select");
				if (item === "Reset") {
					this.ResetMessage();
				} else if (item === "Sender") {
					this.customsender = (yield* stripped_input(f.usr, "Please enter the sender's name."));
				} else if (item === "Recepient") {
					sendPDAs = get_viewable_pdas();
					if (GLOB.PDAs && rt.len(f, GLOB.PDAs) > 0) {
						this.customrecepient = (yield* g.op(f, "Prompt", [1], [null, null, "Select a PDA from the list.", f.usr, (yield* sortNames(sendPDAs))]));
					} else {
						this.customrecepient = null;
					}
				} else if (item === "RecJob") {
					this.customjob = (yield* stripped_input(f.usr, "Please enter the sender's job."));
				} else if (item === "Message") {
					this.custommessage = (yield* stripped_input(f.usr, "Please enter your message."));
				} else if (item === "Send") {
					if (this.customsender === null || this.customsender == "") {
						this.customsender = "UNKNOWN";
					}
					if (this.customrecepient === null) {
						rt.setSv(f, "message", "<span class='notice'>NOTICE: No recepient selected!</span>");
						return (yield* this.attack_hand(f.usr));
					}
					if (this.custommessage === null || this.custommessage == "") {
						rt.setSv(f, "message", "<span class='notice'>NOTICE: No message entered!</span>");
						return (yield* this.attack_hand(f.usr));
					}
					for (_P of each(get_viewable_pdas(), T("/obj/item/device/pda"))) {
						if (_P.owner == this.customsender) {
							PDARec = _P;
						}
					}
					if (PDARec === null) {
						this.linkedServer.send_pda_message(`${this.customrecepient.owner}`, `${this.customsender}`, `${this.custommessage}`);
						this.customrecepient.tnote += fmt("<i><b>&larr; From <a href='byond://?src=＃;choice=Message;target=＃'>＀</a> (＀):</b></i><br>＀<br>", [this.customrecepient, this, this.customsender, this.customjob, this.custommessage]);
						this.customrecepient.log_message(0, null, `${this.customsender} (${this.customjob})`, this.custommessage, "");
						if (!this.customrecepient.silent) {
							playsound(this.customrecepient.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
							this.customrecepient.audible_message(`${bicon(this.customrecepient)} *${this.customrecepient.ttone}*`, null, 3);
							if (this.customrecepient.loc && rt.istype(this.customrecepient.loc, T("/mob/living/carbon/human"))) {
								to_chat((H = this.customrecepient.loc), fmt("＀ <b>Message from ＀ (＀), </b>\"＀\" (<a href='byond://?src=＃;choice=Message;skiprefresh=1;target=＃'>Reply</a>)", [bicon(this.customrecepient), this.customsender, this.customjob, this.custommessage, this, this]));
							}
							log_pda(`${f.usr}/(${f.usr.ckey}) (PDA: ${this.customsender}) sent "${this.custommessage}" to ${this.customrecepient.owner}`);
							this.customrecepient.cut_overlays();
							this.customrecepient.add_overlay(mutable_appearance(rt.rsc("icons/obj/pda.dmi"), "pda-r"));
						}
					} else {
						this.linkedServer.send_pda_message(`${this.customrecepient.owner}`, `${PDARec.owner}`, `${this.custommessage}`);
						this.customrecepient.tnote += fmt("<i><b>&larr; From <a href='byond://?src=＃;choice=Message;target=＃'>＀</a> (＀):</b></i><br>＀<br>", [this.customrecepient, PDARec, PDARec.owner, this.customjob, this.custommessage]);
						this.customrecepient.log_message(0, PDARec, `${PDARec.owner} (${this.customjob})`, this.custommessage, "");
						if (!this.customrecepient.silent) {
							playsound(this.customrecepient.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
							this.customrecepient.audible_message(`${bicon(this.customrecepient)} *${this.customrecepient.ttone}*`, null, 3);
							if (this.customrecepient.loc && rt.istype(this.customrecepient.loc, T("/mob/living/carbon/human"))) {
								to_chat((H = this.customrecepient.loc), fmt("＀ <b>Message from ＀ (＀), </b>\"＀\" (<a href='byond://?src=＃;choice=Message;skiprefresh=1;target=＃'>Reply</a>)", [bicon(this.customrecepient), PDARec.owner, this.customjob, this.custommessage, this.customrecepient, PDARec]));
							}
							log_pda(`${f.usr}/(${f.usr.ckey}) (PDA: ${PDARec.owner}) sent "${this.custommessage}" to ${this.customrecepient.owner}`);
							this.customrecepient.cut_overlays();
							this.customrecepient.add_overlay(mutable_appearance(rt.rsc("icons/obj/pda.dmi"), "pda-r"));
						}
					}
					this.ResetMessage();
				}
			}
		}
		if (rt.at(href_list, "viewr")) {
			if (this.linkedServer === null || rt.bitAnd(this.linkedServer.stat, 3)) {
				rt.setSv(f, "message", this.noserver);
			} else if (this.auth) {
				this.screen = 4;
			}
		}
		if (rt.at(href_list, "back")) {
			this.screen = 0;
		}
	}
	return (yield* this.attack_hand(f.usr));
}, true);

// a spawn(multiply(100, rt.length(rt.getI(f, rt.fieldI(f, live(f.src), $ic[154]), $ic[155])))) body of /obj/machinery/computer/message_monitor/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/message_monitor/proc/Topic: spawn at game/machinery/computer/message.dm:331", function* (f: Frame, dkey: Value, newkey: Value, sendPDAs: Value, PDARec: Value, _P: Value, H: Value) {
	if (this && this.linkedServer && f.usr) {
		this.BruteForce(f.usr);
	}
	return null;
});

rt.type(6579, "/obj/item/weapon/paper/monitorkey", "/obj/item/weapon/paper", {
	server: null,
	name: "monitor decryption key",
});

// message.dm:459
rt.def("/obj/item/weapon/paper/monitorkey/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// message.dm:464
rt.def("/obj/item/weapon/paper/monitorkey/proc/LateInitialize", function LateInitialize(f: Frame) {
	let server: Value = null;
	if (!GLOB.message_servers) return f.dot;
	for (server of each(GLOB.message_servers, T("/obj/machinery/message_server"))) {
		if (server !== null) {
			if (server.decryptkey !== null) {
				this.info = `<center><h2>Daily Key Reset</h2></center><br>The new message monitor key is '${server.decryptkey}'.<br>Please keep this a secret and away from the clown.<br>If necessary, change the password to a more secure one.`;
				this.info_links = this.info;
				this.add_overlay("paper_words");
				break;
			}
		}
	}
	return f.dot;
});
