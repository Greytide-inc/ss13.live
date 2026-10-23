// From code/game/mecha/combat/honker.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12108, "/obj/mecha/combat/honker", "/obj/mecha/combat", {
	squeak: 0,
	step_in: 3,
	deflect_chance: 60,
	internal_damage_threshold: 60,
	max_temperature: 25000,
	add_req_access: 0,
	max_equip: 3,
	desc: "Produced by \"Tyranny of Honk, INC\", this exosuit is designed as heavy clown-support. Used to spread the fun and joy of life. HONK!",
	name: "１H.O.N.K",
	icon_state: "honker",
	obj_integrity: 140,
	max_integrity: 140,
	armor: null,
	infra_luminosity: 5,
	operation_req_access: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/honker"),
});

// /obj/mecha/combat/honker/proc/<init>  (code/game/mecha/combat/honker.dm:10)  may sleep
rt.def("/obj/mecha/combat/honker/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", -20, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "operation_req_access", rt.list(46));
	return f.dot;
}, true);

// /obj/mecha/combat/honker/proc/get_stats_part  (code/game/mecha/combat/honker.dm:31)
rt.def("/obj/mecha/combat/honker/proc/get_stats_part", function get_stats_part(f: Frame) {
	let integrity: Value = null, cell_charge: Value = null, int_tank_air: Value = null, tank_pressure: Value = null, tank_temperature: Value = null, cabin_pressure: Value = null, output: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any, $11: any, $12: any, $13: any, $14: any, $15: any;
	f.vars = () => [integrity, cell_charge, int_tank_air, tank_pressure, tank_temperature, cabin_pressure, output, $0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15];
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
		$1 = "<font color='red'><b>DAMAGE LEVEL CRITICAL</b></font><br>";
	} else {
		$1 = null;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 2))) {
		$2 = "<font color='red'><b>CLOWN SUPPORT SYSTEM MALFUNCTION</b></font><br>";
	} else {
		$2 = null;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 8))) {
		$3 = "<font color='red'><b>GAS TANK HONK</b></font><br>";
	} else {
		$3 = null;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 16))) {
		$4 = fmt("<font color='red'><b>HONK-A-DOODLE</b></font> - <a href='?src=＃;repair_int_control_lost=1'>Recalibrate</a><br>", [live(f.src)]);
	} else {
		$4 = null;
	}
	$5 = live(integrity);
	if (live(cell_charge) === null) {
		$6 = "No powercell installed";
	} else {
		$6 = fmt("＀%", [rt.callName(f, rt.sv(f, "cell"), "percent", [])]);
	}
	if (truthy(rt.sv(f, "use_internal_tank"))) {
		$7 = "Internal Airtank";
	} else {
		$7 = "Environment";
	}
	$8 = live(tank_pressure);
	$9 = live(tank_temperature);
	$10 = subtract(live(tank_temperature), 273.1499938964844);
	if (rt.gt(live(cabin_pressure), 325)) {
		$11 = fmt("<font color='red'>＀</font>", [live(cabin_pressure)]);
	} else {
		$11 = live(cabin_pressure);
	}
	$12 = rt.callSrc(f, "return_temperature", []);
	$13 = subtract(rt.callSrc(f, "return_temperature", []), 273.1499938964844);
	if (truthy(rt.sv(f, "lights"))) {
		$14 = "on";
	} else {
		$14 = "off";
	}
	if (truthy(rt.sv(f, "dna_lock"))) {
		$15 = fmt("<b>DNA-locked:</b><br> <span style='font-size:10px;letter-spacing:-1px;'>＀</span> [<a href='?src=＃;reset_dna=1'>Reset</a>]<br>", [rt.sv(f, "dna_lock"), live(f.src)]);
	} else {
		$15 = null;
	}
	return (output = fmt("＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t<b>IntegriHONK: </b> ＀%<br>\n\t\t\t\t\t\t<b>PowerHONK charge: </b>＀<br>\n\t\t\t\t\t\t<b>Air source: </b>＀<br>\n\t\t\t\t\t\t<b>AirHONK pressure: </b>＀kPa<br>\n\t\t\t\t\t\t<b>AirHONK temperature: </b>＀&deg;K|＀&deg;C<br>\n\t\t\t\t\t\t<b>HONK pressure: </b>＀kPa<br>\n\t\t\t\t\t\t<b>HONK temperature: </b> ＀&deg;K|＀&deg;C<br>\n\t\t\t\t\t\t<b>Lights: </b>＀<br>\n\t\t\t\t\t\t＀\n\t\t\t\t\t", [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15]));
});

// /obj/mecha/combat/honker/proc/get_stats_html  (code/game/mecha/combat/honker.dm:55)
rt.def("/obj/mecha/combat/honker/proc/get_stats_html", function get_stats_html(f: Frame) {
	let output: Value = null;
	f.vars = () => [output];
	return (output = fmt("<html>\n\t\t\t\t\t\t<head><title>＀ data</title>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\tbody {color: #00ff00; background: #32CD32; font-family:\"Courier\",monospace; font-size: 12px;}\n\t\t\t\t\t\thr {border: 1px solid #0f0; color: #fff; background-color: #000;}\n\t\t\t\t\t\ta {padding:2px 5px;;color:#0f0;}\n\t\t\t\t\t\t.wr {margin-bottom: 5px;}\n\t\t\t\t\t\t.header {cursor:pointer;}\n\t\t\t\t\t\t.open, .closed {background: #32CD32; color:#000; padding:1px 2px;}\n\t\t\t\t\t\t.links a {margin-bottom: 2px;padding-top:3px;}\n\t\t\t\t\t\t.visible {display: block;}\n\t\t\t\t\t\t.hidden {display: none;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\tfunction SSticker() {\n\t\t\t\t\t\t    setInterval(function(){\n\t\t\t\t\t\t        window.location='byond://?src=＃&update_content=1';\n\t\t\t\t\t\t        document.body.style.color = get_rand_color_string();\n\t\t\t\t\t\t      document.body.style.background = get_rand_color_string();\n\t\t\t\t\t\t    }, 1000);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tfunction get_rand_color_string() {\n\t\t\t\t\t\t    var color = new Array;\n\t\t\t\t\t\t    for(var i=0;i<3;i++){\n\t\t\t\t\t\t        color.push(Math.floor(Math.random()*255));\n\t\t\t\t\t\t    }\n\t\t\t\t\t\t    return \"rgb(\"+color.toString()+\")\";\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\twindow.onload = function() {\n\t\t\t\t\t\t\tdropdowns();\n\t\t\t\t\t\t\tSSticker();\n\t\t\t\t\t\t}\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<div id='content'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id='eq_list'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t<div id='commands'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>\n\t\t\t\t\t ", [rt.fv(f, "name", live(f.src)), "\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", "\nfunction dropdowns() {\n    var divs = document.getElementsByTagName('div');\n    var headers = new Array();\n    var links = new Array();\n    for(var i=0;i<divs.length;i++){\n        if(divs[i].className=='header') {\n            divs[i].className='header closed';\n            divs[i].innerHTML = divs[i].innerHTML+' +';\n            headers.push(divs[i]);\n        }\n        if(divs[i].className=='links') {\n            divs[i].className='links hidden';\n            links.push(divs[i]);\n        }\n    }\n    for(var i=0;i<headers.length;i++){\n        if(typeof(links[i])!== 'undefined' && links[i]!=null) {\n            headers[i].onclick = (function(elem) {\n                return function() {\n                    if(elem.className.search('visible')>=0) {\n                        elem.className = elem.className.replace('visible','hidden');\n                        this.className = this.className.replace('open','closed');\n                        this.innerHTML = this.innerHTML.replace('-','+');\n                    }\n                    else {\n                        elem.className = elem.className.replace('hidden','visible');\n                        this.className = this.className.replace('closed','open');\n                        this.innerHTML = this.innerHTML.replace('+','-');\n                    }\n                return false;\n                }\n            })(links[i]);\n        }\n    }\n}\n", live(f.src), rt.callName(f, live(f.src), "get_stats_part", []), rt.callName(f, live(f.src), "get_equipment_list", []), rt.callName(f, live(f.src), "get_commands", [])]));
});

// /obj/mecha/combat/honker/proc/get_commands  (code/game/mecha/combat/honker.dm:110)
rt.def("/obj/mecha/combat/honker/proc/get_commands", function get_commands(f: Frame) {
	let output: Value = null;
	f.vars = () => [output];
	output = fmt("<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Sounds of HONK:</div>\n\t\t\t\t\t\t<div class='links'>\n\t\t\t\t\t\t<a href='?src=＃;play_sound=sadtrombone'>Sad Trombone</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t", [live(f.src)]);
	return (output = rt.modify(live(output), rt.callSuper(f, [], rt.Args.Same), add));
});

// /obj/mecha/combat/honker/proc/get_equipment_list  (code/game/mecha/combat/honker.dm:122)
rt.def("/obj/mecha/combat/honker/proc/get_equipment_list", function get_equipment_list(f: Frame) {
	let output: Value = null, MT: Value = null;
	let $e: any;
	f.vars = () => [output, MT, $e];
	if (!truthy(rt.len(f, rt.sv(f, "equipment")))) {
		return live(f.dot);
	}
	output = "<b>Honk-ON-Systems:</b><div style=\"margin-left: 15px;\">";
	MT = null;
	rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MT = $e;
		output = rt.modify(live(output), fmt("<div id='＃'>＀</div>", [live(MT), rt.callName(f, live(MT), "get_equip_info", [])]), add);
	}
	rt.endFor(f, 0);
	return (output = rt.modify(live(output), "</div>", add));
});

// /obj/mecha/combat/honker/proc/mechstep  (code/game/mecha/combat/honker.dm:133)  may sleep
rt.def("/obj/mecha/combat/honker/proc/mechstep", function* mechstep(f: Frame, direction: Value) {
	let result: Value = null;
	f.vars = () => [direction, result];
	if (truthy((result = (yield* g.call(f, P("/proc/step"), null, [live(f.src), live(direction)]))))) {
		if (!truthy(rt.sv(f, "squeak"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "clownstep", 70, 1]);
			rt.setSv(f, "squeak", 1);
		} else {
			rt.setSv(f, "squeak", 0);
		}
	}
	return live(result);
}, true);

// /obj/mecha/combat/honker/proc/Topic  (code/game/mecha/combat/honker.dm:143)  may sleep
rt.def("/obj/mecha/combat/honker/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "play_sound"))) {
		$0 = rt.at(live(f.args[1]), "play_sound");
		if ($0 === "sadtrombone") {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/misc/sadtrombone.ogg"), 50]);
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /proc/rand_hex_color  (code/game/mecha/combat/honker.dm:152)
rt.def("/proc/rand_hex_color", function rand_hex_color(f: Frame) {
	let colors: Value = null, color: Value = null, i: Value = null;
	f.vars = () => [colors, color, i];
	colors = rt.list("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
	color = "";
	i = null;
	i = 0;
	while (rt.lt(live(i), 6)) {
		color = add(live(color), rt.op(f, "PickUnweighted", [1], [live(colors)]));
		i = rt.inc(live(i), 1);
	}
	return live(color);
});
