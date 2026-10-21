// From code/__HELPERS/files.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/getFiles  (code/__HELPERS/files.dm:3)
rt.def("/client/proc/getFiles", function getFiles(f: Frame) {
	let file: Value = null;
	let $e: any;
	f.vars = () => [file, $e];
	file = null;
	rt.forList(f, 0, f.argsList);
	while (($e = rt.next(f, 0)) !== undefined) {
		file = $e;
		rt.op(f, "BrowseResource", [], [live(f.src), live(file), null], false);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /client/proc/browse_files  (code/__HELPERS/files.dm:7)  may sleep
rt.def("/client/proc/browse_files", function* browse_files(f: Frame, root: Value, max_iterations: Value, valid_extensions: Value) {
	let path: Value = null, i: Value = null, choices: Value = null, choice: Value = null, extensions: Value = null, i_2: Value = null, valid_ext: Value = null;
	let $0: any, $e: any;
	f.vars = () => [root, max_iterations, valid_extensions, path, i, choices, choice, extensions, i_2, valid_ext, $0, $e];
	if (live(root) === null) {
		root = "data/logs/";
	}
	if (live(max_iterations) === null) {
		max_iterations = 10;
	}
	if (live(valid_extensions) === null) {
		valid_extensions = rt.list("txt", "log", "htm", "html");
	}
	path = live(root);
	i = null;
	i = 0;
	while (rt.lt(live(i), live(max_iterations))) {
		choices = (yield* g.call(f, P("/proc/flist"), null, [live(path)]));
		if (!isEqual(live(path), live(root))) {
			yield* g.callName(f, live(choices), "Insert", [1, "/"]);
		}
		blk55: {
			$0 = (choice = (yield* g.op(f, "Prompt", [1], [null, "Download", "Choose a file to access:", live(f.src), live(choices)])));
			if (isEqual($0, null)) {
				return live(f.dot);
			} else if ($0 === "/") {
				path = live(root);
				break blk55;
			}
			if (!isEqual((yield* g.call(f, P("/proc/copytext"), null, [(path = rt.modify(live(path), live(choice), add)), -1, 0])), "/")) {
				break;
			}
		}
		i = rt.inc(live(i), 1);
	}
	extensions = null;
	i_2 = null;
	rt.forList(f, 0, live(valid_extensions));
	while (($e = rt.next(f, 0)) !== undefined) {
		i_2 = $e;
		if (truthy(live(extensions))) {
			extensions = rt.modify(live(extensions), "|", add);
		}
		extensions = rt.modify(live(extensions), fmt("＀", [live(i_2)]), add);
	}
	rt.endFor(f, 0);
	valid_ext = (yield* g.new_(f, T("/regex"), [fmt("\\.(＀)$", [live(extensions)]), "i"]));
	if ((!truthy((yield* g.call(f, P("/proc/fexists"), null, [live(path)]))) || !truthy((yield* g.callName(f, live(valid_ext), "Find", [live(path)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='red'>Error: browse_files(): File not found/Invalid file(＀).</font>", [live(path)])]);
		return live(f.dot);
	}
	return live(path);
}, true);

// /client/proc/file_spam_check  (code/__HELPERS/files.dm:44)
rt.def("/client/proc/file_spam_check", function file_spam_check(f: Frame) {
	let time_to_wait: Value = null;
	f.vars = () => [time_to_wait];
	if (rt.gt((time_to_wait = subtract(rt.gl("fileaccess_timer"), rt.worldTime(f))), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<font color='red'>Error: file_spam_check(): Spam. Please wait ＀ seconds.</font>", [rt.call(f, P("/proc/round"), null, [divide(live(time_to_wait), 10)])])]);
		return 1;
	}
	rt.setGl("fileaccess_timer", add(rt.worldTime(f), 200));
	return 0;
});

// /proc/pathwalk  (code/__HELPERS/files.dm:53)
rt.def("/proc/pathwalk", function pathwalk(f: Frame, path: Value) {
	let jobs: Value = null, filenames: Value = null, current_dir: Value = null, new_filenames: Value = null, new_filename: Value = null;
	let $e: any;
	f.vars = () => [jobs, filenames, current_dir, new_filenames, new_filename, $e];
	jobs = rt.list(live(path));
	filenames = rt.list();
	while (truthy(rt.len(f, live(jobs)))) {
		current_dir = rt.call(f, P("/proc/pop"), null, [live(jobs)]);
		new_filenames = rt.call(f, P("/proc/flist"), null, [live(current_dir)]);
		new_filename = null;
		rt.forList(f, 0, live(new_filenames));
		while (($e = rt.next(f, 0)) !== undefined) {
			new_filename = $e;
			if (truthy(rt.call(f, P("/proc/findtext"), null, [live(new_filename), "/", -1]))) {
				jobs = rt.modify(live(jobs), add(live(current_dir), live(new_filename)), add);
			} else {
				filenames = rt.modify(live(filenames), add(live(current_dir), live(new_filename)), add);
			}
		}
		rt.endFor(f, 0);
	}
	return live(filenames);
});

// /proc/pathflatten  (code/__HELPERS/files.dm:68)
rt.def("/proc/pathflatten", function pathflatten(f: Frame, path: Value) {
	return rt.call(f, P("/proc/replacetext"), null, [live(path), "/", "_"]);
});
