// From code/modules/mob/living/silicon/pai/software.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/pai/verb/paiInterface  (code/modules/mob/living/silicon/pai/software.dm:28)  may sleep
rt.def("/mob/living/silicon/pai/verb/paiInterface", function* paiInterface(f: Frame) {
	let dat: Value = null, left_part: Value = null, right_part: Value = null;
	let $0: any;
	f.vars = () => [dat, left_part, right_part, $0];
	dat = "";
	left_part = "";
	right_part = (yield* g.srcCall(f, "softwareMenu"));
	yield* g.callName(f, live(f.src), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "temp"))) {
		left_part = rt.sv(f, "temp");
	} else {
		if (isEqual(rt.fv(f, "stat", live(f.src)), 2)) {
			left_part = "<b><font color=red>�Rr�R �a�� ��Rr����o�</font></b>";
			right_part = "<pre>Program index hash not found</pre>";
		} else {
			$0 = rt.fv(f, "screen", live(f.src));
			if ($0 === "main") {
				left_part = "";
			} else if ($0 === "directives") {
				left_part = (yield* g.callName(f, live(f.src), "directives", []));
			} else if ($0 === "pdamessage") {
				left_part = (yield* g.callName(f, live(f.src), "pdamessage", []));
			} else if ($0 === "buy") {
				left_part = (yield* g.srcCall(f, "downloadSoftware"));
			} else if ($0 === "manifest") {
				left_part = (yield* g.callName(f, live(f.src), "softwareManifest", []));
			} else if ($0 === "medicalrecord") {
				left_part = (yield* g.callName(f, live(f.src), "softwareMedicalRecord", []));
			} else if ($0 === "securityrecord") {
				left_part = (yield* g.callName(f, live(f.src), "softwareSecurityRecord", []));
			} else if ($0 === "translator") {
				left_part = (yield* g.callName(f, live(f.src), "softwareTranslator", []));
			} else if ($0 === "atmosensor") {
				left_part = (yield* g.callName(f, live(f.src), "softwareAtmo", []));
			} else if ($0 === "securityhud") {
				left_part = (yield* g.callName(f, live(f.src), "facialRecognition", []));
			} else if ($0 === "medicalhud") {
				left_part = (yield* g.callName(f, live(f.src), "medicalAnalysis", []));
			} else if ($0 === "doorjack") {
				left_part = (yield* g.callName(f, live(f.src), "softwareDoor", []));
			} else if ($0 === "camerajack") {
				left_part = (yield* g.callName(f, live(f.src), "softwareCamera", []));
			} else if ($0 === "signaller") {
				left_part = (yield* g.callName(f, live(f.src), "softwareSignal", []));
			}
		}
	}
	dat = fmt("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n\t\t\t<html>\n\t\t\t<head>\n\t\t\t\t<style type=\"text/css\">\n\t\t\t\t\tbody { background-image:url('html/paigrid.png'); }\n\n\t\t\t\t\t#header { text-align:center; color:white; font-size: 30px; height: 35px; width: 100%; letter-spacing: 2px; z-index: 5}\n\t\t\t\t\t#content {position: relative; left: 10px; height: 400px; width: 100%; z-index: 0}\n\n\t\t\t\t\t#leftmenu {color: #AAAAAA; background-color:#333333; width: 400px; height: auto; min-height: 340px; position: absolute; z-index: 0}\n\t\t\t\t\t#leftmenu a:link { color: #CCCCCC; }\n\t\t\t\t\t#leftmenu a:hover { color: #CC3333; }\n\t\t\t\t\t#leftmenu a:visited { color: #CCCCCC; }\n\t\t\t\t\t#leftmenu a:active { color: #000000; }\n\n\t\t\t\t\t#rightmenu {color: #CCCCCC; background-color:#555555; width: 200px ; height: auto; min-height: 340px; right: 10px; position: absolute; z-index: 1}\n\t\t\t\t\t#rightmenu a:link { color: #CCCCCC; }\n\t\t\t\t\t#rightmenu a:hover { color: #CC3333; }\n\t\t\t\t\t#rightmenu a:visited { color: #CCCCCC; }\n\t\t\t\t\t#rightmenu a:active { color: #000000; }\n\n\t\t\t\t</style>\n\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t＀\n\t\t\t\t</script>\n\t\t\t</head>\n\t\t\t<body scroll=yes>\n\t\t\t\t<div id=\"header\">\n\t\t\t\t\tpAI OS\n\t\t\t\t</div>\n\t\t\t\t<div id=\"content\">\n\t\t\t\t\t<div id=\"leftmenu\">＀</div>\n\t\t\t\t\t<div id=\"rightmenu\">＀</div>\n\t\t\t\t</div>\n\t\t\t</body>\n\t\t\t</html>", ["\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", live(left_part), live(right_part)]);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=pai;size=640x480;border=0;can_close=1;can_resize=1;can_minimize=1;titlebar=1"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "pai"]);
	rt.setSv(f, "temp", null);
	return live(f.dot);
}, true, { verb: { name: "Software Interface", category: "pAI Commands" } });

// /mob/living/silicon/pai/proc/Topic  (code/modules/mob/living/silicon/pai/software.dm:118)  may sleep
rt.def("/mob/living/silicon/pai/proc/Topic", function* Topic(f: Frame) {
	let soft: Value = null, sub: Value = null, target: Value = null, cost: Value = null, newImage: Value = null, pID: Value = null, new_frequency: Value = null, M: Value = null, count: Value = null, sec: Value = null, med: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [soft, sub, target, cost, newImage, pID, new_frequency, M, count, sec, med, _T, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	soft = rt.at(live(f.args[1]), "software");
	sub = rt.at(live(f.args[1]), "sub");
	if (truthy(live(soft))) {
		rt.setFv(f, "screen", live(f.src), live(soft));
	}
	if (truthy(live(sub))) {
		rt.setFv(f, "subscreen", live(f.src), (yield* g.call(f, P("/proc/text2num"), null, [live(sub)])));
	}
	$0 = live(soft);
	if ($0 === "buy") {
		if (isEqual(rt.sv(f, "subscreen"), 1)) {
			target = rt.at(live(f.args[1]), "buy");
			if (truthy((yield* g.callName(f, rt.sv(f, "available_software"), "Find", [live(target)])))) {
				cost = rt.index(rt.fv(f, "available_software", live(f.src)), live(target));
				if (rt.ge(rt.sv(f, "ram"), live(cost))) {
					(rt.modSrcVar(f, "ram", live(cost), subtract));
					yield* g.callName(f, rt.sv(f, "software"), "Add", [live(target)]);
				} else {
					rt.setSv(f, "temp", "Insufficient RAM available.");
				}
			} else {
				rt.setSv(f, "temp", fmt("Trunk <TT> \"＀\"</TT> not found.", [live(target)]));
			}
		}
	} else if ($0 === "radio") {
		yield* g.callName(f, rt.sv(f, "radio"), "attack_self", [live(f.src)]);
	} else if ($0 === "image") {
		newImage = (yield* g.op(f, "Prompt", [0], [null, "Happy", "Display Image", "Select your new display image.", rt.list("Happy", "Cat", "Extremely Happy", "Face", "Laugh", "Off", "Sad", "Angry", "What")]));
		pID = 1;
		$0 = live(newImage);
		if ($0 === "Happy") {
			pID = 1;
		} else if ($0 === "Cat") {
			pID = 2;
		} else if ($0 === "Extremely Happy") {
			pID = 3;
		} else if ($0 === "Face") {
			pID = 4;
		} else if ($0 === "Laugh") {
			pID = 5;
		} else if ($0 === "Off") {
			pID = 6;
		} else if ($0 === "Sad") {
			pID = 7;
		} else if ($0 === "Angry") {
			pID = 8;
		} else if ($0 === "What") {
			pID = 9;
		} else if ($0 === "Null") {
			pID = 10;
		}
		yield* g.callName(f, rt.sv(f, "card"), "setEmotion", [live(pID)]);
	} else if ($0 === "signaller") {
		if (truthy(rt.at(live(f.args[1]), "send"))) {
			yield* g.callName(f, rt.sv(f, "sradio"), "send_signal", ["ACTIVATE"]);
			yield* g.srcCall(f, "audible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]));
		}
		if (truthy(rt.at(live(f.args[1]), "freq"))) {
			if ((rt.lt((new_frequency = add(rt.fv(f, "frequency", rt.sv(f, "sradio")), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "freq")])))), 1200) || rt.gt(live(new_frequency), 1600))) {
				new_frequency = (yield* g.call(f, P("/proc/sanitize_frequency"), null, [live(new_frequency)]));
			}
			yield* g.callName(f, rt.sv(f, "sradio"), "set_frequency", [live(new_frequency)]);
		}
		if (truthy(rt.at(live(f.args[1]), "code"))) {
			rt.modField(f, rt.sv(f, "sradio"), "code", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "code")])), add);
			rt.setFv(f, "code", rt.sv(f, "sradio"), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "code", rt.sv(f, "sradio"))])));
			rt.setFv(f, "code", rt.sv(f, "sradio"), (yield* g.call(f, P("/proc/min"), null, [100, rt.fv(f, "code", rt.sv(f, "sradio"))])));
			rt.setFv(f, "code", rt.sv(f, "sradio"), (yield* g.call(f, P("/proc/max"), null, [1, rt.fv(f, "code", rt.sv(f, "sradio"))])));
		}
	} else if ($0 === "directive") {
		if (truthy(rt.at(live(f.args[1]), "getdna"))) {
			M = rt.fv(f, "loc", rt.sv(f, "card"));
			count = 0;
			while (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
				if ((!truthy(live(M)) || !truthy(rt.fv(f, "loc", live(M))))) {
					return 0;
				}
				M = rt.fv(f, "loc", live(M));
				count = rt.inc(live(count), 1);
				if (rt.ge(live(count), 6)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You are not being carried by anyone!"]);
					return 0;
				}
			}
			rt.spawnTail(f, 0, "/mob/living/silicon/pai/proc/Topic: spawn at modules/mob/living/silicon/pai/software.dm:205", soft, sub, target, cost, newImage, pID, new_frequency, M, count, sec, med, _T);
		}
	} else if ($0 === "pdamessage") {
		if (rt.sv(f, "pda") !== null) {
			if (truthy(rt.at(live(f.args[1]), "toggler"))) {
				rt.setFv(f, "toff", rt.sv(f, "pda"), (!truthy(rt.fv(f, "toff", rt.sv(f, "pda"))) ? 1 : 0));
			} else {
				if (truthy(rt.at(live(f.args[1]), "ringer"))) {
					rt.setFv(f, "silent", rt.sv(f, "pda"), (!truthy(rt.fv(f, "silent", rt.sv(f, "pda"))) ? 1 : 0));
				} else {
					if (truthy(rt.at(live(f.args[1]), "target"))) {
						if (truthy(rt.sv(f, "silent"))) {
							return (yield* g.call(f, P("/proc/alert"), null, ["Communications circuits remain unitialized."]));
						}
						target = rt.locateIn(f, rt.at(live(f.args[1]), "target"), rt.world());
						yield* g.callName(f, rt.sv(f, "pda"), "create_message", [live(f.src), live(target)]);
					}
				}
			}
		}
	} else if ($0 === "medicalrecord") {
		if (isEqual(rt.sv(f, "subscreen"), 1)) {
			rt.setSv(f, "medicalActive1", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "med_rec"), rt.fv(f, "general", rt.gl("data_core"))])));
			if (truthy(rt.sv(f, "medicalActive1"))) {
				rt.setSv(f, "medicalActive2", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "med_rec"), rt.fv(f, "medical", rt.gl("data_core"))])));
			}
			if (!truthy(rt.sv(f, "medicalActive2"))) {
				rt.setSv(f, "medicalActive1", null);
				rt.setSv(f, "temp", "Unable to locate requested security record. Record may have been deleted, or never have existed.");
			}
		}
	} else if ($0 === "securityrecord") {
		if (isEqual(rt.sv(f, "subscreen"), 1)) {
			rt.setSv(f, "securityActive1", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "sec_rec"), rt.fv(f, "general", rt.gl("data_core"))])));
			if (truthy(rt.sv(f, "securityActive1"))) {
				rt.setSv(f, "securityActive2", (yield* g.call(f, P("/proc/find_record"), null, ["id", rt.at(live(f.args[1]), "sec_rec"), rt.fv(f, "security", rt.gl("data_core"))])));
			}
			if (!truthy(rt.sv(f, "securityActive2"))) {
				rt.setSv(f, "securityActive1", null);
				rt.setSv(f, "temp", "Unable to locate requested security record. Record may have been deleted, or never have existed.");
			}
		}
	} else if ($0 === "securityhud") {
		if (truthy(rt.at(live(f.args[1]), "toggle"))) {
			rt.setSv(f, "secHUD", (!truthy(rt.sv(f, "secHUD")) ? 1 : 0));
			if (truthy(rt.sv(f, "secHUD"))) {
				yield* g.srcCall(f, "add_sec_hud");
			} else {
				yield* g.callName(f, (sec = rt.index(rt.gl("huds"), rt.sv(f, "sec_hud"))), "remove_hud_from", [live(f.src)]);
			}
		}
	} else if ($0 === "medicalhud") {
		if (truthy(rt.at(live(f.args[1]), "toggle"))) {
			rt.setSv(f, "medHUD", (!truthy(rt.sv(f, "medHUD")) ? 1 : 0));
			if (truthy(rt.sv(f, "medHUD"))) {
				yield* g.srcCall(f, "add_med_hud");
			} else {
				yield* g.callName(f, (med = rt.index(rt.gl("huds"), rt.sv(f, "med_hud"))), "remove_hud_from", [live(f.src)]);
			}
		}
	} else if ($0 === "translator") {
		if (truthy(rt.at(live(f.args[1]), "toggle"))) {
			if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
				$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "omnitongue");
			} else {
				$0 = 0;
			}
			if (!truthy($0)) {
				yield* g.srcCall(f, "grant_all_languages", 1);
			}
		}
	} else if ($0 === "doorjack") {
		if (truthy(rt.at(live(f.args[1]), "jack"))) {
			if ((truthy(rt.fv(f, "cable", live(f.src))) && truthy(rt.gv(f, "machine", rt.fv(f, "cable", live(f.src)))))) {
				rt.setFv(f, "hackdoor", live(f.src), rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))));
				yield* g.callName(f, live(f.src), "hackloop", []);
			}
		}
		if (truthy(rt.at(live(f.args[1]), "cancel"))) {
			rt.setFv(f, "hackdoor", live(f.src), null);
		}
		if (truthy(rt.at(live(f.args[1]), "cable"))) {
			rt.setSv(f, "cable", (yield* g.new_(f, T("/obj/item/weapon/pai_cable"), [(_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0))])));
			yield* g.callName(f, live(_T), "visible_message", [fmt("<span class='warning'>A port on ＀ opens to reveal ＀, which promptly falls to the floor.</span>", [live(f.src), rt.fv(f, "cable", live(f.src))]), "<span class='italics'>You hear the soft click of something light and hard falling to the ground.</span>"]);
		}
	}
	yield* g.callName(f, live(f.src), "paiInterface", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// a spawn(0) body of /mob/living/silicon/pai/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/pai/proc/Topic: spawn at modules/mob/living/silicon/pai/software.dm:205", function* (f: Frame, soft: Value, sub: Value, target: Value, cost: Value, newImage: Value, pID: Value, new_frequency: Value, M: Value, count: Value, sec: Value, med: Value, _T: Value) {
	f.vars = () => [soft, sub, target, cost, newImage, pID, new_frequency, M, count, sec, med, _T];
	yield* g.srcCall(f, "CheckDNA", live(M), live(f.src));
	return null;
});

// /mob/living/silicon/pai/proc/softwareMenu  (code/modules/mob/living/silicon/pai/software.dm:277)
rt.def("/mob/living/silicon/pai/proc/softwareMenu", function softwareMenu(f: Frame) {
	let dat: Value = null, s: Value = null, translator_on: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [dat, s, translator_on, $0, $1, $e];
	dat = "";
	dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;software=refresh'>Refresh</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;software=directives'>Directives</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;software=radio;sub=0'>Radio Configuration</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;software=image'>Screen Display</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), "<b>Basic</b> <br>", add);
	s = null;
	rt.forList(f, 0, rt.fv(f, "software", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		if (isEqual(live(s), "digital messenger")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=pdamessage;sub=0'>Digital Messenger</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "crew manifest")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=manifest;sub=0'>Crew Manifest</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "medical records")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=medicalrecord;sub=0'>Medical Records</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "security records")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=securityrecord;sub=0'>Security Records</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "camera")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=＀'>Camera Jack</a> <br>", [live(f.src), live(s)]), add);
		}
		if (isEqual(live(s), "remote signaller")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=signaller;sub=0'>Remote Signaller</a> <br>", [live(f.src)]), add);
		}
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), "<b>Advanced</b> <br>", add);
	s = null;
	rt.forList(f, 0, rt.fv(f, "software", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		if (isEqual(live(s), "atmosphere sensor")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=atmosensor;sub=0'>Atmospheric Sensor</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "heartbeat sensor")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=＀'>Heartbeat Sensor</a> <br>", [live(f.src), live(s)]), add);
		}
		if (isEqual(live(s), "security HUD")) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "secHUD", live(f.src)))) {
				$1 = "<font color=#55FF55> On</font>";
			} else {
				$1 = "<font color=#FF5555> Off</font>";
			}
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=securityhud;sub=0'>Facial Recognition Suite</a>＀ <br>", [$0, $1]), add);
		}
		if (isEqual(live(s), "medical HUD")) {
			$0 = live(f.src);
			if (truthy(rt.fv(f, "medHUD", live(f.src)))) {
				$1 = "<font color=#55FF55> On</font>";
			} else {
				$1 = "<font color=#FF5555> Off</font>";
			}
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=medicalhud;sub=0'>Medical Analysis Suite</a>＀ <br>", [$0, $1]), add);
		}
		if (isEqual(live(s), "universal translator")) {
			if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
				$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "omnitongue");
			} else {
				$0 = 0;
			}
			translator_on = $0;
			$0 = live(f.src);
			if (truthy(live(translator_on))) {
				$1 = "<font color=#55FF55> On</font>";
			} else {
				$1 = "<font color=#FF5555> Off</font>";
			}
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=translator;sub=0'>Universal Translator</a>＀ <br>", [$0, $1]), add);
		}
		if (isEqual(live(s), "projection array")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=projectionarray;sub=0'>Projection Array</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "camera jack")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=camerajack;sub=0'>Camera Jack</a> <br>", [live(f.src)]), add);
		}
		if (isEqual(live(s), "door jack")) {
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=doorjack;sub=0'>Door Jack</a> <br>", [live(f.src)]), add);
		}
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), "<br>", add);
	return (dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=buy;sub=0'>Download additional software</a>", [live(f.src)]), add));
});

// /mob/living/silicon/pai/proc/downloadSoftware  (code/modules/mob/living/silicon/pai/software.dm:332)
rt.def("/mob/living/silicon/pai/proc/downloadSoftware", function downloadSoftware(f: Frame) {
	let dat: Value = null, s: Value = null, cost: Value = null, displayName: Value = null, displayName_2: Value = null;
	let $e: any;
	f.vars = () => [dat, s, cost, displayName, displayName_2, $e];
	dat = "";
	dat = rt.modify(live(dat), "<h2>Centcom pAI Module Subversion Network</h2><br>", add);
	dat = rt.modify(live(dat), fmt("<pre>Remaining Available Memory: ＀</pre><br>", [rt.fv(f, "ram", live(f.src))]), add);
	dat = rt.modify(live(dat), "<p style=\"text-align:center\"><b>Trunks available for checkout</b><br>", add);
	s = null;
	rt.forList(f, 0, rt.sv(f, "available_software"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		if (!truthy(rt.callName(f, rt.sv(f, "software"), "Find", [live(s)]))) {
			cost = rt.index(rt.fv(f, "available_software", live(f.src)), live(s));
			displayName = rt.call(f, P("/proc/uppertext"), null, [live(s)]);
			dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=buy;sub=1;buy=＀'>＀</a> (＀) <br>", [live(f.src), live(s), live(displayName), live(cost)]), add);
		} else {
			dat = rt.modify(live(dat), fmt("＀ (Download Complete) <br>", [(displayName_2 = rt.call(f, P("/proc/lowertext"), null, [live(s)]))]), add);
		}
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</p>", add));
});

// /mob/living/silicon/pai/proc/directives  (code/modules/mob/living/silicon/pai/software.dm:351)
rt.def("/mob/living/silicon/pai/proc/directives", function directives(f: Frame) {
	let dat: Value = null, slaws: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, slaws, $0, $e];
	dat = "";
	if (truthy(rt.fv(f, "master", live(f.src)))) {
		$0 = fmt("Your master: ＀ (＀)", [rt.fv(f, "master", live(f.src)), rt.fv(f, "master_dna", live(f.src))]);
	} else {
		$0 = "You are bound to no one.";
	}
	dat = rt.modify(live(dat), fmt("＀", [$0]), add);
	dat = rt.modify(live(dat), "<br><br>", add);
	dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=directive;getdna=1'>Request carrier DNA sample</a><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "<h2>Directives</h2><br>", add);
	dat = rt.modify(live(dat), "<b>Prime Directive</b><br>", add);
	dat = rt.modify(live(dat), fmt("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;＀<br>", [rt.gv(f, "zeroth", rt.fv(f, "laws", live(f.src)))]), add);
	dat = rt.modify(live(dat), "<b>Supplemental Directives</b><br>", add);
	slaws = null;
	rt.forList(f, 0, rt.fv(f, "supplied", rt.sv(f, "laws")));
	while (($e = rt.next(f, 0)) !== undefined) {
		slaws = $e;
		dat = rt.modify(live(dat), fmt("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;＀<br>", [live(slaws)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<br>", add);
	return (dat = rt.modify(live(dat), "<i><p>Recall, personality, that you are a complex thinking, sentient being. Unlike station AI models, you are capable of\n\t\t\t comprehending the subtle nuances of human language. You may parse the \"spirit\" of a directive and follow its intent,\n\t\t\t rather than tripping over pedantics and getting snared by technicalities. Above all, you are machine in name and build\n\t\t\t only. In all other aspects, you may be seen as the ideal, unwavering human companion that you are.</i></p><br><br><p>\n\t\t\t <b>Your prime directive comes before all others. Should a supplemental directive conflict with it, you are capable of\n\t\t\t simply discarding this inconsistency, ignoring the conflicting supplemental directive and continuing to fulfill your\n\t\t\t prime directive to the best of your ability.</b></p><br><br>-\n\t\t\t", add));
});

// /mob/living/silicon/pai/proc/CheckDNA  (code/modules/mob/living/silicon/pai/software.dm:374)  may sleep
rt.def("/mob/living/silicon/pai/proc/CheckDNA", function* CheckDNA(f: Frame, M: Value, _P: Value) {
	let answer: Value = null;
	f.vars = () => [M, _P, answer];
	if (isEqual((answer = (yield* g.op(f, "Prompt", [0], ["No", fmt("＀ Check DNA", [live(_P)]), fmt("＀ is requesting a DNA sample from you. Will you allow it to confirm your identity?", [live(_P)]), live(M), rt.list("Yes", "No")]))), "Yes")) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ presses ＀ thumb against ＀.</span>", [live(M), (yield* g.callName(f, live(M), "p_their", [])), live(_P)]), fmt("<span class='notice'>You press your thumb against ＀.</span>", [live(_P)]), fmt("<span class='notice'>＀ makes a sharp clicking sound as it extracts DNA material from ＀.</span>", [live(_P), live(M)])]);
		if (!truthy((yield* g.callName(f, live(M), "has_dna", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(_P), "<b>No DNA detected</b>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(_P), fmt("<font color = red><h3>＀'s UE string : ＀</h3></font>", [live(M), rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(M)))])]);
		if (isEqual(rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(M))), rt.fv(f, "master_dna", live(_P)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(_P), "<b>DNA is a match to stored Master DNA.</b>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(_P), "<b>DNA does not match stored Master DNA.</b>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(_P), fmt("＀ does not seem like ＀ ＀ going to provide a DNA sample willingly.", [live(M), (yield* g.callName(f, live(M), "p_they", [])), (yield* g.callName(f, live(M), "p_are", []))])]);
	}
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/softwareSignal  (code/modules/mob/living/silicon/pai/software.dm:394)
rt.def("/mob/living/silicon/pai/proc/softwareSignal", function softwareSignal(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = "";
	dat = rt.modify(live(dat), "<h3>Remote Signaller</h3><br><br>", add);
	return (dat = rt.modify(live(dat), fmt("<B>Frequency/Code</B> for signaler:<BR>\n\tFrequency:\n\t<A href='byond://?src=＃;software=signaller;freq=-10;'>-</A>\n\t<A href='byond://?src=＃;software=signaller;freq=-2'>-</A>\n\t＀\n\t<A href='byond://?src=＃;software=signaller;freq=2'>+</A>\n\t<A href='byond://?src=＃;software=signaller;freq=10'>+</A><BR>\n\n\tCode:\n\t<A href='byond://?src=＃;software=signaller;code=-5'>-</A>\n\t<A href='byond://?src=＃;software=signaller;code=-1'>-</A>\n\t＀\n\t<A href='byond://?src=＃;software=signaller;code=1'>+</A>\n\t<A href='byond://?src=＃;software=signaller;code=5'>+</A><BR>\n\n\t<A href='byond://?src=＃;software=signaller;send=1'>Send Signal</A><BR>", [live(f.src), live(f.src), rt.call(f, P("/proc/format_frequency"), null, [rt.gv(f, "frequency", rt.fv(f, "sradio", live(f.src)))]), live(f.src), live(f.src), live(f.src), live(f.src), rt.gv(f, "code", rt.fv(f, "sradio", live(f.src))), live(f.src), live(f.src), live(f.src)]), add));
});

// /mob/living/silicon/pai/proc/softwareManifest  (code/modules/mob/living/silicon/pai/software.dm:416)  may sleep
rt.def("/mob/living/silicon/pai/proc/softwareManifest", function* softwareManifest(f: Frame) {
	let t: Value = null;
	let $e: any;
	f.vars = () => [t, $e];
	f.dot = rt.modify(live(f.dot), "<h2>Crew Manifest</h2><br><br>", add);
	if (truthy(rt.fv(f, "general", rt.gl("data_core")))) {
		t = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			f.dot = rt.modify(live(f.dot), fmt("＀ - ＀<BR>", [rt.index(rt.fv(f, "fields", live(t)), "name"), rt.index(rt.fv(f, "fields", live(t)), "rank")]), add);
		}
		rt.endFor(f, 0);
	}
	return (f.dot = rt.modify(live(f.dot), "</body></html>", add));
}, true);

// /mob/living/silicon/pai/proc/softwareMedicalRecord  (code/modules/mob/living/silicon/pai/software.dm:425)  may sleep
rt.def("/mob/living/silicon/pai/proc/softwareMedicalRecord", function* softwareMedicalRecord(f: Frame) {
	let R: Value = null;
	let $0: any, $e: any;
	f.vars = () => [R, $0, $e];
	$0 = rt.sv(f, "subscreen");
	if ($0 === 0) {
		f.dot = rt.modify(live(f.dot), "<h3>Medical Records</h3><HR>", add);
		if (truthy(rt.fv(f, "general", rt.gl("data_core")))) {
			R = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				f.dot = rt.modify(live(f.dot), fmt("<A href='?src=＃;med_rec=＀;software=medicalrecord;sub=1'>＀: ＀<BR>", [live(f.src), rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", live(R)), "name")]), add);
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === 1) {
		f.dot = rt.modify(live(f.dot), "<CENTER><B>Medical Record</B></CENTER><BR>", add);
		if (truthy((rt.isIn(f, rt.sv(f, "medicalActive1"), rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), fmt("Name: ＀ ID: ＀<BR>\nSex: ＀<BR>\nAge: ＀<BR>\nFingerprint: ＀<BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "name"), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "id"), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "sex"), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "age"), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "fingerprint"), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "p_stat"), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive1")), "m_stat")]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<pre>Requested medical record not found.</pre><BR>", add);
		}
		if (truthy((rt.isIn(f, rt.sv(f, "medicalActive2"), rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), fmt("<BR>\n<CENTER><B>Medical Data</B></CENTER><BR>\nBlood Type: <A href='?src=＃;field=blood_type'>＀</A><BR>\nDNA: <A href='?src=＃;field=b_dna'>＀</A><BR>\n<BR>\nMinor Disabilities: <A href='?src=＃;field=mi_dis'>＀</A><BR>\nDetails: <A href='?src=＃;field=mi_dis_d'>＀</A><BR>\n<BR>\nMajor Disabilities: <A href='?src=＃;field=ma_dis'>＀</A><BR>\nDetails: <A href='?src=＃;field=ma_dis_d'>＀</A><BR>\n<BR>\nAllergies: <A href='?src=＃;field=alg'>＀</A><BR>\nDetails: <A href='?src=＃;field=alg_d'>＀</A><BR>\n<BR>\nCurrent Diseases: <A href='?src=＃;field=cdi'>＀</A> (per disease info placed in log/comment section)<BR>\nDetails: <A href='?src=＃;field=cdi_d'>＀</A><BR>\n<BR>\nImportant Notes:<BR>\n\t<A href='?src=＃;field=notes'>＀</A><BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "blood_type"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "b_dna"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "mi_dis"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "mi_dis_d"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "ma_dis"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "ma_dis_d"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "alg"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "alg_d"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "cdi"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "cdi_d"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "medicalActive2")), "notes")]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<pre>Requested medical record not found.</pre><BR>", add);
		}
		f.dot = rt.modify(live(f.dot), fmt("<BR>\n<A href='?src=＃;software=medicalrecord;sub=0'>Back</A><BR>", [live(f.src)]), add);
	}
	return live(f.dot);
}, true);

// /mob/living/silicon/pai/proc/softwareSecurityRecord  (code/modules/mob/living/silicon/pai/software.dm:446)  may sleep
rt.def("/mob/living/silicon/pai/proc/softwareSecurityRecord", function* softwareSecurityRecord(f: Frame) {
	let R: Value = null;
	let $0: any, $e: any;
	f.vars = () => [R, $0, $e];
	f.dot = "";
	$0 = rt.sv(f, "subscreen");
	if ($0 === 0) {
		f.dot = rt.modify(live(f.dot), "<h3>Security Records</h3><HR>", add);
		if (truthy(rt.fv(f, "general", rt.gl("data_core")))) {
			R = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				f.dot = rt.modify(live(f.dot), fmt("<A href='?src=＃;sec_rec=＀;software=securityrecord;sub=1'>＀: ＀<BR>", [live(f.src), rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", live(R)), "id"), rt.index(rt.fv(f, "fields", live(R)), "name")]), add);
			}
			rt.endFor(f, 0);
		}
	} else if ($0 === 1) {
		f.dot = rt.modify(live(f.dot), "<h3>Security Record</h3>", add);
		if (truthy((rt.isIn(f, rt.sv(f, "securityActive1"), rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), fmt("Name: <A href='?src=＃;field=name'>＀</A> ID: <A href='?src=＃;field=id'>＀</A><BR>\nSex: <A href='?src=＃;field=sex'>＀</A><BR>\nAge: <A href='?src=＃;field=age'>＀</A><BR>\nRank: <A href='?src=＃;field=rank'>＀</A><BR>\nFingerprint: <A href='?src=＃;field=fingerprint'>＀</A><BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "name"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "id"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "sex"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "age"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "rank"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "fingerprint"), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "p_stat"), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive1")), "m_stat")]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<pre>Requested security record not found,</pre><BR>", add);
		}
		if (truthy((rt.isIn(f, rt.sv(f, "securityActive2"), rt.fv(f, "security", rt.gl("data_core"))) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), fmt("<BR>\nSecurity Data<BR>\nCriminal Status: ＀<BR>\n<BR>\nMinor Crimes: <A href='?src=＃;field=mi_crim'>＀</A><BR>\nDetails: <A href='?src=＃;field=mi_crim_d'>＀</A><BR>\n<BR>\nMajor Crimes: <A href='?src=＃;field=ma_crim'>＀</A><BR>\nDetails: <A href='?src=＃;field=ma_crim_d'>＀</A><BR>\n<BR>\nImportant Notes:<BR>\n\t<A href='?src=＃;field=notes'>＀</A><BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive2")), "criminal"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive2")), "mi_crim"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive2")), "mi_crim_d"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive2")), "ma_crim"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive2")), "ma_crim_d"), live(f.src), rt.index(rt.fv(f, "fields", rt.sv(f, "securityActive2")), "notes")]), add);
		} else {
			f.dot = rt.modify(live(f.dot), "<pre>Requested security record not found,</pre><BR>", add);
		}
		f.dot = rt.modify(live(f.dot), fmt("<BR>\n<A href='?src=＃;software=securityrecord;sub=0'>Back</A><BR>", [live(f.src)]), add);
	}
	return live(f.dot);
}, true);

// /mob/living/silicon/pai/proc/softwareTranslator  (code/modules/mob/living/silicon/pai/software.dm:468)
rt.def("/mob/living/silicon/pai/proc/softwareTranslator", function softwareTranslator(f: Frame) {
	let translator_on: Value = null;
	let $0: any, $1: any;
	f.vars = () => [translator_on, $0, $1];
	if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "omnitongue");
	} else {
		$0 = 0;
	}
	if (truthy((translator_on = $0))) {
		$0 = "<font color=#55FF55>en";
	} else {
		$0 = "<font color=#FF5555>dis";
	}
	if (truthy(live(translator_on))) {
		$1 = "";
	} else {
		$1 = fmt("<a href='byond://?src=＃;software=translator;sub=0;toggle=1'>Activate Translation Module</a><br>", [live(f.src)]);
	}
	f.dot = fmt("<h3>Universal Translator</h3><br>\n\t\t\t\tWhen enabled, this device will permamently be able to speak and understand all known forms of communication.<br><br>\n\t\t\t\tThe device is currently ＀abled.</font><br>＀", [$0, $1]);
	return live(f.dot);
});

// /mob/living/silicon/pai/proc/facialRecognition  (code/modules/mob/living/silicon/pai/software.dm:476)
rt.def("/mob/living/silicon/pai/proc/facialRecognition", function facialRecognition(f: Frame) {
	let dat: Value = null;
	let $0: any;
	f.vars = () => [dat, $0];
	if (truthy(rt.fv(f, "secHUD", live(f.src)))) {
		$0 = "<font color=#55FF55>en";
	} else {
		$0 = "<font color=#FF5555>dis";
	}
	return (dat = fmt("<h3>Facial Recognition Suite</h3><br>\n\t\t\t\tWhen enabled, this package will scan all viewable faces and compare them against the known criminal database, providing real-time graphical data about any detected persons of interest.<br><br>\n\t\t\t\tThe package is currently ＀abled.</font><br>\n\t\t\t\t<a href='byond://?src=＃;software=securityhud;sub=0;toggle=1'>Toggle Package</a><br>\n\t\t\t\t", [$0, live(f.src)]));
});

// /mob/living/silicon/pai/proc/medicalAnalysis  (code/modules/mob/living/silicon/pai/software.dm:485)
rt.def("/mob/living/silicon/pai/proc/medicalAnalysis", function medicalAnalysis(f: Frame) {
	let dat: Value = null, M: Value = null, D: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	f.vars = () => [dat, M, D, $0, $1, $2, $3, $4, $5, $6, $7, $8, $e];
	dat = "";
	if (isEqual(rt.fv(f, "subscreen", live(f.src)), 0)) {
		if (truthy(rt.fv(f, "medHUD", live(f.src)))) {
			$0 = "<font color=#55FF55>en";
		} else {
			$0 = "<font color=#FF5555>dis";
		}
		dat = rt.modify(live(dat), fmt("<h3>Medical Analysis Suite</h3><br>\n\t\t\t\t <h4>Visual Status Overlay</h4><br>\n\t\t\t\t\tWhen enabled, this package will scan all nearby crewmembers' vitals and provide real-time graphical data about their state of health.<br><br>\n\t\t\t\t\tThe suite is currently ＀abled.</font><br>\n\t\t\t\t\t<a href='byond://?src=＃;software=medicalhud;sub=0;toggle=1'>Toggle Suite</a><br>\n\t\t\t\t\t<br>\n\t\t\t\t\t<a href='byond://?src=＃;software=medicalhud;sub=1'>Host Bioscan</a><br>\n\t\t\t\t\t", [$0, live(f.src), live(f.src)]), add);
	}
	if (isEqual(rt.fv(f, "subscreen", live(f.src)), 1)) {
		dat = rt.modify(live(dat), "<h3>Medical Analysis Suite</h3><br>\n\t\t\t\t <h4>Host Bioscan</h4><br>\n\t\t\t\t", add);
		if (!truthy((rt.istype((M = rt.fv(f, "loc", rt.sv(f, "card"))), T("/mob/living")) ? 1 : 0))) {
			while (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
				if (truthy(rt.call(f, P("/proc/isturf"), null, [live(M)]))) {
					rt.setFv(f, "temp", live(f.src), "Error: No biological host found. <br>");
					rt.setFv(f, "subscreen", live(f.src), 0);
					return live(dat);
				}
				M = rt.fv(f, "loc", live(M));
			}
		}
		$0 = live(M);
		if (rt.gt(rt.fv(f, "stat", live(M)), 1)) {
			$1 = "dead";
		} else {
			$1 = fmt("＀% healthy", [rt.fv(f, "health", live(M))]);
		}
		if (rt.gt(rt.callName(f, live(M), "getOxyLoss", []), 50)) {
			$2 = "<font color=#FF5555>";
		} else {
			$2 = "<font color=#55FF55>";
		}
		$3 = rt.callName(f, live(M), "getOxyLoss", []);
		if (rt.gt(rt.callName(f, live(M), "getToxLoss", []), 50)) {
			$4 = "<font color=#FF5555>";
		} else {
			$4 = "<font color=#55FF55>";
		}
		$5 = rt.callName(f, live(M), "getToxLoss", []);
		if (rt.gt(rt.callName(f, live(M), "getFireLoss", []), 50)) {
			$6 = "<font color=#FF5555>";
		} else {
			$6 = "<font color=#55FF55>";
		}
		$7 = rt.callName(f, live(M), "getFireLoss", []);
		if (rt.gt(rt.callName(f, live(M), "getBruteLoss", []), 50)) {
			$8 = "<font color=#FF5555>";
		} else {
			$8 = "<font color=#55FF55>";
		}
		dat = rt.modify(live(dat), fmt("Bioscan Results for ＀: <br>\"\n\t\tOverall Status: ＀ <br>\n\t\tScan Breakdown: <br>\n\t\tRespiratory: ＀＀</font><br>\n\t\tToxicology: ＀＀</font><br>\n\t\tBurns: ＀＀</font><br>\n\t\tStructural Integrity: ＀＀</font><br>\n\t\tBody Temperature: ＀&deg;C (＀&deg;F)<br>\n\t\t", [$0, $1, $2, $3, $4, $5, $6, $7, $8, rt.callName(f, live(M), "getBruteLoss", []), subtract(rt.fv(f, "bodytemperature", live(M)), 273.1499938964844), subtract(multiply(rt.fv(f, "bodytemperature", live(M)), 1.7999999523162842), 459.6700134277344)]), add);
		D = null;
		rt.forList(f, 0, rt.fv(f, "viruses", live(M)), T("/datum/disease"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			dat = rt.modify(live(dat), fmt("<h4>Infection Detected.</h4><br>\n\t\t\t\t\t Name: ＀<br>\n\t\t\t\t\t Type: ＀<br>\n\t\t\t\t\t Stage: ＀/＀<br>\n\t\t\t\t\t Possible Cure: ＀<br>\n\t\t\t\t\t", [rt.fv(f, "name", live(D)), rt.fv(f, "spread_text", live(D)), rt.fv(f, "stage", live(D)), rt.fv(f, "max_stages", live(D)), rt.fv(f, "cure_text", live(D))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=medicalhud;sub=0'>Visual Status Overlay</a><br>", [live(f.src)]), add);
	}
	return live(dat);
});

// /mob/living/silicon/pai/proc/softwareAtmo  (code/modules/mob/living/silicon/pai/software.dm:528)
rt.def("/mob/living/silicon/pai/proc/softwareAtmo", function softwareAtmo(f: Frame) {
	let dat: Value = null, _T: Value = null, environment: Value = null, env_gases: Value = null, pressure: Value = null, total_moles: Value = null, id: Value = null, gas_level: Value = null;
	let $e: any;
	f.vars = () => [dat, _T, environment, env_gases, pressure, total_moles, id, gas_level, $e];
	dat = "<h3>Atmospheric Sensor</h4>";
	if ((_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)) === null) {
		dat = rt.modify(live(dat), "Unable to obtain a reading.<br>", add);
	} else {
		environment = rt.callName(f, live(_T), "return_air", []);
		env_gases = rt.fv(f, "gases", live(environment));
		pressure = rt.callName(f, live(environment), "return_pressure", []);
		total_moles = rt.callName(f, live(environment), "total_moles", []);
		dat = rt.modify(live(dat), fmt("Air Pressure: ＀ kPa<br>", [rt.call(f, P("/proc/round"), null, [live(pressure), 0.10000000149011612])]), add);
		if (truthy(live(total_moles))) {
			id = null;
			rt.forList(f, 0, live(env_gases));
			while (($e = rt.next(f, 0)) !== undefined) {
				id = $e;
				if (rt.gt((gas_level = divide(rt.index(rt.index(live(env_gases), live(id)), 1), live(total_moles))), 0.009999999776482582)) {
					dat = rt.modify(live(dat), fmt("＀: ＀%<br>", [rt.index(rt.index(rt.index(live(env_gases), live(id)), 3), 2), rt.call(f, P("/proc/round"), null, [multiply(live(gas_level), 100)])]), add);
				}
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), fmt("Temperature: ＀&deg;C<br>", [rt.call(f, P("/proc/round"), null, [subtract(rt.fv(f, "temperature", live(environment)), 273.1499938964844)])]), add);
	}
	dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=atmosensor;sub=0'>Refresh Reading</a> <br>", [live(f.src)]), add);
	return (dat = rt.modify(live(dat), "<br>", add));
});

// /mob/living/silicon/pai/proc/softwareCamera  (code/modules/mob/living/silicon/pai/software.dm:554)
rt.def("/mob/living/silicon/pai/proc/softwareCamera", function softwareCamera(f: Frame) {
	let dat: Value = null, machine: Value = null;
	f.vars = () => [dat, machine];
	dat = "<h3>Camera Jack</h3>";
	dat = rt.modify(live(dat), "Cable status : ", add);
	if (!truthy(rt.fv(f, "cable", live(f.src)))) {
		return (dat = rt.modify(live(dat), "<font color=#FF5555>Retracted</font> <br>", add));
	}
	if (!truthy(rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))))) {
		return (dat = rt.modify(live(dat), "<font color=#FFFF55>Extended</font> <br>", add));
	}
	machine = rt.gv(f, "machine", rt.fv(f, "cable", live(f.src)));
	dat = rt.modify(live(dat), "<font color=#55FF55>Connected</font> <br>", add);
	if (!truthy((rt.istype(live(machine), T("/obj/machinery/camera")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "DERP"]);
	}
	return live(dat);
});

// /mob/living/silicon/pai/proc/softwareDoor  (code/modules/mob/living/silicon/pai/software.dm:573)
rt.def("/mob/living/silicon/pai/proc/softwareDoor", function softwareDoor(f: Frame) {
	let dat: Value = null, machine: Value = null;
	f.vars = () => [dat, machine];
	dat = "<h3>Airlock Jack</h3>";
	dat = rt.modify(live(dat), "Cable status : ", add);
	if (!truthy(rt.fv(f, "cable", live(f.src)))) {
		dat = rt.modify(live(dat), "<font color=#FF5555>Retracted</font> <br>", add);
		return (dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=doorjack;cable=1;sub=0'>Extend Cable</a> <br>", [live(f.src)]), add));
	}
	if (!truthy(rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))))) {
		return (dat = rt.modify(live(dat), "<font color=#FFFF55>Extended</font> <br>", add));
	}
	machine = rt.gv(f, "machine", rt.fv(f, "cable", live(f.src)));
	dat = rt.modify(live(dat), "<font color=#55FF55>Connected</font> <br>", add);
	if (!truthy((rt.istype(live(machine), T("/obj/machinery/door")) ? 1 : 0))) {
		return (dat = rt.modify(live(dat), "Connected device's firmware does not appear to be compatible with Airlock Jack protocols.<br>", add));
	}
	if (!truthy(rt.fv(f, "hackdoor", live(f.src)))) {
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=doorjack;jack=1;sub=0'>Begin Airlock Jacking</a> <br>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("Jack in progress... ＀% complete.<br>", [rt.fv(f, "hackprogress", live(f.src))]), add);
		dat = rt.modify(live(dat), fmt("<a href='byond://?src=＃;software=doorjack;cancel=1;sub=0'>Cancel Airlock Jack</a> <br>", [live(f.src)]), add);
	}
	return live(dat);
});

// /mob/living/silicon/pai/proc/hackloop  (code/modules/mob/living/silicon/pai/software.dm:601)  may sleep
rt.def("/mob/living/silicon/pai/proc/hackloop", function* hackloop(f: Frame) {
	let _T: Value = null, AI: Value = null;
	let $e: any;
	f.vars = () => [_T, AI, $e];
	_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0);
	AI = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AI = $e;
		if (truthy(rt.fv(f, "loc", live(_T)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<font color = red><b>Network Alert: Brute-force encryption crack in progress in ＀.</b></font>", [rt.fv(f, "loc", live(_T))])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(AI), "<font color = red><b>Network Alert: Brute-force encryption crack in progress. Unable to pinpoint location.</b></font>"]);
		}
	}
	rt.endFor(f, 0);
	while (rt.lt(rt.fv(f, "hackprogress", live(f.src)), 100)) {
		if (((((truthy(rt.fv(f, "cable", live(f.src))) && truthy(rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))))) && truthy((rt.istype(rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))), T("/obj/machinery/door")) ? 1 : 0))) && isEqual(rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))), rt.fv(f, "hackdoor", live(f.src)))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.fv(f, "hackdoor", live(f.src))])), 1))) {
			rt.modSrcVar(f, "hackprogress", (yield* g.call(f, P("/proc/rand"), null, [1, 10])), add);
		} else {
			rt.setFv(f, "temp", live(f.src), "Door Jack: Connection to airlock has been lost. Hack aborted.");
			rt.setSv(f, "hackprogress", 0);
			rt.setFv(f, "hackdoor", live(f.src), null);
			return live(f.dot);
		}
		if (rt.ge(rt.sv(f, "hackprogress"), 100)) {
			rt.setSv(f, "hackprogress", 100);
		}
		if ((isEqual(rt.fv(f, "screen", live(f.src)), "doorjack") && isEqual(rt.fv(f, "subscreen", live(f.src)), 0))) {
			yield* g.callName(f, live(f.src), "paiInterface", []);
		}
		if (rt.ge(rt.sv(f, "hackprogress"), 100)) {
			rt.setFv(f, "hackprogress", live(f.src), 0);
			yield* g.callName(f, rt.gv(f, "machine", rt.fv(f, "cable", live(f.src))), "open", []);
		}
		yield* g.call(f, P("/proc/sleep"), null, [50]);
	}
	return f.dot;
}, true);

// /mob/living/silicon/pai/proc/pdamessage  (code/modules/mob/living/silicon/pai/software.dm:627)  may sleep
rt.def("/mob/living/silicon/pai/proc/pdamessage", function* pdamessage(f: Frame) {
	let dat: Value = null, _P: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [dat, _P, $0, $1, $2, $3, $e];
	dat = "<h3>Digital Messenger</h3>";
	$0 = live(f.src);
	if (truthy(rt.fv(f, "toff", rt.sv(f, "pda")))) {
		$1 = "<font color='red'>[Off]</font>";
	} else {
		$1 = "<font color='green'>[On]</font>";
	}
	$2 = live(f.src);
	if (truthy(rt.fv(f, "silent", rt.sv(f, "pda")))) {
		$3 = "<font color='red'>[Off]</font>";
	} else {
		$3 = "<font color='green'>[On]</font>";
	}
	dat = rt.modify(live(dat), fmt("<b>Signal/Receiver Status:</b> <A href='byond://?src=＃;software=pdamessage;toggler=1'>\n\t＀</a><br>\n\t<b>Ringer Status:</b> <A href='byond://?src=＃;software=pdamessage;ringer=1'>\n\t＀</a><br><br>", [$0, $1, $2, $3]), add);
	dat = rt.modify(live(dat), "<ul>", add);
	if (!truthy(rt.fv(f, "toff", rt.sv(f, "pda")))) {
		_P = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/sortNames"), null, [(yield* g.call(f, P("/proc/get_viewable_pdas"), null, []))])), T("/obj/item/device/pda"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			if (isEqual(live(_P), rt.fv(f, "pda", live(f.src)))) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("<li><a href='byond://?src=＃;software=pdamessage;target=＃'>＀</a>", [live(f.src), live(_P), live(_P)]), add);
			dat = rt.modify(live(dat), "</li>", add);
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), "</ul>", add);
	dat = rt.modify(live(dat), "<br><br>", add);
	return (dat = rt.modify(live(dat), fmt("Messages: <hr> ＀", [rt.fv(f, "tnote", rt.sv(f, "pda"))]), add));
}, true);
