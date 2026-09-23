// next/og's ImageResponse (used by app/icon.tsx, app/apple-icon.tsx and
// app/opengraph-image.tsx) can't load a font from a <link> tag the way a
// normal web page can - it needs the actual font file bytes handed to it
// directly. This fetches a Google Font's real font file at request time
// so those files can use a real typeface (Fraunces) instead of the
// generic default font.
export async function loadGoogleFont(familyParam: string, text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}&text=${encodeURIComponent(
    text
  )}`;

  const css = await (await fetch(cssUrl)).text();

  const match = css.match(
    /src: url\(([^)]+)\) format\('(opentype|truetype)'\)/
  );

  if (match) {
    const fontResponse = await fetch(match[1]);
    if (fontResponse.status === 200) {
      return await fontResponse.arrayBuffer();
    }
  }

  throw new Error("Failed to load Google Font: " + familyParam);
}
