// Based on /tg/station's code/game/mecha/combat/honker.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// honker.dm:10
rt.def("/obj/mecha/combat/honker/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.armor = rt.alist(f, ["melee", -20, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.operation_req_access = list(46);
	return f.dot;
}, true);

// honker.dm:31
rt.def("/obj/mecha/combat/honker/proc/get_stats_part", function get_stats_part(f: Frame) {
	let output: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $6: any, $7: any, $11: any, $14: any, $15: any;
	let integrity: Value = this.obj_integrity / this.max_integrity * 100;
	let cell_charge: Value = this.get_charge();
	let int_tank_air: Value = this.internal_tank.return_air();
	let tank_pressure: Value = this.internal_tank ? round(int_tank_air.return_pressure(), 0.01) : "None";
	let tank_temperature: Value = this.internal_tank ? int_tank_air.temperature : "Unknown";
	let cabin_pressure: Value = round(this.return_pressure(), 0.01);
	$0 = this.report_internal_damage();
	if (integrity < 30) {
		$1 = "<font color='red'><b>DAMAGE LEVEL CRITICAL</b></font><br>";
	} else {
		$1 = null;
	}
	if (rt.bitAnd(this.internal_damage, 2)) {
		$2 = "<font color='red'><b>CLOWN SUPPORT SYSTEM MALFUNCTION</b></font><br>";
	} else {
		$2 = null;
	}
	if (rt.bitAnd(this.internal_damage, 8)) {
		$3 = "<font color='red'><b>GAS TANK HONK</b></font><br>";
	} else {
		$3 = null;
	}
	if (rt.bitAnd(this.internal_damage, 16)) {
		$4 = fmt("<font color='red'><b>HONK-A-DOODLE</b></font> - <a href='?src=＃;repair_int_control_lost=1'>Recalibrate</a><br>", [this]);
	} else {
		$4 = null;
	}
	let $5: any = integrity;
	if (cell_charge === null) {
		$6 = "No powercell installed";
	} else {
		$6 = `${this.cell.percent()}%`;
	}
	if (this.use_internal_tank) {
		$7 = "Internal Airtank";
	} else {
		$7 = "Environment";
	}
	let $8: any = tank_pressure;
	let $9: any = tank_temperature;
	let $10: any = tank_temperature - T0C;
	if (cabin_pressure > WARNING_HIGH_PRESSURE) {
		$11 = `<font color='red'>${cabin_pressure}</font>`;
	} else {
		$11 = cabin_pressure;
	}
	let $12: any = this.return_temperature();
	let $13: any = this.return_temperature() - T0C;
	if (this.lights) {
		$14 = "on";
	} else {
		$14 = "off";
	}
	if (this.dna_lock) {
		$15 = fmt("<b>DNA-locked:</b><br> <span style='font-size:10px;letter-spacing:-1px;'>＀</span> [<a href='?src=＃;reset_dna=1'>Reset</a>]<br>", [this.dna_lock, this]);
	} else {
		$15 = null;
	}
	return (output = `${$0}\n\t\t\t\t\t\t${$1}\n\t\t\t\t\t\t${$2}\n\t\t\t\t\t\t${$3}\n\t\t\t\t\t\t${$4}\n\t\t\t\t\t\t<b>IntegriHONK: </b> ${$5}%<br>\n\t\t\t\t\t\t<b>PowerHONK charge: </b>${$6}<br>\n\t\t\t\t\t\t<b>Air source: </b>${$7}<br>\n\t\t\t\t\t\t<b>AirHONK pressure: </b>${$8}kPa<br>\n\t\t\t\t\t\t<b>AirHONK temperature: </b>${$9}&deg;K|${$10}&deg;C<br>\n\t\t\t\t\t\t<b>HONK pressure: </b>${$11}kPa<br>\n\t\t\t\t\t\t<b>HONK temperature: </b> ${$12}&deg;K|${$13}&deg;C<br>\n\t\t\t\t\t\t<b>Lights: </b>${$14}<br>\n\t\t\t\t\t\t${$15}\n\t\t\t\t\t`);
});

// honker.dm:55
rt.def("/obj/mecha/combat/honker/proc/get_stats_html", function get_stats_html(f: Frame) {
	let output: Value = null;
	return (output = fmt("<html>\n\t\t\t\t\t\t<head><title>＀ data</title>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\tbody {color: #00ff00; background: #32CD32; font-family:\"Courier\",monospace; font-size: 12px;}\n\t\t\t\t\t\thr {border: 1px solid #0f0; color: #fff; background-color: #000;}\n\t\t\t\t\t\ta {padding:2px 5px;;color:#0f0;}\n\t\t\t\t\t\t.wr {margin-bottom: 5px;}\n\t\t\t\t\t\t.header {cursor:pointer;}\n\t\t\t\t\t\t.open, .closed {background: #32CD32; color:#000; padding:1px 2px;}\n\t\t\t\t\t\t.links a {margin-bottom: 2px;padding-top:3px;}\n\t\t\t\t\t\t.visible {display: block;}\n\t\t\t\t\t\t.hidden {display: none;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\tfunction SSticker() {\n\t\t\t\t\t\t    setInterval(function(){\n\t\t\t\t\t\t        window.location='byond://?src=＃&update_content=1';\n\t\t\t\t\t\t        document.body.style.color = get_rand_color_string();\n\t\t\t\t\t\t      document.body.style.background = get_rand_color_string();\n\t\t\t\t\t\t    }, 1000);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tfunction get_rand_color_string() {\n\t\t\t\t\t\t    var color = new Array;\n\t\t\t\t\t\t    for(var i=0;i<3;i++){\n\t\t\t\t\t\t        color.push(Math.floor(Math.random()*255));\n\t\t\t\t\t\t    }\n\t\t\t\t\t\t    return \"rgb(\"+color.toString()+\")\";\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\twindow.onload = function() {\n\t\t\t\t\t\t\tdropdowns();\n\t\t\t\t\t\t\tSSticker();\n\t\t\t\t\t\t}\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<div id='content'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id='eq_list'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t<div id='commands'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>\n\t\t\t\t\t ", [this.name, "\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", "\nfunction dropdowns() {\n    var divs = document.getElementsByTagName('div');\n    var headers = new Array();\n    var links = new Array();\n    for(var i=0;i<divs.length;i++){\n        if(divs[i].className=='header') {\n            divs[i].className='header closed';\n            divs[i].innerHTML = divs[i].innerHTML+' +';\n            headers.push(divs[i]);\n        }\n        if(divs[i].className=='links') {\n            divs[i].className='links hidden';\n            links.push(divs[i]);\n        }\n    }\n    for(var i=0;i<headers.length;i++){\n        if(typeof(links[i])!== 'undefined' && links[i]!=null) {\n            headers[i].onclick = (function(elem) {\n                return function() {\n                    if(elem.className.search('visible')>=0) {\n                        elem.className = elem.className.replace('visible','hidden');\n                        this.className = this.className.replace('open','closed');\n                        this.innerHTML = this.innerHTML.replace('-','+');\n                    }\n                    else {\n                        elem.className = elem.className.replace('hidden','visible');\n                        this.className = this.className.replace('closed','open');\n                        this.innerHTML = this.innerHTML.replace('+','-');\n                    }\n                return false;\n                }\n            })(links[i]);\n        }\n    }\n}\n", this, this.get_stats_part(), this.get_equipment_list(), this.get_commands()]));
});

// honker.dm:110
rt.def("/obj/mecha/combat/honker/proc/get_commands", function get_commands(f: Frame) {
	let output: Value = fmt("<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Sounds of HONK:</div>\n\t\t\t\t\t\t<div class='links'>\n\t\t\t\t\t\t<a href='?src=＃;play_sound=sadtrombone'>Sad Trombone</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t", [this]);
	return (output += parent_proc());
});

// honker.dm:122
rt.def("/obj/mecha/combat/honker/proc/get_equipment_list", function get_equipment_list(f: Frame) {
	let MT: Value = null;
	if (!rt.len(f, this.equipment)) {
		return f.dot;
	}
	let output: Value = "<b>Honk-ON-Systems:</b><div style=\"margin-left: 15px;\">";
	for (MT of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment"))) {
		output += fmt("<div id='＃'>＀</div>", [MT, MT.get_equip_info()]);
	}
	return (output += "</div>");
});

// honker.dm:133
rt.def("/obj/mecha/combat/honker/proc/mechstep", function* mechstep(f: Frame, direction: Value) {
	let result: Value = null;
	if (result = (yield* step(this, direction))) {
		if (!this.squeak) {
			playsound(this, "clownstep", 70, 1);
			this.squeak = 1;
		} else {
			this.squeak = 0;
		}
	}
	return result;
}, true);

// honker.dm:143
rt.def("/obj/mecha/combat/honker/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (rt.at(href_list, "play_sound")) {
		if (rt.at(href_list, "play_sound") === "sadtrombone") {
			playsound(this, rt.rsc("sound/misc/sadtrombone.ogg"), 50);
		}
	}
	return f.dot;
}, true);
