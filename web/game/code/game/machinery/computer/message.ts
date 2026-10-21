// From code/game/machinery/computer/message.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/message_monitor/proc/<init>  (code/game/machinery/computer/message.dm:15)
rt.def("/obj/machinery/computer/message_monitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spark_system", rt.new_(f, T("/datum/effect_system/spark_spread"), []));
	return f.dot;
});

// /obj/machinery/computer/message_monitor/proc/attackby  (code/game/machinery/computer/message.dm:36)  may sleep
rt.def("/obj/machinery/computer/message_monitor/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "emagged")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It is too hot to mess with!</span>"]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/computer/message_monitor/proc/emag_act  (code/game/machinery/computer/message.dm:43)  may sleep
rt.def("/obj/machinery/computer/message_monitor/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	let MK: Value = null, time: Value = null;
	f.vars = () => [user, MK, time];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	if (rt.fv(f, "linkedServer", live(f.src)) !== null) {
		rt.setSv(f, "emagged", 1);
		rt.setSv(f, "screen", 2);
		yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
		yield* g.callName(f, rt.fv(f, "spark_system", live(f.src)), "start", []);
		rt.setFv(f, "loc", (MK = (yield* g.new_(f, T("/obj/item/weapon/paper/monitorkey"), []))), rt.fv(f, "loc", live(f.src)));
		rt.modField(f, live(MK), "info", "<br><br><font color='red'>�%@%(*$%&(�&?*(%&�/{}</font>", add);
		time = multiply(100, rt.length(rt.gv(f, "decryptkey", rt.fv(f, "linkedServer", live(f.src)))));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/computer/message_monitor/proc/UnmagConsole")])), live(time)]);
		rt.setSv(f, "message", rt.sv(f, "rebootmsg"));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>A no server error appears on the screen.</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/computer/message_monitor/proc/Initialize  (code/game/machinery/computer/message.dm:60)  may sleep
rt.def("/obj/machinery/computer/message_monitor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "linkedServer"))) return f.dot;
	if (!(truthy(rt.gl("message_servers")) && rt.gt(rt.len(f, rt.gl("message_servers")), 0))) return f.dot;
	rt.setSv(f, "linkedServer", rt.index(rt.gl("message_servers"), 1));
	return f.dot;
}, true);

// /obj/machinery/computer/message_monitor/proc/attack_hand  (code/game/machinery/computer/message.dm:67)  may sleep
rt.def("/obj/machinery/computer/message_monitor/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, i: Value = null, n: Value = null, index: Value = null, pda: Value = null, rc: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [dat, i, n, index, pda, rc, popup, $0, $1, $2, $3, $4, $5, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "hacking")) || truthy(rt.sv(f, "emagged")))) {
		rt.setSv(f, "message", rt.sv(f, "rebootmsg"));
	}
	dat = fmt("<center><font color='blue'＀</font>/</center>", [rt.sv(f, "message")]);
	if (truthy(rt.sv(f, "auth"))) {
		dat = rt.modify(live(dat), fmt("<h4><dd><A href='?src=＃;auth=1'>&#09;<font color='green'>[Authenticated]</font></a>&#09;/", [live(f.src)]), add);
		$0 = live(f.src);
		if ((truthy(rt.fv(f, "linkedServer", live(f.src))) && truthy(rt.gv(f, "active", rt.fv(f, "linkedServer", live(f.src)))))) {
			$1 = "<font color='green'>[On]</font>";
		} else {
			$1 = "<font color='red'>[Off]</font>";
		}
		dat = rt.modify(live(dat), fmt(" Server Power: <A href='?src=＃;active=1'>＀</a></h4>", [$0, $1]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<h4><dd><A href='?src=＃;auth=1'>&#09;<font color='red'>[Unauthenticated]</font></a>&#09;/", [live(f.src)]), add);
		if ((truthy(rt.fv(f, "linkedServer", live(f.src))) && truthy(rt.gv(f, "active", rt.fv(f, "linkedServer", live(f.src)))))) {
			$0 = "<font color='green'>[On]</font>";
		} else {
			$0 = "<font color='red'>[Off]</font>";
		}
		dat = rt.modify(live(dat), fmt(" Server Power: <u>＀</u></h4>", [$0]), add);
	}
	if ((truthy(rt.sv(f, "hacking")) || truthy(rt.sv(f, "emagged")))) {
		rt.setSv(f, "screen", 2);
	} else {
		if (((!truthy(rt.sv(f, "auth")) || !truthy(rt.sv(f, "linkedServer"))) || truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "linkedServer")), 3)))) {
			if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "linkedServer")), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			}
			rt.setSv(f, "screen", 0);
		}
	}
	$0 = rt.sv(f, "screen");
	if ($0 === 0) {
		i = 0;
		dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;find=1'>&#09;＀. Link To A Server</a></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
		if (truthy(rt.sv(f, "auth"))) {
			if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "linkedServer")), 3)))) {
				dat = rt.modify(live(dat), "<dd><A>&#09;ERROR: Server not found!</A><br></dd>", add);
			} else {
				dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;view=1'>&#09;＀. View Message Logs </a><br></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
				dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;viewr=1'>&#09;＀. View Request Console Logs </a></br></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
				dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;clear=1'>&#09;＀. Clear Message Logs</a><br></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
				dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;clearr=1'>&#09;＀. Clear Request Console Logs</a><br></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
				dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;pass=1'>&#09;＀. Set Custom Key</a><br></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
				dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;msg=1'>&#09;＀. Send Admin Message</a><br></dd>", [live(f.src), (i = rt.inc(live(i), 1))]), add);
			}
		} else {
			n = null;
			n = (i = rt.inc(live(i), 1));
			while (rt.le(live(n), rt.sv(f, "optioncount"))) {
				dat = rt.modify(live(dat), fmt("<dd><font color='blue'>&#09;＀. ---------------</font><br></dd>", [live(n)]), add);
				n = rt.inc(live(n), 1);
			}
		}
		if ((truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.usr)]))))) {
			dat = rt.modify(live(dat), fmt("<dd><A href='?src=＃;hack=1'><i><font color='Red'>*&@#. Bruteforce Key</font></i></font></a><br></dd>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<br>", add);
		}
		if (!truthy(rt.sv(f, "auth"))) {
			dat = rt.modify(live(dat), "<br><hr><dd><span class='notice'>Please authenticate with the server in order to show additional options.</span>", add);
		} else {
			dat = rt.modify(live(dat), "<br><hr><dd><span class='warning'>Reg, #514 forbids sending messages to a Head of Staff containing Erotic Rendering Properties.</span>", add);
		}
	} else if ($0 === 1) {
		index = 0;
		dat = rt.modify(live(dat), fmt("<center><A href='?src=＃;back=1'>Back</a> - <A href='?src=＃;refresh=1'>Refresh</center><hr>", [live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), "<table border='1' width='100%'><tr><th width = '5%'>X</th><th width='15%'>Sender</th><th width='15%'>Recipient</th><th width='300px' word-wrap: break-word>Message</th></tr>", add);
		pda = null;
		rt.forList(f, 0, rt.gv(f, "pda_msgs", rt.fv(f, "linkedServer", live(f.src))), T("/datum/data_pda_msg"));
		while (($e = rt.next(f, 0)) !== undefined) {
			pda = $e;
			index = rt.inc(live(index), 1);
			if (rt.gt(live(index), 3000)) {
				break;
			}
			$0 = live(f.src);
			$1 = live(pda);
			$2 = rt.fv(f, "sender", live(pda));
			$3 = rt.fv(f, "recipient", live(pda));
			$4 = rt.fv(f, "message", live(pda));
			if (truthy(rt.fv(f, "photo", live(pda)))) {
				$5 = fmt("<a href='byond://?src=＃;photo=1'>(Photo)</a>", [live(pda)]);
			} else {
				$5 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr><td width = '5%'><center><A href='?src=＃;delete=＃' style='color: rgb(255,0,0)'>X</a></center></td><td width='15%'>＀</td><td width='15%'>＀</td><td width='300px'>＀＀</td></tr>", [$0, $1, $2, $3, $4, $5]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table>", add);
	} else if ($0 === 2) {
		if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/ai")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
			dat = rt.modify(live(dat), "Brute-forcing for server key.<br> It will take 20 seconds for every character that the password has.", add);
			dat = rt.modify(live(dat), "In the meantime, this console can reveal your true intentions if you let someone access it. Make sure no humans enter the room during that time.", add);
		} else {
			dat = rt.modify(live(dat), "01000010011100100111010101110100011001010010110<br>\n\t\t\t\t10110011001101111011100100110001101101001011011100110011<br>\n\t\t\t\t10010000001100110011011110111001000100000011100110110010<br>\n\t\t\t\t10111001001110110011001010111001000100000011010110110010<br>\n\t\t\t\t10111100100101110001000000100100101110100001000000111011<br>\n\t\t\t\t10110100101101100011011000010000001110100011000010110101<br>\n\t\t\t\t10110010100100000001100100011000000100000011100110110010<br>\n\t\t\t\t10110001101101111011011100110010001110011001000000110011<br>\n\t\t\t\t00110111101110010001000000110010101110110011001010111001<br>\n\t\t\t\t00111100100100000011000110110100001100001011100100110000<br>\n\t\t\t\t10110001101110100011001010111001000100000011101000110100<br>\n\t\t\t\t00110000101110100001000000111010001101000011001010010000<br>\n\t\t\t\t00111000001100001011100110111001101110111011011110111001<br>\n\t\t\t\t00110010000100000011010000110000101110011001011100010000<br>\n\t\t\t\t00100100101101110001000000111010001101000011001010010000<br>\n\t\t\t\t00110110101100101011000010110111001110100011010010110110<br>\n\t\t\t\t10110010100101100001000000111010001101000011010010111001<br>\n\t\t\t\t10010000001100011011011110110111001110011011011110110110<br>\n\t\t\t\t00110010100100000011000110110000101101110001000000111001<br>\n\t\t\t\t00110010101110110011001010110000101101100001000000111100<br>\n\t\t\t\t10110111101110101011100100010000001110100011100100111010<br>\n\t\t\t\t10110010100100000011010010110111001110100011001010110111<br>\n\t\t\t\t00111010001101001011011110110111001110011001000000110100<br>\n\t\t\t\t10110011000100000011110010110111101110101001000000110110<br>\n\t\t\t\t00110010101110100001000000111001101101111011011010110010<br>\n\t\t\t\t10110111101101110011001010010000001100001011000110110001<br>\n\t\t\t\t10110010101110011011100110010000001101001011101000010111<br>\n\t\t\t\t00010000001001101011000010110101101100101001000000111001<br>\n\t\t\t\t10111010101110010011001010010000001101110011011110010000<br>\n\t\t\t\t00110100001110101011011010110000101101110011100110010000<br>\n\t\t\t\t00110010101101110011101000110010101110010001000000111010<br>\n\t\t\t\t00110100001100101001000000111001001101111011011110110110<br>\n\t\t\t\t10010000001100100011101010111001001101001011011100110011<br>\n\t\t\t\t10010000001110100011010000110000101110100001000000111010<br>\n\t\t\t\t001101001011011010110010100101110", add);
		}
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), fmt("<center><A href='?src=＃;back=1'>Back</a> - <A href='?src=＃;Reset=1'>Reset</a></center><hr>", [live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<table border='1' width='100%'>\n\t\t\t\t\t<tr><td width='20%'><A href='?src=＃;select=Sender'>Sender</a></td>\n\t\t\t\t\t<td width='20%'><A href='?src=＃;select=RecJob'>Sender's Job</a></td>\n\t\t\t\t\t<td width='20%'><A href='?src=＃;select=Recepient'>Recipient</a></td>\n\t\t\t\t\t<td width='300px' word-wrap: break-word><A href='?src=＃;select=Message'>Message</a></td></tr>", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
		$0 = rt.sv(f, "customsender");
		$1 = rt.sv(f, "customjob");
		if (truthy(rt.sv(f, "customrecepient"))) {
			$2 = rt.fv(f, "owner", rt.sv(f, "customrecepient"));
		} else {
			$1 = $1;
			$2 = "NONE";
		}
		dat = rt.modify(live(dat), fmt("<tr><td width='20%'>＀</td>\n\t\t\t<td width='20%'>＀</td>\n\t\t\t<td width='20%'>＀</td>\n\t\t\t<td width='300px'>＀</td></tr>", [$0, $1, $2, rt.sv(f, "custommessage")]), add);
		dat = rt.modify(live(dat), fmt("</table><br><center><A href='?src=＃;select=Send'>Send</a>", [live(f.src)]), add);
	} else if ($0 === 4) {
		index = 0;
		dat = rt.modify(live(dat), fmt("<center><A href='?src=＃;back=1'>Back</a> - <A href='?src=＃;refresh=1'>Refresh</center><hr>", [live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), "<table border='1' width='100%'><tr><th width = '5%'>X</th><th width='15%'>Sending Dep.</th><th width='15%'>Receiving Dep.</th>\n\t\t\t<th width='300px' word-wrap: break-word>Message</th><th width='15%'>Stamp</th><th width='15%'>ID Auth.</th><th width='15%'>Priority.</th></tr>", add);
		rc = null;
		rt.forList(f, 0, rt.gv(f, "rc_msgs", rt.fv(f, "linkedServer", live(f.src))), T("/datum/data_rc_msg"));
		while (($e = rt.next(f, 0)) !== undefined) {
			rc = $e;
			index = rt.inc(live(index), 1);
			if (rt.gt(live(index), 3000)) {
				break;
			}
			dat = rt.modify(live(dat), fmt("<tr><td width = '5%'><center><A href='?src=＃;deleter=＃' style='color: rgb(255,0,0)'>X</a></center></td><td width='15%'>＀</td>\n\t\t\t\t<td width='15%'>＀</td><td width='300px'>＀</td><td width='15%'>＀</td><td width='15%'>＀</td><td width='15%'>＀</td></tr>", [live(f.src), live(rc), rt.fv(f, "send_dpt", live(rc)), rt.fv(f, "rec_dpt", live(rc)), rt.fv(f, "message", live(rc)), rt.fv(f, "stamp", live(rc)), rt.fv(f, "id_auth", live(rc)), rt.fv(f, "priority", live(rc))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</table>", add);
	}
	rt.setSv(f, "message", rt.sv(f, "defaultmsg"));
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "hologram_console", rt.sv(f, "name"), 700, 700]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/message_monitor/proc/BruteForce  (code/game/machinery/computer/message.dm:229)
rt.def("/obj/machinery/computer/message_monitor/proc/BruteForce", function BruteForce(f: Frame, user: Value) {
	let currentKey: Value = null;
	f.vars = () => [currentKey];
	if (rt.sv(f, "linkedServer") === null) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Could not complete brute-force: Linked Server Disconnected!</span>"]);
	} else {
		currentKey = rt.gv(f, "decryptkey", rt.fv(f, "linkedServer", live(f.src)));
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Brute-force completed! The key is '＀'.</span>", [live(currentKey)])]);
	}
	rt.setFv(f, "hacking", live(f.src), 0);
	rt.setFv(f, "screen", live(f.src), 0);
	return f.dot;
});

// /obj/machinery/computer/message_monitor/proc/UnmagConsole  (code/game/machinery/computer/message.dm:238)
rt.def("/obj/machinery/computer/message_monitor/proc/UnmagConsole", function UnmagConsole(f: Frame) {
	rt.setFv(f, "emagged", live(f.src), 0);
	return f.dot;
});

// /obj/machinery/computer/message_monitor/proc/ResetMessage  (code/game/machinery/computer/message.dm:241)
rt.def("/obj/machinery/computer/message_monitor/proc/ResetMessage", function ResetMessage(f: Frame) {
	rt.setSv(f, "customsender", "System Administrator");
	rt.setSv(f, "customrecepient", null);
	rt.setSv(f, "custommessage", "This is a test, please ignore.");
	rt.setSv(f, "customjob", "Admin");
	return f.dot;
});

// /obj/machinery/computer/message_monitor/proc/Topic  (code/game/machinery/computer/message.dm:247)  may sleep
rt.def("/obj/machinery/computer/message_monitor/proc/Topic", function* Topic(f: Frame) {
	let dkey: Value = null, newkey: Value = null, sendPDAs: Value = null, PDARec: Value = null, _P: Value = null, H: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dkey, newkey, sendPDAs, PDARec, _P, H, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)))) {
		if (truthy(rt.at(live(f.args[1]), "auth"))) {
			if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "linkedServer")), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					rt.setSv(f, "auth", 0);
					rt.setSv(f, "screen", 0);
				} else {
					if ((truthy((dkey = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.op(f, "Prompt", [3], [null, null, "Please enter the decryption key.", live(f.usr), null]))])))) && !isEqual(live(dkey), ""))) {
						if (isEqual(rt.gv(f, "decryptkey", rt.fv(f, "linkedServer", live(f.src))), live(dkey))) {
							rt.setSv(f, "auth", 1);
						} else {
							rt.setSv(f, "message", rt.sv(f, "incorrectkey"));
						}
					}
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "active"))) {
			if (truthy(rt.sv(f, "auth"))) {
				rt.setFv(f, "active", rt.sv(f, "linkedServer"), (!truthy(rt.fv(f, "active", rt.sv(f, "linkedServer"))) ? 1 : 0));
			}
		}
		if (truthy(rt.at(live(f.args[1]), "find"))) {
			if ((truthy(rt.gl("message_servers")) && rt.gt(rt.len(f, rt.gl("message_servers")), 1))) {
				rt.setFv(f, "linkedServer", live(f.src), (yield* g.op(f, "Prompt", [1], [null, "Select a server.", "Please select a server.", live(f.usr), rt.gl("message_servers")])));
				rt.setSv(f, "message", "<span class='alert'>NOTICE: Server selected.</span>");
			} else {
				if ((truthy(rt.gl("message_servers")) && rt.gt(rt.len(f, rt.gl("message_servers")), 0))) {
					rt.setSv(f, "linkedServer", rt.index(rt.gl("message_servers"), 1));
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Only Single Server Detected - Server selected.</span>");
				} else {
					rt.setSv(f, "message", rt.sv(f, "noserver"));
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "view"))) {
			if ((rt.fv(f, "linkedServer", live(f.src)) === null || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					rt.setFv(f, "screen", live(f.src), 1);
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "clear"))) {
			if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					rt.setFv(f, "pda_msgs", rt.fv(f, "linkedServer", live(f.src)), rt.list());
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Logs cleared.</span>");
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "clearr"))) {
			if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					rt.setFv(f, "rc_msgs", rt.fv(f, "linkedServer", live(f.src)), rt.list());
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Logs cleared.</span>");
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "pass"))) {
			if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					if ((truthy((dkey = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.op(f, "Prompt", [3], [null, null, "Please enter the decryption key.", live(f.usr), null]))])))) && !isEqual(live(dkey), ""))) {
						if (isEqual(rt.gv(f, "decryptkey", rt.fv(f, "linkedServer", live(f.src))), live(dkey))) {
							if (rt.le(rt.length((newkey = (yield* g.call(f, P("/proc/trim"), null, [(yield* g.op(f, "Prompt", [2], [null, null, "Please enter the new key (3 - 16 characters max):", live(f.usr), null]))])))), 3)) {
								rt.setSv(f, "message", "<span class='notice'>NOTICE: Decryption key too short!</span>");
							} else {
								if (rt.gt(rt.length(live(newkey)), 16)) {
									rt.setSv(f, "message", "<span class='notice'>NOTICE: Decryption key too long!</span>");
								} else {
									if ((truthy(live(newkey)) && !isEqual(live(newkey), ""))) {
										rt.setFv(f, "decryptkey", rt.fv(f, "linkedServer", live(f.src)), live(newkey));
									}
								}
							}
							rt.setSv(f, "message", "<span class='notice'>NOTICE: Decryption key set.</span>");
						} else {
							rt.setSv(f, "message", rt.sv(f, "incorrectkey"));
						}
					}
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "hack"))) {
			if ((truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(f.usr)]))))) {
				rt.setFv(f, "hacking", live(f.src), 1);
				rt.setFv(f, "screen", live(f.src), 2);
				rt.spawnTail(f, multiply(100, rt.length(rt.gv(f, "decryptkey", rt.fv(f, "linkedServer", live(f.src))))), "/obj/machinery/computer/message_monitor/proc/Topic: spawn at game/machinery/computer/message.dm:331", dkey, newkey, sendPDAs, PDARec, _P, H);
			}
		}
		if (truthy(rt.at(live(f.args[1]), "delete"))) {
			if (isEqual(rt.sv(f, "screen"), 1)) {
				if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
					rt.setSv(f, "message", rt.sv(f, "noserver"));
				} else {
					(rt.modField(f, rt.fv(f, "linkedServer", live(f.src)), "pda_msgs", rt.locateIn(f, rt.at(live(f.args[1]), "delete"), rt.world()), subtract));
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Log Deleted!</span>");
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "deleter"))) {
			if (isEqual(rt.sv(f, "screen"), 4)) {
				if ((!truthy(rt.sv(f, "linkedServer")) || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
					rt.setSv(f, "message", rt.sv(f, "noserver"));
				} else {
					(rt.modField(f, rt.fv(f, "linkedServer", live(f.src)), "rc_msgs", rt.locateIn(f, rt.at(live(f.args[1]), "deleter"), rt.world()), subtract));
					rt.setSv(f, "message", "<span class='notice'>NOTICE: Log Deleted!</span>");
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "msg"))) {
			if ((rt.fv(f, "linkedServer", live(f.src)) === null || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					rt.setFv(f, "screen", live(f.src), 3);
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "select"))) {
			if ((rt.fv(f, "linkedServer", live(f.src)) === null || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
				rt.setSv(f, "screen", 0);
			} else {
				$0 = rt.at(live(f.args[1]), "select");
				if ($0 === "Reset") {
					yield* g.srcCall(f, "ResetMessage");
				} else if ($0 === "Sender") {
					rt.setSv(f, "customsender", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter the sender's name."])));
				} else if ($0 === "Recepient") {
					sendPDAs = (yield* g.call(f, P("/proc/get_viewable_pdas"), null, []));
					if ((truthy(rt.gl("PDAs")) && rt.gt(rt.len(f, rt.gl("PDAs")), 0))) {
						rt.setSv(f, "customrecepient", (yield* g.op(f, "Prompt", [1], [null, null, "Select a PDA from the list.", live(f.usr), (yield* g.call(f, P("/proc/sortNames"), null, [live(sendPDAs)]))])));
					} else {
						rt.setSv(f, "customrecepient", null);
					}
				} else if ($0 === "RecJob") {
					rt.setSv(f, "customjob", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter the sender's job."])));
				} else if ($0 === "Message") {
					rt.setSv(f, "custommessage", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter your message."])));
				} else if ($0 === "Send") {
					if ((rt.sv(f, "customsender") === null || isEqual(rt.sv(f, "customsender"), ""))) {
						rt.setSv(f, "customsender", "UNKNOWN");
					}
					if (rt.sv(f, "customrecepient") === null) {
						rt.setSv(f, "message", "<span class='notice'>NOTICE: No recepient selected!</span>");
						return (yield* g.callName(f, live(f.src), "attack_hand", [live(f.usr)]));
					}
					if ((rt.sv(f, "custommessage") === null || isEqual(rt.sv(f, "custommessage"), ""))) {
						rt.setSv(f, "message", "<span class='notice'>NOTICE: No message entered!</span>");
						return (yield* g.callName(f, live(f.src), "attack_hand", [live(f.usr)]));
					}
					PDARec = null;
					_P = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/get_viewable_pdas"), null, [])), T("/obj/item/device/pda"));
					while (($e = rt.next(f, 0)) !== undefined) {
						_P = $e;
						if (isEqual(rt.fv(f, "owner", live(_P)), rt.sv(f, "customsender"))) {
							PDARec = live(_P);
						}
					}
					rt.endFor(f, 0);
					if (live(PDARec) === null) {
						yield* g.callName(f, rt.fv(f, "linkedServer", live(f.src)), "send_pda_message", [fmt("＀", [rt.fv(f, "owner", rt.sv(f, "customrecepient"))]), fmt("＀", [rt.sv(f, "customsender")]), fmt("＀", [rt.sv(f, "custommessage")])]);
						rt.modField(f, rt.sv(f, "customrecepient"), "tnote", fmt("<i><b>&larr; From <a href='byond://?src=＃;choice=Message;target=＃'>＀</a> (＀):</b></i><br>＀<br>", [rt.sv(f, "customrecepient"), live(f.src), rt.sv(f, "customsender"), rt.sv(f, "customjob"), rt.sv(f, "custommessage")]), add);
						yield* g.callName(f, rt.sv(f, "customrecepient"), "log_message", [0, null, fmt("＀ (＀)", [rt.sv(f, "customsender"), rt.sv(f, "customjob")]), rt.sv(f, "custommessage"), ""]);
						if (!truthy(rt.fv(f, "silent", rt.sv(f, "customrecepient")))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", rt.sv(f, "customrecepient")), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
							yield* g.callName(f, rt.sv(f, "customrecepient"), "audible_message", [fmt("＀ *＀*", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "customrecepient")])), rt.fv(f, "ttone", rt.sv(f, "customrecepient"))]), null, 3]);
							if ((truthy(rt.fv(f, "loc", rt.sv(f, "customrecepient"))) && truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "customrecepient")), T("/mob/living/carbon/human")) ? 1 : 0)))) {
								yield* g.call(f, P("/proc/to_chat"), null, [(H = rt.fv(f, "loc", rt.sv(f, "customrecepient"))), fmt("＀ <b>Message from ＀ (＀), </b>\"＀\" (<a href='byond://?src=＃;choice=Message;skiprefresh=1;target=＃'>Reply</a>)", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "customrecepient")])), rt.sv(f, "customsender"), rt.sv(f, "customjob"), rt.sv(f, "custommessage"), live(f.src), live(f.src)])]);
							}
							yield* g.call(f, P("/proc/log_pda"), null, [fmt("＀/(＀) (PDA: ＀) sent \"＀\" to ＀", [live(f.usr), rt.fv(f, "ckey", live(f.usr)), rt.sv(f, "customsender"), rt.sv(f, "custommessage"), rt.fv(f, "owner", rt.sv(f, "customrecepient"))])]);
							yield* g.callName(f, rt.sv(f, "customrecepient"), "cut_overlays", []);
							yield* g.callName(f, rt.sv(f, "customrecepient"), "add_overlay", [(yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/pda.dmi"), "pda-r"]))]);
						}
					} else {
						yield* g.callName(f, rt.fv(f, "linkedServer", live(f.src)), "send_pda_message", [fmt("＀", [rt.fv(f, "owner", rt.sv(f, "customrecepient"))]), fmt("＀", [rt.fv(f, "owner", live(PDARec))]), fmt("＀", [rt.sv(f, "custommessage")])]);
						rt.modField(f, rt.sv(f, "customrecepient"), "tnote", fmt("<i><b>&larr; From <a href='byond://?src=＃;choice=Message;target=＃'>＀</a> (＀):</b></i><br>＀<br>", [rt.sv(f, "customrecepient"), live(PDARec), rt.fv(f, "owner", live(PDARec)), rt.sv(f, "customjob"), rt.sv(f, "custommessage")]), add);
						yield* g.callName(f, rt.sv(f, "customrecepient"), "log_message", [0, live(PDARec), fmt("＀ (＀)", [rt.fv(f, "owner", live(PDARec)), rt.sv(f, "customjob")]), rt.sv(f, "custommessage"), ""]);
						if (!truthy(rt.fv(f, "silent", rt.sv(f, "customrecepient")))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", rt.sv(f, "customrecepient")), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
							yield* g.callName(f, rt.sv(f, "customrecepient"), "audible_message", [fmt("＀ *＀*", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "customrecepient")])), rt.fv(f, "ttone", rt.sv(f, "customrecepient"))]), null, 3]);
							if ((truthy(rt.fv(f, "loc", rt.sv(f, "customrecepient"))) && truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "customrecepient")), T("/mob/living/carbon/human")) ? 1 : 0)))) {
								yield* g.call(f, P("/proc/to_chat"), null, [(H = rt.fv(f, "loc", rt.sv(f, "customrecepient"))), fmt("＀ <b>Message from ＀ (＀), </b>\"＀\" (<a href='byond://?src=＃;choice=Message;skiprefresh=1;target=＃'>Reply</a>)", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "customrecepient")])), rt.fv(f, "owner", live(PDARec)), rt.sv(f, "customjob"), rt.sv(f, "custommessage"), rt.sv(f, "customrecepient"), live(PDARec)])]);
							}
							yield* g.call(f, P("/proc/log_pda"), null, [fmt("＀/(＀) (PDA: ＀) sent \"＀\" to ＀", [live(f.usr), rt.fv(f, "ckey", live(f.usr)), rt.fv(f, "owner", live(PDARec)), rt.sv(f, "custommessage"), rt.fv(f, "owner", rt.sv(f, "customrecepient"))])]);
							yield* g.callName(f, rt.sv(f, "customrecepient"), "cut_overlays", []);
							yield* g.callName(f, rt.sv(f, "customrecepient"), "add_overlay", [(yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/pda.dmi"), "pda-r"]))]);
						}
					}
					yield* g.srcCall(f, "ResetMessage");
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "viewr"))) {
			if ((rt.fv(f, "linkedServer", live(f.src)) === null || truthy(rt.bitAnd(rt.gv(f, "stat", rt.fv(f, "linkedServer", live(f.src))), 3)))) {
				rt.setSv(f, "message", rt.sv(f, "noserver"));
			} else {
				if (truthy(rt.sv(f, "auth"))) {
					rt.setFv(f, "screen", live(f.src), 4);
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "back"))) {
			rt.setFv(f, "screen", live(f.src), 0);
		}
	}
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(f.usr)]));
}, true, { args: ["href", "href_list"] });

// a spawn(multiply(100, rt.length(rt.getI(f, rt.fieldI(f, live(f.src), $ic[154]), $ic[155])))) body of /obj/machinery/computer/message_monitor/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/message_monitor/proc/Topic: spawn at game/machinery/computer/message.dm:331", function* (f: Frame, dkey: Value, newkey: Value, sendPDAs: Value, PDARec: Value, _P: Value, H: Value) {
	f.vars = () => [dkey, newkey, sendPDAs, PDARec, _P, H];
	if (((truthy(live(f.src)) && truthy(rt.fv(f, "linkedServer", live(f.src)))) && truthy(live(f.usr)))) {
		yield* g.srcCall(f, "BruteForce", live(f.usr));
	}
	return null;
});

rt.type(6579, "/obj/item/weapon/paper/monitorkey", "/obj/item/weapon/paper", {
	server: null,
	name: "monitor decryption key",
});

// /obj/item/weapon/paper/monitorkey/proc/Initialize  (code/game/machinery/computer/message.dm:459)  may sleep
rt.def("/obj/item/weapon/paper/monitorkey/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// /obj/item/weapon/paper/monitorkey/proc/LateInitialize  (code/game/machinery/computer/message.dm:464)
rt.def("/obj/item/weapon/paper/monitorkey/proc/LateInitialize", function LateInitialize(f: Frame) {
	let server: Value = null;
	let $e: any;
	f.vars = () => [server, $e];
	if (!truthy(rt.gl("message_servers"))) return f.dot;
	server = null;
	rt.forList(f, 0, rt.gl("message_servers"), T("/obj/machinery/message_server"));
	while (($e = rt.next(f, 0)) !== undefined) {
		server = $e;
		if (live(server) !== null) {
			if (rt.fv(f, "decryptkey", live(server)) !== null) {
				rt.setSv(f, "info", fmt("<center><h2>Daily Key Reset</h2></center><br>The new message monitor key is '＀'.<br>Please keep this a secret and away from the clown.<br>If necessary, change the password to a more secure one.", [rt.fv(f, "decryptkey", live(server))]));
				rt.setSv(f, "info_links", rt.sv(f, "info"));
				rt.callSrc(f, "add_overlay", ["paper_words"]);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
