// Based on /tg/station's code/game/objects/structures/musician.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


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

// musician.dm:5
rt.def("/datum/song/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.lines = new_(T("/list"));
	return f.dot;
});

// musician.dm:19
rt.def("/datum/song/proc/New", function New(f: Frame, dir: Value, obj: Value) {
	this.tempo = this.sanitize_tempo(this.tempo);
	this.instrumentDir = dir;
	this.instrumentObj = obj;
	return f.dot;
});

// musician.dm:25
rt.def("/datum/song/proc/Destroy", function* Destroy(f: Frame) {
	this.instrumentObj = null;
	return (yield* parent_proc());
}, true);

// musician.dm:32
rt.def("/datum/song/proc/playnote", function playnote(f: Frame, note: Value, acc: Value, oct: Value) {
	let soundfile: Value = null, M: Value = null;
	let $e: any;
	if (acc == "b" && (note == 3 || note == 6)) {
		if (note == 3) {
			oct--;
		}
		note--;
		acc = "n";
	} else if (acc == "#" && (note == 2 || note == 5)) {
		if (note == 2) {
			oct++;
		}
		note++;
		acc = "n";
	} else if (acc == "#" && note == 7) {
		note = 1;
		acc = "b";
	} else if (acc == "#") {
		acc = "b";
		note++;
	}
	let $0: any = (oct < 1 ? 1 : 0);
	if (!$0) {
		if (note == 3) {
			$0 = (oct > 9 ? 1 : 0);
		} else {
			$0 = (oct > 8 ? 1 : 0);
		}
	}
	if ($0) {
		return f.dot;
	}
	if (!fexists((soundfile = file((soundfile = `sound/${this.instrumentDir}/${ascii2text(note + 64)}${acc}${oct}.${this.instrumentExt}`))))) {
		return f.dot;
	}
	let source: Value = rt.getStep(f, this.instrumentObj, 0);
	for (M of each(get_hearers_in_view(15, source), T("/mob"))) {
		if (!M.client || !rt.bitAnd(M.client.prefs.toggles, 128)) {
			continue;
		}
		M.playsound_local(source, soundfile, 100, { falloff: 5 });
	}
	return f.dot;
});

// musician.dm:67
rt.def("/datum/song/proc/updateDialog", function* updateDialog(f: Frame, user: Value) {
	yield* this.instrumentObj.updateDialog();
	return f.dot;
}, true);

// musician.dm:71
rt.def("/datum/song/proc/shouldStopPlaying", function shouldStopPlaying(f: Frame, user: Value) {
	if (this.instrumentObj) {
		if (!user.canUseTopic(this.instrumentObj)) {
			return 1;
		}
		return (!this.instrumentObj.anchored ? 1 : 0);
	}
	return 1;
});

// musician.dm:78
rt.def("/datum/song/proc/playsong", function* playsong(f: Frame, user: Value) {
	let cur_oct: Value = null, cur_acc: Value = null, i: Value = null, line: Value = null, beat: Value = null, notes: Value = null, note: Value = null, cur_note: Value = null, i_7: Value = null, ni: Value = null;
	let $e: any;
	while (this.repeat >= 0) {
		cur_oct = rt.op(f, "CreateMultidimensionalList", [1], [7]);
		cur_acc = rt.op(f, "CreateMultidimensionalList", [1], [7]);
		i = null;
		rt.forRange(f, 0, 1, 7, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			rt.setAt(cur_oct, i, 3);
			rt.setAt(cur_acc, i, "n");
		}
		rt.endFor(f, 0);
		line = null;
		for (line of each(this.lines)) {
			beat = null;
			for (beat of each(splittext(lowertext(line), ","))) {
				notes = splittext(beat, "/");
				note = null;
				for (note of each(splittext(rt.index(notes, 1), "-"))) {
					if (!this.playing || this.shouldStopPlaying(user)) {
						this.playing = 0;
						return f.dot;
					}
					if (lentext(note) == 0) {
						continue;
					}
					if ((cur_note = text2ascii(note) - 96) < 1 || cur_note > 7) {
						continue;
					}
					i_7 = null;
					rt.forRange(f, 3, 2, lentext(note), 1);
					while (($e = rt.next(f, 3)) !== undefined) {
						i_7 = $e;
						if (!text2num((ni = copytext(note, i_7, i_7 + 1)))) {
							if (ni == "#" || ni == "b" || ni == "n") {
								rt.setAt(cur_acc, cur_note, ni);
							} else if (ni == "s") {
								rt.setAt(cur_acc, cur_note, "#");
							}
						} else {
							rt.setAt(cur_oct, cur_note, text2num(ni));
						}
					}
					rt.endFor(f, 3);
					if (user.dizziness > 0 && prob(user.dizziness / 2)) {
						cur_note = max(1, min(cur_note + rand(round(-user.dizziness / 10), round(user.dizziness / 10)), 7));
					}
					if (user.dizziness > 0 && prob(user.dizziness / 5)) {
						if (prob(30)) {
							rt.setAt(cur_acc, cur_note, "#");
						} else if (prob(42)) {
							rt.setAt(cur_acc, cur_note, "b");
						} else if (prob(75)) {
							rt.setAt(cur_acc, cur_note, "n");
						}
					}
					this.playnote(cur_note, rt.index(cur_acc, cur_note), rt.index(cur_oct, cur_note));
				}
				if (rt.len(f, notes) >= 2 && text2num(rt.index(notes, 2))) {
					yield* sleep(this.sanitize_tempo(this.tempo / text2num(rt.index(notes, 2))));
				} else {
					yield* sleep(this.tempo);
				}
			}
		}
		this.repeat--;
	}
	this.playing = 0;
	this.repeat = 0;
	yield* this.updateDialog(user);
	return f.dot;
}, true);

// musician.dm:130
rt.def("/datum/song/proc/interact", function* interact(f: Frame, user: Value) {
	let bpm: Value = null, linecount: Value = null, line: Value = null, popup: Value = null;
	let $0: any, $e: any;
	let dat: Value = "";
	if (rt.len(f, this.lines) > 0) {
		dat += "<H3>Playback</H3>";
		if (!this.playing) {
			dat += fmt("<A href='?src=＃;play=1'>Play</A> <SPAN CLASS='linkOn'>Stop</SPAN><BR><BR>", [this]);
			dat += "Repeat Song: ";
			if (this.repeat > 0) {
				$0 = fmt("<A href='?src=＃;repeat=-10'>-</A><A href='?src=＃;repeat=-1'>-</A>", [this, this]);
			} else {
				$0 = "<SPAN CLASS='linkOff'>-</SPAN><SPAN CLASS='linkOff'>-</SPAN>";
			}
			dat += $0;
			dat += ` ${this.repeat} times `;
			if (this.repeat < this.max_repeats) {
				$0 = fmt("<A href='?src=＃;repeat=1'>+</A><A href='?src=＃;repeat=10'>+</A>", [this, this]);
			} else {
				$0 = "<SPAN CLASS='linkOff'>+</SPAN><SPAN CLASS='linkOff'>+</SPAN>";
			}
			dat += $0;
			dat += "<BR>";
		} else {
			dat += fmt("<SPAN CLASS='linkOn'>Play</SPAN> <A href='?src=＃;stop=1'>Stop</A><BR>", [this]);
			dat += `Repeats left: <B>${this.repeat}</B><BR>`;
		}
	}
	if (!this.edit) {
		dat += fmt("<BR><B><A href='?src=＃;edit=2'>Show Editor</A></B><BR>", [this]);
	} else {
		dat += "<H3>Editing</H3>";
		dat += fmt("<B><A href='?src=＃;edit=1'>Hide Editor</A></B>", [this]);
		dat += fmt(" <A href='?src=＃;newsong=1'>Start a New Song</A>", [this]);
		dat += fmt(" <A href='?src=＃;import=1'>Import a Song</A><BR><BR>", [this]);
		bpm = round(600 / this.tempo);
		dat += fmt("Tempo: <A href='?src=＃;tempo=＀'>-</A> ＀ BPM <A href='?src=＃;tempo=-＀'>+</A><BR><BR>", [this, rt.world().tick_lag, bpm, this, rt.world().tick_lag]);
		linecount = 0;
		for (line of each(this.lines)) {
			dat += fmt("Line ＀: <A href='?src=＃;modifyline=＀'>Edit</A> <A href='?src=＃;deleteline=＀'>X</A> ＀<BR>", [(linecount += 1), this, linecount, this, linecount, line]);
		}
		dat += fmt("<A href='?src=＃;newline=1'>Add Line</A><BR><BR>", [this]);
		if (this.help) {
			dat += fmt("<B><A href='?src=＃;help=1'>Hide Help</A></B><BR>", [this]);
			dat += "\n\t\t\t\t\tLines are a series of chords, separated by commas (,), each with notes seperated by hyphens (-).<br>\n\t\t\t\t\tEvery note in a chord will play together, with chord timed by the tempo.<br>\n\t\t\t\t\t<br>\n\t\t\t\t\tNotes are played by the names of the note, and optionally, the accidental, and/or the octave number.<br>\n\t\t\t\t\tBy default, every note is natural and in octave 3. Defining otherwise is remembered for each note.<br>\n\t\t\t\t\tExample: <i>C,D,E,F,G,A,B</i> will play a C major scale.<br>\n\t\t\t\t\tAfter a note has an accidental placed, it will be remembered: <i>C,C4,C,C3</i> is C3,C4,C4,C3</i><br>\n\t\t\t\t\tChords can be played simply by seperating each note with a hyphon: <i>A-C#,Cn-E,E-G#,Gn-B</i><br>\n\t\t\t\t\tA pause may be denoted by an empty chord: <i>C,E,,C,G</i><br>\n\t\t\t\t\tTo make a chord be a different time, end it with /x, where the chord length will be length<br>\n\t\t\t\t\tdefined by tempo / x: <i>C,G/2,E/4</i><br>\n\t\t\t\t\tCombined, an example is: <i>E-E4/4,F#/2,G#/8,B/8,E3-E4/4</i>\n\t\t\t\t\t<br>\n\t\t\t\t\tLines may be up to 50 characters.<br>\n\t\t\t\t\tA song may only contain up to 50 lines.<br>\n\t\t\t\t\t";
		} else {
			dat += fmt("<B><A href='?src=＃;help=2'>Show Help</A></B><BR>", [this]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "instrument", this.instrumentObj.name, 700, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.instrumentObj.icon, this.instrumentObj.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// musician.dm:188
rt.def("/datum/song/proc/ParseSong", function* ParseSong(f: Frame, text: Value) {
	let l: Value = null;
	this.lines = splittext(text, "\n");
	if (!rt.len(f, this.lines)) return f.dot;
	if (copytext(rt.index(this.lines, 1), 1, 6) == "BPM: ") {
		this.tempo = this.sanitize_tempo(600 / text2num(copytext(rt.index(this.lines, 1), 6)));
		this.lines.Cut(1, 2);
	} else {
		this.tempo = this.sanitize_tempo(5);
	}
	if (rt.len(f, this.lines) > 50) {
		to_chat(f.usr, "Too many lines!");
		this.lines.Cut(51);
	}
	let linenum: Value = 1;
	for (l of each(this.lines)) {
		if (lentext(l) > 50) {
			to_chat(f.usr, `Line ${linenum} too long!`);
			yield* this.lines.Remove(l);
		} else {
			linenum++;
		}
	}
	yield* this.updateDialog(f.usr);
	return f.dot;
}, true, { waitfor: false });

// musician.dm:208
rt.def("/datum/song/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t: Value = null, cont: Value = null, newline: Value = null, num: Value = null, content: Value = null;
	if (!f.usr.canUseTopic(this.instrumentObj)) {
		rt.op(f, "Browse", [], [f.usr, null, "window=instrument"], false);
		yield* f.usr.unset_machine();
		return f.dot;
	}
	yield* this.instrumentObj.add_fingerprint(f.usr);
	if (rt.at(href_list, "newsong")) {
		this.lines = (yield* new_(T("/list")));
		this.tempo = this.sanitize_tempo(5);
		this.name = "";
	} else if (rt.at(href_list, "import")) {
		t = "";
		while (true) {
			t = html_encode((yield* g.op(f, "Prompt", [64], [t, `${this.name}`, "Please paste the entire song, formatted:", f.usr, null])));
			if (!(get_dist(this.instrumentObj, f.usr) <= 1)) {
				return f.dot;
			}
			if (lentext(t) >= 3072) {
				if ((cont = (yield* g.op(f, "Prompt", [0], ["yes", "", "Your message is too long! Would you like to continue editing it?", f.usr, list("yes", "no")]))) == "no") {
					break;
				}
			}
			if (!(lentext(t) > 3072)) break;
		}
		yield* this.ParseSong(t);
	} else if (rt.at(href_list, "help")) {
		this.help = text2num(rt.at(href_list, "help")) - 1;
	} else if (rt.at(href_list, "edit")) {
		this.edit = text2num(rt.at(href_list, "edit")) - 1;
	}
	if (rt.at(href_list, "repeat")) {
		if (this.playing) {
			return f.dot;
		}
		if ((this.repeat += round(text2num(rt.at(href_list, "repeat")))) < 0) {
			this.repeat = 0;
		}
		if (this.repeat > this.max_repeats) {
			this.repeat = this.max_repeats;
		}
	} else if (rt.at(href_list, "tempo")) {
		this.tempo = this.sanitize_tempo(this.tempo + text2num(rt.at(href_list, "tempo")));
	} else if (rt.at(href_list, "play")) {
		this.playing = 1;
		rt.spawnTail(f, 0, "/datum/song/proc/Topic: spawn at game/objects/structures/musician.dm:254", href, href_list, t, cont, newline, num, content);
	} else if (rt.at(href_list, "newline")) {
		if (!(newline = html_encode((yield* g.op(f, "Prompt", [3], [null, null, this.instrumentObj.name, "Enter your line: ", null])))) || !(get_dist(this.instrumentObj, f.usr) <= 1)) {
			return f.dot;
		}
		if (rt.len(f, this.lines) > 50) {
			return f.dot;
		}
		if (lentext(newline) > 50) {
			newline = copytext(newline, 1, 50);
		}
		this.lines.Add(newline);
	} else if (rt.at(href_list, "deleteline")) {
		if ((num = round(text2num(rt.at(href_list, "deleteline")))) > rt.len(f, this.lines) || num < 1) {
			return f.dot;
		}
		this.lines.Cut(num, num + 1);
	} else if (rt.at(href_list, "modifyline")) {
		num = round(text2num(rt.at(href_list, "modifyline")), 1);
		if (!(content = html_encode((yield* g.op(f, "Prompt", [3], [null, rt.index(this.lines, num), this.instrumentObj.name, "Enter your line: ", null])))) || !(get_dist(this.instrumentObj, f.usr) <= 1)) {
			return f.dot;
		}
		if (lentext(content) > 50) {
			content = copytext(content, 1, 50);
		}
		if (num > rt.len(f, this.lines) || num < 1) {
			return f.dot;
		}
		rt.setAt(this.lines, num, content);
	} else if (rt.at(href_list, "stop")) {
		this.playing = 0;
	}
	yield* this.updateDialog(f.usr);
	return f.dot;
}, true);

// a spawn(0) body of /datum/song/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/song/proc/Topic: spawn at game/objects/structures/musician.dm:254", function* (f: Frame, href: Value, href_list: Value, t: Value, cont: Value, newline: Value, num: Value, content: Value) {
	yield* this.playsong(f.usr);
	return null;
});

// musician.dm:291
rt.def("/datum/song/proc/sanitize_tempo", function sanitize_tempo(f: Frame, new_tempo: Value) {
	return max(round((new_tempo = rt.op(f, "Abs", [], [new_tempo])), rt.world().tick_lag), rt.world().tick_lag);
});

rt.type(1837, "/datum/song/handheld", "/datum/song", {});

// musician.dm:298
rt.def("/datum/song/handheld/proc/updateDialog", function* updateDialog(f: Frame, user: Value) {
	yield* this.instrumentObj.interact(user);
	return f.dot;
}, true);

// musician.dm:302
rt.def("/datum/song/handheld/proc/shouldStopPlaying", function shouldStopPlaying(f: Frame) {
	if (this.instrumentObj) {
		return (!rt.istype(this.instrumentObj.loc, T("/mob/living")) ? 1 : 0);
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

// musician.dm:320
rt.def("/obj/structure/piano/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.song = (yield* new_(T("/datum/song"), "piano", this));
	if (prob(50)) {
		this.name = "space minimoog";
		this.desc = "This is a minimoog, like a space piano, but more spacey!";
		this.icon_state = "minimoog";
	} else {
		this.name = "space piano";
		this.desc = "This is a space piano, like a regular piano, but always in tune! Even if the musician isn't.";
		this.icon_state = "piano";
	}
	return f.dot;
}, true);

// musician.dm:333
rt.def("/obj/structure/piano/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.song);
	this.song = null;
	return (yield* parent_proc());
}, true);

// musician.dm:338
rt.def("/obj/structure/piano/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	parent_proc();
	if (!mapload) return f.dot;
	this.song.tempo = this.song.sanitize_tempo(this.song.tempo);
	return f.dot;
}, false);

// musician.dm:343
rt.def("/obj/structure/piano/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return 1;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// musician.dm:349
rt.def("/obj/structure/piano/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// musician.dm:352
rt.def("/obj/structure/piano/proc/interact", function* interact(f: Frame, user: Value) {
	if (!user || !this.anchored) {
		return f.dot;
	}
	yield* user.set_machine(this);
	yield* this.song.interact(user);
	return f.dot;
}, true);

// musician.dm:359
rt.def("/obj/structure/piano/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/wrench"))) {
		if (!this.anchored && !this.isinspace()) {
			playsound(this.loc, O.usesound, 50, 1);
			to_chat(user, fmt("<span class='notice'> You begin to tighten ％！ to the floor...</span>", [this]));
			if (yield* do_after(user, 20 * O.toolspeed, { target: this })) {
				user.visible_message(fmt("＀ tightens ％！'s casters.", [user, this]), fmt("<span class='notice'>You tighten ％！'s casters. Now it can be played again.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
				this.anchored = 1;
			}
		} else if (this.anchored) {
			playsound(this.loc, O.usesound, 50, 1);
			to_chat(user, fmt("<span class='notice'> You begin to loosen ％！'s casters...</span>", [this]));
			if (yield* do_after(user, 40 * O.toolspeed, { target: this })) {
				user.visible_message(fmt("＀ loosens ％！'s casters.", [user, this]), fmt("<span class='notice'>You loosen ％！. Now it can be pulled somewhere else.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
				this.anchored = 0;
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
