import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

inject();
injectSpeedInsights();

const EMAIL = 'amkushwa@ttu.edu';
const button = document.getElementById('copy-email');
const copied = document.getElementById('copied');
let timer: number | undefined;

button?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    if (copied) {
      copied.hidden = false;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copied.hidden = true;
      }, 1600);
    }
  } catch {
    window.location.href = `mailto:${EMAIL}`;
  }
});
