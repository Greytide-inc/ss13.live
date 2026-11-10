// Based on /tg/station's code/__HELPERS/files.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// files.dm:3
rt.def("/client/proc/getFiles", function getFiles(f: Frame) {
	let file: Value = null;
	for (file of each(f.argsList)) {
		rt.op(f, "BrowseResource", [], [this, file, null], false);
	}
	return f.dot;
});

// files.dm:7
rt.def("/client/proc/browse_files", function* browse_files(f: Frame, root: Value, max_iterations: Value, valid_extensions: Value) {
	let choices: Value = null, choice: Value = null, extensions: Value = null, i_2: Value = null;
	let $e: any;
	root ??= "data/logs/";
	max_iterations ??= 10;
	valid_extensions ??= list("txt", "log", "htm", "html");
	let path: Value = root;
	let i: Value = 0;
	while (i < max_iterations) {
		choices = flist(path);
		if (path != root) {
			yield* choices.Insert(1, "/");
		}
		blk55: {
			const subject = (choice = (yield* g.op(f, "Prompt", [1], [null, "Download", "Choose a file to access:", this, choices])));
			if (subject == null) {
				return f.dot;
			} else if (subject === "/") {
				path = root;
				break blk55;
			}
			if (copytext((path += choice), -1, 0) != "/") {
				break;
			}
		}
		i++;
	}
	for (i_2 of each(valid_extensions)) {
		if (extensions) {
			extensions += "|";
		}
		extensions += `${i_2}`;
	}
	let valid_ext: Value = (yield* new_(T("/regex"), `\\.(${extensions})$`, "i"));
	if (!fexists(path) || !valid_ext.Find(path)) {
		to_chat(this, `<font color='red'>Error: browse_files(): File not found/Invalid file(${path}).</font>`);
		return f.dot;
	}
	return path;
}, true);

// files.dm:44
rt.def("/client/proc/file_spam_check", function file_spam_check(f: Frame) {
	let time_to_wait: Value = null;
	if ((time_to_wait = GLOB.fileaccess_timer - rt.worldTime(f)) > 0) {
		to_chat(this, `<font color='red'>Error: file_spam_check(): Spam. Please wait ${round(time_to_wait / 10)} seconds.</font>`);
		return 1;
	}
	GLOB.fileaccess_timer = rt.worldTime(f) + FTPDELAY;
	return 0;
});
