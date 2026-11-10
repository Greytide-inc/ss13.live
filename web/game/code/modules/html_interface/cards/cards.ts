// Based on /tg/station's code/modules/html_interface/cards/cards.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2708, "/datum/html_interface/cards", "/datum/html_interface", {});

// cards.dm:5
rt.def("/datum/html_interface/cards/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.head = this.head + "<link rel=\"stylesheet\" type=\"text/css\" href=\"cards.css\" />";
	yield* this.updateLayout("<div id=\"headbar\"></div><div class=\"wrapper\"><table><tr><td style=\"vertical-align: middle;\"><div id=\"hand\"></div></td></tr></table></div>");
	return f.dot;
}, true);

// cards.dm:11
rt.def("/datum/html_interface/cards/proc/registerResources", function registerResources(f: Frame, resources: Value) {
	resources ??= list();
	rt.setAt(resources, "cards.css", rt.rsc("code/modules/html_interface/cards/cards.css"));
	rt.setAt(resources, "cards.png", rt.rsc("code/modules/html_interface/cards/cards.png"));
	parent_proc(resources);
	return f.dot;
});
