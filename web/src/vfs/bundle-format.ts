// bundle-format.ts - The on-disk/on-wire shape of a VFS bundle, shared by the bundler
// (src/tools/bundle-vfs.ts) and the runtime loader (vfs.ts).
//
// A bundle is the read-only "base layer" of the virtual file system: everything tg's DM code
// reads at runtime via file2text/fexists/flist/file() with a literal (non-icon/sound) path.
// Which directories are included and why: src/tools/bundle-vfs.ts.
//
// Format: one JSON file. `files` maps a normalized path (forward slashes, no leading "./",
// no leading "/") to its full text content. `dirs` lists every directory that exists in the
// base layer, normalized WITH a trailing slash (including directories that contain no files,
// and including "" for the root). Directories are also derivable from `files`' ancestors, but
// listing them explicitly means a genuinely empty directory still exists for fexists()/flist().
export interface VfsBundle {
	generatedAt: string;
	files: Record<string, string>;
	dirs: string[];
}
