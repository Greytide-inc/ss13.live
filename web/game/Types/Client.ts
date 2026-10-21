// From Types/Client.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/New  (Types/Client.dm:61)  may sleep
rt.def("/client/proc/New", function* New(f: Frame, TopicData: Value) {
	let M: Value = null, initial_mob: Value = null;
	let $e: any;
	f.vars = () => [TopicData, M, initial_mob, $e];
	M = null;
	rt.forList(f, 0, rt.world(), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "key", live(M)), rt.sv(f, "key"))) {
			rt.setSv(f, "mob", live(M));
			break;
		}
	}
	rt.endFor(f, 0);
	if (rt.sv(f, "mob") === null) {
		rt.setSv(f, "eye", (initial_mob = (yield* g.new_(f, rt.fv(f, "mob", rt.world()), []))));
		rt.setSv(f, "statobj", live(initial_mob));
		rt.setSv(f, "mob", live(initial_mob));
	}
	return rt.sv(f, "mob");
}, true);

// /client/proc/Topic  (Types/Client.dm:77)  may sleep
rt.def("/client/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hsrc: Value) {
	f.vars = () => [href, href_list, hsrc];
	if (live(hsrc) === null) return f.dot;
	yield* g.callName(f, live(hsrc), "Topic", [live(href), live(href_list)]);
	return f.dot;
}, true);

// /client/proc/Stat  (Types/Client.dm:81)  may sleep
rt.def("/client/proc/Stat", function* Stat(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "statobj"), T("/atom")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "statobj"), "Stat", []);
	return f.dot;
}, true);

// /client/proc/Move  (Types/Client.dm:100)  may sleep
rt.def("/client/proc/Move", function* Move(f: Frame, loc: Value, dir: Value) {
	f.vars = () => [loc, dir];
	yield* g.callName(f, rt.sv(f, "mob"), "Move", [live(loc), live(dir)]);
	return f.dot;
}, true);

// /client/verb/North  (Types/Client.dm:104)  may sleep
rt.def("/client/verb/North", function* North(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 1), 1);
	return f.dot;
}, true, { verb: { name: ".north" } });

// /client/verb/South  (Types/Client.dm:108)  may sleep
rt.def("/client/verb/South", function* South(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 2), 2);
	return f.dot;
}, true, { verb: { name: ".south" } });

// /client/verb/East  (Types/Client.dm:112)  may sleep
rt.def("/client/verb/East", function* East(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 4), 4);
	return f.dot;
}, true, { verb: { name: ".east" } });

// /client/verb/West  (Types/Client.dm:116)  may sleep
rt.def("/client/verb/West", function* West(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 8), 8);
	return f.dot;
}, true, { verb: { name: ".west" } });

// /client/verb/Northeast  (Types/Client.dm:120)  may sleep
rt.def("/client/verb/Northeast", function* Northeast(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 5), 5);
	return f.dot;
}, true, { verb: { name: ".northeast" } });

// /client/verb/Southeast  (Types/Client.dm:124)  may sleep
rt.def("/client/verb/Southeast", function* Southeast(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 6), 6);
	return f.dot;
}, true, { verb: { name: ".southeast" } });

// /client/verb/Southwest  (Types/Client.dm:128)  may sleep
rt.def("/client/verb/Southwest", function* Southwest(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 10), 10);
	return f.dot;
}, true, { verb: { name: ".southwest" } });

// /client/verb/Northwest  (Types/Client.dm:132)  may sleep
rt.def("/client/verb/Northwest", function* Northwest(f: Frame) {
	yield* g.srcCall(f, "Move", rt.getStep(f, rt.sv(f, "mob"), 9), 9);
	return f.dot;
}, true, { verb: { name: ".northwest" } });

// /client/proc/Click  (Types/Client.dm:139)  may sleep
rt.def("/client/proc/Click", function* Click(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	yield* g.callName(f, live(object), "Click", [live(location), live(control), live(params)]);
	return f.dot;
}, true);

// /client/proc/DblClick  (Types/Client.dm:142)  may sleep
rt.def("/client/proc/DblClick", function* DblClick(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	yield* g.callName(f, live(object), "DblClick", [live(location), live(control), live(params)]);
	return f.dot;
}, true);

// /client/proc/MouseDown  (Types/Client.dm:146)
rt.def("/client/proc/MouseDown", function MouseDown(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.callName(f, live(object), "MouseDown", [live(location), live(control), live(params)]);
	return f.dot;
});

// /client/proc/MouseDrag  (Types/Client.dm:150)
rt.def("/client/proc/MouseDrag", function MouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	rt.callName(f, live(src_object), "MouseDrag", [live(over_object), live(src_location), live(over_location), live(src_control), live(over_control), live(params)]);
	return f.dot;
});

// /client/proc/MouseDrop  (Types/Client.dm:153)  may sleep
rt.def("/client/proc/MouseDrop", function* MouseDrop(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, src_control: Value, over_control: Value, params: Value) {
	f.vars = () => [src_object, over_object, src_location, over_location, src_control, over_control, params];
	yield* g.callName(f, live(src_object), "MouseDrop", [live(over_object), live(src_location), live(over_location), live(src_control), live(over_control), live(params)]);
	return f.dot;
}, true);

// /client/proc/MouseEntered  (Types/Client.dm:157)  may sleep
rt.def("/client/proc/MouseEntered", function* MouseEntered(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	yield* g.callName(f, live(object), "MouseEntered", [live(location), live(control), live(params)]);
	return f.dot;
}, true);

// /client/proc/MouseExited  (Types/Client.dm:161)  may sleep
rt.def("/client/proc/MouseExited", function* MouseExited(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, location, control, params];
	yield* g.callName(f, live(object), "MouseExited", [live(location), live(control), live(params)]);
	return f.dot;
}, true);

// /client/proc/MouseMove  (Types/Client.dm:165)
rt.def("/client/proc/MouseMove", function MouseMove(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.callName(f, live(object), "MouseMove", [live(location), live(control), live(params)]);
	return f.dot;
});

// /client/proc/MouseUp  (Types/Client.dm:169)
rt.def("/client/proc/MouseUp", function MouseUp(f: Frame, object: Value, location: Value, control: Value, params: Value) {
	rt.callName(f, live(object), "MouseUp", [live(location), live(control), live(params)]);
	return f.dot;
});

// /client/proc/MouseWheel  (Types/Client.dm:173)  may sleep
rt.def("/client/proc/MouseWheel", function* MouseWheel(f: Frame, object: Value, delta_x: Value, delta_y: Value, location: Value, control: Value, params: Value) {
	f.vars = () => [object, delta_x, delta_y, location, control, params];
	yield* g.callName(f, live(object), "MouseWheel", [live(delta_x), live(delta_y), live(location), live(control), live(params)]);
	return f.dot;
}, true);
