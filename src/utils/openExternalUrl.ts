export function openExternalUrl(url: string) {
  const cleanedUrl = url.trim();
  if (!cleanedUrl) {
    return false;
  }

  const platform = (Spicetify as any).Platform || {};
  const openers = [
    () => platform.Browser?.openURL?.(cleanedUrl),
    () => platform.Browser?.open?.(cleanedUrl),
    () => platform.ExternalLinkingAPI?.openExternalURL?.(cleanedUrl),
    () => platform.ExternalLinkingAPI?.openExternalLink?.(cleanedUrl),
  ];

  for (const open of openers) {
    try {
      if (open()) {
        return true;
      }
    } catch {}
  }

  try {
    const anchor = document.createElement('a');
    anchor.href = cleanedUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return true;
  } catch {}

  try {
    return window.open(cleanedUrl, '_blank', 'noopener,noreferrer') !== null;
  } catch {
    return false;
  }
}
