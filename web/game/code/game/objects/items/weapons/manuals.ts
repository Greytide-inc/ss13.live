// Based on /tg/station's code/game/objects/items/weapons/manuals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(7295, "/obj/item/weapon/book/manual/wiki", "/obj/item/weapon/book/manual", {
	page_link: "",
	window_size: "970x710",
});

// manuals.dm:880
rt.def("/obj/item/weapon/book/manual/wiki/proc/attack_self", function attack_self(f: Frame) {
	if (!this.dat) {
		this.initialize_wikibook();
	}
	parent_proc();
	return f.dot;
});

// manuals.dm:885
rt.def("/obj/item/weapon/book/manual/wiki/proc/initialize_wikibook", function initialize_wikibook(f: Frame) {
	if (!GLOB.config.wikiurl) return f.dot;
	this.dat = `\n\n\t\t\t<html><head>\n\t\t\t<style>\n\t\t\t\tiframe {\n\t\t\t\t\tdisplay: none;\n\t\t\t\t}\n\t\t\t</style>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t<script type="text/javascript">\n\t\t\t\tfunction pageloaded(myframe) {\n\t\t\t\t\tdocument.getElementById("loading").style.display = "none";\n\t\t\t\t\tmyframe.style.display = "inline";\n    \t\t\t}\n\t\t\t</script>\n\t\t\t<p id='loading'>You start skimming through the manual...</p>\n\t\t\t<iframe width='100%' height='97%' onload="pageloaded(this)" src="${GLOB.config.wikiurl}/${this.page_link}?printable=yes&remove_links=1" frameborder="0" id="main_frame"></iframe>\n\t\t\t</body>\n\n\t\t\t</html>\n\n\t\t\t`;
	return f.dot;
});
