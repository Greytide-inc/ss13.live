// From code/game/mecha/mecha_topic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/mecha/proc/get_stats_html  (code/game/mecha/mecha_topic.dm:7)
rt.def("/obj/mecha/proc/get_stats_html", function get_stats_html(f: Frame) {
	f.dot = fmt("<html>\n\t\t\t\t\t\t<head><title>＀ data</title>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\tbody {color: #00ff00; background: #000000; font-family:\"Lucida Console\",monospace; font-size: 12px;}\n\t\t\t\t\t\thr {border: 1px solid #0f0; color: #0f0; background-color: #0f0;}\n\t\t\t\t\t\ta {padding:2px 5px;;color:#0f0;}\n\t\t\t\t\t\t.wr {margin-bottom: 5px;}\n\t\t\t\t\t\t.header {cursor:pointer;}\n\t\t\t\t\t\t.open, .closed {background: #32CD32; color:#000; padding:1px 2px;}\n\t\t\t\t\t\t.links a {margin-bottom: 2px;padding-top:3px;}\n\t\t\t\t\t\t.visible {display: block;}\n\t\t\t\t\t\t.hidden {display: none;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\tfunction SSticker() {\n\t\t\t\t\t\t    setInterval(function(){\n\t\t\t\t\t\t        window.location='byond://?src=＃&update_content=1';\n\t\t\t\t\t\t    }, 1000);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\twindow.onload = function() {\n\t\t\t\t\t\t\tdropdowns();\n\t\t\t\t\t\t\tSSticker();\n\t\t\t\t\t\t}\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<div id='content'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id='eq_list'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t<div id='commands'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>\n\t\t\t\t\t ", [rt.fv(f, "name", live(f.src)), "\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", "\nfunction dropdowns() {\n    var divs = document.getElementsByTagName('div');\n    var headers = new Array();\n    var links = new Array();\n    for(var i=0;i<divs.length;i++){\n        if(divs[i].className=='header') {\n            divs[i].className='header closed';\n            divs[i].innerHTML = divs[i].innerHTML+' +';\n            headers.push(divs[i]);\n        }\n        if(divs[i].className=='links') {\n            divs[i].className='links hidden';\n            links.push(divs[i]);\n        }\n    }\n    for(var i=0;i<headers.length;i++){\n        if(typeof(links[i])!== 'undefined' && links[i]!=null) {\n            headers[i].onclick = (function(elem) {\n                return function() {\n                    if(elem.className.search('visible')>=0) {\n                        elem.className = elem.className.replace('visible','hidden');\n                        this.className = this.className.replace('open','closed');\n                        this.innerHTML = this.innerHTML.replace('-','+');\n                    }\n                    else {\n                        elem.className = elem.className.replace('hidden','visible');\n                        this.className = this.className.replace('closed','open');\n                        this.innerHTML = this.innerHTML.replace('+','-');\n                    }\n                return false;\n                }\n            })(links[i]);\n        }\n    }\n}\n", live(f.src), rt.callName(f, live(f.src), "get_stats_part", []), rt.callName(f, live(f.src), "get_equipment_list", []), rt.callName(f, live(f.src), "get_commands", [])]);
	return f.dot;
});

// /obj/mecha/proc/report_internal_damage  (code/game/mecha/mecha_topic.dm:53)
rt.def("/obj/mecha/proc/report_internal_damage", function report_internal_damage(f: Frame) {
	let dam_reports: Value = null, tflag: Value = null, intdamflag: Value = null;
	let $e: any;
	f.vars = () => [dam_reports, tflag, intdamflag, $e];
	f.dot = "";
	dam_reports = rt.alist(f, [fmt("＀", [1]), "<span class='userdanger'>INTERNAL FIRE</span>", fmt("＀", [2]), "<span class='userdanger'>LIFE SUPPORT SYSTEM MALFUNCTION</span>", fmt("＀", [8]), "<span class='userdanger'>GAS TANK BREACH</span>", fmt("＀", [16]), fmt("<span class='userdanger'>COORDINATION SYSTEM CALIBRATION FAILURE</span> - <a href='?src=＃;repair_int_control_lost=1'>Recalibrate</a>", [live(f.src)]), fmt("＀", [4]), "<span class='userdanger'>SHORT CIRCUIT</span>"]);
	tflag = null;
	rt.forList(f, 0, live(dam_reports));
	while (($e = rt.next(f, 0)) !== undefined) {
		tflag = $e;
		intdamflag = rt.call(f, P("/proc/text2num"), null, [live(tflag)]);
		if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), live(intdamflag)))) {
			f.dot = rt.modify(live(f.dot), rt.index(live(dam_reports), live(tflag)), add);
			f.dot = rt.modify(live(f.dot), "<br />", add);
		}
	}
	rt.endFor(f, 0);
	if (!rt.gt(rt.callSrc(f, "return_pressure", []), 325)) return f.dot;
	f.dot = rt.modify(live(f.dot), "<span class='userdanger'>DANGEROUSLY HIGH CABIN PRESSURE</span><br />", add);
	return f.dot;
});

// /obj/mecha/proc/get_stats_part  (code/game/mecha/mecha_topic.dm:72)
rt.def("/obj/mecha/proc/get_stats_part", function get_stats_part(f: Frame) {
	let integrity: Value = null, cell_charge: Value = null, int_tank_air: Value = null, tank_pressure: Value = null, tank_temperature: Value = null, cabin_pressure: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $11: any, $12: any, $13: any, $14: any, $15: any, $16: any, $17: any, $18: any;
	f.vars = () => [integrity, cell_charge, int_tank_air, tank_pressure, tank_temperature, cabin_pressure, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18];
	integrity = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100);
	cell_charge = rt.callSrc(f, "get_charge", []);
	int_tank_air = rt.callName(f, rt.sv(f, "internal_tank"), "return_air", []);
	if (truthy(rt.sv(f, "internal_tank"))) {
		$0 = rt.call(f, P("/proc/round"), null, [rt.callName(f, live(int_tank_air), "return_pressure", []), 0.009999999776482582]);
	} else {
		$0 = "None";
	}
	tank_pressure = $0;
	if (truthy(rt.sv(f, "internal_tank"))) {
		$0 = rt.fv(f, "temperature", live(int_tank_air));
	} else {
		$0 = "Unknown";
	}
	tank_temperature = $0;
	cabin_pressure = rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "return_pressure", []), 0.009999999776482582]);
	$0 = rt.callSrc(f, "report_internal_damage", []);
	if (rt.lt(live(integrity), 30)) {
		$1 = "<span class='userdanger'>DAMAGE LEVEL CRITICAL</span><br>";
	} else {
		$1 = null;
	}
	$2 = live(integrity);
	if (live(cell_charge) === null) {
		$3 = "No powercell installed";
	} else {
		$3 = fmt("＀%", [rt.callName(f, rt.sv(f, "cell"), "percent", [])]);
	}
	if (truthy(rt.sv(f, "use_internal_tank"))) {
		$4 = "Internal Airtank";
	} else {
		$4 = "Environment";
	}
	$5 = live(tank_pressure);
	$6 = live(tank_temperature);
	$7 = subtract(live(tank_temperature), 273.1499938964844);
	if (rt.gt(live(cabin_pressure), 325)) {
		$8 = fmt("<span class='danger'>＀</span>", [live(cabin_pressure)]);
	} else {
		$8 = live(cabin_pressure);
	}
	$9 = rt.callSrc(f, "return_temperature", []);
	$10 = subtract(rt.callSrc(f, "return_temperature", []), 273.1499938964844);
	if (truthy(rt.sv(f, "dna_lock"))) {
		$11 = fmt("<b>DNA-locked:</b><br> <span style='font-size:10px;letter-spacing:-1px;'>＀</span> [<a href='?src=＃;reset_dna=1'>Reset</a>]<br>", [rt.sv(f, "dna_lock"), live(f.src)]);
	} else {
		$11 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "thrusters_action")))) {
		if (truthy(rt.sv(f, "thrusters_active"))) {
			$12 = "Enabled";
		} else {
			$12 = "Disabled";
		}
		$12 = fmt("<b>Thrusters: </b> ＀<br>", [$12]);
	} else {
		$12 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "defense_action")))) {
		if (truthy(rt.sv(f, "defence_mode"))) {
			$13 = "Enabled";
		} else {
			$13 = "Disabled";
		}
		$13 = fmt("<b>Defence Mode: </b> ＀<br>", [$13]);
	} else {
		$13 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "overload_action")))) {
		if (truthy(rt.sv(f, "leg_overload_mode"))) {
			$14 = "Enabled";
		} else {
			$14 = "Disabled";
		}
		$14 = fmt("<b>Leg Actuators Overload: </b> ＀<br>", [$14]);
	} else {
		$14 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "smoke_action")))) {
		$15 = fmt("<b>Smoke: </b> ＀<br>", [rt.sv(f, "smoke")]);
	} else {
		$15 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "zoom_action")))) {
		if (truthy(rt.sv(f, "zoom_mode"))) {
			$16 = "Enabled";
		} else {
			$16 = "Disabled";
		}
		$16 = fmt("<b>Zoom: </b> ＀<br>", [$16]);
	} else {
		$16 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "switch_damtype_action")))) {
		$17 = fmt("<b>Damtype: </b> ＀<br>", [rt.sv(f, "damtype")]);
	} else {
		$17 = "";
	}
	if (truthy(rt.fv(f, "owner", rt.sv(f, "phasing_action")))) {
		if (truthy(rt.sv(f, "phasing"))) {
			$18 = "Enabled";
		} else {
			$18 = "Disabled";
		}
		$18 = fmt("<b>Phase Modulator: </b> ＀<br>", [$18]);
	} else {
		$18 = "";
	}
	f.dot = fmt("＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t<b>Integrity: </b> ＀%<br>\n\t\t\t\t\t\t<b>Powercell charge: </b>＀<br>\n\t\t\t\t\t\t<b>Air source: </b>＀<br>\n\t\t\t\t\t\t<b>Airtank pressure: </b>＀kPa<br>\n\t\t\t\t\t\t<b>Airtank temperature: </b>＀&deg;K|＀&deg;C<br>\n\t\t\t\t\t\t<b>Cabin pressure: </b>＀kPa<br>\n\t\t\t\t\t\t<b>Cabin temperature: </b> ＀&deg;K|＀&deg;C<br>\n\t\t\t\t\t\t＀<br>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t", [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18]);
	return f.dot;
});

// /obj/mecha/proc/get_commands  (code/game/mecha/mecha_topic.dm:99)
rt.def("/obj/mecha/proc/get_commands", function get_commands(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $11: any, $12: any;
	f.vars = () => [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12];
	$0 = live(f.src);
	if (truthy(rt.fv(f, "broadcasting", rt.sv(f, "radio")))) {
		$1 = "Engaged";
	} else {
		$1 = "Disengaged";
	}
	$2 = live(f.src);
	if (truthy(rt.fv(f, "listening", rt.sv(f, "radio")))) {
		$3 = "Engaged";
	} else {
		$3 = "Disengaged";
	}
	$4 = live(f.src);
	$5 = live(f.src);
	$6 = rt.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "frequency", rt.sv(f, "radio"))]);
	$7 = live(f.src);
	$8 = live(f.src);
	$9 = live(f.src);
	if (truthy(rt.sv(f, "add_req_access"))) {
		$10 = "L";
	} else {
		$10 = "Unl";
	}
	$11 = live(f.src);
	if (truthy(rt.sv(f, "maint_access"))) {
		$12 = "Forbid";
	} else {
		$12 = "Permit";
	}
	f.dot = fmt("<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Electronics</div>\n\t\t\t\t\t\t<div class='links'>\n\t\t\t\t\t\t<b>Radio settings:</b><br>\n\t\t\t\t\t\tMicrophone: <a href='?src=＃;rmictoggle=1'><span id=\"rmicstate\">＀</span></a><br>\n\t\t\t\t\t\tSpeaker: <a href='?src=＃;rspktoggle=1'><span id=\"rspkstate\">＀</span></a><br>\n\t\t\t\t\t\tFrequency:\n\t\t\t\t\t\t<a href='?src=＃;rfreq=-10'>-</a>\n\t\t\t\t\t\t<a href='?src=＃;rfreq=-2'>-</a>\n\t\t\t\t\t\t<span id=\"rfreq\">＀</span>\n\t\t\t\t\t\t<a href='?src=＃;rfreq=2'>+</a>\n\t\t\t\t\t\t<a href='?src=＃;rfreq=10'>+</a><br>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Permissions & Logging</div>\n\t\t\t\t\t\t<div class='links'>\n\t\t\t\t\t\t<a href='?src=＃;toggle_id_upload=1'><span id='t_id_upload'>＀ock ID upload panel</span></a><br>\n\t\t\t\t\t\t<a href='?src=＃;toggle_maint_access=1'><span id='t_maint_access'>＀ maintenance protocols</span></a><br>\n\t\t\t\t\t\t<a href='?src=＃;dna_lock=1'>DNA-lock</a><br>\n\t\t\t\t\t\t<a href='?src=＃;view_log=1'>View internal log</a><br>\n\t\t\t\t\t\t<a href='?src=＃;change_name=1'>Change exosuit name</a><br>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id='equipment_menu'>＀</div>\n\t\t\t\t\t\t", [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, live(f.src), live(f.src), live(f.src), rt.callSrc(f, "get_equipment_menu", [])]);
	return f.dot;
});

// /obj/mecha/proc/get_equipment_menu  (code/game/mecha/mecha_topic.dm:128)
rt.def("/obj/mecha/proc/get_equipment_menu", function get_equipment_menu(f: Frame) {
	let X: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [X, W, $e];
	f.dot = "";
	if (!truthy(rt.len(f, rt.sv(f, "equipment")))) return f.dot;
	f.dot = rt.modify(live(f.dot), "<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Equipment</div>\n\t\t\t\t\t\t<div class='links'>", add);
	X = null;
	rt.forList(f, 0, rt.sv(f, "equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		f.dot = rt.modify(live(f.dot), fmt("＀ <a href='?src=＃;detach=1'>Detach</a><br>", [rt.gv(f, "name", (W = live(X))), live(W)]), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.modify(live(f.dot), fmt("<b>Available equipment slots:</b> ＀", [subtract(rt.sv(f, "max_equip"), rt.len(f, rt.sv(f, "equipment")))]), add);
	f.dot = rt.modify(live(f.dot), "</div></div>", add);
	return f.dot;
});

// /obj/mecha/proc/get_equipment_list  (code/game/mecha/mecha_topic.dm:141)
rt.def("/obj/mecha/proc/get_equipment_list", function get_equipment_list(f: Frame) {
	let MT: Value = null;
	let $e: any;
	f.vars = () => [MT, $e];
	if (!truthy(rt.len(f, rt.sv(f, "equipment")))) {
		return live(f.dot);
	}
	f.dot = "<b>Equipment:</b><div style=\"margin-left: 15px;\">";
	MT = null;
	rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MT = $e;
		f.dot = rt.modify(live(f.dot), fmt("<div id='＃'>＀</div>", [live(MT), rt.callName(f, live(MT), "get_equip_info", [])]), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.modify(live(f.dot), "</div>", add);
	return f.dot;
});

// /obj/mecha/proc/get_log_html  (code/game/mecha/mecha_topic.dm:151)
rt.def("/obj/mecha/proc/get_log_html", function get_log_html(f: Frame) {
	let entry: Value = null;
	let $e: any;
	f.vars = () => [entry, $e];
	f.dot = fmt("<html><head><title>＀ Log</title></head><body style='font: 13px 'Courier', monospace;'>", [rt.fv(f, "name", live(f.src))]);
	entry = null;
	rt.forList(f, 0, rt.sv(f, "log"), T("/list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		entry = $e;
		f.dot = rt.modify(live(f.dot), fmt("<div style='font-weight: bold;'>＀ ＀ ＀</div>\n\t\t\t\t\t\t<div style='margin-left:15px; margin-bottom:10px;'>＀</div>\n\t\t\t\t\t\t", [rt.at(live(entry), "time"), rt.call(f, P("/proc/time2text"), null, [rt.at(live(entry), "date"), "MMM DD"]), rt.at(live(entry), "year"), rt.at(live(entry), "message")]), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.modify(live(f.dot), "</body></html>", add);
	return f.dot;
});

// /obj/mecha/proc/output_access_dialog  (code/game/mecha/mecha_topic.dm:161)
rt.def("/obj/mecha/proc/output_access_dialog", function output_access_dialog(f: Frame, id_card: Value, user: Value) {
	let a: Value = null, a_name: Value = null;
	let $e: any;
	f.vars = () => [a, a_name, $e];
	if ((!truthy(live(id_card)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	f.dot = "<html>\n\t\t\t\t\t\t<head><style>\n\t\t\t\t\t\th1 {font-size:15px;margin-bottom:4px;}\n\t\t\t\t\t\tbody {color: #00ff00; background: #000000; font-family:\"Courier New\", Courier, monospace; font-size: 12px;}\n\t\t\t\t\t\ta {color:#0f0;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<h1>Following keycodes are present in this system:</h1>";
	a = null;
	rt.forList(f, 0, rt.sv(f, "operation_req_access"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		f.dot = rt.modify(live(f.dot), fmt("＀ - <a href='?src=＃;del_req_access=＀;user=＃;id_card=＃'>Delete</a><br>", [rt.call(f, P("/proc/get_access_desc"), null, [live(a)]), live(f.src), live(a), live(user), live(id_card)]), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.modify(live(f.dot), "<hr><h1>Following keycodes were detected on portable device:</h1>", add);
	a = null;
	rt.forList(f, 0, rt.fv(f, "access", live(id_card)));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		if (truthy((rt.isIn(f, live(a), rt.sv(f, "operation_req_access")) ? 1 : 0))) {
			continue;
		}
		if (!truthy((a_name = rt.call(f, P("/proc/get_access_desc"), null, [live(a)])))) {
			continue;
		}
		f.dot = rt.modify(live(f.dot), fmt("＀ - <a href='?src=＃;add_req_access=＀;user=＃;id_card=＃'>Add</a><br>", [live(a_name), live(f.src), live(a), live(user), live(id_card)]), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.modify(live(f.dot), fmt("<hr><a href='?src=＃;finish_req_access=1;user=＃'>Finish</a> ", [live(f.src), live(user)]), add);
	f.dot = rt.modify(live(f.dot), "<span class='danger'>(Warning! The ID upload panel will be locked. It can be unlocked only through Exosuit Interface.)</span>", add);
	f.dot = rt.modify(live(f.dot), "</body></html>", add);
	rt.op(f, "Browse", [], [live(user), live(f.dot), "window=exosuit_add_access"], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), "exosuit_add_access"]);
	return f.dot;
});

// /obj/mecha/proc/output_maintenance_dialog  (code/game/mecha/mecha_topic.dm:187)
rt.def("/obj/mecha/proc/output_maintenance_dialog", function output_maintenance_dialog(f: Frame, id_card: Value, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if ((!truthy(live(id_card)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "add_req_access"))) {
		$0 = fmt("<a href='?src=＃;req_access=1;id_card=＃;user=＃'>Edit operation keycodes</a>", [live(f.src), live(id_card), live(user)]);
	} else {
		$0 = null;
	}
	if (truthy(rt.sv(f, "maint_access"))) {
		$1 = fmt("<a href='?src=＃;maint_access=1;id_card=＃;user=＃'>Initiate maintenance protocol</a>", [live(f.src), live(id_card), live(user)]);
	} else {
		$1 = null;
	}
	if (rt.gt(rt.sv(f, "state"), 0)) {
		$2 = fmt("<a href='?src=＃;set_internal_tank_valve=1;user=＃'>Set Cabin Air Pressure</a>", [live(f.src), live(user)]);
	} else {
		$2 = null;
	}
	f.dot = fmt("<html>\n\t\t\t\t\t\t<head>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\tbody {color: #00ff00; background: #000000; font-family:\"Courier New\", Courier, monospace; font-size: 12px;}\n\t\t\t\t\t\ta {padding:2px 5px; background:#32CD32;color:#000;display:block;margin:2px;text-align:center;text-decoration:none;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>", [$0, $1, $2]);
	rt.op(f, "Browse", [], [live(user), live(f.dot), "window=exosuit_maint_console"], false);
	rt.call(f, P("/proc/onclose"), null, [live(user), "exosuit_maint_console"]);
	return f.dot;
});

// /obj/mecha/proc/Topic  (code/game/mecha/mecha_topic.dm:212)  may sleep
rt.def("/obj/mecha/proc/Topic", function* Topic(f: Frame) {
	let filter: Value = null, user: Value = null, new_pressure: Value = null, equip: Value = null, new_frequency: Value = null, newname: Value = null, _T: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [filter, user, new_pressure, equip, new_frequency, newname, _T, $0, $1, $2, $3];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return live(f.dot);
	}
	filter = (yield* g.new_(f, T("/datum/topic_input"), [live(f.args[0]), live(f.args[1])]));
	if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1)) {
		if ((truthy(rt.at(live(f.args[1]), "req_access")) && truthy(rt.sv(f, "add_req_access")))) {
			yield* g.srcCall(f, "output_access_dialog", (yield* g.callName(f, live(filter), "getObj", ["id_card"])), (yield* g.callName(f, live(filter), "getMob", ["user"])));
		}
		if ((truthy(rt.at(live(f.args[1]), "maint_access")) && truthy(rt.sv(f, "maint_access")))) {
			if (truthy((user = (yield* g.callName(f, live(filter), "getMob", ["user"]))))) {
				if (isEqual(rt.sv(f, "state"), 0)) {
					rt.setSv(f, "state", 1);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The securing bolts are now exposed."]);
				} else {
					if (isEqual(rt.sv(f, "state"), 1)) {
						rt.setSv(f, "state", 0);
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The securing bolts are now hidden."]);
					}
				}
				yield* g.srcCall(f, "output_maintenance_dialog", (yield* g.callName(f, live(filter), "getObj", ["id_card"])), live(user));
			}
		}
		if ((truthy(rt.at(live(f.args[1]), "set_internal_tank_valve")) && rt.ge(rt.sv(f, "state"), 1))) {
			if (truthy((user = (yield* g.callName(f, live(filter), "getMob", ["user"]))))) {
				if (truthy((new_pressure = (yield* g.op(f, "Prompt", [32], [rt.sv(f, "internal_tank_valve"), "Pressure setting", "Input new output pressure", live(user), null]))))) {
					rt.setSv(f, "internal_tank_valve", live(new_pressure));
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("The internal pressure valve has been set to ＀kPa.", [rt.sv(f, "internal_tank_valve")])]);
				}
			}
		}
		if (((truthy(rt.at(live(f.args[1]), "add_req_access")) && truthy(rt.sv(f, "add_req_access"))) && truthy((yield* g.callName(f, live(filter), "getObj", ["id_card"]))))) {
			rt.modSrcVar(f, "operation_req_access", (yield* g.callName(f, live(filter), "getNum", ["add_req_access"])), add);
			yield* g.srcCall(f, "output_access_dialog", (yield* g.callName(f, live(filter), "getObj", ["id_card"])), (yield* g.callName(f, live(filter), "getMob", ["user"])));
		}
		if (((truthy(rt.at(live(f.args[1]), "del_req_access")) && truthy(rt.sv(f, "add_req_access"))) && truthy((yield* g.callName(f, live(filter), "getObj", ["id_card"]))))) {
			(rt.modSrcVar(f, "operation_req_access", (yield* g.callName(f, live(filter), "getNum", ["del_req_access"])), subtract));
			yield* g.srcCall(f, "output_access_dialog", (yield* g.callName(f, live(filter), "getObj", ["id_card"])), (yield* g.callName(f, live(filter), "getMob", ["user"])));
		}
		if (truthy(rt.at(live(f.args[1]), "finish_req_access"))) {
			rt.setSv(f, "add_req_access", 0);
			rt.op(f, "Browse", [], [(user = (yield* g.callName(f, live(filter), "getMob", ["user"]))), null, "window=exosuit_add_access"], false);
		}
	}
	if (!isEqual(live(f.usr), rt.sv(f, "occupant"))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "update_content"))) {
		yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", live(f.src)), "exosuit.browser", "content", (yield* g.callName(f, live(f.src), "get_stats_part", []))]);
	}
	if (truthy(rt.at(live(f.args[1]), "select_equip"))) {
		if ((truthy((equip = (yield* g.callName(f, live(filter), "getObj", ["select_equip"])))) && truthy(rt.fv(f, "selectable", live(equip))))) {
			rt.setFv(f, "selected", live(f.src), live(equip));
			yield* g.callName(f, live(f.src), "occupant_message", [fmt("You switch to ＀", [live(equip)])]);
			yield* g.callName(f, live(f.src), "visible_message", [fmt("＀ raises ＀", [live(f.src), live(equip)])]);
			yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", live(f.src)), "exosuit.browser", "eq_list", (yield* g.callName(f, live(f.src), "get_equipment_list", []))]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "rmictoggle"))) {
		rt.setFv(f, "broadcasting", rt.sv(f, "radio"), (!truthy(rt.fv(f, "broadcasting", rt.sv(f, "radio"))) ? 1 : 0));
		$0 = rt.fv(f, "occupant", live(f.src));
		$1 = "exosuit.browser";
		$2 = "rmicstate";
		if (truthy(rt.fv(f, "broadcasting", rt.sv(f, "radio")))) {
			$3 = "Engaged";
		} else {
			$3 = "Disengaged";
		}
		yield* g.call(f, P("/proc/send_byjax"), null, [$0, $1, $2, $3]);
	}
	if (truthy(rt.at(live(f.args[1]), "rspktoggle"))) {
		rt.setFv(f, "listening", rt.sv(f, "radio"), (!truthy(rt.fv(f, "listening", rt.sv(f, "radio"))) ? 1 : 0));
		$0 = rt.fv(f, "occupant", live(f.src));
		$1 = "exosuit.browser";
		$2 = "rspkstate";
		if (truthy(rt.fv(f, "listening", rt.sv(f, "radio")))) {
			$3 = "Engaged";
		} else {
			$3 = "Disengaged";
		}
		yield* g.call(f, P("/proc/send_byjax"), null, [$0, $1, $2, $3]);
	}
	if (truthy(rt.at(live(f.args[1]), "rfreq"))) {
		new_frequency = add(rt.fv(f, "frequency", rt.sv(f, "radio")), (yield* g.callName(f, live(filter), "getNum", ["rfreq"])));
		if ((!truthy(rt.fv(f, "freerange", rt.sv(f, "radio"))) || (rt.lt(rt.fv(f, "frequency", rt.sv(f, "radio")), 1200) || rt.gt(rt.fv(f, "frequency", rt.sv(f, "radio")), 1600)))) {
			new_frequency = (yield* g.call(f, P("/proc/sanitize_frequency"), null, [live(new_frequency)]));
		}
		yield* g.callName(f, rt.sv(f, "radio"), "set_frequency", [live(new_frequency)]);
		yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", live(f.src)), "exosuit.browser", "rfreq", fmt("＀", [(yield* g.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "frequency", rt.sv(f, "radio"))]))])]);
	}
	if (truthy(rt.at(live(f.args[1]), "view_log"))) {
		rt.op(f, "Browse", [], [rt.fv(f, "occupant", live(f.src)), (yield* g.callName(f, live(f.src), "get_log_html", [])), "window=exosuit_log"], false);
		yield* g.call(f, P("/proc/onclose"), null, [rt.sv(f, "occupant"), "exosuit_log"]);
	}
	if (truthy(rt.at(live(f.args[1]), "change_name"))) {
		if ((truthy((newname = (yield* g.call(f, P("/proc/stripped_input"), null, [rt.sv(f, "occupant"), "Choose new exosuit name", "Rename exosuit", "", 42])))) && truthy((yield* g.call(f, P("/proc/trim"), null, [live(newname)]))))) {
			rt.setSv(f, "name", live(newname));
		} else {
			yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "occupant"), "nope.avi"]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "toggle_id_upload"))) {
		rt.setSv(f, "add_req_access", (!truthy(rt.sv(f, "add_req_access")) ? 1 : 0));
		$0 = rt.fv(f, "occupant", live(f.src));
		$1 = "exosuit.browser";
		$2 = "t_id_upload";
		if (truthy(rt.sv(f, "add_req_access"))) {
			$2 = $2;
			$3 = "L";
		} else {
			$3 = "Unl";
		}
		yield* g.call(f, P("/proc/send_byjax"), null, [$0, $1, $2, fmt("＀ock ID upload panel", [$3])]);
	}
	if (truthy(rt.at(live(f.args[1]), "toggle_maint_access"))) {
		if (truthy(rt.sv(f, "state"))) {
			yield* g.srcCall(f, "occupant_message", "<span class='danger'>Maintenance protocols in effect</span>");
			return live(f.dot);
		}
		rt.setSv(f, "maint_access", (!truthy(rt.sv(f, "maint_access")) ? 1 : 0));
		$0 = rt.fv(f, "occupant", live(f.src));
		$1 = "exosuit.browser";
		$2 = "t_maint_access";
		if (truthy(rt.sv(f, "maint_access"))) {
			$2 = $2;
			$3 = "Forbid";
		} else {
			$3 = "Permit";
		}
		yield* g.call(f, P("/proc/send_byjax"), null, [$0, $1, $2, fmt("＀ maintenance protocols", [$3])]);
	}
	if (truthy(rt.at(live(f.args[1]), "dna_lock"))) {
		if ((truthy(rt.sv(f, "occupant")) && !truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='danger'> You do not have any DNA!</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "dna_lock", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", rt.sv(f, "occupant"))));
		yield* g.srcCall(f, "occupant_message", "You feel a prick as the needle takes your DNA sample.");
	}
	if (truthy(rt.at(live(f.args[1]), "reset_dna"))) {
		rt.setSv(f, "dna_lock", null);
	}
	if (!truthy(rt.at(live(f.args[1]), "repair_int_control_lost"))) return f.dot;
	yield* g.srcCall(f, "occupant_message", "Recalibrating coordination system...");
	yield* g.srcCall(f, "log_message", "Recalibration of coordination system started.");
	_T = rt.sv(f, "loc");
	rt.spawnTail(f, 100, "/obj/mecha/proc/Topic: spawn at game/mecha/mecha_topic.dm:323", filter, user, new_pressure, equip, new_frequency, newname, _T);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// a spawn(100) body of /obj/mecha/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/Topic: spawn at game/mecha/mecha_topic.dm:323", function* (f: Frame, filter: Value, user: Value, new_pressure: Value, equip: Value, new_frequency: Value, newname: Value, _T: Value) {
	f.vars = () => [filter, user, new_pressure, equip, new_frequency, newname, _T];
	if (isEqual(live(_T), rt.sv(f, "loc"))) {
		yield* g.srcCall(f, "clearInternalDamage", 16);
		yield* g.srcCall(f, "occupant_message", "<span class='notice'>Recalibration successful.</span>");
		yield* g.srcCall(f, "log_message", "Recalibration of coordination system finished with 0 errors.");
	} else {
		yield* g.srcCall(f, "occupant_message", "<span class='warning'>Recalibration failed!</span>");
		yield* g.srcCall(f, "log_message", "Recalibration of coordination system failed with 1 error.", 1);
	}
	return null;
});
