// Gemini's API sometimes returns "503 Service Unavailable" when Google's
// servers are getting hit with high demand - this is temporary and
// usually clears up within a few seconds on its own. Without this,
// every 503 immediately fails the whole generation (wasting the user's
// credit and time) even though trying again a moment later would have
// worked. This retries a few times with a short, growing wait in
// between before finally giving up.
export async function generateWithRetry(
  model: { generateContent: (prompt: string) => Promise<any> },
  prompt: string,
  maxRetries = 3
) {

  let lastError: any;


  for (let attempt = 0; attempt < maxRetries; attempt++) {

    try {

      return await model.generateContent(prompt);

    } catch (error: any) {

      lastError = error;

      const message = String(error?.message || "");

      const isOverloaded =
        error?.status === 503 ||
        /503|overloaded|unavailable|high demand/i.test(message);

      // Only retry when Google's own servers are overloaded. Any other
      // error (bad prompt, invalid API key, quota exceeded) will just
      // fail the exact same way again, so there's no point waiting and
      // retrying those - fail immediately instead.
      if (!isOverloaded || attempt === maxRetries - 1) {

        throw error;

      }

      console.log(
        `GEMINI 503 - retrying (attempt ${attempt + 1}/${maxRetries})...`
      );

      const delaySeconds = 2 * Math.pow(2, attempt); // 2s, then 4s, then 8s

      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));

    }

  }


  throw lastError;

}
