import axios from "./axios";

const REASONS = [
    { value: "Spam", label: "Spam" },
    { value: "Harassment", label: "Harassment or bullying" },
    { value: "HateSpeech", label: "Hate speech" },
    { value: "Violence", label: "Violence or dangerous organizations" },
    { value: "Misinformation", label: "Misinformation" },
    { value: "NudityOrSexual", label: "Nudity or sexual content" },
    { value: "IntellectualProperty", label: "Intellectual property violation" },
    { value: "SpamOrMisleading", label: "Spam or misleading content" },
    { value: "Impersonation", label: "Impersonation" },
    { value: "Other", label: "Other" },
];

export const GROUP_REPORT_REASONS = REASONS;

const getReportReasonErrorMessage = (status, serverError) => {
    if (status === 401 || status === 403) {
        return "You are not authorized to perform this action.";
    }
    if (status === 404) {
        return "This group could not be found.";
    }
    if (status === 409 || serverError?.includes("Already")) {
        return "You have already reported this group.";
    }
    return serverError || "Unable to submit your report. Please try again.";
};

const parseServerError = (data) => {
    if (!data) return null;
    if (typeof data === "string") return data;
    return data?.message || data?.error?.message || data?.error || null;
};

/**
 * Reports a group.
 * Maps to POST /api/reports with { reportType: "Group", groupId, reason, details }.
 *
 * @param {{ groupId: number|string, reason: string, details?: string|null }} payload
 * @returns {Promise<{ id: number }>}
 */
export async function reportGroupApi({ groupId, reason, details = null }) {
    try {
        const response = await axios.post("/reports", {
            reportType: "Group",
            groupId,
            reason,
            details,
        });
        return { id: response.data?.id ?? response.data?.Id ?? null };
    } catch (error) {
        const status = error?.response?.status;
        const serverError = parseServerError(error?.response?.data);
        const message = getReportReasonErrorMessage(status, serverError);
        const err = new Error(message);
        err.status = status;
        err.original = error;
        throw err;
    }
}
