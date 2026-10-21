// From code/datums/datumvars.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/proc/vv_edit_var  (code/datums/datumvars.dm:9)
rt.def("/datum/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(var_name);
	if ($0 === "vars") {
		return 0;
	} else if ($0 === "var_edited") {
		return 0;
	}
	rt.setSv(f, "var_edited", 1);
	rt.setAt(rt.sv(f, "vars"), live(var_name), live(var_value));
	return f.dot;
});

// /datum/proc/vv_get_var  (code/datums/datumvars.dm:18)
rt.def("/datum/proc/vv_get_var", function vv_get_var(f: Frame, var_name: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(var_name);
	if ($0 === "vars") {
		return rt.call(f, P("/proc/debug_variable"), null, [live(var_name), rt.list(), 0, live(f.src)]);
	}
	return rt.call(f, P("/proc/debug_variable"), null, [live(var_name), rt.index(rt.sv(f, "vars"), live(var_name)), 0, live(f.src)]);
});

// /datum/proc/vv_get_dropdown  (code/datums/datumvars.dm:26)
rt.def("/datum/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.list();
	rt.setAt((f.dot = rt.modify(live(f.dot), "---", add)), "Call Proc", fmt("?_src_=vars;proc_call=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Mark Object", fmt("?_src_=vars;mark_object=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Delete", fmt("?_src_=vars;delete=＃", [live(f.src)]));
	return f.dot;
});

// /client/proc/debug_variables  (code/datums/datumvars.dm:43)  may sleep
rt.def("/client/proc/debug_variables", function* debug_variables(f: Frame, D: Value) {
	let islist: Value = null, title: Value = null, refid: Value = null, sprite: Value = null, hash: Value = null, type: Value = null, AT: Value = null, sprite_text: Value = null, atomsnowflake: Value = null, A: Value = null, M: Value = null, formatted_type: Value = null, middle_point: Value = null, splitpoint: Value = null, marked: Value = null, varedited_line: Value = null, dropdownoptions: Value = null, dropdownoptions_html: Value = null, name: Value = null, link: Value = null, names: Value = null, V: Value = null, variable_html: Value = null, L: Value = null, i: Value = null, key: Value = null, value: Value = null, V_15: Value = null, html: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [D, islist, title, refid, sprite, hash, type, AT, sprite_text, atomsnowflake, A, M, formatted_type, middle_point, splitpoint, marked, varedited_line, dropdownoptions, dropdownoptions_html, name, link, names, V, variable_html, L, i, key, value, V_15, html, $0, $1, $2, $3, $e];
	if ((!truthy(rt.fv(f, "client", live(f.usr))) || !truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>You need to be an administrator to access this.</span>"]);
		return live(f.dot);
	}
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	if ((!truthy((islist = (rt.istype(live(D), T("/list")) ? 1 : 0))) && !truthy((rt.istype(live(D), T("/datum")) ? 1 : 0)))) {
		return live(f.dot);
	}
	title = "";
	refid = fmt("＃", [live(D)]);
	sprite = null;
	hash = null;
	type = T("/list");
	if (!truthy(live(islist))) {
		type = rt.fv(f, "type", live(D));
	}
	if (truthy((rt.istype(live(D), T("/atom")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "icon", (AT = live(D)))) && truthy(rt.fv(f, "icon_state", live(AT))))) {
			sprite = (yield* g.new_(f, T("/icon"), [rt.fv(f, "icon", live(AT)), rt.fv(f, "icon_state", live(AT))]));
			hash = (yield* g.call(f, P("/proc/md5"), null, [add((hash = (yield* g.call(f, P("/proc/md5"), null, [rt.fv(f, "icon", live(AT))]))), rt.fv(f, "icon_state", live(AT)))]));
			rt.op(f, "BrowseResource", [], [live(f.usr), live(sprite), fmt("vv＀.png", [live(hash)])], false);
		}
	}
	title = fmt("＀ (＃) = ＀", [live(D), live(D), live(type)]);
	sprite_text = null;
	if (truthy(live(sprite))) {
		sprite_text = fmt("<img src='vv＀.png'></td><td>", [live(hash)]);
	}
	atomsnowflake = rt.list();
	if (truthy((rt.istype(live(D), T("/atom")) ? 1 : 0))) {
		if (truthy((rt.istype((A = live(D)), T("/mob/living")) ? 1 : 0))) {
			atomsnowflake = rt.modify(live(atomsnowflake), fmt("<a href='?_src_=vars;rename=＀'><b>＀</b></a>", [live(refid), live(D)]), add);
			if (truthy(rt.fv(f, "dir", live(A)))) {
				atomsnowflake = rt.modify(live(atomsnowflake), fmt("<br><font size='1'><a href='?_src_=vars;rotatedatum=＀;rotatedir=left'><<</a> <a href='?_src_=vars;datumedit=＀;varnameedit=dir'>＀</a> <a href='?_src_=vars;rotatedatum=＀;rotatedir=right'>>></a></font>", [live(refid), live(refid), (yield* g.call(f, P("/proc/dir2text"), null, [rt.fv(f, "dir", live(A))])), live(refid)]), add);
			}
			M = live(A);
			$0 = live(refid);
			if (truthy(rt.fv(f, "ckey", live(M)))) {
				$1 = rt.fv(f, "ckey", live(M));
			} else {
				$1 = "No ckey";
			}
			$2 = live(refid);
			if (truthy(rt.fv(f, "real_name", live(M)))) {
				$3 = rt.fv(f, "real_name", live(M));
			} else {
				$3 = "No real name";
			}
			atomsnowflake = rt.modify(live(atomsnowflake), fmt("\n\t\t\t\t<br><font size='1'><a href='?_src_=vars;datumedit=＀;varnameedit=ckey'>＀</a> / <a href='?_src_=vars;datumedit=＀;varnameedit=real_name'>＀</a></font>\n\t\t\t\t<br><font size='1'>\n\t\t\t\t\tBRUTE:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=brute'>＀</a>\n\t\t\t\t\tFIRE:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=fire'>＀</a>\n\t\t\t\t\tTOXIN:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=toxin'>＀</a>\n\t\t\t\t\tOXY:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=oxygen'>＀</a>\n\t\t\t\t\tCLONE:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=clone'>＀</a>\n\t\t\t\t\tBRAIN:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=brain'>＀</a>\n\t\t\t\t\tSTAMINA:<font size='1'><a href='?_src_=vars;mobToDamage=＀;adjustDamage=stamina'>＀</a>\n\t\t\t\t</font>\n\t\t\t", [$0, $1, $2, $3, live(refid), (yield* g.callName(f, live(M), "getBruteLoss", [])), live(refid), (yield* g.callName(f, live(M), "getFireLoss", [])), live(refid), (yield* g.callName(f, live(M), "getToxLoss", [])), live(refid), (yield* g.callName(f, live(M), "getOxyLoss", [])), live(refid), (yield* g.callName(f, live(M), "getCloneLoss", [])), live(refid), (yield* g.callName(f, live(M), "getBrainLoss", [])), live(refid), (yield* g.callName(f, live(M), "getStaminaLoss", []))]), add);
		} else {
			atomsnowflake = rt.modify(live(atomsnowflake), fmt("<a href='?_src_=vars;datumedit=＀;varnameedit=name'><b>＀</b></a>", [live(refid), live(D)]), add);
			if (truthy(rt.fv(f, "dir", live(A)))) {
				atomsnowflake = rt.modify(live(atomsnowflake), fmt("<br><font size='1'><a href='?_src_=vars;rotatedatum=＀;rotatedir=left'><<</a> <a href='?_src_=vars;datumedit=＀;varnameedit=dir'>＀</a> <a href='?_src_=vars;rotatedatum=＀;rotatedir=right'>>></a></font>", [live(refid), live(refid), (yield* g.call(f, P("/proc/dir2text"), null, [rt.fv(f, "dir", live(A))])), live(refid)]), add);
			}
		}
	} else {
		atomsnowflake = rt.modify(live(atomsnowflake), fmt("<b>＀</b>", [live(D)]), add);
	}
	if (rt.gt(rt.length((formatted_type = fmt("＀", [live(type)]))), 25)) {
		middle_point = divide(rt.length(live(formatted_type)), 2);
		if (truthy((splitpoint = (yield* g.call(f, P("/proc/findtext"), null, [live(formatted_type), "/", live(middle_point)]))))) {
			formatted_type = fmt("＀<br>＀", [(yield* g.call(f, P("/proc/copytext"), null, [live(formatted_type), 1, live(splitpoint)])), (yield* g.call(f, P("/proc/copytext"), null, [live(formatted_type), live(splitpoint)]))]);
		} else {
			formatted_type = "Type too long";
		}
	}
	marked = null;
	if ((truthy(rt.fv(f, "marked_datum", rt.sv(f, "holder"))) && isEqual(rt.fv(f, "marked_datum", rt.sv(f, "holder")), live(D)))) {
		marked = "<br><font size='1' color='red'><b>Marked Object</b></font>";
	}
	varedited_line = "";
	if ((!truthy(live(islist)) && truthy(rt.fv(f, "var_edited", live(D))))) {
		varedited_line = "<br><font size='1' color='red'><b>Var Edited</b></font>";
	}
	dropdownoptions = rt.list();
	if (truthy(live(islist))) {
		dropdownoptions = rt.alist(f, [null, "---", "Add Item", fmt("?_src_=vars;listadd=＀", [live(refid)]), "Remove Nulls", fmt("?_src_=vars;listnulls=＀", [live(refid)]), "Remove Dupes", fmt("?_src_=vars;listdupes=＀", [live(refid)]), "Set len", fmt("?_src_=vars;listlen=＀", [live(refid)]), "Shuffle", fmt("?_src_=vars;listshuffle=＀", [live(refid)])]);
	} else {
		dropdownoptions = (yield* g.callName(f, live(D), "vv_get_dropdown", []));
	}
	dropdownoptions_html = rt.list();
	name = null;
	rt.forList(f, 0, live(dropdownoptions));
	while (($e = rt.next(f, 0)) !== undefined) {
		name = $e;
		if (truthy((link = rt.index(live(dropdownoptions), live(name))))) {
			dropdownoptions_html = rt.modify(live(dropdownoptions_html), fmt("<option value='＀'>＀</option>", [live(link), live(name)]), add);
		} else {
			dropdownoptions_html = rt.modify(live(dropdownoptions_html), fmt("<option value>＀</option>", [live(name)]), add);
		}
	}
	rt.endFor(f, 0);
	names = rt.list();
	if (!truthy(live(islist))) {
		V = null;
		rt.forList(f, 0, rt.fv(f, "vars", live(D)));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			names = rt.modify(live(names), live(V), add);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	variable_html = rt.list();
	if (truthy(live(islist))) {
		L = live(D);
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, live(L)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			key = rt.index(live(L), live(i));
			value = null;
			if (rt.le((yield* g.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])])), 10)) {
				$0 = "TYPEID_NULL";
			} else {
				$0 = (yield* g.call(f, P("/proc/copytext"), null, [fmt("＃", [live(L)]), 4, subtract((yield* g.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])])), 6)]));
			}
			if ((isEqual($0, "f") && !truthy((yield* g.call(f, P("/proc/isnum"), null, [live(key)]))))) {
				value = rt.index(live(L), live(key));
			}
			variable_html = rt.modify(live(variable_html), (yield* g.call(f, P("/proc/debug_variable"), null, [live(i), live(value), 0, live(D)])), add);
		}
		rt.endFor(f, 0);
	} else {
		names = (yield* g.call(f, P("/proc/sortList"), null, [live(names)]));
		V_15 = null;
		rt.forList(f, 0, live(names));
		while (($e = rt.next(f, 0)) !== undefined) {
			V_15 = $e;
			if (truthy((yield* g.callName(f, live(D), "can_vv_get", [live(V_15)])))) {
				variable_html = rt.modify(live(variable_html), (yield* g.callName(f, live(D), "vv_get_var", [live(V_15)])), add);
			}
		}
		rt.endFor(f, 0);
	}
	html = fmt("\n<html>\n\t<head>\n\t\t<title>＀</title>\n\t\t<style>\n\t\t\tbody {\n\t\t\t\tfont-family: Verdana, sans-serif;\n\t\t\t\tfont-size: 9pt;\n\t\t\t}\n\t\t\t.value {\n\t\t\t\tfont-family: \"Courier New\", monospace;\n\t\t\t\tfont-size: 8pt;\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body onload='selectTextField(); updateSearch()' onkeydown='return checkreload()' onkeyup='updateSearch()'>\n\t\t<script type=\"text/javascript\">\n\t\t\tfunction checkreload() {\n\t\t\t\tif(event.keyCode == 116){\t//F5 (to refresh properly)\n\t\t\t\t\tdocument.getElementById(\"refresh_link\").click();\n\t\t\t\t\tevent.preventDefault ? event.preventDefault() : (event.returnValue = false)\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t\treturn true;\n\t\t\t}\n\t\t\tfunction updateSearch(){\n\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\tvar filter = filter_text.value.toLowerCase();\n\t\t\t\tif(event.keyCode == 13){\t//Enter / return\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.style.backgroundColor == \"#ffee88\" )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\talist = lis[i].getElementsByTagName(\"a\")\n\t\t\t\t\t\t\t\tif(alist.length > 0){\n\t\t\t\t\t\t\t\t\tlocation.href=alist[0].href;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {   }\n\t\t\t\t\t}\n\t\t\t\t\treturn\n\t\t\t\t}\n\t\t\t\tif(event.keyCode == 38){\t//Up arrow\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.style.backgroundColor == \"#ffee88\" )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tif( (i-1) >= 0){\n\t\t\t\t\t\t\t\t\tvar li_new = lis[i-1];\n\t\t\t\t\t\t\t\t\tli.style.backgroundColor = \"white\";\n\t\t\t\t\t\t\t\t\tli_new.style.backgroundColor = \"#ffee88\";\n\t\t\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {  }\n\t\t\t\t\t}\n\t\t\t\t\treturn\n\t\t\t\t}\n\t\t\t\tif(event.keyCode == 40){\t//Down arrow\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.style.backgroundColor == \"#ffee88\" )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tif( (i+1) < lis.length){\n\t\t\t\t\t\t\t\t\tvar li_new = lis[i+1];\n\t\t\t\t\t\t\t\t\tli.style.backgroundColor = \"white\";\n\t\t\t\t\t\t\t\t\tli_new.style.backgroundColor = \"#ffee88\";\n\t\t\t\t\t\t\t\t\treturn\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {  }\n\t\t\t\t\t}\n\t\t\t\t\treturn\n\t\t\t\t}\n\n\t\t\t\t//This part here resets everything to how it was at the start so the filter is applied to the complete list. Screw efficiency, it's client-side anyway and it only looks through 200 or so variables at maximum anyway (mobs).\n\t\t\t\tif(complete_list != null && complete_list != \"\"){\n\t\t\t\t\tvar vars_ol1 = document.getElementById(\"vars\");\n\t\t\t\t\tvars_ol1.innerHTML = complete_list\n\t\t\t\t}\n\t\t\t\tdocument.cookie=\"＀＀search=\"+encodeURIComponent(filter);\n\t\t\t\tif(filter == \"\"){\n\t\t\t\t\treturn;\n\t\t\t\t}else{\n\t\t\t\t\tvar vars_ol = document.getElementById('vars');\n\t\t\t\t\tvar lis = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\t\tfor ( var i = 0; i < lis.length; ++i )\n\t\t\t\t\t{\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\tvar li = lis[i];\n\t\t\t\t\t\t\tif ( li.innerText.toLowerCase().indexOf(filter) == -1 )\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tvars_ol.removeChild(li);\n\t\t\t\t\t\t\t\ti--;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}catch(err) {   }\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tvar lis_new = vars_ol.getElementsByTagName(\"li\");\n\t\t\t\tfor ( var j = 0; j < lis_new.length; ++j )\n\t\t\t\t{\n\t\t\t\t\tvar li1 = lis[j];\n\t\t\t\t\tif (j == 0){\n\t\t\t\t\t\tli1.style.backgroundColor = \"#ffee88\";\n\t\t\t\t\t}else{\n\t\t\t\t\t\tli1.style.backgroundColor = \"white\";\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tfunction selectTextField() {\n\t\t\t\tvar filter_text = document.getElementById('filter');\n\t\t\t\tfilter_text.focus();\n\t\t\t\tfilter_text.select();\n\t\t\t\tvar lastsearch = getCookie(\"＀＀search\");\n\t\t\t\tif (lastsearch) {\n\t\t\t\t\tfilter_text.value = lastsearch;\n\t\t\t\t\tupdateSearch();\n\t\t\t\t}\n\t\t\t}\n\t\t\tfunction loadPage(list) {\n\t\t\t\tif(list.options[list.selectedIndex].value == \"\"){\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tlocation.href=list.options[list.selectedIndex].value;\n\t\t\t}\n\t\t\tfunction getCookie(cname) {\n\t\t\t\tvar name = cname + \"=\";\n\t\t\t\tvar ca = document.cookie.split(';');\n\t\t\t\tfor(var i=0; i<ca.length; i++) {\n\t\t\t\t\tvar c = ca[i];\n\t\t\t\t\twhile (c.charAt(0)==' ') c = c.substring(1,c.length);\n\t\t\t\t\tif (c.indexOf(name)==0) return c.substring(name.length,c.length);\n\t\t\t\t}\n\t\t\t\treturn \"\";\n\t\t\t}\n\n\t\t</script>\n\t\t<div align='center'>\n\t\t\t<table width='100%'>\n\t\t\t\t<tr>\n\t\t\t\t\t<td width='50%'>\n\t\t\t\t\t\t<table align='center' width='100%'>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t\t<b><font size='1'>＀</font></b>\n\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td width='50%'>\n\t\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t\t<a id='refresh_link' href='?_src_=vars;datumrefresh=＀'>Refresh</a>\n\t\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t\t<select name=\"file\" size=\"1\"\n\t\t\t\t\t\t\t\t\tonchange=\"loadPage(this.form.elements[0])\"\n\t\t\t\t\t\t\t\t\ttarget=\"_parent._top\"\n\t\t\t\t\t\t\t\t\tonmouseclick=\"this.focus()\"\n\t\t\t\t\t\t\t\t\tstyle=\"background-color:#ffffff\">\n\t\t\t\t\t\t\t\t\t<option value selected>Select option</option>\n\t\t\t\t\t\t\t\t\t＀\n\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</div>\n\t\t<hr>\n\t\t<font size='1'>\n\t\t\t<b>E</b> - Edit, tries to determine the variable type by itself.<br>\n\t\t\t<b>C</b> - Change, asks you for the var type first.<br>\n\t\t\t<b>M</b> - Mass modify: changes this variable for all objects of this type.<br>\n\t\t</font>\n\t\t<hr>\n\t\t<table width='100%'>\n\t\t\t<tr>\n\t\t\t\t<td width='20%'>\n\t\t\t\t\t<div align='center'>\n\t\t\t\t\t\t<b>Search:</b>\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t\t<td width='80%'>\n\t\t\t\t\t<input type='text' id='filter' name='filter_text' value='' style='width:100%;'>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\t\t<hr>\n\t\t<ol id='vars'>\n\t\t\t＀\n\t\t</ol>\n\t\t<script type='text/javascript'>\n\t\t\tvar vars_ol = document.getElementById(\"vars\");\n\t\t\tvar complete_list = vars_ol.innerHTML;\n\t\t</script>\n\t</body>\n</html>\n", [live(title), live(refid), rt.gl("cookieoffset"), live(refid), rt.gl("cookieoffset"), live(sprite_text), (yield* g.callName(f, live(atomsnowflake), "Join", [])), live(formatted_type), live(marked), live(varedited_line), live(refid), (yield* g.callName(f, live(dropdownoptions_html), "Join", [])), (yield* g.callName(f, live(variable_html), "Join", []))]);
	rt.op(f, "Browse", [], [live(f.usr), live(html), fmt("window=variables＀;size=475x650", [live(refid)])], false);
	return f.dot;
}, true, { verb: { name: "View Variables", category: "Debug" }, argTypes: [{ path: "/datum", source: "world" }] });

// /proc/debug_variable  (code/datums/datumvars.dm:390)
rt.def("/proc/debug_variable", function debug_variable(f: Frame, name: Value, value: Value, level: Value, DA: Value, sanitize: Value) {
	let header: Value = null, index: Value = null, item: Value = null, D: Value = null, L: Value = null, items: Value = null, i: Value = null, key: Value = null, val: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [name, value, DA, sanitize, header, index, item, D, L, items, i, key, val, $0, $1, $e];
	if (live(DA) === null) {
		DA = null;
	}
	if (live(sanitize) === null) {
		sanitize = 1;
	}
	header = null;
	if (truthy(live(DA))) {
		if (truthy((rt.istype(live(DA), T("/list")) ? 1 : 0))) {
			index = live(name);
			if (truthy(live(value))) {
				name = rt.index(live(DA), live(name));
			} else {
				value = rt.index(live(DA), live(name));
			}
			header = fmt("<li style='backgroundColor:white'>(<a href='?_src_=vars;listedit=＃;index=＀'>E</a>) (<a href='?_src_=vars;listchange=＃;index=＀'>C</a>) (<a href='?_src_=vars;listremove=＃;index=＀'>-</a>) ", [live(DA), live(index), live(DA), live(index), live(DA), live(index)]);
		} else {
			header = fmt("<li style='backgroundColor:white'>(<a href='?_src_=vars;datumedit=＃;varnameedit=＀'>E</a>) (<a href='?_src_=vars;datumchange=＃;varnamechange=＀'>C</a>) (<a href='?_src_=vars;datummass=＃;varnamemass=＀'>M</a>) ", [live(DA), live(name), live(DA), live(name), live(DA), live(name)]);
		}
	} else {
		header = "<li>";
	}
	item = null;
	if (live(value) === null) {
		if (truthy(live(sanitize))) {
			$0 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
		} else {
			$0 = live(name);
		}
		item = fmt("＀ = <span class='value'>null</span>", [$0]);
	} else {
		if (truthy(rt.call(f, P("/proc/istext"), null, [live(value)]))) {
			if (truthy(live(sanitize))) {
				$0 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
			} else {
				$0 = live(name);
			}
			if (truthy(live(sanitize))) {
				$1 = rt.call(f, P("/proc/html_encode"), null, [live(value)]);
			} else {
				$1 = live(value);
			}
			item = fmt("＀ = <span class='value'>\"＀\"</span>", [$0, $1]);
		} else {
			if (truthy(rt.call(f, P("/proc/isicon"), null, [live(value)]))) {
				if (truthy(live(sanitize))) {
					$0 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
				} else {
					$0 = live(name);
				}
				item = fmt("＀ = /icon (<span class='value'>＀</span>)", [$0, live(value)]);
			} else {
				if (truthy(rt.call(f, P("/proc/isfile"), null, [live(value)]))) {
					if (truthy(live(sanitize))) {
						$0 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
					} else {
						$0 = live(name);
					}
					item = fmt("＀ = <span class='value'>'＀'</span>", [$0, live(value)]);
				} else {
					if (truthy((rt.istype(live(value), T("/datum")) ? 1 : 0))) {
						if (!isEqual(fmt("＀", [(D = live(value))]), fmt("＀", [rt.fv(f, "type", live(D))]))) {
							$0 = live(value);
							if (truthy(live(sanitize))) {
								$1 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
							} else {
								$1 = live(name);
							}
							item = fmt("<a href='?_src_=vars;Vars=＃'>＀ ＃</a> = ＀ ＀", [$0, $1, live(value), live(D), rt.fv(f, "type", live(D))]);
						} else {
							$0 = live(value);
							if (truthy(live(sanitize))) {
								$1 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
							} else {
								$1 = live(name);
							}
							item = fmt("<a href='?_src_=vars;Vars=＃'>＀ ＃</a> = ＀", [$0, $1, live(value), rt.fv(f, "type", live(D))]);
						}
					} else {
						if (truthy((rt.istype(live(value), T("/list")) ? 1 : 0))) {
							L = live(value);
							items = rt.list();
							$0 = (rt.gt(rt.len(f, live(L)), 0) ? 1 : 0);
							if (truthy($0)) {
								$0 = ((isEqual(live(name), "underlays") ? 1 : 0) || (isEqual(live(name), "overlays") ? 1 : 0));
								if (!truthy($0)) {
									$0 = rt.len(f, live(L));
									if (rt.le(rt.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])]), 10)) {
										$1 = "TYPEID_NULL";
									} else {
										$1 = rt.call(f, P("/proc/copytext"), null, [fmt("＃", [live(L)]), 4, subtract(rt.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])]), 6)]);
									}
									if (isEqual($1, "f")) {
										$1 = 50;
									} else {
										$1 = 150;
									}
									$0 = (rt.gt($0, $1) ? 1 : 0);
								}
								$0 = (!truthy($0) ? 1 : 0);
							}
							if (truthy($0)) {
								i = null;
								rt.forRange(f, 0, 1, rt.len(f, live(L)), 1);
								while (($e = rt.next(f, 0)) !== undefined) {
									i = $e;
									key = rt.index(live(L), live(i));
									val = null;
									if (rt.le(rt.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])]), 10)) {
										$0 = "TYPEID_NULL";
									} else {
										$0 = rt.call(f, P("/proc/copytext"), null, [fmt("＃", [live(L)]), 4, subtract(rt.call(f, P("/proc/lentext"), null, [fmt("＃", [live(L)])]), 6)]);
									}
									if ((isEqual($0, "f") && !truthy(rt.call(f, P("/proc/isnum"), null, [live(key)])))) {
										val = rt.index(live(L), live(key));
									}
									if (!truthy(live(val))) {
										val = live(key);
										key = live(i);
									}
									items = rt.modify(live(items), rt.call(f, P("/proc/debug_variable"), null, [null, live(key), null, live(val), null, add(live(level), 1), "sanitize", live(sanitize)], rt.Args.Named), add);
								}
								rt.endFor(f, 0);
								$0 = live(value);
								if (truthy(live(sanitize))) {
									$1 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
								} else {
									$1 = live(name);
								}
								item = fmt("<a href='?_src_=vars;Vars=＃'>＀ = /list (＀)</a><ul>＀</ul>", [$0, $1, rt.len(f, live(L)), rt.callName(f, live(items), "Join", [])]);
							} else {
								$0 = live(value);
								if (truthy(live(sanitize))) {
									$1 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
								} else {
									$1 = live(name);
								}
								item = fmt("<a href='?_src_=vars;Vars=＃'>＀ = /list (＀)</a>", [$0, $1, rt.len(f, live(L))]);
							}
						} else {
							if (truthy(live(sanitize))) {
								$0 = rt.call(f, P("/proc/html_encode"), null, [live(name)]);
							} else {
								$0 = live(name);
							}
							if (truthy(live(sanitize))) {
								$1 = rt.call(f, P("/proc/html_encode"), null, [live(value)]);
							} else {
								$1 = live(value);
							}
							item = fmt("＀ = <span class='value'>＀</span>", [$0, $1]);
						}
					}
				}
			}
		}
	}
	return fmt("＀＀</li>", [live(header), live(item)]);
});

// /client/proc/view_var_Topic  (code/datums/datumvars.dm:473)  may sleep
rt.def("/client/proc/view_var_Topic", function* view_var_Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	let DAT: Value = null, M: Value = null, D: Value = null, _T: Value = null, new_name: Value = null, index: Value = null, L: Value = null, variable: Value = null, prompt: Value = null, L_0: Value = null, value: Value = null, O: Value = null, action_type: Value = null, O_type: Value = null, i: Value = null, Obj: Value = null, A: Value = null, amount: Value = null, chosen_id: Value = null, reagent_options: Value = null, valid_id: Value = null, ID: Value = null, amount_3: Value = null, C: Value = null, Mo: Value = null, H: Value = null, result: Value = null, newtype: Value = null, edit_action: Value = null, limb_list: Value = null, result_3: Value = null, BP: Value = null, success: Value = null, msg: Value = null, Text: Value = null, amount_2: Value = null, msg_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [href, href_list, hsrc, DAT, M, D, _T, new_name, index, L, variable, prompt, L_0, value, O, action_type, O_type, i, Obj, A, amount, chosen_id, reagent_options, valid_id, ID, amount_3, C, Mo, H, result, newtype, edit_action, limb_list, result_3, BP, success, msg, Text, amount_2, msg_3, $0, $e];
	if ((!isEqual(rt.fv(f, "client", live(f.usr)), live(f.src)) || !truthy(rt.fv(f, "holder", live(f.src))))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "Vars"))) {
		yield* g.srcCall(f, "debug_variables", rt.locateIn(f, rt.at(live(href_list), "Vars"), rt.world()));
	} else {
		if (truthy(rt.at(live(href_list), "datumrefresh"))) {
			if (!truthy((DAT = rt.locateIn(f, rt.at(live(href_list), "datumrefresh"), rt.world())))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.src), "debug_variables", [live(DAT)]);
		} else {
			if (truthy(rt.at(live(href_list), "mob_player_panel"))) {
				if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
					return live(f.dot);
				}
				if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "mob_player_panel"), rt.world())), T("/mob")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
					return live(f.dot);
				}
				yield* g.callName(f, rt.fv(f, "holder", live(f.src)), "show_player_panel", [live(M)]);
				rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "mob_player_panel"));
			} else {
				if (truthy(rt.at(live(href_list), "godmode"))) {
					if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
						return live(f.dot);
					}
					if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "godmode"), rt.world())), T("/mob")) ? 1 : 0))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
						return live(f.dot);
					}
					yield* g.callName(f, live(f.src), "cmd_admin_godmode", [live(M)]);
					rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "godmode"));
				} else {
					if (truthy(rt.at(live(href_list), "mark_object"))) {
						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
							return live(f.dot);
						}
						if (!truthy((rt.istype((D = rt.locateIn(f, rt.at(live(href_list), "mark_object"), rt.world())), T("/datum")) ? 1 : 0))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /datum"]);
							return live(f.dot);
						}
						rt.setFv(f, "marked_datum", rt.fv(f, "holder", live(f.src)), live(D));
						rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "mark_object"));
					} else {
						if (truthy(rt.at(live(href_list), "proc_call"))) {
							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
								return live(f.dot);
							}
							if (truthy((_T = rt.locateIn(f, rt.at(live(href_list), "proc_call"), rt.world())))) {
								yield* g.srcCall(f, "callproc_datum", live(_T));
							}
						} else {
							if (truthy(rt.at(live(href_list), "delete"))) {
								if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32, 0])))) {
									return live(f.dot);
								}
								if (!truthy((D = rt.locateIn(f, rt.at(live(href_list), "delete"), rt.world())))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Unable to locate item!"]);
								}
								yield* g.srcCall(f, "admin_delete", live(D));
								rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "delete"));
							} else {
								if (truthy(rt.at(live(href_list), "regenerateicons"))) {
									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
										return live(f.dot);
									}
									if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [(M = rt.locateIn(f, rt.at(live(href_list), "regenerateicons"), rt.world()))])))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob"]);
										return live(f.dot);
									}
									yield* g.callName(f, live(M), "regenerate_icons", []);
								} else {
									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1024])))) return f.dot;
									if (truthy(rt.at(live(href_list), "rename"))) {
										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
											return live(f.dot);
										}
										if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "rename"), rt.world())), T("/mob")) ? 1 : 0))) {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
											return live(f.dot);
										}
										if ((!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "What would you like to name this mob?", "Input a name", rt.fv(f, "real_name", live(M)), 42])))) || !truthy(live(M)))) {
											return live(f.dot);
										}
										yield* g.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ renamed ＀ to ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), live(new_name)])]);
										yield* g.callName(f, live(M), "fully_replace_character_name", [rt.fv(f, "real_name", live(M)), live(new_name)]);
										rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "rename"));
									} else {
										if ((truthy(rt.at(live(href_list), "varnameedit")) && truthy(rt.at(live(href_list), "datumedit")))) {
											if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
												return live(f.dot);
											}
											if (!truthy((rt.istype((D = rt.locateIn(f, rt.at(live(href_list), "datumedit"), rt.world())), T("/datum")) ? 1 : 0))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on datums"]);
												return live(f.dot);
											}
											yield* g.srcCall(f, "modify_variables", live(D), rt.at(live(href_list), "varnameedit"), 1);
										} else {
											if ((truthy(rt.at(live(href_list), "varnamechange")) && truthy(rt.at(live(href_list), "datumchange")))) {
												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
													return live(f.dot);
												}
												if (!truthy((rt.istype((D = rt.locateIn(f, rt.at(live(href_list), "datumchange"), rt.world())), T("/datum")) ? 1 : 0))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on datums"]);
													return live(f.dot);
												}
												yield* g.srcCall(f, "modify_variables", live(D), rt.at(live(href_list), "varnamechange"), 0);
											} else {
												if ((truthy(rt.at(live(href_list), "varnamemass")) && truthy(rt.at(live(href_list), "datummass")))) {
													if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
														return live(f.dot);
													}
													if (!truthy((rt.istype((D = rt.locateIn(f, rt.at(live(href_list), "datummass"), rt.world())), T("/datum")) ? 1 : 0))) {
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /datum"]);
														return live(f.dot);
													}
													yield* g.srcCall(f, "cmd_mass_modify_object_variables", live(D), rt.at(live(href_list), "varnamemass"));
												} else {
													if ((truthy(rt.at(live(href_list), "listedit")) && truthy(rt.at(live(href_list), "index")))) {
														if (!truthy((index = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "index")]))))) {
															return live(f.dot);
														}
														if (!truthy((rt.istype((L = rt.locateIn(f, rt.at(live(href_list), "listedit"), rt.world())), T("/list")) ? 1 : 0))) {
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
															return live(f.dot);
														}
														yield* g.callSrc(f, "mod_list", [null, live(L), null, null, null, "list", null, "contents", null, live(index), "autodetect_class", 1], rt.Args.Named);
													} else {
														if ((truthy(rt.at(live(href_list), "listchange")) && truthy(rt.at(live(href_list), "index")))) {
															if (!truthy((index = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "index")]))))) {
																return live(f.dot);
															}
															if (!truthy((rt.istype((L = rt.locateIn(f, rt.at(live(href_list), "listchange"), rt.world())), T("/list")) ? 1 : 0))) {
																yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																return live(f.dot);
															}
															yield* g.callSrc(f, "mod_list", [null, live(L), null, null, null, "list", null, "contents", null, live(index), "autodetect_class", 0], rt.Args.Named);
														} else {
															if ((truthy(rt.at(live(href_list), "listremove")) && truthy(rt.at(live(href_list), "index")))) {
																if (!truthy((index = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "index")]))))) {
																	return live(f.dot);
																}
																if (!truthy((rt.istype((L = rt.locateIn(f, rt.at(live(href_list), "listremove"), rt.world())), T("/list")) ? 1 : 0))) {
																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																	return live(f.dot);
																}
																variable = rt.index(live(L), live(index));
																if (!isEqual((prompt = (yield* g.call(f, P("/proc/alert"), null, [fmt("Do you want to remove item number ＀ from list?", [live(index)]), "Confirm", "Yes", "No"]))), "Yes")) {
																	return live(f.dot);
																}
																yield* g.callName(f, live(L), "Cut", [live(index), add(live(index), 1)]);
																yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: /list's contents: REMOVED=＀", [live(f.src), (yield* g.call(f, P("/proc/html_encode"), null, [fmt("＀", [live(variable)])]))])]);
																yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified list's contents: REMOVED=＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(variable)])]);
																yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified list's contents: REMOVED=＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(variable)])]);
															} else {
																if (truthy(rt.at(live(href_list), "listadd"))) {
																	if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(href_list), "listadd"), rt.world())), T("/list")) ? 1 : 0))) {
																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																		return live(f.dot);
																	}
																	yield* g.srcCall(f, "mod_list_add", live(L_0), null, "list", "contents");
																} else {
																	if (truthy(rt.at(live(href_list), "listdupes"))) {
																		if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(href_list), "listdupes"), rt.world())), T("/list")) ? 1 : 0))) {
																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																			return live(f.dot);
																		}
																		yield* g.call(f, P("/proc/uniqueList_inplace"), null, [live(L_0)]);
																		yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: /list contents: CLEAR DUPES", [live(f.src)])]);
																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified list's contents: CLEAR DUPES", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified list's contents: CLEAR DUPES", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
																	} else {
																		if (truthy(rt.at(live(href_list), "listnulls"))) {
																			if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(href_list), "listnulls"), rt.world())), T("/list")) ? 1 : 0))) {
																				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																				return live(f.dot);
																			}
																			yield* g.call(f, P("/proc/listclearnulls"), null, [live(L_0)]);
																			yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: /list contents: CLEAR NULLS", [live(f.src)])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified list's contents: CLEAR NULLS", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified list's contents: CLEAR NULLS", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
																		} else {
																			if (truthy(rt.at(live(href_list), "listlen"))) {
																				if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(href_list), "listlen"), rt.world())), T("/list")) ? 1 : 0))) {
																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																					return live(f.dot);
																				}
																				if (!isEqual(rt.index((value = (yield* g.srcCall(f, "vv_get_value", "Number"))), "class"), "Number")) {
																					return live(f.dot);
																				}
																				rt.setFv(f, "len", live(L_0), rt.at(live(value), "value"));
																				yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: /list len: ＀", [live(f.src), rt.len(f, live(L_0))])]);
																				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified list's len: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.len(f, live(L_0))])]);
																				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified list's len: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), rt.len(f, live(L_0))])]);
																			} else {
																				if (truthy(rt.at(live(href_list), "listshuffle"))) {
																					if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(href_list), "listshuffle"), rt.world())), T("/list")) ? 1 : 0))) {
																						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /list"]);
																						return live(f.dot);
																					}
																					yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(L_0)]);
																					yield* g.call(f, P("/proc/log_world"), null, [fmt("### ListVarEdit by ＀: /list contents: SHUFFLE", [live(f.src)])]);
																					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ modified list's contents: SHUFFLE", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
																					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ modified list's contents: SHUFFLE", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
																				} else {
																					if (truthy(rt.at(live(href_list), "give_spell"))) {
																						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																							return live(f.dot);
																						}
																						if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "give_spell"), rt.world())), T("/mob")) ? 1 : 0))) {
																							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																							return live(f.dot);
																						}
																						yield* g.callName(f, live(f.src), "give_spell", [live(M)]);
																						rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "give_spell"));
																					} else {
																						if (truthy(rt.at(live(href_list), "remove_spell"))) {
																							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																								return live(f.dot);
																							}
																							if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "remove_spell"), rt.world())), T("/mob")) ? 1 : 0))) {
																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																								return live(f.dot);
																							}
																							yield* g.srcCall(f, "remove_spell", live(M));
																							rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "remove_spell"));
																						} else {
																							if (truthy(rt.at(live(href_list), "give_disease"))) {
																								if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																									return live(f.dot);
																								}
																								if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "give_disease"), rt.world())), T("/mob")) ? 1 : 0))) {
																									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																									return live(f.dot);
																								}
																								yield* g.callName(f, live(f.src), "give_disease", [live(M)]);
																								rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "give_spell"));
																							} else {
																								if (truthy(rt.at(live(href_list), "gib"))) {
																									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																										return live(f.dot);
																									}
																									if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "gib"), rt.world())), T("/mob")) ? 1 : 0))) {
																										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																										return live(f.dot);
																									}
																									yield* g.callName(f, live(f.src), "cmd_admin_gib", [live(M)]);
																								} else {
																									if (truthy(rt.at(live(href_list), "build_mode"))) {
																										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [1])))) {
																											return live(f.dot);
																										}
																										if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "build_mode"), rt.world())), T("/mob")) ? 1 : 0))) {
																											yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																											return live(f.dot);
																										}
																										yield* g.call(f, P("/proc/togglebuildmode"), null, [live(M)]);
																										rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "build_mode"));
																									} else {
																										if (truthy(rt.at(live(href_list), "drop_everything"))) {
																											if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																												return live(f.dot);
																											}
																											if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "drop_everything"), rt.world())), T("/mob")) ? 1 : 0))) {
																												yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																												return live(f.dot);
																											}
																											if (truthy(rt.fv(f, "client", live(f.usr)))) {
																												yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_admin_drop_everything", [live(M)]);
																											}
																										} else {
																											if (truthy(rt.at(live(href_list), "direct_control"))) {
																												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																													return live(f.dot);
																												}
																												if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "direct_control"), rt.world())), T("/mob")) ? 1 : 0))) {
																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																													return live(f.dot);
																												}
																												if (truthy(rt.fv(f, "client", live(f.usr)))) {
																													yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_assume_direct_control", [live(M)]);
																												}
																											} else {
																												if (truthy(rt.at(live(href_list), "offer_control"))) {
																													if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																														return live(f.dot);
																													}
																													if (!truthy((rt.istype((M = rt.locateIn(f, rt.at(live(href_list), "offer_control"), rt.world())), T("/mob")) ? 1 : 0))) {
																														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /mob"]);
																														return live(f.dot);
																													}
																													yield* g.call(f, P("/proc/offer_control"), null, [live(M)]);
																												} else {
																													if (truthy(rt.at(live(href_list), "delall"))) {
																														if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [48])))) {
																															return live(f.dot);
																														}
																														if (!truthy((rt.istype((O = rt.locateIn(f, rt.at(live(href_list), "delall"), rt.world())), T("/obj")) ? 1 : 0))) {
																															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be used on instances of type /obj"]);
																															return live(f.dot);
																														}
																														if ((isEqual((action_type = (yield* g.call(f, P("/proc/alert"), null, [fmt("Strict type (＀) or type and all subtypes?", [rt.fv(f, "type", live(O))]), null, "Strict type", "Type and subtypes", "Cancel"]))), "Cancel") || !truthy(live(action_type)))) {
																															return live(f.dot);
																														}
																														if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("Are you really sure you want to delete all objects of type ＀?", [rt.fv(f, "type", live(O))]), null, "Yes", "No"])), "Yes")) {
																															return live(f.dot);
																														}
																														if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Second confirmation required. Delete?", null, "Yes", "No"])), "Yes")) {
																															return live(f.dot);
																														}
																														O_type = rt.fv(f, "type", live(O));
																														$0 = live(action_type);
																														if ($0 === "Strict type") {
																															i = 0;
																															Obj = null;
																															rt.forList(f, 0, rt.world(), T("/obj"));
																															while (($e = rt.next(f, 0)) !== undefined) {
																																Obj = $e;
																																if (isEqual(rt.fv(f, "type", live(Obj)), live(O_type))) {
																																	i = rt.inc(live(i), 1);
																																	yield* g.call(f, P("/proc/qdel"), null, [live(Obj)]);
																																}
																																if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
																																	yield* g.call(f, P("/proc/stoplag"), null, []);
																																}
																															}
																															rt.endFor(f, 0);
																															if (!truthy(live(i))) {
																																yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "No objects of this type exist"]);
																																return live(f.dot);
																															}
																															yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ deleted all objects of type ＀ (＀ objects deleted) ", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(O_type), live(i)])]);
																															yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ deleted all objects of type ＀ (＀ objects deleted) </span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(O_type), live(i)])]);
																														} else if ($0 === "Type and subtypes") {
																															i = 0;
																															Obj = null;
																															rt.forList(f, 0, rt.world(), T("/obj"));
																															while (($e = rt.next(f, 0)) !== undefined) {
																																Obj = $e;
																																if (truthy(rt.op(f, "IsType", [], [live(Obj), live(O_type)]))) {
																																	i = rt.inc(live(i), 1);
																																	yield* g.call(f, P("/proc/qdel"), null, [live(Obj)]);
																																}
																																if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
																																	yield* g.call(f, P("/proc/stoplag"), null, []);
																																}
																															}
																															rt.endFor(f, 0);
																															if (!truthy(live(i))) {
																																yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "No objects of this type exist"]);
																																return live(f.dot);
																															}
																															yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ deleted all objects of type or subtype of ＀ (＀ objects deleted) ", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(O_type), live(i)])]);
																															yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ deleted all objects of type or subtype of ＀ (＀ objects deleted) </span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(O_type), live(i)])]);
																														}
																													} else {
																														if (truthy(rt.at(live(href_list), "addreagent"))) {
																															if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																																return live(f.dot);
																															}
																															if (!truthy(rt.gv(f, "reagents", (A = rt.locateIn(f, rt.at(live(href_list), "addreagent"), rt.world()))))) {
																																if (truthy((amount = (yield* g.op(f, "Prompt", [32], [50, "Set Reagent Size", fmt("Specify the reagent size of ＀", [live(A)]), live(f.usr), null]))))) {
																																	yield* g.callName(f, live(A), "create_reagents", [live(amount)]);
																																}
																															}
																															if (truthy(rt.fv(f, "reagents", live(A)))) {
																																chosen_id = null;
																																reagent_options = (yield* g.call(f, P("/proc/sortList"), null, [rt.gl("chemical_reagents_list")]));
																																$0 = (yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Choose a method.", "Add Reagents", "Enter ID", "Choose ID"]));
																																if ($0 === "Enter ID") {
																																	valid_id = null;
																																	while (!truthy(live(valid_id))) {
																																		if (!truthy((chosen_id = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Enter the ID of the reagent you want to add."]))))) {
																																			break;
																																		}
																																		ID = null;
																																		rt.forList(f, 0, live(reagent_options));
																																		while (($e = rt.next(f, 0)) !== undefined) {
																																			ID = $e;
																																			if (isEqual(live(ID), live(chosen_id))) {
																																				valid_id = 1;
																																			}
																																		}
																																		rt.endFor(f, 0);
																																		if (!truthy(live(valid_id))) {
																																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>A reagent with that ID doesn't exist!</span>"]);
																																		}
																																	}
																																} else if ($0 === "Choose ID") {
																																	chosen_id = (yield* g.op(f, "Prompt", [1], [null, "Choose a reagent.", "Choose a reagent to add.", live(f.usr), live(reagent_options)]));
																																}
																																if (truthy(live(chosen_id))) {
																																	if (truthy((amount_3 = (yield* g.op(f, "Prompt", [32], [rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(A))), "Choose the amount.", "Choose the amount to add.", live(f.usr), null]))))) {
																																		yield* g.callName(f, rt.fv(f, "reagents", live(A)), "add_reagent", [live(chosen_id), live(amount_3)]);
																																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has added ＀ units of ＀ to ％！", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(amount_3), live(chosen_id), live(A)])]);
																																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ has added ＀ units of ＀ to ％！</span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(amount_3), live(chosen_id), live(A)])]);
																																	}
																																}
																															}
																															rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "addreagent"));
																														} else {
																															if (truthy(rt.at(live(href_list), "explode"))) {
																																if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																																	return live(f.dot);
																																}
																																if (((!truthy((rt.istype((A = rt.locateIn(f, rt.at(live(href_list), "explode"), rt.world())), T("/obj")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) && !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)]))))) {
																																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /obj, /mob and /turf"]);
																																	return live(f.dot);
																																}
																																yield* g.callName(f, live(f.src), "cmd_admin_explosion", [live(A)]);
																																rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "explode"));
																															} else {
																																if (truthy(rt.at(live(href_list), "emp"))) {
																																	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [8])))) {
																																		return live(f.dot);
																																	}
																																	if (((!truthy((rt.istype((A = rt.locateIn(f, rt.at(live(href_list), "emp"), rt.world())), T("/obj")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)])))) && !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)]))))) {
																																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /obj, /mob and /turf"]);
																																		return live(f.dot);
																																	}
																																	yield* g.callName(f, live(f.src), "cmd_admin_emp", [live(A)]);
																																	rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "emp"));
																																} else {
																																	if (truthy(rt.at(live(href_list), "rotatedatum"))) {
																																		if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																																			return live(f.dot);
																																		}
																																		if (!truthy((rt.istype((A = rt.locateIn(f, rt.at(live(href_list), "rotatedatum"), rt.world())), T("/atom")) ? 1 : 0))) {
																																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /atom"]);
																																			return live(f.dot);
																																		}
																																		$0 = rt.at(live(href_list), "rotatedir");
																																		if ($0 === "right") {
																																			yield* g.callName(f, live(A), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), -45]))]);
																																		} else if ($0 === "left") {
																																			yield* g.callName(f, live(A), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), 45]))]);
																																		}
																																		rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "rotatedatum"));
																																	} else {
																																		if (truthy(rt.at(live(href_list), "editorgans"))) {
																																			if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																																				return live(f.dot);
																																			}
																																			if (!truthy((rt.istype((C = rt.locateIn(f, rt.at(live(href_list), "editorgans"), rt.world())), T("/mob/living/carbon")) ? 1 : 0))) {
																																				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon"]);
																																				return live(f.dot);
																																			}
																																			yield* g.srcCall(f, "manipulate_organs", live(C));
																																			rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "editorgans"));
																																		} else {
																																			if (truthy(rt.at(live(href_list), "makehuman"))) {
																																				if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																					return live(f.dot);
																																				}
																																				if (!truthy((rt.istype((Mo = rt.locateIn(f, rt.at(live(href_list), "makehuman"), rt.world())), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/monkey"]);
																																					return live(f.dot);
																																				}
																																				if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Confirm mob type change?", null, "Transform", "Cancel"])), "Transform")) {
																																					return live(f.dot);
																																				}
																																				if (!truthy(live(Mo))) {
																																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																					return live(f.dot);
																																				}
																																				yield* g.callName(f, rt.sv(f, "holder"), "Topic", [live(href), rt.alist(f, ["humanone", rt.at(live(href_list), "makehuman")])]);
																																			} else {
																																				if (truthy(rt.at(live(href_list), "makemonkey"))) {
																																					if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																						return live(f.dot);
																																					}
																																					if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "makemonkey"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/human"]);
																																						return live(f.dot);
																																					}
																																					if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Confirm mob type change?", null, "Transform", "Cancel"])), "Transform")) {
																																						return live(f.dot);
																																					}
																																					if (!truthy(live(H))) {
																																						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																						return live(f.dot);
																																					}
																																					yield* g.callName(f, rt.sv(f, "holder"), "Topic", [live(href), rt.alist(f, ["monkeyone", rt.at(live(href_list), "makemonkey")])]);
																																				} else {
																																					if (truthy(rt.at(live(href_list), "makerobot"))) {
																																						if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																							return live(f.dot);
																																						}
																																						if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "makerobot"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/human"]);
																																							return live(f.dot);
																																						}
																																						if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Confirm mob type change?", null, "Transform", "Cancel"])), "Transform")) {
																																							return live(f.dot);
																																						}
																																						if (!truthy(live(H))) {
																																							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																							return live(f.dot);
																																						}
																																						yield* g.callName(f, rt.sv(f, "holder"), "Topic", [live(href), rt.alist(f, ["makerobot", rt.at(live(href_list), "makerobot")])]);
																																					} else {
																																						if (truthy(rt.at(live(href_list), "makealien"))) {
																																							if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																								return live(f.dot);
																																							}
																																							if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "makealien"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/human"]);
																																								return live(f.dot);
																																							}
																																							if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Confirm mob type change?", null, "Transform", "Cancel"])), "Transform")) {
																																								return live(f.dot);
																																							}
																																							if (!truthy(live(H))) {
																																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																								return live(f.dot);
																																							}
																																							yield* g.callName(f, rt.sv(f, "holder"), "Topic", [live(href), rt.alist(f, ["makealien", rt.at(live(href_list), "makealien")])]);
																																						} else {
																																							if (truthy(rt.at(live(href_list), "makeslime"))) {
																																								if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																									return live(f.dot);
																																								}
																																								if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "makeslime"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/human"]);
																																									return live(f.dot);
																																								}
																																								if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Confirm mob type change?", null, "Transform", "Cancel"])), "Transform")) {
																																									return live(f.dot);
																																								}
																																								if (!truthy(live(H))) {
																																									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																									return live(f.dot);
																																								}
																																								yield* g.callName(f, rt.sv(f, "holder"), "Topic", [live(href), rt.alist(f, ["makeslime", rt.at(live(href_list), "makeslime")])]);
																																							} else {
																																								if (truthy(rt.at(live(href_list), "makeai"))) {
																																									if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																										return live(f.dot);
																																									}
																																									if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "makeai"), rt.world())), T("/mob/living/carbon")) ? 1 : 0))) {
																																										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon"]);
																																										return live(f.dot);
																																									}
																																									if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Confirm mob type change?", null, "Transform", "Cancel"])), "Transform")) {
																																										return live(f.dot);
																																									}
																																									if (!truthy(live(H))) {
																																										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																										return live(f.dot);
																																									}
																																									yield* g.callName(f, rt.sv(f, "holder"), "Topic", [live(href), rt.alist(f, ["makeai", rt.at(live(href_list), "makeai")])]);
																																								} else {
																																									if (truthy(rt.at(live(href_list), "setspecies"))) {
																																										if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																											return live(f.dot);
																																										}
																																										if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "setspecies"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																											yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/human"]);
																																											return live(f.dot);
																																										}
																																										result = (yield* g.op(f, "Prompt", [1], [null, "Species", "Please choose a new species", live(f.usr), rt.gl("species_list")]));
																																										if (!truthy(live(H))) {
																																											yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																											return live(f.dot);
																																										}
																																										if (truthy(live(result))) {
																																											newtype = rt.index(rt.gl("species_list"), live(result));
																																											yield* g.call(f, P("/proc/admin_ticket_log"), null, [fmt("＀ has modified the bodyparts of ＀ to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(H), live(result)])]);
																																											yield* g.callName(f, live(H), "set_species", [live(newtype)]);
																																										}
																																									} else {
																																										if (truthy(rt.at(live(href_list), "editbodypart"))) {
																																											if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																												return live(f.dot);
																																											}
																																											if (!truthy((rt.istype((C = rt.locateIn(f, rt.at(live(href_list), "editbodypart"), rt.world())), T("/mob/living/carbon")) ? 1 : 0))) {
																																												yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon"]);
																																												return live(f.dot);
																																											}
																																											if (!truthy((edit_action = (yield* g.op(f, "Prompt", [1], [null, "Modify Body Part", "What would you like to do?", live(f.usr), rt.list("add", "remove", "augment")]))))) {
																																												return live(f.dot);
																																											}
																																											limb_list = rt.list("head", "l_arm", "r_arm", "l_leg", "r_leg");
																																											if (isEqual(live(edit_action), "augment")) {
																																												limb_list = rt.modify(live(limb_list), "chest", add);
																																											}
																																											result_3 = (yield* g.op(f, "Prompt", [1], [null, fmt("＀ Body Part", [(yield* g.call(f, P("/proc/capitalize"), null, [live(edit_action)]))]), fmt("Please choose which body part to ＀", [live(edit_action)]), live(f.usr), live(limb_list)]));
																																											if (!truthy(live(C))) {
																																												yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																												return live(f.dot);
																																											}
																																											if (truthy(live(result_3))) {
																																												BP = (yield* g.callName(f, live(C), "get_bodypart", [live(result_3)]));
																																												$0 = live(edit_action);
																																												if ($0 === "remove") {
																																													if (truthy(live(BP))) {
																																														yield* g.callName(f, live(BP), "drop_limb", []);
																																													} else {
																																														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ doesn't have such bodypart.", [live(C)])]);
																																													}
																																												} else if ($0 === "add") {
																																													if (truthy(live(BP))) {
																																														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ already has such bodypart.", [live(C)])]);
																																													} else {
																																														if (!truthy((yield* g.callName(f, live(C), "regenerate_limb", [live(result_3)])))) {
																																															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ cannot have such bodypart.", [live(C)])]);
																																														}
																																													}
																																												} else if ($0 === "augment") {
																																													if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																														if (truthy(live(BP))) {
																																															yield* g.callName(f, live(BP), "change_bodypart_status", [2, 1, 1]);
																																														} else {
																																															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀ doesn't have such bodypart.", [live(C)])]);
																																														}
																																													} else {
																																														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Only humans can be augmented."]);
																																													}
																																												}
																																											}
																																											yield* g.call(f, P("/proc/admin_ticket_log"), null, [fmt("＀ has modified the bodyparts of ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(C)])]);
																																										} else {
																																											if (truthy(rt.at(live(href_list), "purrbation"))) {
																																												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096])))) {
																																													return live(f.dot);
																																												}
																																												if (!truthy((rt.istype((H = rt.locateIn(f, rt.at(live(href_list), "purrbation"), rt.world())), T("/mob/living/carbon/human")) ? 1 : 0))) {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to instances of type /mob/living/carbon/human"]);
																																													return live(f.dot);
																																												}
																																												if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(H), T("/datum/species/human")])))) {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "This can only be done to the basic human species at the moment."]);
																																													return live(f.dot);
																																												}
																																												if (!truthy(live(H))) {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																													return live(f.dot);
																																												}
																																												if (truthy((success = (yield* g.call(f, P("/proc/purrbation_toggle"), null, [live(H)]))))) {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Put ＀ on purrbation.", [live(H)])]);
																																													yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has put ＀ on purrbation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																													yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='notice'>＀ has put ＀ on purrbation.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))]))]);
																																													yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(H), live(msg)]);
																																												} else {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Removed ＀ from purrbation.", [live(H)])]);
																																													yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has removed ＀ from purrbation.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))])]);
																																													yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='notice'>＀ has removed ＀ from purrbation.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(H)]))]))]);
																																													yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(H), live(msg)]);
																																												}
																																											} else {
																																												if (!(truthy(rt.at(live(href_list), "adjustDamage")) && truthy(rt.at(live(href_list), "mobToDamage")))) return f.dot;
																																												if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [0])))) {
																																													return live(f.dot);
																																												}
																																												if (!truthy((rt.istype((L_0 = rt.locateIn(f, rt.at(live(href_list), "mobToDamage"), rt.world())), T("/mob/living")) ? 1 : 0))) {
																																													return live(f.dot);
																																												}
																																												Text = rt.at(live(href_list), "adjustDamage");
																																												amount_2 = (yield* g.op(f, "Prompt", [32], [null, 0, fmt("Adjust ＀loss", [live(Text)]), "Deal how much damage to mob? (Negative values here heal)", null]));
																																												if (!truthy(live(L_0))) {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Mob doesn't exist anymore"]);
																																													return live(f.dot);
																																												}
																																												$0 = live(Text);
																																												if ($0 === "brute") {
																																													yield* g.callName(f, live(L_0), "adjustBruteLoss", [live(amount_2)]);
																																												} else if ($0 === "fire") {
																																													yield* g.callName(f, live(L_0), "adjustFireLoss", [live(amount_2)]);
																																												} else if ($0 === "toxin") {
																																													yield* g.callName(f, live(L_0), "adjustToxLoss", [live(amount_2)]);
																																												} else if ($0 === "oxygen") {
																																													yield* g.callName(f, live(L_0), "adjustOxyLoss", [live(amount_2)]);
																																												} else if ($0 === "brain") {
																																													yield* g.callName(f, live(L_0), "adjustBrainLoss", [live(amount_2)]);
																																												} else if ($0 === "clone") {
																																													yield* g.callName(f, live(L_0), "adjustCloneLoss", [live(amount_2)]);
																																												} else if ($0 === "stamina") {
																																													yield* g.callName(f, live(L_0), "adjustStaminaLoss", [live(amount_2)]);
																																												} else {
																																													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("You caused an error. DEBUG: Text:＀ Mob:＀", [live(Text), live(L_0)])]);
																																													return live(f.dot);
																																												}
																																												if (isEqual(live(amount_2), 0)) return f.dot;
																																												yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ dealt ＀ amount of ＀ damage to ＀ ", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(amount_2), live(Text), live(L_0)])]);
																																												yield* g.call(f, P("/proc/message_admins"), null, [(msg_3 = fmt("<span class='notice'>＀ dealt ＀ amount of ＀ damage to ＀ </span>", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(amount_2), live(Text), live(L_0)]))]);
																																												yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(L_0), live(msg_3)]);
																																												rt.setAt(live(href_list), "datumrefresh", rt.at(live(href_list), "mobToDamage"));
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true);
