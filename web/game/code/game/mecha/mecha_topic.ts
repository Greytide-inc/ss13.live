// Based on /tg/station's code/game/mecha/mecha_topic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// mecha_topic.dm:7
rt.def("/obj/mecha/proc/get_stats_html", function get_stats_html(f: Frame) {
	f.dot = fmt("<html>\n\t\t\t\t\t\t<head><title>＀ data</title>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\tbody {color: #00ff00; background: #000000; font-family:\"Lucida Console\",monospace; font-size: 12px;}\n\t\t\t\t\t\thr {border: 1px solid #0f0; color: #0f0; background-color: #0f0;}\n\t\t\t\t\t\ta {padding:2px 5px;;color:#0f0;}\n\t\t\t\t\t\t.wr {margin-bottom: 5px;}\n\t\t\t\t\t\t.header {cursor:pointer;}\n\t\t\t\t\t\t.open, .closed {background: #32CD32; color:#000; padding:1px 2px;}\n\t\t\t\t\t\t.links a {margin-bottom: 2px;padding-top:3px;}\n\t\t\t\t\t\t.visible {display: block;}\n\t\t\t\t\t\t.hidden {display: none;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t<script language='javascript' type='text/javascript'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t＀\n\t\t\t\t\t\tfunction SSticker() {\n\t\t\t\t\t\t    setInterval(function(){\n\t\t\t\t\t\t        window.location='byond://?src=＃&update_content=1';\n\t\t\t\t\t\t    }, 1000);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\twindow.onload = function() {\n\t\t\t\t\t\t\tdropdowns();\n\t\t\t\t\t\t\tSSticker();\n\t\t\t\t\t\t}\n\t\t\t\t\t\t</script>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<div id='content'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id='eq_list'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<hr>\n\t\t\t\t\t\t<div id='commands'>\n\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>\n\t\t\t\t\t ", [this.name, "\n\nfunction replaceContent() {\n\tvar args = Array.prototype.slice.call(arguments);\n\tvar id = args[0];\n\tvar content = args[1];\n\tvar callback  = null;\n\tif(args[2]){\n\t\tcallback = args[2];\n\t\tif(args[3]){\n\t\t\targs = args.slice(3);\n\t\t}\n\t}\n\tvar parent = document.getElementById(id);\n\tif(typeof(parent)!=='undefined' && parent!=null){\n\t\tparent.innerHTML = content?content:'';\n\t}\n\tif(callback && window[callback]){\n\t\twindow[callback].apply(null,args);\n\t}\n}\n", "\nfunction dropdowns() {\n    var divs = document.getElementsByTagName('div');\n    var headers = new Array();\n    var links = new Array();\n    for(var i=0;i<divs.length;i++){\n        if(divs[i].className=='header') {\n            divs[i].className='header closed';\n            divs[i].innerHTML = divs[i].innerHTML+' +';\n            headers.push(divs[i]);\n        }\n        if(divs[i].className=='links') {\n            divs[i].className='links hidden';\n            links.push(divs[i]);\n        }\n    }\n    for(var i=0;i<headers.length;i++){\n        if(typeof(links[i])!== 'undefined' && links[i]!=null) {\n            headers[i].onclick = (function(elem) {\n                return function() {\n                    if(elem.className.search('visible')>=0) {\n                        elem.className = elem.className.replace('visible','hidden');\n                        this.className = this.className.replace('open','closed');\n                        this.innerHTML = this.innerHTML.replace('-','+');\n                    }\n                    else {\n                        elem.className = elem.className.replace('hidden','visible');\n                        this.className = this.className.replace('closed','open');\n                        this.innerHTML = this.innerHTML.replace('+','-');\n                    }\n                return false;\n                }\n            })(links[i]);\n        }\n    }\n}\n", this, this.get_stats_part(), this.get_equipment_list(), this.get_commands()]);
	return f.dot;
});

// mecha_topic.dm:53
rt.def("/obj/mecha/proc/report_internal_damage", function report_internal_damage(f: Frame) {
	let tflag: Value = null, intdamflag: Value = null;
	f.dot = "";
	let dam_reports: Value = rt.alist(f, [`${1}`, "<span class='userdanger'>INTERNAL FIRE</span>", `${2}`, "<span class='userdanger'>LIFE SUPPORT SYSTEM MALFUNCTION</span>", `${8}`, "<span class='userdanger'>GAS TANK BREACH</span>", `${16}`, fmt("<span class='userdanger'>COORDINATION SYSTEM CALIBRATION FAILURE</span> - <a href='?src=＃;repair_int_control_lost=1'>Recalibrate</a>", [this]), `${4}`, "<span class='userdanger'>SHORT CIRCUIT</span>"]);
	for (tflag of each(dam_reports)) {
		intdamflag = text2num(tflag);
		if (rt.bitAnd(this.internal_damage, intdamflag)) {
			f.dot += rt.index(dam_reports, tflag);
			f.dot += "<br />";
		}
	}
	if (!(this.return_pressure() > WARNING_HIGH_PRESSURE)) return f.dot;
	f.dot += "<span class='userdanger'>DANGEROUSLY HIGH CABIN PRESSURE</span><br />";
	return f.dot;
});

// mecha_topic.dm:72
rt.def("/obj/mecha/proc/get_stats_part", function get_stats_part(f: Frame) {
	let $0: any, $1: any, $3: any, $4: any, $8: any, $11: any, $12: any, $13: any, $14: any, $15: any, $16: any, $17: any, $18: any;
	let integrity: Value = this.obj_integrity / this.max_integrity * 100;
	let cell_charge: Value = this.get_charge();
	let int_tank_air: Value = this.internal_tank.return_air();
	let tank_pressure: Value = this.internal_tank ? round(int_tank_air.return_pressure(), 0.01) : "None";
	let tank_temperature: Value = this.internal_tank ? int_tank_air.temperature : "Unknown";
	let cabin_pressure: Value = round(this.return_pressure(), 0.01);
	$0 = this.report_internal_damage();
	if (integrity < 30) {
		$1 = "<span class='userdanger'>DAMAGE LEVEL CRITICAL</span><br>";
	} else {
		$1 = null;
	}
	let $2: any = integrity;
	if (cell_charge === null) {
		$3 = "No powercell installed";
	} else {
		$3 = `${this.cell.percent()}%`;
	}
	if (this.use_internal_tank) {
		$4 = "Internal Airtank";
	} else {
		$4 = "Environment";
	}
	let $5: any = tank_pressure;
	let $6: any = tank_temperature;
	let $7: any = tank_temperature - T0C;
	if (cabin_pressure > WARNING_HIGH_PRESSURE) {
		$8 = `<span class='danger'>${cabin_pressure}</span>`;
	} else {
		$8 = cabin_pressure;
	}
	let $9: any = this.return_temperature();
	let $10: any = this.return_temperature() - T0C;
	if (this.dna_lock) {
		$11 = fmt("<b>DNA-locked:</b><br> <span style='font-size:10px;letter-spacing:-1px;'>＀</span> [<a href='?src=＃;reset_dna=1'>Reset</a>]<br>", [this.dna_lock, this]);
	} else {
		$11 = "";
	}
	if (this.thrusters_action.owner) {
		if (this.thrusters_active) {
			$12 = "Enabled";
		} else {
			$12 = "Disabled";
		}
		$12 = `<b>Thrusters: </b> ${$12}<br>`;
	} else {
		$12 = "";
	}
	if (this.defense_action.owner) {
		if (this.defence_mode) {
			$13 = "Enabled";
		} else {
			$13 = "Disabled";
		}
		$13 = `<b>Defence Mode: </b> ${$13}<br>`;
	} else {
		$13 = "";
	}
	if (this.overload_action.owner) {
		if (this.leg_overload_mode) {
			$14 = "Enabled";
		} else {
			$14 = "Disabled";
		}
		$14 = `<b>Leg Actuators Overload: </b> ${$14}<br>`;
	} else {
		$14 = "";
	}
	if (this.smoke_action.owner) {
		$15 = `<b>Smoke: </b> ${this.smoke}<br>`;
	} else {
		$15 = "";
	}
	if (this.zoom_action.owner) {
		if (this.zoom_mode) {
			$16 = "Enabled";
		} else {
			$16 = "Disabled";
		}
		$16 = `<b>Zoom: </b> ${$16}<br>`;
	} else {
		$16 = "";
	}
	if (this.switch_damtype_action.owner) {
		$17 = `<b>Damtype: </b> ${this.damtype}<br>`;
	} else {
		$17 = "";
	}
	if (this.phasing_action.owner) {
		if (this.phasing) {
			$18 = "Enabled";
		} else {
			$18 = "Disabled";
		}
		$18 = `<b>Phase Modulator: </b> ${$18}<br>`;
	} else {
		$18 = "";
	}
	f.dot = `${$0}\n\t\t\t\t\t\t${$1}\n\t\t\t\t\t\t<b>Integrity: </b> ${$2}%<br>\n\t\t\t\t\t\t<b>Powercell charge: </b>${$3}<br>\n\t\t\t\t\t\t<b>Air source: </b>${$4}<br>\n\t\t\t\t\t\t<b>Airtank pressure: </b>${$5}kPa<br>\n\t\t\t\t\t\t<b>Airtank temperature: </b>${$6}&deg;K|${$7}&deg;C<br>\n\t\t\t\t\t\t<b>Cabin pressure: </b>${$8}kPa<br>\n\t\t\t\t\t\t<b>Cabin temperature: </b> ${$9}&deg;K|${$10}&deg;C<br>\n\t\t\t\t\t\t${$11}<br>\n\t\t\t\t\t\t${$12}\n\t\t\t\t\t\t${$13}\n\t\t\t\t\t\t${$14}\n\t\t\t\t\t\t${$15}\n\t\t\t\t\t\t${$16}\n\t\t\t\t\t\t${$17}\n\t\t\t\t\t\t${$18}\n\t\t\t\t\t`;
	return f.dot;
});

// mecha_topic.dm:99
rt.def("/obj/mecha/proc/get_commands", function get_commands(f: Frame) {
	let $1: any, $3: any, $10: any, $12: any;
	let $0: any = this;
	if (this.radio.broadcasting) {
		$1 = "Engaged";
	} else {
		$1 = "Disengaged";
	}
	let $2: any = this;
	if (this.radio.listening) {
		$3 = "Engaged";
	} else {
		$3 = "Disengaged";
	}
	let $4: any = this;
	let $5: any = this;
	let $6: any = format_frequency(this.radio.frequency);
	let $7: any = this;
	let $8: any = this;
	let $9: any = this;
	if (this.add_req_access) {
		$10 = "L";
	} else {
		$10 = "Unl";
	}
	let $11: any = this;
	if (this.maint_access) {
		$12 = "Forbid";
	} else {
		$12 = "Permit";
	}
	f.dot = fmt("<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Electronics</div>\n\t\t\t\t\t\t<div class='links'>\n\t\t\t\t\t\t<b>Radio settings:</b><br>\n\t\t\t\t\t\tMicrophone: <a href='?src=＃;rmictoggle=1'><span id=\"rmicstate\">＀</span></a><br>\n\t\t\t\t\t\tSpeaker: <a href='?src=＃;rspktoggle=1'><span id=\"rspkstate\">＀</span></a><br>\n\t\t\t\t\t\tFrequency:\n\t\t\t\t\t\t<a href='?src=＃;rfreq=-10'>-</a>\n\t\t\t\t\t\t<a href='?src=＃;rfreq=-2'>-</a>\n\t\t\t\t\t\t<span id=\"rfreq\">＀</span>\n\t\t\t\t\t\t<a href='?src=＃;rfreq=2'>+</a>\n\t\t\t\t\t\t<a href='?src=＃;rfreq=10'>+</a><br>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Permissions & Logging</div>\n\t\t\t\t\t\t<div class='links'>\n\t\t\t\t\t\t<a href='?src=＃;toggle_id_upload=1'><span id='t_id_upload'>＀ock ID upload panel</span></a><br>\n\t\t\t\t\t\t<a href='?src=＃;toggle_maint_access=1'><span id='t_maint_access'>＀ maintenance protocols</span></a><br>\n\t\t\t\t\t\t<a href='?src=＃;dna_lock=1'>DNA-lock</a><br>\n\t\t\t\t\t\t<a href='?src=＃;view_log=1'>View internal log</a><br>\n\t\t\t\t\t\t<a href='?src=＃;change_name=1'>Change exosuit name</a><br>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id='equipment_menu'>＀</div>\n\t\t\t\t\t\t", [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, this, this, this, this.get_equipment_menu()]);
	return f.dot;
});

// mecha_topic.dm:128
rt.def("/obj/mecha/proc/get_equipment_menu", function get_equipment_menu(f: Frame) {
	let X: Value = null, W: Value = null;
	f.dot = "";
	if (!rt.len(f, this.equipment)) return f.dot;
	f.dot += "<div class='wr'>\n\t\t\t\t\t\t<div class='header'>Equipment</div>\n\t\t\t\t\t\t<div class='links'>";
	for (X of each(this.equipment)) {
		f.dot += fmt("＀ <a href='?src=＃;detach=1'>Detach</a><br>", [(W = X).name, W]);
	}
	f.dot += `<b>Available equipment slots:</b> ${this.max_equip - rt.len(f, this.equipment)}`;
	f.dot += "</div></div>";
	return f.dot;
});

// mecha_topic.dm:141
rt.def("/obj/mecha/proc/get_equipment_list", function get_equipment_list(f: Frame) {
	let MT: Value = null;
	if (!rt.len(f, this.equipment)) {
		return f.dot;
	}
	f.dot = "<b>Equipment:</b><div style=\"margin-left: 15px;\">";
	for (MT of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment"))) {
		f.dot += fmt("<div id='＃'>＀</div>", [MT, MT.get_equip_info()]);
	}
	f.dot += "</div>";
	return f.dot;
});

// mecha_topic.dm:151
rt.def("/obj/mecha/proc/get_log_html", function get_log_html(f: Frame) {
	let entry: Value = null;
	f.dot = `<html><head><title>${this.name} Log</title></head><body style='font: 13px 'Courier', monospace;'>`;
	for (entry of each(this.log, T("/list"))) {
		f.dot += `<div style='font-weight: bold;'>${rt.at(entry, "time")} ${time2text(rt.at(entry, "date"), "MMM DD")} ${rt.at(entry, "year")}</div>\n\t\t\t\t\t\t<div style='margin-left:15px; margin-bottom:10px;'>${rt.at(entry, "message")}</div>\n\t\t\t\t\t\t`;
	}
	f.dot += "</body></html>";
	return f.dot;
});

// mecha_topic.dm:161
rt.def("/obj/mecha/proc/output_access_dialog", function output_access_dialog(f: Frame, id_card: Value, user: Value) {
	let a: Value = null, a_name: Value = null;
	if (!id_card || !user) {
		return f.dot;
	}
	f.dot = "<html>\n\t\t\t\t\t\t<head><style>\n\t\t\t\t\t\th1 {font-size:15px;margin-bottom:4px;}\n\t\t\t\t\t\tbody {color: #00ff00; background: #000000; font-family:\"Courier New\", Courier, monospace; font-size: 12px;}\n\t\t\t\t\t\ta {color:#0f0;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t<h1>Following keycodes are present in this system:</h1>";
	for (a of each(this.operation_req_access)) {
		f.dot += fmt("＀ - <a href='?src=＃;del_req_access=＀;user=＃;id_card=＃'>Delete</a><br>", [get_access_desc(a), this, a, user, id_card]);
	}
	f.dot += "<hr><h1>Following keycodes were detected on portable device:</h1>";
	a = null;
	for (a of each(id_card.access)) {
		if (rt.isIn(f, a, this.operation_req_access)) {
			continue;
		}
		if (!(a_name = get_access_desc(a))) {
			continue;
		}
		f.dot += fmt("＀ - <a href='?src=＃;add_req_access=＀;user=＃;id_card=＃'>Add</a><br>", [a_name, this, a, user, id_card]);
	}
	f.dot += fmt("<hr><a href='?src=＃;finish_req_access=1;user=＃'>Finish</a> ", [this, user]);
	f.dot += "<span class='danger'>(Warning! The ID upload panel will be locked. It can be unlocked only through Exosuit Interface.)</span>";
	f.dot += "</body></html>";
	rt.op(f, "Browse", [], [user, f.dot, "window=exosuit_add_access"], false);
	onclose(user, "exosuit_add_access");
	return f.dot;
});

// mecha_topic.dm:187
rt.def("/obj/mecha/proc/output_maintenance_dialog", function output_maintenance_dialog(f: Frame, id_card: Value, user: Value) {
	let $0: any, $1: any, $2: any;
	if (!id_card || !user) {
		return f.dot;
	}
	if (this.add_req_access) {
		$0 = fmt("<a href='?src=＃;req_access=1;id_card=＃;user=＃'>Edit operation keycodes</a>", [this, id_card, user]);
	} else {
		$0 = null;
	}
	if (this.maint_access) {
		$1 = fmt("<a href='?src=＃;maint_access=1;id_card=＃;user=＃'>Initiate maintenance protocol</a>", [this, id_card, user]);
	} else {
		$1 = null;
	}
	if (this.state > 0) {
		$2 = fmt("<a href='?src=＃;set_internal_tank_valve=1;user=＃'>Set Cabin Air Pressure</a>", [this, user]);
	} else {
		$2 = null;
	}
	f.dot = `<html>\n\t\t\t\t\t\t<head>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\tbody {color: #00ff00; background: #000000; font-family:"Courier New", Courier, monospace; font-size: 12px;}\n\t\t\t\t\t\ta {padding:2px 5px; background:#32CD32;color:#000;display:block;margin:2px;text-align:center;text-decoration:none;}\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t</head>\n\t\t\t\t\t\t<body>\n\t\t\t\t\t\t${$0}\n\t\t\t\t\t\t${$1}\n\t\t\t\t\t\t${$2}\n\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>`;
	rt.op(f, "Browse", [], [user, f.dot, "window=exosuit_maint_console"], false);
	onclose(user, "exosuit_maint_console");
	return f.dot;
});

// mecha_topic.dm:212
rt.def("/obj/mecha/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let user: Value = null, new_pressure: Value = null, equip: Value = null, new_frequency: Value = null, newname: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	yield* parent_proc();
	if (rt.at(href_list, "close")) {
		return f.dot;
	}
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	let filter: Value = (yield* new_(T("/datum/topic_input"), href, href_list));
	if (get_dist(this, f.usr) <= 1) {
		if (rt.at(href_list, "req_access") && this.add_req_access) {
			this.output_access_dialog(filter.getObj("id_card"), filter.getMob("user"));
		}
		if (rt.at(href_list, "maint_access") && this.maint_access) {
			if (user = filter.getMob("user")) {
				if (this.state == 0) {
					this.state = 1;
					to_chat(user, "The securing bolts are now exposed.");
				} else if (this.state == 1) {
					this.state = 0;
					to_chat(user, "The securing bolts are now hidden.");
				}
				this.output_maintenance_dialog(filter.getObj("id_card"), user);
			}
		}
		if (rt.at(href_list, "set_internal_tank_valve") && this.state >= 1) {
			if (user = filter.getMob("user")) {
				if (new_pressure = (yield* g.op(f, "Prompt", [32], [this.internal_tank_valve, "Pressure setting", "Input new output pressure", user, null]))) {
					this.internal_tank_valve = new_pressure;
					to_chat(user, `The internal pressure valve has been set to ${this.internal_tank_valve}kPa.`);
				}
			}
		}
		if (rt.at(href_list, "add_req_access") && this.add_req_access && filter.getObj("id_card")) {
			this.operation_req_access += filter.getNum("add_req_access");
			this.output_access_dialog(filter.getObj("id_card"), filter.getMob("user"));
		}
		if (rt.at(href_list, "del_req_access") && this.add_req_access && filter.getObj("id_card")) {
			this.operation_req_access -= filter.getNum("del_req_access");
			this.output_access_dialog(filter.getObj("id_card"), filter.getMob("user"));
		}
		if (rt.at(href_list, "finish_req_access")) {
			this.add_req_access = 0;
			rt.op(f, "Browse", [], [(user = filter.getMob("user")), null, "window=exosuit_add_access"], false);
		}
	}
	if (f.usr != this.occupant) {
		return f.dot;
	}
	if (rt.at(href_list, "update_content")) {
		send_byjax(this.occupant, "exosuit.browser", "content", this.get_stats_part());
	}
	if (rt.at(href_list, "select_equip")) {
		if ((equip = filter.getObj("select_equip")) && equip.selectable) {
			this.selected = equip;
			this.occupant_message(`You switch to ${equip}`);
			this.visible_message(`${this} raises ${equip}`);
			send_byjax(this.occupant, "exosuit.browser", "eq_list", this.get_equipment_list());
		}
	}
	if (rt.at(href_list, "rmictoggle")) {
		this.radio.broadcasting = (!this.radio.broadcasting ? 1 : 0);
		$0 = this.occupant;
		$1 = "exosuit.browser";
		$2 = "rmicstate";
		if (this.radio.broadcasting) {
			$3 = "Engaged";
		} else {
			$3 = "Disengaged";
		}
		send_byjax($0, $1, $2, $3);
	}
	if (rt.at(href_list, "rspktoggle")) {
		this.radio.listening = (!this.radio.listening ? 1 : 0);
		$0 = this.occupant;
		$1 = "exosuit.browser";
		$2 = "rspkstate";
		if (this.radio.listening) {
			$3 = "Engaged";
		} else {
			$3 = "Disengaged";
		}
		send_byjax($0, $1, $2, $3);
	}
	if (rt.at(href_list, "rfreq")) {
		new_frequency = this.radio.frequency + filter.getNum("rfreq");
		if (!this.radio.freerange || this.radio.frequency < 1200 || this.radio.frequency > 1600) {
			new_frequency = sanitize_frequency(new_frequency);
		}
		yield* this.radio.set_frequency(new_frequency);
		send_byjax(this.occupant, "exosuit.browser", "rfreq", `${format_frequency(this.radio.frequency)}`);
	}
	if (rt.at(href_list, "view_log")) {
		rt.op(f, "Browse", [], [this.occupant, this.get_log_html(), "window=exosuit_log"], false);
		onclose(this.occupant, "exosuit_log");
	}
	if (rt.at(href_list, "change_name")) {
		if ((newname = (yield* stripped_input(this.occupant, "Choose new exosuit name", "Rename exosuit", "", 42))) && trim(newname)) {
			this.name = newname;
		} else {
			yield* alert(this.occupant, "nope.avi");
		}
	}
	if (rt.at(href_list, "toggle_id_upload")) {
		this.add_req_access = (!this.add_req_access ? 1 : 0);
		$0 = this.occupant;
		$1 = "exosuit.browser";
		$2 = "t_id_upload";
		if (this.add_req_access) {

			$3 = "L";
		} else {
			$3 = "Unl";
		}
		send_byjax($0, $1, $2, `${$3}ock ID upload panel`);
	}
	if (rt.at(href_list, "toggle_maint_access")) {
		if (this.state) {
			this.occupant_message("<span class='danger'>Maintenance protocols in effect</span>");
			return f.dot;
		}
		this.maint_access = (!this.maint_access ? 1 : 0);
		$0 = this.occupant;
		$1 = "exosuit.browser";
		$2 = "t_maint_access";
		if (this.maint_access) {

			$3 = "Forbid";
		} else {
			$3 = "Permit";
		}
		send_byjax($0, $1, $2, `${$3} maintenance protocols`);
	}
	if (rt.at(href_list, "dna_lock")) {
		if (this.occupant && !rt.istype(this.occupant, T("/mob/living/carbon"))) {
			to_chat(this.occupant, "<span class='danger'> You do not have any DNA!</span>");
			return f.dot;
		}
		this.dna_lock = this.occupant.dna.unique_enzymes;
		this.occupant_message("You feel a prick as the needle takes your DNA sample.");
	}
	if (rt.at(href_list, "reset_dna")) {
		this.dna_lock = null;
	}
	if (!rt.at(href_list, "repair_int_control_lost")) return f.dot;
	this.occupant_message("Recalibrating coordination system...");
	this.log_message("Recalibration of coordination system started.");
	let _T: Value = this.loc;
	rt.spawnTail(f, 100, "/obj/mecha/proc/Topic: spawn at game/mecha/mecha_topic.dm:323", filter, user, new_pressure, equip, new_frequency, newname, _T);
	return f.dot;
}, true);

// a spawn(100) body of /obj/mecha/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/Topic: spawn at game/mecha/mecha_topic.dm:323", function* (f: Frame, filter: Value, user: Value, new_pressure: Value, equip: Value, new_frequency: Value, newname: Value, _T: Value) {
	if (_T == this.loc) {
		this.clearInternalDamage(16);
		this.occupant_message("<span class='notice'>Recalibration successful.</span>");
		this.log_message("Recalibration of coordination system finished with 0 errors.");
	} else {
		this.occupant_message("<span class='warning'>Recalibration failed!</span>");
		this.log_message("Recalibration of coordination system failed with 1 error.", 1);
	}
	return null;
});
