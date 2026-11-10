// Based on BYOND's Types/Atoms/_Atom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, truthy } = rt;


// Empty in tg.
rt.def("/atom/proc/handle_atom_del", undefined, false, { args: ["A"] });

// _Atom.dm:95
rt.def("/atom/proc/Cross", function Cross(f: Frame, O: Value) {
	return (!(this.density && O.density) ? 1 : 0);
});

// _Atom.dm:106
rt.def("/atom/proc/Enter", function Enter(f: Frame, O: Value, oldloc: Value) {
	let content: Value = null;
	if (isturf(this)) {
		if (this.density && O && O.density) {
			return 0;
		}
		for (content of each(this, T("/atom/movable"))) {
			if (content != O && !content.Cross(O)) {
				return 0;
			}
		}
	}
	return 1;
});

// _Atom.dm:115
rt.def("/atom/proc/Exit", function Exit(f: Frame, O: Value, newloc: Value) {
	let content: Value = null, L: Value = null, sk: Value = null, r: Value = null;
	// stress2c: only the contents whose Uncross isn't the base one (which returns 1): hook_list, see src/vm/natives-world.ts
	if (isturf(this) && (L = hook_list(this, 1)) !== null) {
		const chk = truthy(hook_check_mode());
		for (content of each(L, T("/atom/movable"))) {
			if (content == O) continue;
			sk = (chk ? hook_skips(content, 1) : 0);
			r = content.Uncross(O);
			if (chk) hook_check(sk, r, 1);
			if (!r) {
				return 0;
			}
		}
	}
	return 1;
});

// _Atom.dm:124
rt.def("/atom/proc/New", function New(f: Frame, loc: Value) {
	parent_proc();
	return f.dot;
}, false);
