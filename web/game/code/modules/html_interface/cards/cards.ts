// From code/modules/html_interface/cards/cards.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2708, "/datum/html_interface/cards", "/datum/html_interface", {});

// /datum/html_interface/cards/proc/New  (code/modules/html_interface/cards/cards.dm:5)  may sleep
rt.def("/datum/html_interface/cards/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "head", live(f.src), add(rt.fv(f, "head", live(f.src)), "<link rel=\"stylesheet\" type=\"text/css\" href=\"cards.css\" />"));
	yield* g.callName(f, live(f.src), "updateLayout", ["<div id=\"headbar\"></div><div class=\"wrapper\"><table><tr><td style=\"vertical-align: middle;\"><div id=\"hand\"></div></td></tr></table></div>"]);
	return f.dot;
}, true);

// /datum/html_interface/cards/proc/registerResources  (code/modules/html_interface/cards/cards.dm:11)
rt.def("/datum/html_interface/cards/proc/registerResources", function registerResources(f: Frame, resources: Value) {
	f.vars = () => [resources];
	if (live(resources) === null) {
		resources = rt.list();
	}
	rt.setAt(live(resources), "cards.css", rt.rsc("code/modules/html_interface/cards/cards.css"));
	rt.setAt(live(resources), "cards.png", rt.rsc("code/modules/html_interface/cards/cards.png"));
	rt.callSuper(f, [live(resources)]);
	return f.dot;
});
