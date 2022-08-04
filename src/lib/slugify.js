export default function slugify(s) {
	return encodeURIComponent(
		String(s).trim().toLowerCase().replace(/\s+/g, "-"),
	);
}
