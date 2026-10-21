// From code/game/objects/structures/musician.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1836, "/datum/song", "/datum", {
	name: "Untitled",
	tempo: 5,
	playing: 0,
	help: 0,
	edit: 1,
	repeat: 0,
	max_repeats: 10,
	instrumentDir: "piano",
	instrumentExt: "ogg",
	instrumentObj: null,
	lines: null,
});

// /datum/song/proc/<init>  (code/game/objects/structures/musician.dm:5)
rt.def("/datum/song/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "lines", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/song/proc/New  (code/game/objects/structures/musician.dm:19)
rt.def("/datum/song/proc/New", function New(f: Frame, dir: Value, obj: Value) {
	rt.setSv(f, "tempo", rt.callSrc(f, "sanitize_tempo", [rt.sv(f, "tempo")]));
	rt.setSv(f, "instrumentDir", live(dir));
	rt.setSv(f, "instrumentObj", live(obj));
	return f.dot;
});

// /datum/song/proc/Destroy  (code/game/objects/structures/musician.dm:25)  may sleep
rt.def("/datum/song/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "instrumentObj", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/song/proc/playnote  (code/game/objects/structures/musician.dm:32)
rt.def("/datum/song/proc/playnote", function playnote(f: Frame, note: Value, acc: Value, oct: Value) {
	let soundfile: Value = null, source: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [note, acc, oct, soundfile, source, M, $0, $e];
	if ((isEqual(live(acc), "b") && (isEqual(live(note), 3) || isEqual(live(note), 6)))) {
		if (isEqual(live(note), 3)) {
			oct = rt.inc(live(oct), -1);
		}
		note = rt.inc(live(note), -1);
		acc = "n";
	} else {
		if ((isEqual(live(acc), "#") && (isEqual(live(note), 2) || isEqual(live(note), 5)))) {
			if (isEqual(live(note), 2)) {
				oct = rt.inc(live(oct), 1);
			}
			note = rt.inc(live(note), 1);
			acc = "n";
		} else {
			if ((isEqual(live(acc), "#") && isEqual(live(note), 7))) {
				note = 1;
				acc = "b";
			} else {
				if (isEqual(live(acc), "#")) {
					acc = "b";
					note = rt.inc(live(note), 1);
				}
			}
		}
	}
	$0 = (rt.lt(live(oct), 1) ? 1 : 0);
	if (!truthy($0)) {
		if (isEqual(live(note), 3)) {
			$0 = (rt.gt(live(oct), 9) ? 1 : 0);
		} else {
			$0 = (rt.gt(live(oct), 8) ? 1 : 0);
		}
	}
	if (truthy($0)) {
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/fexists"), null, [(soundfile = rt.call(f, P("/proc/file"), null, [(soundfile = fmt("sound/＀/＀＀＀.＀", [rt.sv(f, "instrumentDir"), rt.call(f, P("/proc/ascii2text"), null, [add(live(note), 64)]), live(acc), live(oct), rt.sv(f, "instrumentExt")]))]))]))) {
		return live(f.dot);
	}
	source = rt.getStep(f, rt.sv(f, "instrumentObj"), 0);
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/get_hearers_in_view"), null, [15, live(source)]), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy(rt.fv(f, "client", live(M))) || !truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 128)))) {
			continue;
		}
		rt.callName(f, live(M), "playsound_local", [null, live(source), null, live(soundfile), null, 100, "falloff", 5], rt.Args.Named);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/song/proc/updateDialog  (code/game/objects/structures/musician.dm:67)  may sleep
rt.def("/datum/song/proc/updateDialog", function* updateDialog(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "instrumentObj"), "updateDialog", []);
	return f.dot;
}, true);

// /datum/song/proc/shouldStopPlaying  (code/game/objects/structures/musician.dm:71)
rt.def("/datum/song/proc/shouldStopPlaying", function shouldStopPlaying(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "instrumentObj"))) {
		if (!truthy(rt.callName(f, live(user), "canUseTopic", [rt.sv(f, "instrumentObj")]))) {
			return 1;
		}
		return (!truthy(rt.fv(f, "anchored", rt.sv(f, "instrumentObj"))) ? 1 : 0);
	}
	return 1;
});

// /datum/song/proc/playsong  (code/game/objects/structures/musician.dm:78)  may sleep
rt.def("/datum/song/proc/playsong", function* playsong(f: Frame, user: Value) {
	let cur_oct: Value = null, cur_acc: Value = null, i: Value = null, line: Value = null, beat: Value = null, notes: Value = null, note: Value = null, cur_note: Value = null, i_7: Value = null, ni: Value = null;
	let $e: any;
	f.vars = () => [user, cur_oct, cur_acc, i, line, beat, notes, note, cur_note, i_7, ni, $e];
	while (rt.ge(rt.sv(f, "repeat"), 0)) {
		cur_oct = rt.op(f, "CreateMultidimensionalList", [1], [7]);
		cur_acc = rt.op(f, "CreateMultidimensionalList", [1], [7]);
		i = null;
		rt.forRange(f, 0, 1, 7, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			rt.setAt(live(cur_oct), live(i), 3);
			rt.setAt(live(cur_acc), live(i), "n");
		}
		rt.endFor(f, 0);
		line = null;
		rt.forList(f, 0, rt.sv(f, "lines"));
		while (($e = rt.next(f, 0)) !== undefined) {
			line = $e;
			beat = null;
			rt.forList(f, 1, (yield* g.call(f, P("/proc/splittext"), null, [(yield* g.call(f, P("/proc/lowertext"), null, [live(line)])), ","])));
			while (($e = rt.next(f, 1)) !== undefined) {
				beat = $e;
				notes = (yield* g.call(f, P("/proc/splittext"), null, [live(beat), "/"]));
				note = null;
				rt.forList(f, 2, (yield* g.call(f, P("/proc/splittext"), null, [rt.index(live(notes), 1), "-"])));
				while (($e = rt.next(f, 2)) !== undefined) {
					note = $e;
					if ((!truthy(rt.sv(f, "playing")) || truthy((yield* g.srcCall(f, "shouldStopPlaying", live(user)))))) {
						rt.setSv(f, "playing", 0);
						return live(f.dot);
					}
					if (isEqual((yield* g.call(f, P("/proc/lentext"), null, [live(note)])), 0)) {
						continue;
					}
					if ((rt.lt((cur_note = subtract((yield* g.call(f, P("/proc/text2ascii"), null, [live(note)])), 96)), 1) || rt.gt(live(cur_note), 7))) {
						continue;
					}
					i_7 = null;
					rt.forRange(f, 3, 2, (yield* g.call(f, P("/proc/lentext"), null, [live(note)])), 1);
					while (($e = rt.next(f, 3)) !== undefined) {
						i_7 = $e;
						if (!truthy((yield* g.call(f, P("/proc/text2num"), null, [(ni = (yield* g.call(f, P("/proc/copytext"), null, [live(note), live(i_7), add(live(i_7), 1)])))])))) {
							if (((isEqual(live(ni), "#") || isEqual(live(ni), "b")) || isEqual(live(ni), "n"))) {
								rt.setAt(live(cur_acc), live(cur_note), live(ni));
							} else {
								if (isEqual(live(ni), "s")) {
									rt.setAt(live(cur_acc), live(cur_note), "#");
								}
							}
						} else {
							rt.setAt(live(cur_oct), live(cur_note), (yield* g.call(f, P("/proc/text2num"), null, [live(ni)])));
						}
					}
					rt.endFor(f, 3);
					if ((rt.gt(rt.fv(f, "dizziness", live(user)), 0) && truthy(rt.op(f, "Prob", [], [divide(rt.fv(f, "dizziness", live(user)), 2)])))) {
						cur_note = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(live(cur_note), (yield* g.call(f, P("/proc/rand"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(rt.neg(rt.fv(f, "dizziness", live(user))), 10)])), (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "dizziness", live(user)), 10)]))]))), 7]))]));
					}
					if ((rt.gt(rt.fv(f, "dizziness", live(user)), 0) && truthy(rt.op(f, "Prob", [], [divide(rt.fv(f, "dizziness", live(user)), 5)])))) {
						if (truthy(rt.op(f, "Prob", [], [30]))) {
							rt.setAt(live(cur_acc), live(cur_note), "#");
						} else {
							if (truthy(rt.op(f, "Prob", [], [42]))) {
								rt.setAt(live(cur_acc), live(cur_note), "b");
							} else {
								if (truthy(rt.op(f, "Prob", [], [75]))) {
									rt.setAt(live(cur_acc), live(cur_note), "n");
								}
							}
						}
					}
					yield* g.srcCall(f, "playnote", live(cur_note), rt.index(live(cur_acc), live(cur_note)), rt.index(live(cur_oct), live(cur_note)));
				}
				rt.endFor(f, 2);
				if ((rt.ge(rt.len(f, live(notes)), 2) && truthy((yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(notes), 2)]))))) {
					yield* g.call(f, P("/proc/sleep"), null, [(yield* g.srcCall(f, "sanitize_tempo", divide(rt.sv(f, "tempo"), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(notes), 2)])))))]);
				} else {
					yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "tempo")]);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		rt.incSrcVar(f, "repeat", -1, true);
	}
	rt.setSv(f, "playing", 0);
	rt.setSv(f, "repeat", 0);
	yield* g.srcCall(f, "updateDialog", live(user));
	return f.dot;
}, true);

// /datum/song/proc/interact  (code/game/objects/structures/musician.dm:130)  may sleep
rt.def("/datum/song/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, bpm: Value = null, linecount: Value = null, line: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, dat, bpm, linecount, line, popup, $0, $e];
	dat = "";
	if (rt.gt(rt.len(f, rt.sv(f, "lines")), 0)) {
		dat = rt.modify(live(dat), "<H3>Playback</H3>", add);
		if (!truthy(rt.sv(f, "playing"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;play=1'>Play</A> <SPAN CLASS='linkOn'>Stop</SPAN><BR><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), "Repeat Song: ", add);
			if (rt.gt(rt.sv(f, "repeat"), 0)) {
				$0 = fmt("<A href='?src=＃;repeat=-10'>-</A><A href='?src=＃;repeat=-1'>-</A>", [live(f.src), live(f.src)]);
			} else {
				$0 = "<SPAN CLASS='linkOff'>-</SPAN><SPAN CLASS='linkOff'>-</SPAN>";
			}
			dat = rt.modify(live(dat), $0, add);
			dat = rt.modify(live(dat), fmt(" ＀ times ", [rt.sv(f, "repeat")]), add);
			if (rt.lt(rt.sv(f, "repeat"), rt.sv(f, "max_repeats"))) {
				$0 = fmt("<A href='?src=＃;repeat=1'>+</A><A href='?src=＃;repeat=10'>+</A>", [live(f.src), live(f.src)]);
			} else {
				$0 = "<SPAN CLASS='linkOff'>+</SPAN><SPAN CLASS='linkOff'>+</SPAN>";
			}
			dat = rt.modify(live(dat), $0, add);
			dat = rt.modify(live(dat), "<BR>", add);
		} else {
			dat = rt.modify(live(dat), fmt("<SPAN CLASS='linkOn'>Play</SPAN> <A href='?src=＃;stop=1'>Stop</A><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), fmt("Repeats left: <B>＀</B><BR>", [rt.sv(f, "repeat")]), add);
		}
	}
	if (!truthy(rt.sv(f, "edit"))) {
		dat = rt.modify(live(dat), fmt("<BR><B><A href='?src=＃;edit=2'>Show Editor</A></B><BR>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "<H3>Editing</H3>", add);
		dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;edit=1'>Hide Editor</A></B>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt(" <A href='?src=＃;newsong=1'>Start a New Song</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt(" <A href='?src=＃;import=1'>Import a Song</A><BR><BR>", [live(f.src)]), add);
		bpm = (yield* g.call(f, P("/proc/round"), null, [divide(600, rt.sv(f, "tempo"))]));
		dat = rt.modify(live(dat), fmt("Tempo: <A href='?src=＃;tempo=＀'>-</A> ＀ BPM <A href='?src=＃;tempo=-＀'>+</A><BR><BR>", [live(f.src), rt.fv(f, "tick_lag", rt.world()), live(bpm), live(f.src), rt.fv(f, "tick_lag", rt.world())]), add);
		linecount = 0;
		line = null;
		rt.forList(f, 0, rt.sv(f, "lines"));
		while (($e = rt.next(f, 0)) !== undefined) {
			line = $e;
			dat = rt.modify(live(dat), fmt("Line ＀: <A href='?src=＃;modifyline=＀'>Edit</A> <A href='?src=＃;deleteline=＀'>X</A> ＀<BR>", [(linecount = rt.modify(live(linecount), 1, add)), live(f.src), live(linecount), live(f.src), live(linecount), live(line)]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;newline=1'>Add Line</A><BR><BR>", [live(f.src)]), add);
		if (truthy(rt.sv(f, "help"))) {
			dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;help=1'>Hide Help</A></B><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), "\n\t\t\t\t\tLines are a series of chords, separated by commas (,), each with notes seperated by hyphens (-).<br>\n\t\t\t\t\tEvery note in a chord will play together, with chord timed by the tempo.<br>\n\t\t\t\t\t<br>\n\t\t\t\t\tNotes are played by the names of the note, and optionally, the accidental, and/or the octave number.<br>\n\t\t\t\t\tBy default, every note is natural and in octave 3. Defining otherwise is remembered for each note.<br>\n\t\t\t\t\tExample: <i>C,D,E,F,G,A,B</i> will play a C major scale.<br>\n\t\t\t\t\tAfter a note has an accidental placed, it will be remembered: <i>C,C4,C,C3</i> is C3,C4,C4,C3</i><br>\n\t\t\t\t\tChords can be played simply by seperating each note with a hyphon: <i>A-C#,Cn-E,E-G#,Gn-B</i><br>\n\t\t\t\t\tA pause may be denoted by an empty chord: <i>C,E,,C,G</i><br>\n\t\t\t\t\tTo make a chord be a different time, end it with /x, where the chord length will be length<br>\n\t\t\t\t\tdefined by tempo / x: <i>C,G/2,E/4</i><br>\n\t\t\t\t\tCombined, an example is: <i>E-E4/4,F#/2,G#/8,B/8,E3-E4/4</i>\n\t\t\t\t\t<br>\n\t\t\t\t\tLines may be up to 50 characters.<br>\n\t\t\t\t\tA song may only contain up to 50 lines.<br>\n\t\t\t\t\t", add);
		} else {
			dat = rt.modify(live(dat), fmt("<B><A href='?src=＃;help=2'>Show Help</A></B><BR>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "instrument", rt.fv(f, "name", rt.sv(f, "instrumentObj")), 700, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", rt.sv(f, "instrumentObj")), rt.fv(f, "icon_state", rt.sv(f, "instrumentObj"))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /datum/song/proc/ParseSong  (code/game/objects/structures/musician.dm:188)  may sleep
rt.def("/datum/song/proc/ParseSong", function* ParseSong(f: Frame, text: Value) {
	let linenum: Value = null, l: Value = null;
	let $e: any;
	f.vars = () => [text, linenum, l, $e];
	rt.setSv(f, "lines", (yield* g.call(f, P("/proc/splittext"), null, [live(text), "\n"])));
	if (!truthy(rt.len(f, rt.sv(f, "lines")))) return f.dot;
	if (isEqual((yield* g.call(f, P("/proc/copytext"), null, [rt.index(rt.sv(f, "lines"), 1), 1, 6])), "BPM: ")) {
		rt.setSv(f, "tempo", (yield* g.srcCall(f, "sanitize_tempo", divide(600, (yield* g.call(f, P("/proc/text2num"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.index(rt.sv(f, "lines"), 1), 6]))]))))));
		yield* g.callName(f, rt.sv(f, "lines"), "Cut", [1, 2]);
	} else {
		rt.setSv(f, "tempo", (yield* g.srcCall(f, "sanitize_tempo", 5)));
	}
	if (rt.gt(rt.len(f, rt.sv(f, "lines")), 50)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Too many lines!"]);
		yield* g.callName(f, rt.sv(f, "lines"), "Cut", [51]);
	}
	linenum = 1;
	l = null;
	rt.forList(f, 0, rt.sv(f, "lines"));
	while (($e = rt.next(f, 0)) !== undefined) {
		l = $e;
		if (rt.gt((yield* g.call(f, P("/proc/lentext"), null, [live(l)])), 50)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Line ＀ too long!", [live(linenum)])]);
			yield* g.callName(f, rt.sv(f, "lines"), "Remove", [live(l)]);
		} else {
			linenum = rt.inc(live(linenum), 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "updateDialog", live(f.usr));
	return f.dot;
}, true, { waitfor: false });

// /datum/song/proc/Topic  (code/game/objects/structures/musician.dm:208)  may sleep
rt.def("/datum/song/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t: Value = null, cont: Value = null, newline: Value = null, num: Value = null, content: Value = null;
	f.vars = () => [href, href_list, t, cont, newline, num, content];
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [rt.sv(f, "instrumentObj")])))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=instrument"], false);
		yield* g.callName(f, live(f.usr), "unset_machine", []);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "instrumentObj"), "add_fingerprint", [live(f.usr)]);
	if (truthy(rt.at(live(href_list), "newsong"))) {
		rt.setSv(f, "lines", (yield* g.new_(f, T("/list"), [])));
		rt.setSv(f, "tempo", (yield* g.srcCall(f, "sanitize_tempo", 5)));
		rt.setSv(f, "name", "");
	} else {
		if (truthy(rt.at(live(href_list), "import"))) {
			t = "";
			while (true) {
				t = (yield* g.call(f, P("/proc/html_encode"), null, [(yield* g.op(f, "Prompt", [64], [live(t), fmt("＀", [rt.sv(f, "name")]), "Please paste the entire song, formatted:", live(f.usr), null]))]));
				if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "instrumentObj"), live(f.usr)])), 1)) {
					return live(f.dot);
				}
				if (rt.ge((yield* g.call(f, P("/proc/lentext"), null, [live(t)])), 3072)) {
					if (isEqual((cont = (yield* g.op(f, "Prompt", [0], ["yes", "", "Your message is too long! Would you like to continue editing it?", live(f.usr), rt.list("yes", "no")]))), "no")) {
						break;
					}
				}
				if (!rt.gt((yield* g.call(f, P("/proc/lentext"), null, [live(t)])), 3072)) break;
			}
			yield* g.srcCall(f, "ParseSong", live(t));
		} else {
			if (truthy(rt.at(live(href_list), "help"))) {
				rt.setSv(f, "help", subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "help")])), 1));
			} else {
				if (truthy(rt.at(live(href_list), "edit"))) {
					rt.setSv(f, "edit", subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "edit")])), 1));
				}
			}
		}
	}
	if (truthy(rt.at(live(href_list), "repeat"))) {
		if (truthy(rt.sv(f, "playing"))) {
			return live(f.dot);
		}
		if (rt.lt((rt.modSrcVar(f, "repeat", (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "repeat")]))])), add)), 0)) {
			rt.setSv(f, "repeat", 0);
		}
		if (rt.gt(rt.sv(f, "repeat"), rt.sv(f, "max_repeats"))) {
			rt.setSv(f, "repeat", rt.sv(f, "max_repeats"));
		}
	} else {
		if (truthy(rt.at(live(href_list), "tempo"))) {
			rt.setSv(f, "tempo", (yield* g.srcCall(f, "sanitize_tempo", add(rt.sv(f, "tempo"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "tempo")]))))));
		} else {
			if (truthy(rt.at(live(href_list), "play"))) {
				rt.setSv(f, "playing", 1);
				rt.spawnTail(f, 0, "/datum/song/proc/Topic: spawn at game/objects/structures/musician.dm:254", href, href_list, t, cont, newline, num, content);
			} else {
				if (truthy(rt.at(live(href_list), "newline"))) {
					if ((!truthy((newline = (yield* g.call(f, P("/proc/html_encode"), null, [(yield* g.op(f, "Prompt", [3], [null, null, rt.fv(f, "name", rt.sv(f, "instrumentObj")), "Enter your line: ", null]))])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "instrumentObj"), live(f.usr)])), 1))) {
						return live(f.dot);
					}
					if (rt.gt(rt.len(f, rt.sv(f, "lines")), 50)) {
						return live(f.dot);
					}
					if (rt.gt((yield* g.call(f, P("/proc/lentext"), null, [live(newline)])), 50)) {
						newline = (yield* g.call(f, P("/proc/copytext"), null, [live(newline), 1, 50]));
					}
					yield* g.callName(f, rt.sv(f, "lines"), "Add", [live(newline)]);
				} else {
					if (truthy(rt.at(live(href_list), "deleteline"))) {
						if ((rt.gt((num = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "deleteline")]))]))), rt.len(f, rt.sv(f, "lines"))) || rt.lt(live(num), 1))) {
							return live(f.dot);
						}
						yield* g.callName(f, rt.sv(f, "lines"), "Cut", [live(num), add(live(num), 1)]);
					} else {
						if (truthy(rt.at(live(href_list), "modifyline"))) {
							num = (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "modifyline")])), 1]));
							if ((!truthy((content = (yield* g.call(f, P("/proc/html_encode"), null, [(yield* g.op(f, "Prompt", [3], [null, rt.index(rt.sv(f, "lines"), live(num)), rt.fv(f, "name", rt.sv(f, "instrumentObj")), "Enter your line: ", null]))])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "instrumentObj"), live(f.usr)])), 1))) {
								return live(f.dot);
							}
							if (rt.gt((yield* g.call(f, P("/proc/lentext"), null, [live(content)])), 50)) {
								content = (yield* g.call(f, P("/proc/copytext"), null, [live(content), 1, 50]));
							}
							if ((rt.gt(live(num), rt.len(f, rt.sv(f, "lines"))) || rt.lt(live(num), 1))) {
								return live(f.dot);
							}
							rt.setAt(rt.sv(f, "lines"), live(num), live(content));
						} else {
							if (truthy(rt.at(live(href_list), "stop"))) {
								rt.setSv(f, "playing", 0);
							}
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateDialog", live(f.usr));
	return live(f.dot);
}, true);

// a spawn(0) body of /datum/song/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/song/proc/Topic: spawn at game/objects/structures/musician.dm:254", function* (f: Frame, href: Value, href_list: Value, t: Value, cont: Value, newline: Value, num: Value, content: Value) {
	f.vars = () => [href, href_list, t, cont, newline, num, content];
	yield* g.srcCall(f, "playsong", live(f.usr));
	return null;
});

// /datum/song/proc/sanitize_tempo  (code/game/objects/structures/musician.dm:291)
rt.def("/datum/song/proc/sanitize_tempo", function sanitize_tempo(f: Frame, new_tempo: Value) {
	f.vars = () => [new_tempo];
	return rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/round"), null, [(new_tempo = rt.op(f, "Abs", [], [live(new_tempo)])), rt.fv(f, "tick_lag", rt.world())]), rt.fv(f, "tick_lag", rt.world())]);
});

rt.type(1837, "/datum/song/handheld", "/datum/song", {});

// /datum/song/handheld/proc/updateDialog  (code/game/objects/structures/musician.dm:298)  may sleep
rt.def("/datum/song/handheld/proc/updateDialog", function* updateDialog(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "instrumentObj"), "interact", [live(user)]);
	return f.dot;
}, true);

// /datum/song/handheld/proc/shouldStopPlaying  (code/game/objects/structures/musician.dm:302)
rt.def("/datum/song/handheld/proc/shouldStopPlaying", function shouldStopPlaying(f: Frame) {
	if (truthy(rt.sv(f, "instrumentObj"))) {
		return (!truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "instrumentObj")), T("/mob/living")) ? 1 : 0)) ? 1 : 0);
	}
	return 1;
});

rt.type(12819, "/obj/structure/piano", "/obj/structure", {
	song: null,
	anchored: 1,
	name: "space minimoog",
	icon: rt.rsc("icons/obj/musician.dmi"),
	icon_state: "minimoog",
	density: 1,
});

// /obj/structure/piano/proc/New  (code/game/objects/structures/musician.dm:320)  may sleep
rt.def("/obj/structure/piano/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "song", (yield* g.new_(f, T("/datum/song"), ["piano", live(f.src)])));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		rt.setSv(f, "name", "space minimoog");
		rt.setSv(f, "desc", "This is a minimoog, like a space piano, but more spacey!");
		rt.setSv(f, "icon_state", "minimoog");
	} else {
		rt.setSv(f, "name", "space piano");
		rt.setSv(f, "desc", "This is a space piano, like a regular piano, but always in tune! Even if the musician isn't.");
		rt.setSv(f, "icon_state", "piano");
	}
	return f.dot;
}, true);

// /obj/structure/piano/proc/Destroy  (code/game/objects/structures/musician.dm:333)  may sleep
rt.def("/obj/structure/piano/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "song")]);
	rt.setSv(f, "song", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/piano/proc/Initialize  (code/game/objects/structures/musician.dm:338)
rt.def("/obj/structure/piano/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	rt.setFv(f, "tempo", rt.sv(f, "song"), rt.callName(f, rt.sv(f, "song"), "sanitize_tempo", [rt.fv(f, "tempo", rt.sv(f, "song"))]));
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/piano/proc/attack_hand  (code/game/objects/structures/musician.dm:343)  may sleep
rt.def("/obj/structure/piano/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return 1;
	}
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/structure/piano/proc/attack_paw  (code/game/objects/structures/musician.dm:349)  may sleep
rt.def("/obj/structure/piano/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /obj/structure/piano/proc/interact  (code/game/objects/structures/musician.dm:352)  may sleep
rt.def("/obj/structure/piano/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(live(user)) || !truthy(rt.sv(f, "anchored")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "song"), "interact", [live(user)]);
	return f.dot;
}, true);

// /obj/structure/piano/proc/attackby  (code/game/objects/structures/musician.dm:359)  may sleep
rt.def("/obj/structure/piano/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'> You begin to tighten ％！ to the floor...</span>", [live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ tightens ％！'s casters.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You tighten ％！'s casters. Now it can be played again.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
				rt.setSv(f, "anchored", 1);
			}
		} else {
			if (truthy(rt.sv(f, "anchored"))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'> You begin to loosen ％！'s casters...</span>", [live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ loosens ％！'s casters.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You loosen ％！. Now it can be pulled somewhere else.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
					rt.setSv(f, "anchored", 0);
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });
