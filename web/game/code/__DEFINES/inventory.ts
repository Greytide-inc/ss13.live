// From code/__DEFINES/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/slotdefine2slotbit  (code/__DEFINES/inventory.dm:60)
rt.def("/proc/slotdefine2slotbit", function slotdefine2slotbit(f: Frame, slotdefine: Value) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = 0;
	$0 = live(slotdefine);
	if ($0 === 1) {
		f.dot = 1024;
	} else if ($0 === 2) {
		f.dot = 32;
	} else if ($0 === 10) {
		f.dot = 8192;
	} else if ($0 === 5) {
		f.dot = 512;
	} else if ($0 === 6) {
		f.dot = 256;
	} else if ($0 === 7) {
		f.dot = 16;
	} else if ($0 === 8) {
		f.dot = 8;
	} else if ($0 === 9) {
		f.dot = 4;
	} else if ($0 === 11) {
		f.dot = 64;
	} else if ($0 === 12) {
		f.dot = 128;
	} else if ($0 === 13) {
		f.dot = 1;
	} else if ($0 === 14) {
		f.dot = 2;
	} else if ($0 === 15 || $0 === 16) {
		f.dot = 2048;
	}
	return f.dot;
});
