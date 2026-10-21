// From code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/_abs  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:4)
rt.def("/proc/_abs", function _abs(f: Frame, A: Value) {
	return rt.op(f, "Abs", [], [live(A)]);
});

// /proc/_acrccos  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:11)
rt.def("/proc/_acrccos", function _acrccos(f: Frame, A: Value) {
	return rt.op(f, "ArcCos", [], [live(A)]);
});

// /proc/_arcsin  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:14)
rt.def("/proc/_arcsin", function _arcsin(f: Frame, A: Value) {
	return rt.op(f, "ArcSin", [], [live(A)]);
});

// /proc/_ascii2text  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:17)
rt.def("/proc/_ascii2text", function _ascii2text(f: Frame, A: Value) {
	return rt.call(f, P("/proc/ascii2text"), null, [live(A)]);
});

// /proc/_block  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:20)
rt.def("/proc/_block", function _block(f: Frame, Start: Value, End: Value) {
	return rt.call(f, P("/proc/block"), null, [live(Start), live(End)]);
});

// /proc/_ckey  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:23)
rt.def("/proc/_ckey", function _ckey(f: Frame, Key: Value) {
	return rt.call(f, P("/proc/ckey"), null, [live(Key)]);
});

// /proc/_ckeyEx  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:26)
rt.def("/proc/_ckeyEx", function _ckeyEx(f: Frame, Key: Value) {
	return rt.call(f, P("/proc/ckeyEx"), null, [live(Key)]);
});

// /proc/_copytext  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:29)
rt.def("/proc/_copytext", function _copytext(f: Frame, _T: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	return rt.call(f, P("/proc/copytext"), null, [live(_T), live(Start), live(End)]);
});

// /proc/_cos  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:32)
rt.def("/proc/_cos", function _cos(f: Frame, X: Value) {
	return rt.op(f, "Cos", [], [live(X)]);
});

// /proc/_get_dir  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:35)
rt.def("/proc/_get_dir", function _get_dir(f: Frame, Loc1: Value, Loc2: Value) {
	return rt.getDir(f, live(Loc1), live(Loc2));
});

// /proc/_get_dist  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:38)
rt.def("/proc/_get_dist", function _get_dist(f: Frame, Loc1: Value, Loc2: Value) {
	return rt.call(f, P("/proc/get_dist"), null, [live(Loc1), live(Loc2)]);
});

// /proc/_get_step  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:41)
rt.def("/proc/_get_step", function _get_step(f: Frame, Ref: Value, Dir: Value) {
	return rt.getStep(f, live(Ref), live(Dir));
});

// /proc/_hearers  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:44)
rt.def("/proc/_hearers", function _hearers(f: Frame, Depth: Value, Center: Value) {
	f.vars = () => [Depth, Center];
	if (live(Depth) === null) {
		Depth = rt.fv(f, "view", rt.world());
	}
	if (live(Center) === null) {
		Center = live(f.usr);
	}
	return rt.call(f, P("/proc/hearers"), null, [live(Depth), live(Center)]);
});

// /proc/_image  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:47)
rt.def("/proc/_image", function _image(f: Frame, icon: Value, loc: Value, icon_state: Value, layer: Value, dir: Value) {
	return rt.call(f, P("/proc/image"), null, [live(icon), live(loc), live(icon_state), live(layer), live(dir)]);
});

// /proc/_length  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:50)
rt.def("/proc/_length", function _length(f: Frame, E: Value) {
	return rt.length(live(E));
});

// /proc/_link  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:53)
rt.def("/proc/_link", function _link(f: Frame, thing: Value, url: Value) {
	rt.op(f, "Link", [], [live(thing), live(url)], false);
	return f.dot;
});

// /proc/_locate  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:56)
rt.def("/proc/_locate", function _locate(f: Frame, X: Value, Y: Value, Z: Value) {
	if (live(Y) === null) {
		return rt.locateIn(f, live(X), rt.world());
	}
	return rt.locate(live(X), live(Y), live(Z));
});

// /proc/_log  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:62)
rt.def("/proc/_log", function _log(f: Frame, X: Value, Y: Value) {
	return rt.op(f, "Log", [], [live(Y), live(X)]);
});

// /proc/_lowertext  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:65)
rt.def("/proc/_lowertext", function _lowertext(f: Frame, _T: Value) {
	return rt.call(f, P("/proc/lowertext"), null, [live(_T)]);
});

// /proc/_matrix  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:68)
rt.def("/proc/_matrix", function _matrix(f: Frame, a: Value, b: Value, c: Value, d: Value, e: Value, _f: Value) {
	return rt.call(f, P("/proc/matrix"), null, [live(a), live(b), live(c), live(d), live(e), live(_f)]);
});

// /proc/_max  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:71)
rt.def("/proc/_max", function _max(f: Frame) {
	return rt.call(f, P("/proc/max"), null, [f.argsList], rt.Args.List);
});

// /proc/_md5  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:74)
rt.def("/proc/_md5", function _md5(f: Frame, _T: Value) {
	return rt.call(f, P("/proc/md5"), null, [live(_T)]);
});

// /proc/_min  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:77)
rt.def("/proc/_min", function _min(f: Frame) {
	return rt.call(f, P("/proc/min"), null, [f.argsList], rt.Args.List);
});

// /proc/_new  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:80)  may sleep
rt.def("/proc/_new", function* _new(f: Frame, type: Value, _arguments: Value) {
	f.vars = () => [type, _arguments];
	return (yield* g.new_(f, live(type), [live(_arguments)], rt.Args.List));
}, true);

// /proc/_num2text  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:83)
rt.def("/proc/_num2text", function _num2text(f: Frame, N: Value, SigFig: Value) {
	f.vars = () => [SigFig];
	if (live(SigFig) === null) {
		SigFig = 6;
	}
	return rt.call(f, P("/proc/num2text"), null, [live(N), live(SigFig)]);
});

// /proc/_ohearers  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:86)
rt.def("/proc/_ohearers", function _ohearers(f: Frame, Dist: Value, Center: Value) {
	f.vars = () => [Center];
	if (live(Center) === null) {
		Center = live(f.usr);
	}
	return rt.call(f, P("/proc/ohearers"), null, [live(Dist), live(Center)]);
});

// /proc/_orange  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:89)
rt.def("/proc/_orange", function _orange(f: Frame, Dist: Value, Center: Value) {
	f.vars = () => [Center];
	if (live(Center) === null) {
		Center = live(f.usr);
	}
	return rt.call(f, P("/proc/orange"), null, [live(Dist), live(Center)]);
});

// /proc/_output  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:92)
rt.def("/proc/_output", function _output(f: Frame, thing: Value, msg: Value, control: Value) {
	rt.op(f, "OutputControl", [], [live(thing), live(msg), live(control)], false);
	return f.dot;
});

// /proc/_oview  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:95)
rt.def("/proc/_oview", function _oview(f: Frame, Dist: Value, Center: Value) {
	f.vars = () => [Center];
	if (live(Center) === null) {
		Center = live(f.usr);
	}
	return rt.call(f, P("/proc/oview"), null, [live(Dist), live(Center)]);
});

// /proc/_oviewers  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:98)
rt.def("/proc/_oviewers", function _oviewers(f: Frame, Dist: Value, Center: Value) {
	f.vars = () => [Center];
	if (live(Center) === null) {
		Center = live(f.usr);
	}
	return rt.call(f, P("/proc/oviewers"), null, [live(Dist), live(Center)]);
});

// /proc/_params2list  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:101)
rt.def("/proc/_params2list", function _params2list(f: Frame, Params: Value) {
	return rt.call(f, P("/proc/params2list"), null, [live(Params)]);
});

// /proc/_pick  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:104)
rt.def("/proc/_pick", function _pick(f: Frame) {
	return rt.op(f, "PickUnweighted", [1], [f.argsList]);
});

// /proc/_prob  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:107)
rt.def("/proc/_prob", function _prob(f: Frame, _P: Value) {
	return rt.op(f, "Prob", [], [live(_P)]);
});

// /proc/_rand  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:110)
rt.def("/proc/_rand", function _rand(f: Frame, L: Value, H: Value) {
	f.vars = () => [L, H];
	if (live(L) === null) {
		L = 0;
	}
	if (live(H) === null) {
		H = 1;
	}
	return rt.call(f, P("/proc/rand"), null, [live(L), live(H)]);
});

// /proc/_range  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:113)
rt.def("/proc/_range", function _range(f: Frame, Dist: Value, Center: Value) {
	f.vars = () => [Center];
	if (live(Center) === null) {
		Center = live(f.usr);
	}
	return rt.call(f, P("/proc/range"), null, [live(Dist), live(Center)]);
});

// /proc/_regex  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:116)
rt.def("/proc/_regex", function _regex(f: Frame, pattern: Value, flags: Value) {
	return rt.call(f, P("/proc/regex"), null, [live(pattern), live(flags)]);
});

// /proc/_REGEX_QUOTE  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:119)
rt.def("/proc/_REGEX_QUOTE", function _REGEX_QUOTE(f: Frame, text: Value) {
	return rt.call(f, P("/proc/regex"), null, [live(text), 1]);
});

// /proc/_REGEX_QUOTE_REPLACEMENT  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:122)
rt.def("/proc/_REGEX_QUOTE_REPLACEMENT", function _REGEX_QUOTE_REPLACEMENT(f: Frame, text: Value) {
	return rt.call(f, P("/proc/regex"), null, [live(text), 2]);
});

// /proc/_replacetext  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:125)
rt.def("/proc/_replacetext", function _replacetext(f: Frame, Haystack: Value, Needle: Value, Replacement: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	return rt.call(f, P("/proc/replacetext"), null, [live(Haystack), live(Needle), live(Replacement), live(Start), live(End)]);
});

// /proc/_replacetextEx  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:128)
rt.def("/proc/_replacetextEx", function _replacetextEx(f: Frame, Haystack: Value, Needle: Value, Replacement: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	return rt.call(f, P("/proc/replacetextEx"), null, [live(Haystack), live(Needle), live(Replacement), live(Start), live(End)]);
});

// /proc/_rgb  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:131)
rt.def("/proc/_rgb", function _rgb(f: Frame, R: Value, G: Value, B: Value) {
	return rt.op(f, "Rgb", [1, 3], [live(R), live(G), live(B)]);
});

// /proc/_rgba  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:134)
rt.def("/proc/_rgba", function _rgba(f: Frame, R: Value, G: Value, B: Value, A: Value) {
	return rt.op(f, "Rgb", [1, 4], [live(R), live(G), live(B), live(A)]);
});

// /proc/_roll  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:137)
rt.def("/proc/_roll", function _roll(f: Frame, dice: Value) {
	return rt.call(f, P("/proc/roll"), null, [live(dice)]);
});

// /proc/_round  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:140)
rt.def("/proc/_round", function _round(f: Frame, A: Value, B: Value) {
	f.vars = () => [B];
	if (live(B) === null) {
		B = 1;
	}
	return rt.call(f, P("/proc/round"), null, [live(A), live(B)]);
});

// /proc/_sin  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:143)
rt.def("/proc/_sin", function _sin(f: Frame, X: Value) {
	return rt.op(f, "Sin", [], [live(X)]);
});

// /proc/_step  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:146)  may sleep
rt.def("/proc/_step", function* _step(f: Frame, Ref: Value, Dir: Value, Speed: Value) {
	f.vars = () => [Ref, Dir, Speed];
	if (live(Speed) === null) {
		Speed = 0;
	}
	return (yield* g.call(f, P("/proc/step"), null, [live(Ref), live(Dir), live(Speed)]));
}, true);

// /proc/_list_add  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:149)
rt.def("/proc/_list_add", function _list_add(f: Frame) {
	if (rt.lt(rt.len(f, f.argsList), 2)) {
		return live(f.dot);
	}
	f.args[0] = rt.modify(live(f.args[0]), rt.callName(f, f.argsList, "Copy", [2]), add);
	return f.dot;
}, false, { args: ["L"] });

// /proc/_list_copy  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:154)
rt.def("/proc/_list_copy", function _list_copy(f: Frame, L: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	return rt.callName(f, live(L), "Copy", [live(Start), live(End)]);
});

// /proc/_list_cut  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:157)
rt.def("/proc/_list_cut", function _list_cut(f: Frame, L: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	rt.callName(f, live(L), "Cut", [live(Start), live(End)]);
	return f.dot;
});

// /proc/_list_find  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:160)
rt.def("/proc/_list_find", function _list_find(f: Frame, L: Value, Elem: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 1;
	}
	if (live(End) === null) {
		End = 0;
	}
	return rt.callName(f, live(L), "Find", [live(Elem), live(Start), live(End)]);
});

// /proc/_list_insert  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:163)
rt.def("/proc/_list_insert", function _list_insert(f: Frame, L: Value, Index: Value, Item: Value) {
	return rt.callName(f, live(L), "Insert", [live(Index), live(Item)]);
});

// /proc/_list_join  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:166)
rt.def("/proc/_list_join", function _list_join(f: Frame, L: Value, Glue: Value, Start: Value, End: Value) {
	f.vars = () => [Start, End];
	if (live(Start) === null) {
		Start = 0;
	}
	if (live(End) === null) {
		End = 1;
	}
	return rt.callName(f, live(L), "Join", [live(Glue), live(Start), live(End)]);
});

// /proc/_list_remove  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:169)
rt.def("/proc/_list_remove", function _list_remove(f: Frame) {
	if (rt.lt(rt.len(f, f.argsList), 2)) {
		return live(f.dot);
	}
	(f.args[0] = rt.modify(live(f.args[0]), rt.callName(f, f.argsList, "Copy", [2]), subtract));
	return f.dot;
}, false, { args: ["L"] });

// /proc/_list_swap  (code/modules/admin/verbs/SDQL2/SDQL_2_wrappers.dm:174)
rt.def("/proc/_list_swap", function _list_swap(f: Frame, L: Value, Index1: Value, Index2: Value) {
	rt.callName(f, live(L), "Swap", [live(Index1), live(Index2)]);
	return f.dot;
});
