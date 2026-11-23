// Retry schedule for CCMS lookups, shared by the browser (BillResult) and the
// server (fetchBillJson). Pure, so it can be unit-tested.
//
// Policy: at most MAX_RETRIES retries, only on 429 and timeouts (5xx, network
// errors and a genuine empty bill are not retried), exponential backoff with
// jitter, a Retry-After header honoured when PITC sends one, and the total
// waiting time kept under TOTAL_BUDGET_MS so the visitor is never left staring
// at a spinner.
export const MAX_RETRIES = 2;
export const TOTAL_BUDGET_MS = 8000;
const BASE_MS = 1500;
const MAX_STEP_MS = 4000;

export const RETRYABLE = new Set(["429", "timeout"]);

// Milliseconds to wait before retry number `attempt` (1-based), or null when
// no retry should happen. `waitedMs` is the total already spent waiting.
export function retryDelay({ attempt, cause, retryAfterSec, waitedMs = 0, rand = Math.random }) {
  if (attempt > MAX_RETRIES || !RETRYABLE.has(cause)) return null;
  let ms = Math.min(MAX_STEP_MS, BASE_MS * 2 ** (attempt - 1));
  ms = Math.round(ms * (0.7 + rand() * 0.6)); // jitter: 70% to 130%
  if (Number.isFinite(retryAfterSec) && retryAfterSec > 0) ms = Math.max(ms, Math.round(retryAfterSec * 1000));
  if (waitedMs + ms > TOTAL_BUDGET_MS) return null; // would blow the budget: give up instead
  return ms;
}

// Normalise anything a fetch attempt can produce into one of the causes the
// log records: ok, notfound, 429, timeout, 5xx, network, http.
export function causeOf({ status, error, hasBill } = {}) {
  if (error) {
    const n = error.name || "";
    if (n === "TimeoutError" || n === "AbortError") return "timeout";
    if (error.cause === "network" || n === "TypeError") return "network";
    return "network";
  }
  if (status === 429) return "429";
  if (status >= 500) return "5xx";
  if (status >= 400) return "http";
  return hasBill ? "ok" : "notfound";
}

// Retry-After is seconds or an HTTP date.
export function parseRetryAfter(value) {
  if (!value) return null;
  const s = Number(value);
  if (Number.isFinite(s)) return s;
  const t = Date.parse(value);
  return Number.isFinite(t) ? Math.max(0, (t - Date.now()) / 1000) : null;
}
