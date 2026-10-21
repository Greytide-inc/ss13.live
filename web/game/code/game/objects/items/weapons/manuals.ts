// From code/game/objects/items/weapons/manuals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7295, "/obj/item/weapon/book/manual/wiki", "/obj/item/weapon/book/manual", {
	page_link: "",
	window_size: "970x710",
});

// /obj/item/weapon/book/manual/wiki/proc/attack_self  (code/game/objects/items/weapons/manuals.dm:880)
rt.def("/obj/item/weapon/book/manual/wiki/proc/attack_self", function attack_self(f: Frame) {
	if (!truthy(rt.sv(f, "dat"))) {
		rt.callSrc(f, "initialize_wikibook", []);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/weapon/book/manual/wiki/proc/initialize_wikibook  (code/game/objects/items/weapons/manuals.dm:885)
rt.def("/obj/item/weapon/book/manual/wiki/proc/initialize_wikibook", function initialize_wikibook(f: Frame) {
	if (!truthy(rt.fv(f, "wikiurl", rt.gl("config")))) return f.dot;
	rt.setSv(f, "dat", fmt("\n\n\t\t\t<html><head>\n\t\t\t<style>\n\t\t\t\tiframe {\n\t\t\t\t\tdisplay: none;\n\t\t\t\t}\n\t\t\t</style>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t<script type=\"text/javascript\">\n\t\t\t\tfunction pageloaded(myframe) {\n\t\t\t\t\tdocument.getElementById(\"loading\").style.display = \"none\";\n\t\t\t\t\tmyframe.style.display = \"inline\";\n    \t\t\t}\n\t\t\t</script>\n\t\t\t<p id='loading'>You start skimming through the manual...</p>\n\t\t\t<iframe width='100%' height='97%' onload=\"pageloaded(this)\" src=\"＀/＀?printable=yes&remove_links=1\" frameborder=\"0\" id=\"main_frame\"></iframe>\n\t\t\t</body>\n\n\t\t\t</html>\n\n\t\t\t", [rt.fv(f, "wikiurl", rt.gl("config")), rt.sv(f, "page_link")]));
	return f.dot;
});
