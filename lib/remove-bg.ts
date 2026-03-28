export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(imageBuffer)]);
  formData.append("image_file", blob, "image.png");
  formData.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Remove.bg API error: ${response.status} - ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
