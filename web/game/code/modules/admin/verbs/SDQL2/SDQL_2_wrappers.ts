// Based on /tg/station's code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P, g } = rt;


// SDQL_2_wrappers.dm:4
rt.def("/proc/_abs", function _abs(f: Frame, A: Value) {
	return rt.op(f, "Abs", [], [A]);
});

// SDQL_2_wrappers.dm:11
rt.def("/proc/_acrccos", function _acrccos(f: Frame, A: Value) {
	return rt.op(f, "ArcCos", [], [A]);
});

// SDQL_2_wrappers.dm:14
rt.def("/proc/_arcsin", function _arcsin(f: Frame, A: Value) {
	return rt.op(f, "ArcSin", [], [A]);
});

// SDQL_2_wrappers.dm:17
rt.def("/proc/_ascii2text", function _ascii2text(f: Frame, A: Value) {
	return ascii2text(A);
});

// SDQL_2_wrappers.dm:20
rt.def("/proc/_block", function _block(f: Frame, Start: Value, End: Value) {
	return block(Start, End);
});

// SDQL_2_wrappers.dm:23
rt.def("/proc/_ckey", function _ckey(f: Frame, Key: Value) {
	return ckey(Key);
});

// SDQL_2_wrappers.dm:26
rt.def("/proc/_ckeyEx", function _ckeyEx(f: Frame, Key: Value) {
	return ckeyEx(Key);
});

// SDQL_2_wrappers.dm:29
rt.def("/proc/_copytext", function _copytext(f: Frame, _T: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	return copytext(_T, Start, End);
});

// SDQL_2_wrappers.dm:32
rt.def("/proc/_cos", function _cos(f: Frame, X: Value) {
	return rt.op(f, "Cos", [], [X]);
});

// SDQL_2_wrappers.dm:35
rt.def("/proc/_get_dir", function _get_dir(f: Frame, Loc1: Value, Loc2: Value) {
	return rt.getDir(f, Loc1, Loc2);
});

// SDQL_2_wrappers.dm:38
rt.def("/proc/_get_dist", function _get_dist(f: Frame, Loc1: Value, Loc2: Value) {
	return get_dist(Loc1, Loc2);
});

// SDQL_2_wrappers.dm:41
rt.def("/proc/_get_step", function _get_step(f: Frame, Ref: Value, Dir: Value) {
	return rt.getStep(f, Ref, Dir);
});

// SDQL_2_wrappers.dm:44
rt.def("/proc/_hearers", function _hearers(f: Frame, Depth: Value, Center: Value) {
	Depth ??= rt.world().view;
	Center ??= f.usr;
	return hearers(Depth, Center);
});

// SDQL_2_wrappers.dm:47
rt.def("/proc/_image", function _image(f: Frame, icon: Value, loc: Value, icon_state: Value, layer: Value, dir: Value) {
	return image(icon, loc, icon_state, layer, dir);
});

// SDQL_2_wrappers.dm:50
rt.def("/proc/_length", function _length(f: Frame, E: Value) {
	return rt.length(E);
});

// SDQL_2_wrappers.dm:53
rt.def("/proc/_link", function _link(f: Frame, thing: Value, url: Value) {
	rt.op(f, "Link", [], [thing, url], false);
	return f.dot;
});

// SDQL_2_wrappers.dm:56
rt.def("/proc/_locate", function _locate(f: Frame, X: Value, Y: Value, Z: Value) {
	if (Y === null) {
		return rt.locateIn(f, X, rt.world());
	}
	return rt.locate(X, Y, Z);
});

// SDQL_2_wrappers.dm:62
rt.def("/proc/_log", function _log(f: Frame, X: Value, Y: Value) {
	return rt.op(f, "Log", [], [Y, X]);
});

// SDQL_2_wrappers.dm:65
rt.def("/proc/_lowertext", function _lowertext(f: Frame, _T: Value) {
	return lowertext(_T);
});

// SDQL_2_wrappers.dm:68
rt.def("/proc/_matrix", function _matrix(f: Frame, a: Value, b: Value, c: Value, d: Value, e: Value, _f: Value) {
	return matrix(a, b, c, d, e, _f);
});

// SDQL_2_wrappers.dm:71
rt.def("/proc/_max", function _max(f: Frame) {
	return rt.call(f, P("/proc/max"), null, [f.argsList], rt.Args.List);
});

// SDQL_2_wrappers.dm:74
rt.def("/proc/_md5", function _md5(f: Frame, _T: Value) {
	return md5(_T);
});

// SDQL_2_wrappers.dm:77
rt.def("/proc/_min", function _min(f: Frame) {
	return rt.call(f, P("/proc/min"), null, [f.argsList], rt.Args.List);
});

// SDQL_2_wrappers.dm:80
rt.def("/proc/_new", function* _new(f: Frame, type: Value, _arguments: Value) {
	return (yield* g.new_(f, type, [_arguments], rt.Args.List));
}, true);

// SDQL_2_wrappers.dm:83
rt.def("/proc/_num2text", function _num2text(f: Frame, N: Value, SigFig: Value) {
	SigFig ??= 6;
	return num2text(N, SigFig);
});

// SDQL_2_wrappers.dm:86
rt.def("/proc/_ohearers", function _ohearers(f: Frame, Dist: Value, Center: Value) {
	Center ??= f.usr;
	return ohearers(Dist, Center);
});

// SDQL_2_wrappers.dm:89
rt.def("/proc/_orange", function _orange(f: Frame, Dist: Value, Center: Value) {
	Center ??= f.usr;
	return orange(Dist, Center);
});

// SDQL_2_wrappers.dm:92
rt.def("/proc/_output", function _output(f: Frame, thing: Value, msg: Value, control: Value) {
	rt.op(f, "OutputControl", [], [thing, msg, control], false);
	return f.dot;
});

// SDQL_2_wrappers.dm:95
rt.def("/proc/_oview", function _oview(f: Frame, Dist: Value, Center: Value) {
	Center ??= f.usr;
	return oview(Dist, Center);
});

// SDQL_2_wrappers.dm:98
rt.def("/proc/_oviewers", function _oviewers(f: Frame, Dist: Value, Center: Value) {
	Center ??= f.usr;
	return oviewers(Dist, Center);
});

// SDQL_2_wrappers.dm:101
rt.def("/proc/_params2list", function _params2list(f: Frame, Params: Value) {
	return params2list(Params);
});

// SDQL_2_wrappers.dm:104
rt.def("/proc/_pick", function _pick(f: Frame) {
	return pick(f.argsList);
});

// SDQL_2_wrappers.dm:107
rt.def("/proc/_prob", function _prob(f: Frame, _P: Value) {
	return prob(_P);
});

// SDQL_2_wrappers.dm:110
rt.def("/proc/_rand", function _rand(f: Frame, L: Value, H: Value) {
	L ??= 0;
	H ??= 1;
	return rand(L, H);
});

// SDQL_2_wrappers.dm:113
rt.def("/proc/_range", function _range(f: Frame, Dist: Value, Center: Value) {
	Center ??= f.usr;
	return range(Dist, Center);
});

// SDQL_2_wrappers.dm:116
rt.def("/proc/_regex", function _regex(f: Frame, pattern: Value, flags: Value) {
	return regex(pattern, flags);
});

// SDQL_2_wrappers.dm:119
rt.def("/proc/_REGEX_QUOTE", function _REGEX_QUOTE(f: Frame, text: Value) {
	return regex(text, 1);
});

// SDQL_2_wrappers.dm:122
rt.def("/proc/_REGEX_QUOTE_REPLACEMENT", function _REGEX_QUOTE_REPLACEMENT(f: Frame, text: Value) {
	return regex(text, 2);
});

// SDQL_2_wrappers.dm:125
rt.def("/proc/_replacetext", function _replacetext(f: Frame, Haystack: Value, Needle: Value, Replacement: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	return replacetext(Haystack, Needle, Replacement, Start, End);
});

// SDQL_2_wrappers.dm:128
rt.def("/proc/_replacetextEx", function _replacetextEx(f: Frame, Haystack: Value, Needle: Value, Replacement: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	return replacetextEx(Haystack, Needle, Replacement, Start, End);
});

// SDQL_2_wrappers.dm:131
rt.def("/proc/_rgb", function _rgb(f: Frame, R: Value, G: Value, B: Value) {
	return rt.op(f, "Rgb", [1, 3], [R, G, B]);
});

// SDQL_2_wrappers.dm:134
rt.def("/proc/_rgba", function _rgba(f: Frame, R: Value, G: Value, B: Value, A: Value) {
	return rt.op(f, "Rgb", [1, 4], [R, G, B, A]);
});

// SDQL_2_wrappers.dm:137
rt.def("/proc/_roll", function _roll(f: Frame, dice: Value) {
	return roll(dice);
});

// SDQL_2_wrappers.dm:140
rt.def("/proc/_round", function _round(f: Frame, A: Value, B: Value) {
	B ??= 1;
	return round(A, B);
});

// SDQL_2_wrappers.dm:143
rt.def("/proc/_sin", function _sin(f: Frame, X: Value) {
	return rt.op(f, "Sin", [], [X]);
});

// SDQL_2_wrappers.dm:146
rt.def("/proc/_step", function* _step(f: Frame, Ref: Value, Dir: Value, Speed: Value) {
	Speed ??= 0;
	return (yield* step(Ref, Dir, Speed));
}, true);

// SDQL_2_wrappers.dm:149
rt.def("/proc/_list_add", function _list_add(f: Frame) {
	if (rt.len(f, f.argsList) < 2) {
		return f.dot;
	}
	f.args[0] += f.argsList.Copy(2);
	return f.dot;
}, false, { args: ["L"] });

// SDQL_2_wrappers.dm:154
rt.def("/proc/_list_copy", function _list_copy(f: Frame, L: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	return L.Copy(Start, End);
});

// SDQL_2_wrappers.dm:157
rt.def("/proc/_list_cut", function _list_cut(f: Frame, L: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	L.Cut(Start, End);
	return f.dot;
});

// SDQL_2_wrappers.dm:160
rt.def("/proc/_list_find", function _list_find(f: Frame, L: Value, Elem: Value, Start: Value, End: Value) {
	Start ??= 1;
	End ??= 0;
	return L.Find(Elem, Start, End);
});

// SDQL_2_wrappers.dm:163
rt.def("/proc/_list_insert", function _list_insert(f: Frame, L: Value, Index: Value, Item: Value) {
	return L.Insert(Index, Item);
});

// SDQL_2_wrappers.dm:166
rt.def("/proc/_list_join", function _list_join(f: Frame, L: Value, Glue: Value, Start: Value, End: Value) {
	Start ??= 0;
	End ??= 1;
	return L.Join(Glue, Start, End);
});

// SDQL_2_wrappers.dm:169
rt.def("/proc/_list_remove", function _list_remove(f: Frame) {
	if (rt.len(f, f.argsList) < 2) {
		return f.dot;
	}
	f.args[0] -= f.argsList.Copy(2);
	return f.dot;
}, false, { args: ["L"] });

// SDQL_2_wrappers.dm:174
rt.def("/proc/_list_swap", function _list_swap(f: Frame, L: Value, Index1: Value, Index2: Value) {
	L.Swap(Index1, Index2);
	return f.dot;
});
