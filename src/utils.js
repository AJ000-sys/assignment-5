export const NOT_AVAILABLE = "Not available";
export const RATE_LIMIT_MESSAGE =
    "TVmaze is limiting requests right now. Please wait a few seconds and try again.";

export function statusCheck(response) {
    if (response.status === 429) {
        throw new Error(RATE_LIMIT_MESSAGE);
    }
    if (!response.ok) {
        throw new Error(`TVmaze returned an error (status ${response.status}). Please try again.`);
    }
    return response;
}

export function stripHtml(html) {
    if (!html) {
        return "";
    }
    return html.replace(/<[^>]*>/g, "").trim();
}

export function formatUpdated(updated) {
    if (!updated) {
        return NOT_AVAILABLE;
    }
    return new Date(updated * 1000).toLocaleString();
}