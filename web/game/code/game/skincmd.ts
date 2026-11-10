// Based on /tg/station's code/game/skincmd.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// skincmd.dm:10
rt.def("/mob/verb/skincmd", function skincmd(f: Frame, data: Value) {
	let a: Value = null;
	let ref: Value = copytext(data, 1, findtext(data, ";"));
	if (rt.index(this.skincmds, ref) === null) return f.dot;
	(a = rt.index(this.skincmds, ref)).SkinCmd(this, copytext(data, findtext(data, ";") + 1));
	return f.dot;
}, false, { hidden: true, argTypes: [{ type: 2 }] });
