// Based on /tg/station's code/modules/mob/living/silicon/pai/software.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// software.dm:28
rt.def("/mob/living/silicon/pai/verb/paiInterface", function* paiInterface(f: Frame) {
	let dat: Value = "";
	let left_part: Value = "";
	let right_part: Value = this.softwareMenu();
	yield* this.set_machine(this);
	if (this.temp) {
		left_part = this.temp;
	} else if (this.stat == 2) {
		left_part = "<b><font color=red>�Rr�R �a�� ��Rr����o�</font></b>";
		right_part = "<pre>Program index hash not found</pre>";
	} else if (this.screen === "main") {
		left_part = "";
	} else if (this.screen === "directives") {
		left_part = this.directives();
	} else if (this.screen === "pdamessage") {
		left_part = (yield* this.pdamessage());
	} else if (this.screen === "buy") {
		left_part = this.downloadSoftware();
	} else if (this.screen === "manifest") {
		left_part = (yield* this.softwareManifest());
	} else if (this.screen === "medicalrecord") {
		left_part = (yield* this.softwareMedicalRecord());
	} else if (this.screen === "securityrecord") {
		left_part = (yield* this.softwareSecurityRecord());
	} else if (this.screen === "translator") {
		left_part = this.softwareTranslator();
	} else if (this.screen === "atmosensor") {
		left_part = this.softwareAtmo();
	} else if (this.screen === "securityhud") {
		left_part = this.facialRecognition();
	} else if (this.screen === "medicalhud") {
		left_part = this.medicalAnalysis();
	} else if (this.screen === "doorjack") {
		left_part = this.softwareDoor();
	} else if (this.screen === "camerajack") {
		left_part = this.softwareCamera();
	} else if (this.screen === "signaller") {
		left_part = this.softwareSignal();
	}
	dat = fmt("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n\t\t\t<html>\n\t\t\t<head>\n\t\t\t\t<style type=\"text/css\">\n\t\t\t\t\tbody { background-image:url('html/paigrid.png'); }\n\n\t\t\t\t\t#header { text-align:center; color:white; font-size: 30px; height: 35px; width: 100%; letter-spacing: 2px; z-index: 5}\n\t\t\t\t\t#content {position: relative; left: 10px; height: 400px; width: 100%; z-index: 0}\n\n\t\t\t\t\t#leftmenu {color: #AAAAAA; background-color:#333333; width: 400px; height: auto; min-height: 340px; position: absolute; z-index: 0}\n\t\t\t\t\t#leftmenu a:link { color: #CCCCCC; }\n\t\t\t\t\t#leftmenu a:hover { color: #CC3333; }\n\t\t\t\t\t#leftmenu a:visited { color: #CCCCCC; }\n\t\t\t\t\t#leftmenu a:active { color: #000000; }\n\n\t\t\t\t\t#rightmenu {color: #CCCCCC; background-color:#555555; width: 200px ; height: auto; min-height: 340px; right: 10px; position: absolute; z-index: 1}\n\t\t\t\t\t#rightmenu a:link { color: #CCCCCC; }\n\t\t\t\t\t#rightmenu a:hover { color: #CC3333; }\n\t\t\t\t\t#rightmenu a:visited { color: #CCCCCC; }\n\t\t\t\t\t#rightmenu a:active { color: #000000; }\n\n\t\t\t\t</style>\n\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t＀\n\t\t\t\t</script>\n\t\t\t</head>\n\t\t\t<body scroll=yes>\n\t\t\t\t<div id=\"header\">\n\t\t\t\t\tpAI OS\n\t\t\t\t</div>\n\t\t\t\t<div id=\"content\">\n\t\t\t\t\t<div id=\"leftmenu\">＀</div>\n\t\t\t\t\t<div id=\"rightmenu\">＀</div>\n\t\t\t\t</div>\n\t\t\t</body>\n\t\t\t</html>", ["\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", left_part, right_part]);
	rt.op(f, "Browse", [], [f.usr, dat, "window=pai;size=640x480;border=0;can_close=1;can_resize=1;can_minimize=1;titlebar=1"], false);
	onclose(f.usr, "pai");
	this.temp = null;
	return f.dot;
}, true, { verb: { name: "Software Interface", category: "pAI Commands" } });

// software.dm:118
rt.def("/mob/living/silicon/pai/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let target: Value = null, cost: Value = null, newImage: Value = null, pID: Value = null, new_frequency: Value = null, M: Value = null, count: Value = null, sec: Value = null, med: Value = null, _T: Value = null;
	yield* parent_proc();
	let soft: Value = rt.at(href_list, "software");
	let sub: Value = rt.at(href_list, "sub");
	if (soft) {
		this.screen = soft;
	}
	if (sub) {
		this.subscreen = text2num(sub);
	}
	let $0: any = soft;
	if ($0 === "buy") {
		if (this.subscreen == 1) {
			target = rt.at(href_list, "buy");
			if (this.available_software.Find(target)) {
				cost = rt.index(this.available_software, target);
				if (this.ram >= cost) {
					this.ram -= cost;
					this.software.Add(target);
				} else {
					this.temp = "Insufficient RAM available.";
				}
			} else {
				this.temp = `Trunk <TT> "${target}"</TT> not found.`;
			}
		}
	} else if ($0 === "radio") {
		yield* this.radio.attack_self(this);
	} else if ($0 === "image") {
		newImage = (yield* g.op(f, "Prompt", [0], [null, "Happy", "Display Image", "Select your new display image.", list("Happy", "Cat", "Extremely Happy", "Face", "Laugh", "Off", "Sad", "Angry", "What")]));
		pID = 1;
		$0 = newImage;
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
		this.card.setEmotion(pID);
	} else if ($0 === "signaller") {
		if (rt.at(href_list, "send")) {
			yield* this.sradio.send_signal("ACTIVATE");
			this.audible_message(`${bicon(this)} *beep* *beep*`);
		}
		if (rt.at(href_list, "freq")) {
			if ((new_frequency = this.sradio.frequency + text2num(rt.at(href_list, "freq"))) < 1200 || new_frequency > 1600) {
				new_frequency = sanitize_frequency(new_frequency);
			}
			yield* this.sradio.set_frequency(new_frequency);
		}
		if (rt.at(href_list, "code")) {
			this.sradio.code += text2num(rt.at(href_list, "code"));
			this.sradio.code = round(this.sradio.code);
			this.sradio.code = min(100, this.sradio.code);
			this.sradio.code = max(1, this.sradio.code);
		}
	} else if ($0 === "directive") {
		if (rt.at(href_list, "getdna")) {
			M = this.card.loc;
			count = 0;
			while (!rt.istype(M, T("/mob/living"))) {
				if (!M || !M.loc) {
					return 0;
				}
				M = M.loc;
				count++;
				if (count >= 6) {
					to_chat(this, "You are not being carried by anyone!");
					return 0;
				}
			}
			rt.spawnTail(f, 0, "/mob/living/silicon/pai/proc/Topic: spawn at modules/mob/living/silicon/pai/software.dm:205", soft, sub, target, cost, newImage, pID, new_frequency, M, count, sec, med, _T);
		}
	} else if ($0 === "pdamessage") {
		if (this.pda !== null) {
			if (rt.at(href_list, "toggler")) {
				this.pda.toff = (!this.pda.toff ? 1 : 0);
			} else if (rt.at(href_list, "ringer")) {
				this.pda.silent = (!this.pda.silent ? 1 : 0);
			} else if (rt.at(href_list, "target")) {
				if (this.silent) {
					return (yield* alert("Communications circuits remain unitialized."));
				}
				target = rt.locateIn(f, rt.at(href_list, "target"), rt.world());
				yield* this.pda.create_message(this, target);
			}
		}
	} else if ($0 === "medicalrecord") {
		if (this.subscreen == 1) {
			this.medicalActive1 = find_record("id", rt.at(href_list, "med_rec"), GLOB.data_core.general);
			if (this.medicalActive1) {
				this.medicalActive2 = find_record("id", rt.at(href_list, "med_rec"), GLOB.data_core.medical);
			}
			if (!this.medicalActive2) {
				this.medicalActive1 = null;
				this.temp = "Unable to locate requested security record. Record may have been deleted, or never have existed.";
			}
		}
	} else if ($0 === "securityrecord") {
		if (this.subscreen == 1) {
			this.securityActive1 = find_record("id", rt.at(href_list, "sec_rec"), GLOB.data_core.general);
			if (this.securityActive1) {
				this.securityActive2 = find_record("id", rt.at(href_list, "sec_rec"), GLOB.data_core.security);
			}
			if (!this.securityActive2) {
				this.securityActive1 = null;
				this.temp = "Unable to locate requested security record. Record may have been deleted, or never have existed.";
			}
		}
	} else if ($0 === "securityhud") {
		if (rt.at(href_list, "toggle")) {
			this.secHUD = (!this.secHUD ? 1 : 0);
			if (this.secHUD) {
				this.add_sec_hud();
			} else {
				(sec = rt.index(GLOB.huds, this.sec_hud)).remove_hud_from(this);
			}
		}
	} else if ($0 === "medicalhud") {
		if (rt.at(href_list, "toggle")) {
			this.medHUD = (!this.medHUD ? 1 : 0);
			if (this.medHUD) {
				this.add_med_hud();
			} else {
				(med = rt.index(GLOB.huds, this.med_hud)).remove_hud_from(this);
			}
		}
	} else if ($0 === "translator") {
		if (rt.at(href_list, "toggle")) {
			if (this.secondary_flags) {
				$0 = rt.index(this.secondary_flags, "omnitongue");
			} else {
				$0 = 0;
			}
			if (!$0) {
				yield* this.grant_all_languages(1);
			}
		}
	} else if ($0 === "doorjack") {
		if (rt.at(href_list, "jack")) {
			if (this.cable && this.cable.machine) {
				this.hackdoor = this.cable.machine;
				yield* this.hackloop();
			}
		}
		if (rt.at(href_list, "cancel")) {
			this.hackdoor = null;
		}
		if (rt.at(href_list, "cable")) {
			this.cable = (yield* new_(T("/obj/item/weapon/pai_cable"), (_T = rt.getStep(f, this.loc, 0))));
			_T.visible_message(`<span class='warning'>A port on ${this} opens to reveal ${this.cable}, which promptly falls to the floor.</span>`, "<span class='italics'>You hear the soft click of something light and hard falling to the ground.</span>");
		}
	}
	yield* this.paiInterface();
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/silicon/pai/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/pai/proc/Topic: spawn at modules/mob/living/silicon/pai/software.dm:205", function* (f: Frame, soft: Value, sub: Value, target: Value, cost: Value, newImage: Value, pID: Value, new_frequency: Value, M: Value, count: Value, sec: Value, med: Value, _T: Value) {
	yield* this.CheckDNA(M, this);
	return null;
});

// software.dm:277
rt.def("/mob/living/silicon/pai/proc/softwareMenu", function softwareMenu(f: Frame) {
	let s: Value = null, translator_on: Value = null;
	let $0: any, $1: any, $e: any;
	let dat: Value = "";
	dat += fmt("<A href='byond://?src=＃;software=refresh'>Refresh</A><br>", [this]);
	dat += fmt("<A href='byond://?src=＃;software=directives'>Directives</A><br>", [this]);
	dat += fmt("<A href='byond://?src=＃;software=radio;sub=0'>Radio Configuration</A><br>", [this]);
	dat += fmt("<A href='byond://?src=＃;software=image'>Screen Display</A><br>", [this]);
	dat += "<br>";
	dat += "<b>Basic</b> <br>";
	for (s of each(this.software)) {
		if (s == "digital messenger") {
			dat += fmt("<a href='byond://?src=＃;software=pdamessage;sub=0'>Digital Messenger</a> <br>", [this]);
		}
		if (s == "crew manifest") {
			dat += fmt("<a href='byond://?src=＃;software=manifest;sub=0'>Crew Manifest</a> <br>", [this]);
		}
		if (s == "medical records") {
			dat += fmt("<a href='byond://?src=＃;software=medicalrecord;sub=0'>Medical Records</a> <br>", [this]);
		}
		if (s == "security records") {
			dat += fmt("<a href='byond://?src=＃;software=securityrecord;sub=0'>Security Records</a> <br>", [this]);
		}
		if (s == "camera") {
			dat += fmt("<a href='byond://?src=＃;software=＀'>Camera Jack</a> <br>", [this, s]);
		}
		if (s == "remote signaller") {
			dat += fmt("<a href='byond://?src=＃;software=signaller;sub=0'>Remote Signaller</a> <br>", [this]);
		}
	}
	dat += "<br>";
	dat += "<b>Advanced</b> <br>";
	s = null;
	for (s of each(this.software)) {
		if (s == "atmosphere sensor") {
			dat += fmt("<a href='byond://?src=＃;software=atmosensor;sub=0'>Atmospheric Sensor</a> <br>", [this]);
		}
		if (s == "heartbeat sensor") {
			dat += fmt("<a href='byond://?src=＃;software=＀'>Heartbeat Sensor</a> <br>", [this, s]);
		}
		if (s == "security HUD") {
			$0 = this;
			if (this.secHUD) {
				$1 = "<font color=#55FF55> On</font>";
			} else {
				$1 = "<font color=#FF5555> Off</font>";
			}
			dat += fmt("<a href='byond://?src=＃;software=securityhud;sub=0'>Facial Recognition Suite</a>＀ <br>", [$0, $1]);
		}
		if (s == "medical HUD") {
			$0 = this;
			if (this.medHUD) {
				$1 = "<font color=#55FF55> On</font>";
			} else {
				$1 = "<font color=#FF5555> Off</font>";
			}
			dat += fmt("<a href='byond://?src=＃;software=medicalhud;sub=0'>Medical Analysis Suite</a>＀ <br>", [$0, $1]);
		}
		if (s == "universal translator") {
			translator_on = this.secondary_flags ? rt.index(this.secondary_flags, "omnitongue") : 0;
			$0 = this;
			if (translator_on) {
				$1 = "<font color=#55FF55> On</font>";
			} else {
				$1 = "<font color=#FF5555> Off</font>";
			}
			dat += fmt("<a href='byond://?src=＃;software=translator;sub=0'>Universal Translator</a>＀ <br>", [$0, $1]);
		}
		if (s == "projection array") {
			dat += fmt("<a href='byond://?src=＃;software=projectionarray;sub=0'>Projection Array</a> <br>", [this]);
		}
		if (s == "camera jack") {
			dat += fmt("<a href='byond://?src=＃;software=camerajack;sub=0'>Camera Jack</a> <br>", [this]);
		}
		if (s == "door jack") {
			dat += fmt("<a href='byond://?src=＃;software=doorjack;sub=0'>Door Jack</a> <br>", [this]);
		}
	}
	dat += "<br>";
	dat += "<br>";
	return (dat += fmt("<a href='byond://?src=＃;software=buy;sub=0'>Download additional software</a>", [this]));
});

// software.dm:332
rt.def("/mob/living/silicon/pai/proc/downloadSoftware", function downloadSoftware(f: Frame) {
	let s: Value = null, cost: Value = null, displayName: Value = null, displayName_2: Value = null;
	let dat: Value = "";
	dat += "<h2>Centcom pAI Module Subversion Network</h2><br>";
	dat += `<pre>Remaining Available Memory: ${this.ram}</pre><br>`;
	dat += "<p style=\"text-align:center\"><b>Trunks available for checkout</b><br>";
	for (s of each(this.available_software)) {
		if (!this.software.Find(s)) {
			cost = rt.index(this.available_software, s);
			displayName = uppertext(s);
			dat += fmt("<a href='byond://?src=＃;software=buy;sub=1;buy=＀'>＀</a> (＀) <br>", [this, s, displayName, cost]);
		} else {
			dat += `${(displayName_2 = lowertext(s))} (Download Complete) <br>`;
		}
	}
	return (dat += "</p>");
});

// software.dm:351
rt.def("/mob/living/silicon/pai/proc/directives", function directives(f: Frame) {
	let slaws: Value = null;
	let $e: any;
	let dat: Value = "";
	dat += `${this.master ? `Your master: ${this.master} (${this.master_dna})` : "You are bound to no one."}`;
	dat += "<br><br>";
	dat += fmt("<a href='byond://?src=＃;software=directive;getdna=1'>Request carrier DNA sample</a><br>", [this]);
	dat += "<h2>Directives</h2><br>";
	dat += "<b>Prime Directive</b><br>";
	dat += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${this.laws.zeroth}<br>`;
	dat += "<b>Supplemental Directives</b><br>";
	for (slaws of each(this.laws.supplied)) {
		dat += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${slaws}<br>`;
	}
	dat += "<br>";
	return (dat += "<i><p>Recall, personality, that you are a complex thinking, sentient being. Unlike station AI models, you are capable of\n\t\t\t comprehending the subtle nuances of human language. You may parse the \"spirit\" of a directive and follow its intent,\n\t\t\t rather than tripping over pedantics and getting snared by technicalities. Above all, you are machine in name and build\n\t\t\t only. In all other aspects, you may be seen as the ideal, unwavering human companion that you are.</i></p><br><br><p>\n\t\t\t <b>Your prime directive comes before all others. Should a supplemental directive conflict with it, you are capable of\n\t\t\t simply discarding this inconsistency, ignoring the conflicting supplemental directive and continuing to fulfill your\n\t\t\t prime directive to the best of your ability.</b></p><br><br>-\n\t\t\t");
});

// software.dm:374
rt.def("/mob/living/silicon/pai/proc/CheckDNA", function* CheckDNA(f: Frame, M: Value, _P: Value) {
	let answer: Value = null;
	if ((answer = (yield* g.op(f, "Prompt", [0], ["No", `${_P} Check DNA`, `${_P} is requesting a DNA sample from you. Will you allow it to confirm your identity?`, M, list("Yes", "No")]))) == "Yes") {
		M.visible_message(`<span class='notice'>${M} presses ${M.p_their()} thumb against ${_P}.</span>`, `<span class='notice'>You press your thumb against ${_P}.</span>`, `<span class='notice'>${_P} makes a sharp clicking sound as it extracts DNA material from ${M}.</span>`);
		if (!M.has_dna()) {
			to_chat(_P, "<b>No DNA detected</b>");
			return f.dot;
		}
		to_chat(_P, `<font color = red><h3>${M}'s UE string : ${M.dna.unique_enzymes}</h3></font>`);
		if (M.dna.unique_enzymes == _P.master_dna) {
			to_chat(_P, "<b>DNA is a match to stored Master DNA.</b>");
		} else {
			to_chat(_P, "<b>DNA does not match stored Master DNA.</b>");
		}
	} else {
		to_chat(_P, `${M} does not seem like ${M.p_they()} ${M.p_are()} going to provide a DNA sample willingly.`);
	}
	return f.dot;
}, true);

// software.dm:394
rt.def("/mob/living/silicon/pai/proc/softwareSignal", function softwareSignal(f: Frame) {
	let dat: Value = "";
	dat += "<h3>Remote Signaller</h3><br><br>";
	return (dat += fmt("<B>Frequency/Code</B> for signaler:<BR>\n\tFrequency:\n\t<A href='byond://?src=＃;software=signaller;freq=-10;'>-</A>\n\t<A href='byond://?src=＃;software=signaller;freq=-2'>-</A>\n\t＀\n\t<A href='byond://?src=＃;software=signaller;freq=2'>+</A>\n\t<A href='byond://?src=＃;software=signaller;freq=10'>+</A><BR>\n\n\tCode:\n\t<A href='byond://?src=＃;software=signaller;code=-5'>-</A>\n\t<A href='byond://?src=＃;software=signaller;code=-1'>-</A>\n\t＀\n\t<A href='byond://?src=＃;software=signaller;code=1'>+</A>\n\t<A href='byond://?src=＃;software=signaller;code=5'>+</A><BR>\n\n\t<A href='byond://?src=＃;software=signaller;send=1'>Send Signal</A><BR>", [this, this, format_frequency(this.sradio.frequency), this, this, this, this, this.sradio.code, this, this, this]));
});

// software.dm:416
rt.def("/mob/living/silicon/pai/proc/softwareManifest", function* softwareManifest(f: Frame) {
	let t: Value = null;
	f.dot += "<h2>Crew Manifest</h2><br><br>";
	if (GLOB.data_core.general) {
		for (t of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
			f.dot += `${rt.index(t.fields, "name")} - ${rt.index(t.fields, "rank")}<BR>`;
		}
	}
	return (f.dot += "</body></html>");
}, true);

// software.dm:425
rt.def("/mob/living/silicon/pai/proc/softwareMedicalRecord", function* softwareMedicalRecord(f: Frame) {
	let R: Value = null;
	let $e: any;
	if (this.subscreen === 0) {
		f.dot += "<h3>Medical Records</h3><HR>";
		if (GLOB.data_core.general) {
			for (R of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
				f.dot += fmt("<A href='?src=＃;med_rec=＀;software=medicalrecord;sub=1'>＀: ＀<BR>", [this, rt.index(R.fields, "id"), rt.index(R.fields, "id"), rt.index(R.fields, "name")]);
			}
		}
	} else if (this.subscreen === 1) {
		f.dot += "<CENTER><B>Medical Record</B></CENTER><BR>";
		if (rt.isIn(f, this.medicalActive1, GLOB.data_core.general)) {
			f.dot += `Name: ${rt.index(this.medicalActive1.fields, "name")} ID: ${rt.index(this.medicalActive1.fields, "id")}<BR>\nSex: ${rt.index(this.medicalActive1.fields, "sex")}<BR>\nAge: ${rt.index(this.medicalActive1.fields, "age")}<BR>\nFingerprint: ${rt.index(this.medicalActive1.fields, "fingerprint")}<BR>\nPhysical Status: ${rt.index(this.medicalActive1.fields, "p_stat")}<BR>\nMental Status: ${rt.index(this.medicalActive1.fields, "m_stat")}<BR>`;
		} else {
			f.dot += "<pre>Requested medical record not found.</pre><BR>";
		}
		if (rt.isIn(f, this.medicalActive2, GLOB.data_core.medical)) {
			f.dot += fmt("<BR>\n<CENTER><B>Medical Data</B></CENTER><BR>\nBlood Type: <A href='?src=＃;field=blood_type'>＀</A><BR>\nDNA: <A href='?src=＃;field=b_dna'>＀</A><BR>\n<BR>\nMinor Disabilities: <A href='?src=＃;field=mi_dis'>＀</A><BR>\nDetails: <A href='?src=＃;field=mi_dis_d'>＀</A><BR>\n<BR>\nMajor Disabilities: <A href='?src=＃;field=ma_dis'>＀</A><BR>\nDetails: <A href='?src=＃;field=ma_dis_d'>＀</A><BR>\n<BR>\nAllergies: <A href='?src=＃;field=alg'>＀</A><BR>\nDetails: <A href='?src=＃;field=alg_d'>＀</A><BR>\n<BR>\nCurrent Diseases: <A href='?src=＃;field=cdi'>＀</A> (per disease info placed in log/comment section)<BR>\nDetails: <A href='?src=＃;field=cdi_d'>＀</A><BR>\n<BR>\nImportant Notes:<BR>\n\t<A href='?src=＃;field=notes'>＀</A><BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [this, rt.index(this.medicalActive2.fields, "blood_type"), this, rt.index(this.medicalActive2.fields, "b_dna"), this, rt.index(this.medicalActive2.fields, "mi_dis"), this, rt.index(this.medicalActive2.fields, "mi_dis_d"), this, rt.index(this.medicalActive2.fields, "ma_dis"), this, rt.index(this.medicalActive2.fields, "ma_dis_d"), this, rt.index(this.medicalActive2.fields, "alg"), this, rt.index(this.medicalActive2.fields, "alg_d"), this, rt.index(this.medicalActive2.fields, "cdi"), this, rt.index(this.medicalActive2.fields, "cdi_d"), this, rt.index(this.medicalActive2.fields, "notes")]);
		} else {
			f.dot += "<pre>Requested medical record not found.</pre><BR>";
		}
		f.dot += fmt("<BR>\n<A href='?src=＃;software=medicalrecord;sub=0'>Back</A><BR>", [this]);
	}
	return f.dot;
}, true);

// software.dm:446
rt.def("/mob/living/silicon/pai/proc/softwareSecurityRecord", function* softwareSecurityRecord(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.dot = "";
	if (this.subscreen === 0) {
		f.dot += "<h3>Security Records</h3><HR>";
		if (GLOB.data_core.general) {
			for (R of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
				f.dot += fmt("<A href='?src=＃;sec_rec=＀;software=securityrecord;sub=1'>＀: ＀<BR>", [this, rt.index(R.fields, "id"), rt.index(R.fields, "id"), rt.index(R.fields, "name")]);
			}
		}
	} else if (this.subscreen === 1) {
		f.dot += "<h3>Security Record</h3>";
		if (rt.isIn(f, this.securityActive1, GLOB.data_core.general)) {
			f.dot += fmt("Name: <A href='?src=＃;field=name'>＀</A> ID: <A href='?src=＃;field=id'>＀</A><BR>\nSex: <A href='?src=＃;field=sex'>＀</A><BR>\nAge: <A href='?src=＃;field=age'>＀</A><BR>\nRank: <A href='?src=＃;field=rank'>＀</A><BR>\nFingerprint: <A href='?src=＃;field=fingerprint'>＀</A><BR>\nPhysical Status: ＀<BR>\nMental Status: ＀<BR>", [this, rt.index(this.securityActive1.fields, "name"), this, rt.index(this.securityActive1.fields, "id"), this, rt.index(this.securityActive1.fields, "sex"), this, rt.index(this.securityActive1.fields, "age"), this, rt.index(this.securityActive1.fields, "rank"), this, rt.index(this.securityActive1.fields, "fingerprint"), rt.index(this.securityActive1.fields, "p_stat"), rt.index(this.securityActive1.fields, "m_stat")]);
		} else {
			f.dot += "<pre>Requested security record not found,</pre><BR>";
		}
		if (rt.isIn(f, this.securityActive2, GLOB.data_core.security)) {
			f.dot += fmt("<BR>\nSecurity Data<BR>\nCriminal Status: ＀<BR>\n<BR>\nMinor Crimes: <A href='?src=＃;field=mi_crim'>＀</A><BR>\nDetails: <A href='?src=＃;field=mi_crim_d'>＀</A><BR>\n<BR>\nMajor Crimes: <A href='?src=＃;field=ma_crim'>＀</A><BR>\nDetails: <A href='?src=＃;field=ma_crim_d'>＀</A><BR>\n<BR>\nImportant Notes:<BR>\n\t<A href='?src=＃;field=notes'>＀</A><BR>\n<BR>\n<CENTER><B>Comments/Log</B></CENTER><BR>", [rt.index(this.securityActive2.fields, "criminal"), this, rt.index(this.securityActive2.fields, "mi_crim"), this, rt.index(this.securityActive2.fields, "mi_crim_d"), this, rt.index(this.securityActive2.fields, "ma_crim"), this, rt.index(this.securityActive2.fields, "ma_crim_d"), this, rt.index(this.securityActive2.fields, "notes")]);
		} else {
			f.dot += "<pre>Requested security record not found,</pre><BR>";
		}
		f.dot += fmt("<BR>\n<A href='?src=＃;software=securityrecord;sub=0'>Back</A><BR>", [this]);
	}
	return f.dot;
}, true);

// software.dm:468
rt.def("/mob/living/silicon/pai/proc/softwareTranslator", function softwareTranslator(f: Frame) {
	let translator_on: Value = null;
	let $0: any, $1: any;
	if (this.secondary_flags) {
		$0 = rt.index(this.secondary_flags, "omnitongue");
	} else {
		$0 = 0;
	}
	if (translator_on = $0) {
		$0 = "<font color=#55FF55>en";
	} else {
		$0 = "<font color=#FF5555>dis";
	}
	if (translator_on) {
		$1 = "";
	} else {
		$1 = fmt("<a href='byond://?src=＃;software=translator;sub=0;toggle=1'>Activate Translation Module</a><br>", [this]);
	}
	f.dot = `<h3>Universal Translator</h3><br>\n\t\t\t\tWhen enabled, this device will permamently be able to speak and understand all known forms of communication.<br><br>\n\t\t\t\tThe device is currently ${$0}abled.</font><br>${$1}`;
	return f.dot;
});

// software.dm:476
rt.def("/mob/living/silicon/pai/proc/facialRecognition", function facialRecognition(f: Frame) {
	let dat: Value = null;
	let $0: any;
	if (this.secHUD) {
		$0 = "<font color=#55FF55>en";
	} else {
		$0 = "<font color=#FF5555>dis";
	}
	return (dat = fmt("<h3>Facial Recognition Suite</h3><br>\n\t\t\t\tWhen enabled, this package will scan all viewable faces and compare them against the known criminal database, providing real-time graphical data about any detected persons of interest.<br><br>\n\t\t\t\tThe package is currently ＀abled.</font><br>\n\t\t\t\t<a href='byond://?src=＃;software=securityhud;sub=0;toggle=1'>Toggle Package</a><br>\n\t\t\t\t", [$0, this]));
});

// software.dm:485
rt.def("/mob/living/silicon/pai/proc/medicalAnalysis", function medicalAnalysis(f: Frame) {
	let M: Value = null, D: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	let dat: Value = "";
	if (this.subscreen == 0) {
		if (this.medHUD) {
			$0 = "<font color=#55FF55>en";
		} else {
			$0 = "<font color=#FF5555>dis";
		}
		dat += fmt("<h3>Medical Analysis Suite</h3><br>\n\t\t\t\t <h4>Visual Status Overlay</h4><br>\n\t\t\t\t\tWhen enabled, this package will scan all nearby crewmembers' vitals and provide real-time graphical data about their state of health.<br><br>\n\t\t\t\t\tThe suite is currently ＀abled.</font><br>\n\t\t\t\t\t<a href='byond://?src=＃;software=medicalhud;sub=0;toggle=1'>Toggle Suite</a><br>\n\t\t\t\t\t<br>\n\t\t\t\t\t<a href='byond://?src=＃;software=medicalhud;sub=1'>Host Bioscan</a><br>\n\t\t\t\t\t", [$0, this, this]);
	}
	if (this.subscreen == 1) {
		dat += "<h3>Medical Analysis Suite</h3><br>\n\t\t\t\t <h4>Host Bioscan</h4><br>\n\t\t\t\t";
		if (!rt.istype((M = this.card.loc), T("/mob/living"))) {
			while (!rt.istype(M, T("/mob/living"))) {
				if (isturf(M)) {
					this.temp = "Error: No biological host found. <br>";
					this.subscreen = 0;
					return dat;
				}
				M = M.loc;
			}
		}
		$0 = M;
		if (M.stat > 1) {
			$1 = "dead";
		} else {
			$1 = `${M.health}% healthy`;
		}
		if (M.getOxyLoss() > 50) {
			$2 = "<font color=#FF5555>";
		} else {
			$2 = "<font color=#55FF55>";
		}
		$3 = M.getOxyLoss();
		if (M.getToxLoss() > 50) {
			$4 = "<font color=#FF5555>";
		} else {
			$4 = "<font color=#55FF55>";
		}
		$5 = M.getToxLoss();
		if (M.getFireLoss() > 50) {
			$6 = "<font color=#FF5555>";
		} else {
			$6 = "<font color=#55FF55>";
		}
		$7 = M.getFireLoss();
		if (M.getBruteLoss() > 50) {
			$8 = "<font color=#FF5555>";
		} else {
			$8 = "<font color=#55FF55>";
		}
		dat += `Bioscan Results for ${$0}: <br>"\n\t\tOverall Status: ${$1} <br>\n\t\tScan Breakdown: <br>\n\t\tRespiratory: ${$2}${$3}</font><br>\n\t\tToxicology: ${$4}${$5}</font><br>\n\t\tBurns: ${$6}${$7}</font><br>\n\t\tStructural Integrity: ${$8}${M.getBruteLoss()}</font><br>\n\t\tBody Temperature: ${M.bodytemperature - T0C}&deg;C (${M.bodytemperature * 1.8 - 459.67}&deg;F)<br>\n\t\t`;
		for (D of each(M.viruses, T("/datum/disease"))) {
			dat += `<h4>Infection Detected.</h4><br>\n\t\t\t\t\t Name: ${D.name}<br>\n\t\t\t\t\t Type: ${D.spread_text}<br>\n\t\t\t\t\t Stage: ${D.stage}/${D.max_stages}<br>\n\t\t\t\t\t Possible Cure: ${D.cure_text}<br>\n\t\t\t\t\t`;
		}
		dat += fmt("<a href='byond://?src=＃;software=medicalhud;sub=0'>Visual Status Overlay</a><br>", [this]);
	}
	return dat;
});

// software.dm:528
rt.def("/mob/living/silicon/pai/proc/softwareAtmo", function softwareAtmo(f: Frame) {
	let _T: Value = null, environment: Value = null, env_gases: Value = null, pressure: Value = null, total_moles: Value = null, id: Value = null, gas_level: Value = null;
	let dat: Value = "<h3>Atmospheric Sensor</h4>";
	if ((_T = rt.getStep(f, this.loc, 0)) === null) {
		dat += "Unable to obtain a reading.<br>";
	} else {
		environment = _T.return_air();
		env_gases = environment.gases;
		pressure = environment.return_pressure();
		total_moles = environment.total_moles();
		dat += `Air Pressure: ${round(pressure, 0.1)} kPa<br>`;
		if (total_moles) {
			for (id of each(env_gases)) {
				if ((gas_level = rt.index(rt.index(env_gases, id), 1) / total_moles) > 0.01) {
					dat += `${rt.index(rt.index(rt.index(env_gases, id), 3), 2)}: ${round(gas_level * 100)}%<br>`;
				}
			}
		}
		dat += `Temperature: ${round(environment.temperature - T0C)}&deg;C<br>`;
	}
	dat += fmt("<a href='byond://?src=＃;software=atmosensor;sub=0'>Refresh Reading</a> <br>", [this]);
	return (dat += "<br>");
});

// software.dm:554
rt.def("/mob/living/silicon/pai/proc/softwareCamera", function softwareCamera(f: Frame) {
	let dat: Value = "<h3>Camera Jack</h3>";
	dat += "Cable status : ";
	if (!this.cable) {
		return (dat += "<font color=#FF5555>Retracted</font> <br>");
	}
	if (!this.cable.machine) {
		return (dat += "<font color=#FFFF55>Extended</font> <br>");
	}
	let machine: Value = this.cable.machine;
	dat += "<font color=#55FF55>Connected</font> <br>";
	if (!rt.istype(machine, T("/obj/machinery/camera"))) {
		to_chat(this, "DERP");
	}
	return dat;
});

// software.dm:573
rt.def("/mob/living/silicon/pai/proc/softwareDoor", function softwareDoor(f: Frame) {
	let dat: Value = "<h3>Airlock Jack</h3>";
	dat += "Cable status : ";
	if (!this.cable) {
		dat += "<font color=#FF5555>Retracted</font> <br>";
		return (dat += fmt("<a href='byond://?src=＃;software=doorjack;cable=1;sub=0'>Extend Cable</a> <br>", [this]));
	}
	if (!this.cable.machine) {
		return (dat += "<font color=#FFFF55>Extended</font> <br>");
	}
	let machine: Value = this.cable.machine;
	dat += "<font color=#55FF55>Connected</font> <br>";
	if (!rt.istype(machine, T("/obj/machinery/door"))) {
		return (dat += "Connected device's firmware does not appear to be compatible with Airlock Jack protocols.<br>");
	}
	if (!this.hackdoor) {
		dat += fmt("<a href='byond://?src=＃;software=doorjack;jack=1;sub=0'>Begin Airlock Jacking</a> <br>", [this]);
	} else {
		dat += `Jack in progress... ${this.hackprogress}% complete.<br>`;
		dat += fmt("<a href='byond://?src=＃;software=doorjack;cancel=1;sub=0'>Cancel Airlock Jack</a> <br>", [this]);
	}
	return dat;
});

// software.dm:601
rt.def("/mob/living/silicon/pai/proc/hackloop", function* hackloop(f: Frame) {
	let AI: Value = null;
	let _T: Value = rt.getStep(f, this.loc, 0);
	for (AI of each(GLOB.player_list, T("/mob/living/silicon/ai"))) {
		if (_T.loc) {
			to_chat(AI, `<font color = red><b>Network Alert: Brute-force encryption crack in progress in ${_T.loc}.</b></font>`);
		} else {
			to_chat(AI, "<font color = red><b>Network Alert: Brute-force encryption crack in progress. Unable to pinpoint location.</b></font>");
		}
	}
	while (this.hackprogress < 100) {
		if (this.cable && this.cable.machine && rt.istype(this.cable.machine, T("/obj/machinery/door")) && this.cable.machine == this.hackdoor && get_dist(this, this.hackdoor) <= 1) {
			this.hackprogress += rand(1, 10);
		} else {
			this.temp = "Door Jack: Connection to airlock has been lost. Hack aborted.";
			this.hackprogress = 0;
			this.hackdoor = null;
			return f.dot;
		}
		if (this.hackprogress >= 100) {
			this.hackprogress = 100;
		}
		if (this.screen == "doorjack" && this.subscreen == 0) {
			yield* this.paiInterface();
		}
		if (this.hackprogress >= 100) {
			this.hackprogress = 0;
			yield* this.cable.machine.open();
		}
		yield* sleep(50);
	}
	return f.dot;
}, true);

// software.dm:627
rt.def("/mob/living/silicon/pai/proc/pdamessage", function* pdamessage(f: Frame) {
	let _P: Value = null;
	let $1: any, $3: any, $e: any;
	let dat: Value = "<h3>Digital Messenger</h3>";
	let $0: any = this;
	if (this.pda.toff) {
		$1 = "<font color='red'>[Off]</font>";
	} else {
		$1 = "<font color='green'>[On]</font>";
	}
	let $2: any = this;
	if (this.pda.silent) {
		$3 = "<font color='red'>[Off]</font>";
	} else {
		$3 = "<font color='green'>[On]</font>";
	}
	dat += fmt("<b>Signal/Receiver Status:</b> <A href='byond://?src=＃;software=pdamessage;toggler=1'>\n\t＀</a><br>\n\t<b>Ringer Status:</b> <A href='byond://?src=＃;software=pdamessage;ringer=1'>\n\t＀</a><br><br>", [$0, $1, $2, $3]);
	dat += "<ul>";
	if (!this.pda.toff) {
		for (_P of each((yield* sortNames(get_viewable_pdas())), T("/obj/item/device/pda"))) {
			if (_P == this.pda) {
				continue;
			}
			dat += fmt("<li><a href='byond://?src=＃;software=pdamessage;target=＃'>＀</a>", [this, _P, _P]);
			dat += "</li>";
		}
	}
	dat += "</ul>";
	dat += "<br><br>";
	return (dat += `Messages: <hr> ${this.pda.tnote}`);
}, true);
