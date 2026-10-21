// tripcode - name#secret -> a short tag, one way, keyed by the server's pepper (tools/server.mjs, admin-check.mjs).
// The same secret always gives the same tag while the pepper file is kept; without the file nobody can test guesses offline.
import crypto from "node:crypto";
import fs from "node:fs";
const ABC = "abcdefghijkmnpqrstuvwxyz23456789"; // 32 signs, no l, o, 0, 1 (easy to misread); lower case, so a ckey keeps the whole tag
export const TAG_LEN = 8; // 40 bits
export function tagOf(pepper, secret) {
	const h = crypto.createHmac("sha256", pepper).update(String(secret)).digest();
	let t = "";
	for (let i = 0; i < TAG_LEN; i++) t += ABC[h[i] & 31];
	return t;
}
/** No file: a fresh pepper each start (tags last one run). A missing file is made (32 random bytes as hex, owner-only). */
export function loadPepper(file) {
	if (!file) return crypto.randomBytes(32);
	if (!fs.existsSync(file)) fs.writeFileSync(file, crypto.randomBytes(32).toString("hex") + "\n", { mode: 0o600, flag: "wx" });
	const hex = fs.readFileSync(file, "utf8").trim();
	if (!/^[0-9a-f]{64}$/.test(hex)) throw new Error(`${file}: not a pepper file (64 hex digits)`);
	return Buffer.from(hex, "hex");
}
