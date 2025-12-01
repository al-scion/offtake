export const getFileHash = async (file: File) => {
	const fileBuffer = await file.arrayBuffer();
	const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
	const sha256 = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return sha256;
};