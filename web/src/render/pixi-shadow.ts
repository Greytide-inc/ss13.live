// pixi-shadow - the sight shadows (live-sight.ts, sight-shadow-paint.ts) on pixi-view.ts's stage.

import * as PIXI from "pixi.js";
import { TILE_PX } from "./station-client.js";
import type { Prepared } from "./client-scene.js";
import { nearest } from "./pixi-sprites.js";

export function makeShadow(app: PIXI.Application, planes: Map<number, { out: PIXI.Sprite }>) {
	// Sight shadows (live-sight.ts, sight-shadow-paint.ts): the painted canvas stretched over its box of tiles (linear, so soft), above every
	// plane under FULLSCREEN_PLANE (the lighting included), below the fullscreen overlays (blindness, flashes) and the HUD.
	const FULLSCREEN_PLANE = 18;
	const shadowSprite = new PIXI.Sprite();
	let shadowTex: PIXI.Texture | null = null, shadowVer = -1, shadowSize = "", shadowCanvas: HTMLCanvasElement | null = null;
	function placeShadow(p: Prepared, s: number, ox: number, oy: number, cx: number, cy: number): void {
		const sh = p.shadow;
		if (!sh) { shadowSprite.parent?.removeChild(shadowSprite); return; }
		shadowSprite.alpha = p.shadowAlpha ?? 1;
		const size = `${sh.canvas.width}x${sh.canvas.height}`;
		if (size !== shadowSize || sh.canvas !== shadowCanvas) { // the smoothed tg look paints on a canvas of its own
			shadowSize = size; shadowCanvas = sh.canvas;
			shadowTex?.destroy(true);
			const src = new PIXI.CanvasSource({ resource: sh.canvas });
			shadowTex = new PIXI.Texture({ source: sh.crisp ? nearest(src) : src });
			shadowSprite.texture = shadowTex;
		} else if (sh.version !== shadowVer) shadowTex!.source.update();
		shadowVer = sh.version;
		const mx = sh.x0 * TILE_PX, my = -(sh.y0 + sh.h - 1) * TILE_PX; // the box's top-left in map px
		shadowSprite.position.set(s === 1 ? mx - cx : mx * s + ox, s === 1 ? my - cy : my * s + oy);
		shadowSprite.scale.set((s * TILE_PX) / sh.res);
		let at = 0; // after the planes below FULLSCREEN_PLANE (the stage holds one sprite per plane, in plane order)
		for (const [plane, st] of planes) if (plane < FULLSCREEN_PLANE && st.out.parent === app.stage) at = Math.max(at, app.stage.getChildIndex(st.out) + 1);
		app.stage.addChildAt(shadowSprite, at);
	}
	return placeShadow;
}
