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

      const isQuotaExceeded =
        error?.status === 429 ||
        /429|quota|too many requests/i.test(message);

      // A quota error means the free plan's DAILY request limit was hit
      // (Google's own suggested "retry in 30s" text is misleading here -
      // in practice this is a per-day cap, not a per-minute one, so
      // retrying moments later just fails again). Nothing client-side
      // can fix this today, so fail right away with a clear, accurate
      // message instead of retrying (and instead of showing Google's
      // raw technical error text to the user).
      if (isQuotaExceeded) {

        throw new Error(
          "You've reached today's free-plan limit for AI generation. This resets once a day - please try again tomorrow, or upgrade your plan for higher limits."
        );

      }

      // Any error that isn't Google being overloaded (bad prompt,
      // invalid API key, etc) will just fail the exact same way again,
      // so there's no point waiting and retrying it - fail immediately
      // instead, with the original error untouched.
      if (!isOverloaded) {

        throw error;

      }

      // Overloaded, but we're out of retries. Google's flash models can
      // stay overloaded for anywhere from a few seconds to (rarely)
      // several hours, and there's nothing this code can do to speed
      // that up - so fail with a clear, friendly message instead of
      // Google's raw technical error text.
      if (attempt === maxRetries - 1) {

        throw new Error(
          "Google's AI service is temporarily overloaded (high demand on their end, not a problem with your account). Please try again in a few minutes."
        );

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
