// Based on /tg/station's code/datums/datumvars.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// datumvars.dm:9
rt.def("/datum/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "vars") {
		return 0;
	} else if (var_name === "var_edited") {
		return 0;
	}
	this.var_edited = 1;
	rt.setAt(this.vars, var_name, var_value);
	return f.dot;
});

// datumvars.dm:18
rt.def("/datum/proc/vv_get_var", function vv_get_var(f: Frame, var_name: Value) {
	if (var_name === "vars") {
		return debug_variable(var_name, list(), 0, this);
	}
	return debug_variable(var_name, rt.index(this.vars, var_name), 0, this);
});

// datumvars.dm:26
rt.def("/datum/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = list();
	rt.setAt((f.dot += "---"), "Call Proc", fmt("?_src_=vars;proc_call=＃", [this]));
	rt.setAt(f.dot, "Mark Object", fmt("?_src_=vars;mark_object=＃", [this]));
	rt.setAt(f.dot, "Delete", fmt("?_src_=vars;delete=＃", [this]));
	return f.dot;
});

// datumvars.dm:43
rt.def("/client/proc/debug_variables", function* debug_variables(f: Frame, D: Value) {
	let islist: Value = null, sprite: Value = null, hash: Value = null, AT: Value = null, sprite_text: Value = null, A: Value = null, M: Value = null, formatted_type: Value = null, middle_point: Value = null, splitpoint: Value = null, marked: Value = null, name: Value = null, link: Value = null, V: Value = null, L: Value = null, i: Value = null, key: Value = null, value: Value = null, V_15: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	if (!f.usr.client || !f.usr.client.holder) {
		to_chat(f.usr, "<span class='danger'>You need to be an administrator to access this.</span>");
		return f.dot;
	}
	if (!D) {
		return f.dot;
	}
	if (!(islist = (rt.istype(D, T("/list")) ? 1 : 0)) && !rt.istype(D, T("/datum"))) {
		return f.dot;
	}
	let title: Value = "";
	let refid: Value = fmt("＃", [D]);
	let type: Value = T("/list");
	if (!islist) {
		type = D.type;
	}
	if (rt.istype(D, T("/atom"))) {
		if ((AT = D).icon && AT.icon_state) {
			sprite = (yield* new_(T("/icon"), AT.icon, AT.icon_state));
			hash = md5((hash = md5(AT.icon)) + AT.icon_state);
			rt.op(f, "BrowseResource", [], [f.usr, sprite, `vv${hash}.png`], false);
		}
	}
	title = fmt("＀ (＃) = ＀", [D, D, type]);
	if (sprite) {
		sprite_text = `<img src='vv${hash}.png'></td><td>`;
	}
	let atomsnowflake: Value = list();
	if (rt.istype(D, T("/atom"))) {
		if (rt.istype((A = D), T("/mob/living"))) {
			atomsnowflake += `<a href='?_src_=vars;rename=${refid}'><b>${D}</b></a>`;
			if (A.dir) {
				atomsnowflake += `<br><font size='1'><a href='?_src_=vars;rotatedatum=${refid};rotatedir=left'><<</a> <a href='?_src_=vars;datumedit=${refid};varnameedit=dir'>${dir2text(A.dir)}</a> <a href='?_src_=vars;rotatedatum=${refid};rotatedir=right'>>></a></font>`;
			}
			M = A;
			$0 = refid;
			if (M.ckey) {
				$1 = M.ckey;
			} else {
				$1 = "No ckey";
			}
			$2 = refid;
			if (M.real_name) {
				$3 = M.real_name;
			} else {
				$3 = "No real name";
			}
			atomsnowflake += `\n\t\t\t\t<br><font size='1'><a href='?_src_=vars;datumedit=${$0};varnameedit=ckey'>${$1}</a> / <a href='?_src_=vars;datumedit=${$2};varnameedit=real_name'>${$3}</a></font>\n\t\t\t\t<br><font size='1'>\n\t\t\t\t\tBRUTE:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=brute'>${M.getBruteLoss()}</a>\n\t\t\t\t\tFIRE:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=fire'>${M.getFireLoss()}</a>\n\t\t\t\t\tTOXIN:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=toxin'>${M.getToxLoss()}</a>\n\t\t\t\t\tOXY:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=oxygen'>${M.getOxyLoss()}</a>\n\t\t\t\t\tCLONE:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=clone'>${M.getCloneLoss()}</a>\n\t\t\t\t\tBRAIN:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=brain'>${M.getBrainLoss()}</a>\n\t\t\t\t\tSTAMINA:<font size='1'><a href='?_src_=vars;mobToDamage=${refid};adjustDamage=stamina'>${M.getStaminaLoss()}</a>\n\t\t\t\t</font>\n\t\t\t`;
		} else {
			atomsnowflake += `<a href='?_src_=vars;datumedit=${refid};varnameedit=name'><b>${D}</b></a>`;
			if (A.dir) {
				atomsnowflake += `<br><font size='1'><a href='?_src_=vars;rotatedatum=${refid};rotatedir=left'><<</a> <a href='?_src_=vars;datumedit=${refid};varnameedit=dir'>${dir2text(A.dir)}</a> <a href='?_src_=vars;rotatedatum=${refid};rotatedir=right'>>></a></font>`;
			}
		}
	} else {
		atomsnowflake += `<b>${D}</b>`;
	}
	if (rt.length((formatted_type = `${type}`)) > 25) {
		middle_point = rt.length(formatted_type) / 2;
		if (splitpoint = findtext(formatted_type, "/", middle_point)) {
			formatted_type = `${copytext(formatted_type, 1, splitpoint)}<br>${copytext(formatted_type, splitpoint)}`;
		} else {
			formatted_type = "Type too long";
		}
	}
	if (this.holder.marked_datum && this.holder.marked_datum == D) {
		marked = "<br><font size='1' color='red'><b>Marked Object</b></font>";
	}
	let varedited_line: Value = "";
	if (!islist && D.var_edited) {
		varedited_line = "<br><font size='1' color='red'><b>Var Edited</b></font>";
	}
	let dropdownoptions: Value = list();
	if (islist) {
		dropdownoptions = rt.alist(f, [null, "---", "Add Item", `?_src_=vars;listadd=${refid}`, "Remove Nulls", `?_src_=vars;listnulls=${refid}`, "Remove Dupes", `?_src_=vars;listdupes=${refid}`, "Set len", `?_src_=vars;listlen=${refid}`, "Shuffle", `?_src_=vars;listshuffle=${refid}`]);
	} else {
		dropdownoptions = D.vv_get_dropdown();
	}
	let dropdownoptions_html: Value = list();
	for (name of each(dropdownoptions)) {
		if (link = rt.index(dropdownoptions, name)) {
			dropdownoptions_html += `<option value='${link}'>${name}</option>`;
		} else {
			dropdownoptions_html += `<option value>${name}</option>`;
		}
	}
	let names: Value = list();
	if (!islist) {
		for (V of each(D.vars)) {
			names += V;
		}
	}
	yield* sleep(1);
	let variable_html: Value = list();
	if (islist) {
		L = D;
		rt.forRange(f, 0, 1, rt.len(f, L), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			key = rt.index(L, i);
			value = null;
			if (lentext(fmt("＃", [L])) <= 10) {
				$0 = "TYPEID_NULL";
			} else {
				$0 = copytext(fmt("＃", [L]), 4, lentext(fmt("＃", [L])) - 6);
			}
			if ($0 == "f" && !isnum(key)) {
				value = rt.index(L, key);
			}
			variable_html += debug_variable(i, value, 0, D);
		}
		rt.endFor(f, 0);
	} else {
		names = (yield* sortList(names));
		for (V_15 of each(names)) {
			if (D.can_vv_get(V_15)) {
				variable_html += D.vv_get_var(V_15);
			}
		}
	}
	let html: Value = fmt("\n<html>\n\t<head>\n\t\t<title>＀</title>\n\t\t<style>\n\t\t\tbody {\n\t\t\t\tfont-family: Verdana, sans-serif;\n\t\t\t\tfont-size: 9pt;\n\t\t\t}\n\t\t\t.value {\n\t\t\t\tfont-family: \"Courier New\", monospace;\n\t\t\t\tfont-size: 8pt;\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body onload='selectTextField(); updateSearch()' onkeydown='return checkreload()' onkeyup='updateSearch()'>\n\t\t<script type=\"text/javascript\">\n\t\t\tfunction checkreload() {\n\t\t\t\tif(event.keyCode == 116){\t//F5 (to refresh properly)\n\t\t\t\t\tdocument.getElementById(\"refresh_link\").click();\n\t\t\t\t\tevent.preventDefault ? event.preventDefault() : (event.returnValue = false)\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t\treturn true;\n\t\t\t}\n\t\t\tfunction updateSearch(){\n\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\tvar filter = filter_text.value.toLowerCase();\n\t\t\t\tif(event.keyCode == 13){\t//Enter / return\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.style.backgroundColor == \"#ffee88\" )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\talist = lis[i].getElementsByTagName(\"a\")\n\t\t\t\t\t\t\t\tif(alist.length > 0){\n\t\t\t\t\t\t\t\t\tlocation.href=alist[0].href;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {   }\n\t\t\t\t\t}\n\t\t\t\t\treturn\n\t\t\t\t}\n\t\t\t\tif(event.keyCode == 38){\t//Up arrow\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.style.backgroundColor == \"#ffee88\" )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tif( (i-1) >= 0){\n\t\t\t\t\t\t\t\t\tvar li_new = lis[i-1];\n\t\t\t\t\t\t\t\t\tli.style.backgroundColor = \"white\";\n\t\t\t\t\t\t\t\t\tli_new.style.backgroundColor = \"#ffee88\";\n\t\t\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {  }\n\t\t\t\t\t}\n\t\t\t\t\treturn\n\t\t\t\t}\n\t\t\t\tif(event.keyCode == 40){\t//Down arrow\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.style.backgroundColor == \"#ffee88\" )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tif( (i+1) < lis.length){\n\t\t\t\t\t\t\t\t\tvar li_new = lis[i+1];\n\t\t\t\t\t\t\t\t\tli.style.backgroundColor = \"white\";\n\t\t\t\t\t\t\t\t\tli_new.style.backgroundColor = \"#ffee88\";\n\t\t\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {  }\n\t\t\t\t\t}\n\t\t\t\t\treturn\n\t\t\t\t}\n\n\t\t\t\t//This part here resets everything to how it was at the start so the filter is applied to the complete list. Screw efficiency, it's client-side anyway and it only looks through 200 or so variables at maximum anyway (mobs).\n\t\t\t\tif(complete_list != null && complete_list != \"\"){\n\t\t\t\t\tvar vars_ol1 = document.getElementById(\"vars\");\n\t\t\t\t\tvars_ol1.innerHTML = complete_list\n\t\t\t\t}\n\t\t\t\tdocument.cookie=\"＀＀search=\"+encodeURIComponent(filter);\n\t\t\t\tif(filter == \"\"){\n\t\t\t\t\treturn;\n\t\t\t\t}else{\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.innerText.toLowerCase().indexOf(filter) == -1 )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tvars_ol.removeChild(li);\n\t\t\t\t\t\t\t\ti--;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {   }\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tvar lis_new = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\tfor ( var j = 0; j < lis_new.length; ++j )\n\t\t\t\t{\n\t\t\t\t\tvar li1 = lis[j];\n\t\t\t\t\tif (j == 0){\n\t\t\t\t\t\tli1.style.backgroundColor = \"#ffee88\";\n\t\t\t\t\t}else{\n\t\t\t\t\t\tli1.style.backgroundColor = \"white\";\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tfunction selectTextField() {\n\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\tfilter_text.focus();\n\t\t\t\tfilter_text.select();\n\t\t\t\tvar lastsearch = getCookie(\"＀＀search\");\n\t\t\t\tif (lastsearch) {\n\t\t\t\t\tfilter_text.value = lastsearch;\n\t\t\t\t\tupdateSearch();\n\t\t\t\t}\n\t\t\t}\n\t\t\tfunction loadPage(list) {\n\t\t\t\tif(list.options[list.selectedIndex].value == \"\"){\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tlocation.href=list.options[list.selectedIndex].value;\n\t\t\t}\n\t\t\tfunction getCookie(cname) {\n\t\t\t\tvar name = cname + \"=\";\n\t\t\t\tvar ca = document.cookie.split(';');\n\t\t\t\tfor(var i=0; i<ca.length; i++) {\n\t\t\t\t\tvar c = ca[i];\n\t\t\t\t\twhile (c.charAt(0)==' ') c = c.substring(1,c.length);\n\t\t\t\t\tif (c.indexOf(name)==0) return c.substring(name.length,c.length);\n\t\t\t\t}\n\t\t\t\treturn \"\";\n\t\t\t}\n\n\t\t</script>\n\t\t<div align='center'>\n\t\t\t<table width='100%'>\n\t\t\t\t<tr>\n\t\t\t\t\t<td width='50%'>\n\t\t\t\t\t\t<table align='center' width='100%'>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t\t<b><font size='1'>＀</font></b>\n\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td width='50%'>\n\t\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t\t<a id='refresh_link' href='?_src_=vars;datumrefresh=＀'>Refresh</a>\n\t\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t\t<select name=\"file\" size=\"1\"\n\t\t\t\t\t\t\t\t\tonchange=\"loadPage(this.form.elements[0])\"\n\t\t\t\t\t\t\t\t\ttarget=\"_parent._top\"\n\t\t\t\t\t\t\t\t\tonmouseclick=\"this.focus()\"\n\t\t\t\t\t\t\t\t\tstyle=\"background-color:#ffffff\">\n\t\t\t\t\t\t\t\t\t<option value selected>Select option</option>\n\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</div>\n\t\t<hr>\n\t\t<font size='1'>\n\t\t\t<b>E</b> - Edit, tries to determine the variable type by itself.<br>\n\t\t\t<b>C</b> - Change, asks you for the var type first.<br>\n\t\t\t<b>M</b> - Mass modify: changes this variable for all objects of this type.<br>\n\t\t</font>\n\t\t<hr>\n\t\t<table width='100%'>\n\t\t\t<tr>\n\t\t\t\t<td width='20%'>\n\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t<b>Search:</b>\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t\t<td width='80%'>\n\t\t\t\t\t<input type='text' id='filter' name='filter_text' value='' style='width:100%;'>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t<hr>\n\t\t<ol id='vars'>\n\t\t\t＀\n\t\t</ol>\n\t\t<script type='text/javascript'>\n\t\t\tvar vars_ol = document.getElementById(\"vars\");\n\t\t\tvar complete_list = vars_ol.innerHTML;\n\t\t</script>\n\t</body>\n</html>\n", [title, refid, GLOB.cookieoffset, refid, GLOB.cookieoffset, sprite_text, atomsnowflake.Join(), formatted_type, marked, varedited_line, refid, dropdownoptions_html.Join(), variable_html.Join()]);
	rt.op(f, "Browse", [], [f.usr, html, `window=variables${refid};size=475x650`], false);
	return f.dot;
}, true, { verb: { name: "View Variables", category: "Debug" }, argTypes: [{ path: "/datum", source: "world" }] });

// datumvars.dm:390
rt.def("/proc/debug_variable", function debug_variable(f: Frame, name: Value, value: Value, level: Value, DA: Value, sanitize: Value) {
	let header: Value = null, index: Value = null, item: Value = null, D: Value = null, L: Value = null, items: Value = null, i: Value = null, key: Value = null, val: Value = null;
	let $0: any, $1: any, $e: any;
	sanitize ??= 1;
	if (DA) {
		if (rt.istype(DA, T("/list"))) {
			index = name;
			if (value) {
				name = rt.index(DA, name);
			} else {
				value = rt.index(DA, name);
			}
			header = fmt("<li style='backgroundColor:white'>(<a href='?_src_=vars;listedit=＃;index=＀'>E</a>) (<a href='?_src_=vars;listchange=＃;index=＀'>C</a>) (<a href='?_src_=vars;listremove=＃;index=＀'>-</a>) ", [DA, index, DA, index, DA, index]);
		} else {
			header = fmt("<li style='backgroundColor:white'>(<a href='?_src_=vars;datumedit=＃;varnameedit=＀'>E</a>) (<a href='?_src_=vars;datumchange=＃;varnamechange=＀'>C</a>) (<a href='?_src_=vars;datummass=＃;varnamemass=＀'>M</a>) ", [DA, name, DA, name, DA, name]);
		}
	} else {
		header = "<li>";
	}
	if (value === null) {
		if (sanitize) {
			$0 = html_encode(name);
		} else {
			$0 = name;
		}
		item = `${$0} = <span class='value'>null</span>`;
	} else if (istext(value)) {
		if (sanitize) {
			$0 = html_encode(name);
		} else {
			$0 = name;
		}
		if (sanitize) {
			$1 = html_encode(value);
		} else {
			$1 = value;
		}
		item = `${$0} = <span class='value'>"${$1}"</span>`;
	} else if (isicon(value)) {
		item = `${sanitize ? html_encode(name) : name} = /icon (<span class='value'>${value}</span>)`;
	} else if (isfile(value)) {
		item = `${sanitize ? html_encode(name) : name} = <span class='value'>'${value}'</span>`;
	} else if (rt.istype(value, T("/datum"))) {
		if (`${(D = value)}` != `${D.type}`) {
			$0 = value;
			if (sanitize) {
				$1 = html_encode(name);
			} else {
				$1 = name;
			}
			item = fmt("<a href='?_src_=vars;Vars=＃'>＀ ＃</a> = ＀ ＀", [$0, $1, value, D, D.type]);
		} else {
			$0 = value;
			if (sanitize) {
				$1 = html_encode(name);
			} else {
				$1 = name;
			}
			item = fmt("<a href='?_src_=vars;Vars=＃'>＀ ＃</a> = ＀", [$0, $1, value, D.type]);
		}
	} else if (rt.istype(value, T("/list"))) {
		L = value;
		items = list();
		$0 = (rt.len(f, L) > 0 ? 1 : 0);
		if ($0) {
			$0 = ((name == "underlays" ? 1 : 0) || (name == "overlays" ? 1 : 0));
			if (!$0) {
				$0 = rt.len(f, L);
				if (lentext(fmt("＃", [L])) <= 10) {
					$1 = "TYPEID_NULL";
				} else {
					$1 = copytext(fmt("＃", [L]), 4, lentext(fmt("＃", [L])) - 6);
				}
				if ($1 == "f") {
					$1 = 50;
				} else {
					$1 = 150;
				}
				$0 = ($0 > $1 ? 1 : 0);
			}
			$0 = (!$0 ? 1 : 0);
		}
		if ($0) {
			rt.forRange(f, 0, 1, rt.len(f, L), 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				key = rt.index(L, i);
				val = null;
				if (lentext(fmt("＃", [L])) <= 10) {
					$0 = "TYPEID_NULL";
				} else {
					$0 = copytext(fmt("＃", [L]), 4, lentext(fmt("＃", [L])) - 6);
				}
				if ($0 == "f" && !isnum(key)) {
					val = rt.index(L, key);
				}
				if (!val) {
					val = key;
					key = i;
				}
				items += rt.call(f, P("/proc/debug_variable"), null, [null, key, null, val, null, level + 1, "sanitize", sanitize], rt.Args.Named);
			}
			rt.endFor(f, 0);
			$0 = value;
			if (sanitize) {
				$1 = html_encode(name);
			} else {
				$1 = name;
			}
			item = fmt("<a href='?_src_=vars;Vars=＃'>＀ = /list (＀)</a><ul>＀</ul>", [$0, $1, rt.len(f, L), items.Join()]);
		} else {
			$0 = value;
			if (sanitize) {
				$1 = html_encode(name);
			} else {
				$1 = name;
			}
			item = fmt("<a href='?_src_=vars;Vars=＃'>＀ = /list (＀)</a>", [$0, $1, rt.len(f, L)]);
		}
	} else {
		item = `${sanitize ? html_encode(name) : name} = <span class='value'>${sanitize ? html_encode(value) : value}</span>`;
	}
	return `${header}${item}</li>`;
});

// datumvars.dm:473
rt.def("/client/proc/view_var_Topic", function* view_var_Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	let DAT: Value = null, M: Value = null, D: Value = null, _T: Value = null, new_name: Value = null, index: Value = null, L: Value = null, variable: Value = null, prompt: Value = null, L_0: Value = null, value: Value = null, O: Value = null, action_type: Value = null, O_type: Value = null, i: Value = null, Obj: Value = null, A: Value = null, amount: Value = null, chosen_id: Value = null, reagent_options: Value = null, valid_id: Value = null, ID: Value = null, amount_3: Value = null, C: Value = null, Mo: Value = null, H: Value = null, result: Value = null, newtype: Value = null, edit_action: Value = null, limb_list: Value = null, result_3: Value = null, BP: Value = null, success: Value = null, msg: Value = null, Text: Value = null, amount_2: Value = null, msg_3: Value = null;
	let $e: any;
	if (f.usr.client != this || !this.holder) {
		return f.dot;
	}
	if (rt.at(href_list, "Vars")) {
		yield* this.debug_variables(rt.locateIn(f, rt.at(href_list, "Vars"), rt.world()));
	} else if (rt.at(href_list, "datumrefresh")) {
		if (!(DAT = rt.locateIn(f, rt.at(href_list, "datumrefresh"), rt.world()))) {
			return f.dot;
		}
		yield* this.debug_variables(DAT);
	} else if (rt.at(href_list, "mob_player_panel")) {
		if (!check_rights(0)) {
			return f.dot;
		}
		if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "mob_player_panel"), rt.world())), T("/mob"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob");
			return f.dot;
		}
		this.holder.show_player_panel(M);
		rt.setAt(href_list, "datumrefresh", rt.at(href_list, "mob_player_panel"));
	} else if (rt.at(href_list, "godmode")) {
		if (!check_rights(2)) {
			return f.dot;
		}
		if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "godmode"), rt.world())), T("/mob"))) {
			to_chat(f.usr, "This can only be used on instances of type /mob");
			return f.dot;
		}
		this.cmd_admin_godmode(M);
		rt.setAt(href_list, "datumrefresh", rt.at(href_list, "godmode"));
	} else if (rt.at(href_list, "mark_object")) {
		if (!check_rights(0)) {
			return f.dot;
		}
		if (!rt.istype((D = rt.locateIn(f, rt.at(href_list, "mark_object"), rt.world())), T("/datum"))) {
			to_chat(f.usr, "This can only be done to instances of type /datum");
			return f.dot;
		}
		this.holder.marked_datum = D;
		rt.setAt(href_list, "datumrefresh", rt.at(href_list, "mark_object"));
	} else if (rt.at(href_list, "proc_call")) {
		if (!check_rights(0)) {
			return f.dot;
		}
		if (_T = rt.locateIn(f, rt.at(href_list, "proc_call"), rt.world())) {
			yield* this.callproc_datum(_T);
		}
	} else if (rt.at(href_list, "delete")) {
		if (!check_rights(32, 0)) {
			return f.dot;
		}
		if (!(D = rt.locateIn(f, rt.at(href_list, "delete"), rt.world()))) {
			to_chat(f.usr, "Unable to locate item!");
		}
		yield* this.admin_delete(D);
		rt.setAt(href_list, "datumrefresh", rt.at(href_list, "delete"));
	} else if (rt.at(href_list, "regenerateicons")) {
		if (!check_rights(0)) {
			return f.dot;
		}
		if (!ismob((M = rt.locateIn(f, rt.at(href_list, "regenerateicons"), rt.world())))) {
			to_chat(f.usr, "This can only be done to instances of type /mob");
			return f.dot;
		}
		yield* M.regenerate_icons();
	} else {
		if (!check_rights(1024)) return f.dot;
		if (rt.at(href_list, "rename")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "rename"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			if (!(new_name = (yield* stripped_input(f.usr, "What would you like to name this mob?", "Input a name", M.real_name, 42))) || !M) {
				return f.dot;
			}
			message_admins(`Admin ${key_name_admin(f.usr)} renamed ${key_name_admin(M)} to ${new_name}.`);
			yield* M.fully_replace_character_name(M.real_name, new_name);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "rename"));
		} else if (rt.at(href_list, "varnameedit") && rt.at(href_list, "datumedit")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((D = rt.locateIn(f, rt.at(href_list, "datumedit"), rt.world())), T("/datum"))) {
				to_chat(f.usr, "This can only be used on datums");
				return f.dot;
			}
			yield* this.modify_variables(D, rt.at(href_list, "varnameedit"), 1);
		} else if (rt.at(href_list, "varnamechange") && rt.at(href_list, "datumchange")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((D = rt.locateIn(f, rt.at(href_list, "datumchange"), rt.world())), T("/datum"))) {
				to_chat(f.usr, "This can only be used on datums");
				return f.dot;
			}
			yield* this.modify_variables(D, rt.at(href_list, "varnamechange"), 0);
		} else if (rt.at(href_list, "varnamemass") && rt.at(href_list, "datummass")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((D = rt.locateIn(f, rt.at(href_list, "datummass"), rt.world())), T("/datum"))) {
				to_chat(f.usr, "This can only be used on instances of type /datum");
				return f.dot;
			}
			yield* this.cmd_mass_modify_object_variables(D, rt.at(href_list, "varnamemass"));
		} else if (rt.at(href_list, "listedit") && rt.at(href_list, "index")) {
			if (!(index = text2num(rt.at(href_list, "index")))) {
				return f.dot;
			}
			if (!rt.istype((L = rt.locateIn(f, rt.at(href_list, "listedit"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			yield* this.mod_list(L, null, "list", "contents", index, { autodetect_class: 1 });
		} else if (rt.at(href_list, "listchange") && rt.at(href_list, "index")) {
			if (!(index = text2num(rt.at(href_list, "index")))) {
				return f.dot;
			}
			if (!rt.istype((L = rt.locateIn(f, rt.at(href_list, "listchange"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			yield* this.mod_list(L, null, "list", "contents", index, { autodetect_class: 0 });
		} else if (rt.at(href_list, "listremove") && rt.at(href_list, "index")) {
			if (!(index = text2num(rt.at(href_list, "index")))) {
				return f.dot;
			}
			if (!rt.istype((L = rt.locateIn(f, rt.at(href_list, "listremove"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			variable = rt.index(L, index);
			if ((prompt = (yield* alert(`Do you want to remove item number ${index} from list?`, "Confirm", "Yes", "No"))) != "Yes") {
				return f.dot;
			}
			L.Cut(index, index + 1);
			log_world(`### ListVarEdit by ${this}: /list's contents: REMOVED=${html_encode(`${variable}`)}`);
			log_admin(`${key_name(this)} modified list's contents: REMOVED=${variable}`);
			message_admins(`${key_name_admin(this)} modified list's contents: REMOVED=${variable}`);
		} else if (rt.at(href_list, "listadd")) {
			if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "listadd"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			yield* this.mod_list_add(L_0, null, "list", "contents");
		} else if (rt.at(href_list, "listdupes")) {
			if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "listdupes"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			uniqueList_inplace(L_0);
			log_world(`### ListVarEdit by ${this}: /list contents: CLEAR DUPES`);
			log_admin(`${key_name(this)} modified list's contents: CLEAR DUPES`);
			message_admins(`${key_name_admin(this)} modified list's contents: CLEAR DUPES`);
		} else if (rt.at(href_list, "listnulls")) {
			if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "listnulls"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			listclearnulls(L_0);
			log_world(`### ListVarEdit by ${this}: /list contents: CLEAR NULLS`);
			log_admin(`${key_name(this)} modified list's contents: CLEAR NULLS`);
			message_admins(`${key_name_admin(this)} modified list's contents: CLEAR NULLS`);
		} else if (rt.at(href_list, "listlen")) {
			if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "listlen"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			if (rt.index((value = (yield* this.vv_get_value("Number"))), "class") != "Number") {
				return f.dot;
			}
			L_0.len = rt.at(value, "value");
			log_world(`### ListVarEdit by ${this}: /list len: ${rt.len(f, L_0)}`);
			log_admin(`${key_name(this)} modified list's len: ${rt.len(f, L_0)}`);
			message_admins(`${key_name_admin(this)} modified list's len: ${rt.len(f, L_0)}`);
		} else if (rt.at(href_list, "listshuffle")) {
			if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "listshuffle"), rt.world())), T("/list"))) {
				to_chat(f.usr, "This can only be used on instances of type /list");
				return f.dot;
			}
			shuffle_inplace(L_0);
			log_world(`### ListVarEdit by ${this}: /list contents: SHUFFLE`);
			log_admin(`${key_name(this)} modified list's contents: SHUFFLE`);
			message_admins(`${key_name_admin(this)} modified list's contents: SHUFFLE`);
		} else if (rt.at(href_list, "give_spell")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "give_spell"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			yield* this.give_spell(M);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "give_spell"));
		} else if (rt.at(href_list, "remove_spell")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "remove_spell"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			yield* this.remove_spell(M);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "remove_spell"));
		} else if (rt.at(href_list, "give_disease")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "give_disease"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			yield* this.give_disease(M);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "give_spell"));
		} else if (rt.at(href_list, "gib")) {
			if (!check_rights(8)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "gib"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			yield* this.cmd_admin_gib(M);
		} else if (rt.at(href_list, "build_mode")) {
			if (!check_rights(1)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "build_mode"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			yield* togglebuildmode(M);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "build_mode"));
		} else if (rt.at(href_list, "drop_everything")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "drop_everything"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			if (f.usr.client) {
				yield* f.usr.client.cmd_admin_drop_everything(M);
			}
		} else if (rt.at(href_list, "direct_control")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "direct_control"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			if (f.usr.client) {
				yield* f.usr.client.cmd_assume_direct_control(M);
			}
		} else if (rt.at(href_list, "offer_control")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((M = rt.locateIn(f, rt.at(href_list, "offer_control"), rt.world())), T("/mob"))) {
				to_chat(f.usr, "This can only be used on instances of type /mob");
				return f.dot;
			}
			yield* offer_control(M);
		} else if (rt.at(href_list, "delall")) {
			if (!check_rights(48)) {
				return f.dot;
			}
			if (!rt.istype((O = rt.locateIn(f, rt.at(href_list, "delall"), rt.world())), T("/obj"))) {
				to_chat(f.usr, "This can only be used on instances of type /obj");
				return f.dot;
			}
			if ((action_type = (yield* alert(`Strict type (${O.type}) or type and all subtypes?`, null, "Strict type", "Type and subtypes", "Cancel"))) == "Cancel" || !action_type) {
				return f.dot;
			}
			if ((yield* alert(`Are you really sure you want to delete all objects of type ${O.type}?`, null, "Yes", "No")) != "Yes") {
				return f.dot;
			}
			if ((yield* alert("Second confirmation required. Delete?", null, "Yes", "No")) != "Yes") {
				return f.dot;
			}
			O_type = O.type;
			if (action_type === "Strict type") {
				i = 0;
				for (Obj of each(rt.world(), T("/obj"))) {
					if (Obj.type == O_type) {
						i++;
						yield* qdel(Obj);
					}
					if (rt.tickUsage(f) > GLOB.current_ticklimit) {
						yield* stoplag();
					}
				}
				if (!i) {
					to_chat(f.usr, "No objects of this type exist");
					return f.dot;
				}
				log_admin(`${key_name(f.usr)} deleted all objects of type ${O_type} (${i} objects deleted) `);
				message_admins(`<span class='notice'>${key_name(f.usr)} deleted all objects of type ${O_type} (${i} objects deleted) </span>`);
			} else if (action_type === "Type and subtypes") {
				i = 0;
				Obj = null;
				for (Obj of each(rt.world(), T("/obj"))) {
					if (rt.op(f, "IsType", [], [Obj, O_type])) {
						i++;
						yield* qdel(Obj);
					}
					if (rt.tickUsage(f) > GLOB.current_ticklimit) {
						yield* stoplag();
					}
				}
				if (!i) {
					to_chat(f.usr, "No objects of this type exist");
					return f.dot;
				}
				log_admin(`${key_name(f.usr)} deleted all objects of type or subtype of ${O_type} (${i} objects deleted) `);
				message_admins(`<span class='notice'>${key_name(f.usr)} deleted all objects of type or subtype of ${O_type} (${i} objects deleted) </span>`);
			}
		} else if (rt.at(href_list, "addreagent")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!(A = rt.locateIn(f, rt.at(href_list, "addreagent"), rt.world())).reagents) {
				if (amount = (yield* g.op(f, "Prompt", [32], [50, "Set Reagent Size", `Specify the reagent size of ${A}`, f.usr, null]))) {
					yield* A.create_reagents(amount);
				}
			}
			if (A.reagents) {
				reagent_options = (yield* sortList(GLOB.chemical_reagents_list));
				const subject = (yield* alert(f.usr, "Choose a method.", "Add Reagents", "Enter ID", "Choose ID"));
				if (subject === "Enter ID") {
					while (!valid_id) {
						if (!(chosen_id = (yield* stripped_input(f.usr, "Enter the ID of the reagent you want to add.")))) {
							break;
						}
						ID = null;
						for (ID of each(reagent_options)) {
							if (ID == chosen_id) {
								valid_id = 1;
							}
						}
						if (!valid_id) {
							to_chat(f.usr, "<span class='warning'>A reagent with that ID doesn't exist!</span>");
						}
					}
				} else if (subject === "Choose ID") {
					chosen_id = (yield* g.op(f, "Prompt", [1], [null, "Choose a reagent.", "Choose a reagent to add.", f.usr, reagent_options]));
				}
				if (chosen_id) {
					if (amount_3 = (yield* g.op(f, "Prompt", [32], [A.reagents.maximum_volume, "Choose the amount.", "Choose the amount to add.", f.usr, null]))) {
						yield* A.reagents.add_reagent(chosen_id, amount_3);
						log_admin(fmt("＀ has added ＀ units of ＀ to ％！", [key_name(f.usr), amount_3, chosen_id, A]));
						message_admins(fmt("<span class='notice'>＀ has added ＀ units of ＀ to ％！</span>", [key_name(f.usr), amount_3, chosen_id, A]));
					}
				}
			}
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "addreagent"));
		} else if (rt.at(href_list, "explode")) {
			if (!check_rights(8)) {
				return f.dot;
			}
			if (!rt.istype((A = rt.locateIn(f, rt.at(href_list, "explode"), rt.world())), T("/obj")) && !ismob(A) && !isturf(A)) {
				to_chat(f.usr, "This can only be done to instances of type /obj, /mob and /turf");
				return f.dot;
			}
			yield* this.cmd_admin_explosion(A);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "explode"));
		} else if (rt.at(href_list, "emp")) {
			if (!check_rights(8)) {
				return f.dot;
			}
			if (!rt.istype((A = rt.locateIn(f, rt.at(href_list, "emp"), rt.world())), T("/obj")) && !ismob(A) && !isturf(A)) {
				to_chat(f.usr, "This can only be done to instances of type /obj, /mob and /turf");
				return f.dot;
			}
			yield* this.cmd_admin_emp(A);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "emp"));
		} else if (rt.at(href_list, "rotatedatum")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((A = rt.locateIn(f, rt.at(href_list, "rotatedatum"), rt.world())), T("/atom"))) {
				to_chat(f.usr, "This can only be done to instances of type /atom");
				return f.dot;
			}
			const item = rt.at(href_list, "rotatedir");
			if (item === "right") {
				yield* A.setDir(turn(A.dir, -45));
			} else if (item === "left") {
				yield* A.setDir(turn(A.dir, 45));
			}
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "rotatedatum"));
		} else if (rt.at(href_list, "editorgans")) {
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((C = rt.locateIn(f, rt.at(href_list, "editorgans"), rt.world())), T("/mob/living/carbon"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon");
				return f.dot;
			}
			yield* this.manipulate_organs(C);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "editorgans"));
		} else if (rt.at(href_list, "makehuman")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((Mo = rt.locateIn(f, rt.at(href_list, "makehuman"), rt.world())), T("/mob/living/carbon/monkey"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/monkey");
				return f.dot;
			}
			if ((yield* alert("Confirm mob type change?", null, "Transform", "Cancel")) != "Transform") {
				return f.dot;
			}
			if (!Mo) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			yield* this.holder.Topic(href, rt.alist(f, ["humanone", rt.at(href_list, "makehuman")]));
		} else if (rt.at(href_list, "makemonkey")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makemonkey"), rt.world())), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/human");
				return f.dot;
			}
			if ((yield* alert("Confirm mob type change?", null, "Transform", "Cancel")) != "Transform") {
				return f.dot;
			}
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			yield* this.holder.Topic(href, rt.alist(f, ["monkeyone", rt.at(href_list, "makemonkey")]));
		} else if (rt.at(href_list, "makerobot")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makerobot"), rt.world())), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/human");
				return f.dot;
			}
			if ((yield* alert("Confirm mob type change?", null, "Transform", "Cancel")) != "Transform") {
				return f.dot;
			}
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			yield* this.holder.Topic(href, rt.alist(f, ["makerobot", rt.at(href_list, "makerobot")]));
		} else if (rt.at(href_list, "makealien")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makealien"), rt.world())), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/human");
				return f.dot;
			}
			if ((yield* alert("Confirm mob type change?", null, "Transform", "Cancel")) != "Transform") {
				return f.dot;
			}
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			yield* this.holder.Topic(href, rt.alist(f, ["makealien", rt.at(href_list, "makealien")]));
		} else if (rt.at(href_list, "makeslime")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makeslime"), rt.world())), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/human");
				return f.dot;
			}
			if ((yield* alert("Confirm mob type change?", null, "Transform", "Cancel")) != "Transform") {
				return f.dot;
			}
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			yield* this.holder.Topic(href, rt.alist(f, ["makeslime", rt.at(href_list, "makeslime")]));
		} else if (rt.at(href_list, "makeai")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "makeai"), rt.world())), T("/mob/living/carbon"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon");
				return f.dot;
			}
			if ((yield* alert("Confirm mob type change?", null, "Transform", "Cancel")) != "Transform") {
				return f.dot;
			}
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			yield* this.holder.Topic(href, rt.alist(f, ["makeai", rt.at(href_list, "makeai")]));
		} else if (rt.at(href_list, "setspecies")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "setspecies"), rt.world())), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/human");
				return f.dot;
			}
			result = (yield* g.op(f, "Prompt", [1], [null, "Species", "Please choose a new species", f.usr, GLOB.species_list]));
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			if (result) {
				newtype = rt.index(GLOB.species_list, result);
				admin_ticket_log(`${key_name_admin(f.usr)} has modified the bodyparts of ${H} to ${result}`);
				yield* H.set_species(newtype);
			}
		} else if (rt.at(href_list, "editbodypart")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((C = rt.locateIn(f, rt.at(href_list, "editbodypart"), rt.world())), T("/mob/living/carbon"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon");
				return f.dot;
			}
			if (!(edit_action = (yield* g.op(f, "Prompt", [1], [null, "Modify Body Part", "What would you like to do?", f.usr, list("add", "remove", "augment")])))) {
				return f.dot;
			}
			limb_list = list("head", "l_arm", "r_arm", "l_leg", "r_leg");
			if (edit_action == "augment") {
				limb_list += "chest";
			}
			result_3 = (yield* g.op(f, "Prompt", [1], [null, `${capitalize(edit_action)} Body Part`, `Please choose which body part to ${edit_action}`, f.usr, limb_list]));
			if (!C) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			if (result_3) {
				BP = C.get_bodypart(result_3);
				if (edit_action === "remove") {
					if (BP) {
						yield* BP.drop_limb();
					} else {
						to_chat(f.usr, `${C} doesn't have such bodypart.`);
					}
				} else if (edit_action === "add") {
					if (BP) {
						to_chat(f.usr, `${C} already has such bodypart.`);
					} else if (!(yield* C.regenerate_limb(result_3))) {
						to_chat(f.usr, `${C} cannot have such bodypart.`);
					}
				} else if (edit_action === "augment") {
					if (rt.istype(C, T("/mob/living/carbon/human"))) {
						if (BP) {
							yield* BP.change_bodypart_status(BODYPART_ROBOTIC, 1, 1);
						} else {
							to_chat(f.usr, `${C} doesn't have such bodypart.`);
						}
					} else {
						to_chat(f.usr, "Only humans can be augmented.");
					}
				}
			}
			admin_ticket_log(`${key_name_admin(f.usr)} has modified the bodyparts of ${C}`);
		} else if (rt.at(href_list, "purrbation")) {
			if (!check_rights(4096)) {
				return f.dot;
			}
			if (!rt.istype((H = rt.locateIn(f, rt.at(href_list, "purrbation"), rt.world())), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "This can only be done to instances of type /mob/living/carbon/human");
				return f.dot;
			}
			if (!is_species(H, T("/datum/species/human"))) {
				to_chat(f.usr, "This can only be done to the basic human species at the moment.");
				return f.dot;
			}
			if (!H) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			if (success = (yield* purrbation_toggle(H))) {
				to_chat(f.usr, `Put ${H} on purrbation.`);
				log_admin(`${key_name(f.usr)} has put ${key_name(H)} on purrbation.`);
				message_admins((msg = `<span class='notice'>${key_name_admin(f.usr)} has put ${key_name(H)} on purrbation.</span>`));
				admin_ticket_log(H, msg);
			} else {
				to_chat(f.usr, `Removed ${H} from purrbation.`);
				log_admin(`${key_name(f.usr)} has removed ${key_name(H)} from purrbation.`);
				message_admins((msg = `<span class='notice'>${key_name_admin(f.usr)} has removed ${key_name(H)} from purrbation.</span>`));
				admin_ticket_log(H, msg);
			}
		} else {
			if (!(rt.at(href_list, "adjustDamage") && rt.at(href_list, "mobToDamage"))) return f.dot;
			if (!check_rights(0)) {
				return f.dot;
			}
			if (!rt.istype((L_0 = rt.locateIn(f, rt.at(href_list, "mobToDamage"), rt.world())), T("/mob/living"))) {
				return f.dot;
			}
			Text = rt.at(href_list, "adjustDamage");
			amount_2 = (yield* g.op(f, "Prompt", [32], [null, 0, `Adjust ${Text}loss`, "Deal how much damage to mob? (Negative values here heal)", null]));
			if (!L_0) {
				to_chat(f.usr, "Mob doesn't exist anymore");
				return f.dot;
			}
			if (Text === "brute") {
				yield* L_0.adjustBruteLoss(amount_2);
			} else if (Text === "fire") {
				yield* L_0.adjustFireLoss(amount_2);
			} else if (Text === "toxin") {
				yield* L_0.adjustToxLoss(amount_2);
			} else if (Text === "oxygen") {
				yield* L_0.adjustOxyLoss(amount_2);
			} else if (Text === "brain") {
				yield* L_0.adjustBrainLoss(amount_2);
			} else if (Text === "clone") {
				yield* L_0.adjustCloneLoss(amount_2);
			} else if (Text === "stamina") {
				yield* L_0.adjustStaminaLoss(amount_2);
			} else {
				to_chat(f.usr, `You caused an error. DEBUG: Text:${Text} Mob:${L_0}`);
				return f.dot;
			}
			if (amount_2 == 0) return f.dot;
			log_admin(`${key_name(f.usr)} dealt ${amount_2} amount of ${Text} damage to ${L_0} `);
			message_admins((msg_3 = `<span class='notice'>${key_name(f.usr)} dealt ${amount_2} amount of ${Text} damage to ${L_0} </span>`));
			admin_ticket_log(L_0, msg_3);
			rt.setAt(href_list, "datumrefresh", rt.at(href_list, "mobToDamage"));
		}
	}
	return f.dot;
}, true);
