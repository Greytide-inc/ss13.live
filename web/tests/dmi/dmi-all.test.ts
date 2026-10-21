// dmi-all.test.ts - Sweep all .dmi files in the repo (icons/) and check for problems
// Usage: npm run test:dmi-all
//
// For each file: check that parseDmiFile succeeds (non-null, no crash), has at least one state,
// all cells fit in the image, image dimensions are whole multiples of icon dimensions, and if a
// state has multiple frames, its delay list has the right length. Crashes/parse failures exit 1;
// other oddities are warnings.

import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { cellRect } from "../../src/dmi/dmi.js";
import { parseDmiFile } from "../../src/dmi/dmi-node.js";

// build/dist/tests/dmi/dmi-all.test.js -> up 4 to web/
let webDir = dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) webDir = dirname(webDir);
const repoRoot = dirname(webDir);

// Recursively find all .dmi files in a directory
function findDmiFiles(baseDir: string): string[] {
	const results: string[] = [];

	function walk(dir: string) {
		try {
			const entries = readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = join(dir, entry.name);
				if (entry.isDirectory()) {
					walk(fullPath);
				} else if (entry.name.endsWith(".dmi")) {
					results.push(fullPath);
				}
			}
		} catch {
			// ignore permission errors
		}
	}

	walk(baseDir);
	return results.sort();
}

// Collect all .dmi files from icons/
const dmiFiles = [
	...findDmiFiles(join(repoRoot, "icons")),
];

let filesChecked = 0;
let filesOK = 0;
let filesWithProblems = 0;
let totalStates = 0;
const problems: string[] = [];
let parseFailures = 0;

// Check each file
for (const filePath of dmiFiles) {
	filesChecked++;
	const relPath = relative(repoRoot, filePath);

	let dmi;
	try {
		dmi = parseDmiFile(filePath);
	} catch (e) {
		filesWithProblems++;
		parseFailures++;
		problems.push(`${relPath}: parse exception: ${e}`);
		continue;
	}

	// Check 1: must return non-null
	if (!dmi) {
		filesWithProblems++;
		parseFailures++;
		problems.push(`${relPath}: parseDmiFile returned null`);
		continue;
	}

	// File didn't crash, so count it
	totalStates += dmi.states.length;

	// Collect warnings (non-fatal)
	const warnings: string[] = [];

	// Check 2: at least one state
	if (dmi.states.length === 0) {
		warnings.push("no states");
	}

	// Check 4: image width/height are whole multiples of icon width/height
	if (dmi.imageWidth % dmi.width !== 0) {
		warnings.push(
			`imageWidth ${dmi.imageWidth} not multiple of width ${dmi.width}`
		);
	}
	if (dmi.imageHeight % dmi.height !== 0) {
		warnings.push(
			`imageHeight ${dmi.imageHeight} not multiple of height ${dmi.height}`
		);
	}

	// Check 3 & 5: for each state, cells fit in image and delay list is correct
	for (const state of dmi.states) {
		// Check 5: if frames > 1, delay list must have one entry per frame
		if (state.frames > 1 && state.delay.length !== state.frames) {
			warnings.push(
				`state "${state.name}": frames=${state.frames} but delay.length=${state.delay.length}`
			);
		}

		// Check 3: every state's cells fit inside the image
		for (const dirCells of state.cells) {
			for (const cellIndex of dirCells) {
				const rect = cellRect(dmi, cellIndex);
				// Check if the cell fits within the image bounds
				if (
					rect.x + rect.w > dmi.imageWidth ||
					rect.y + rect.h > dmi.imageHeight
				) {
					warnings.push(
						`state "${state.name}": cell ${cellIndex} at (${rect.x}, ${rect.y}) size (${rect.w}x${rect.h}) exceeds image (${dmi.imageWidth}x${dmi.imageHeight})`
					);
					break; // only report once per state
				}
			}
		}
	}

	if (warnings.length === 0) {
		filesOK++;
	} else {
		filesWithProblems++;
		problems.push(`${relPath}: ${warnings.join("; ")}`);
	}
}

// Print all problems
for (const problem of problems) {
	console.log(problem);
}

// Print summary
console.log(
	`\n${filesChecked} files checked, ${filesOK} OK, ${filesWithProblems} with problems, ${totalStates} total states`
);

// Exit 1 only if any file failed to parse or crashed
process.exit(parseFailures > 0 ? 1 : 0);
