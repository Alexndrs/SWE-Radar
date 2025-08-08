import { SERVER_URL } from "./config";
import type { Job } from "./types";


export const getJobs = async (): Promise<Job[]> => {
    const response = await fetch(`${SERVER_URL}/job`);
    if (!response.ok) {
        throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    return data as Job[];
};

export const changeAppliedStatus = async (jobId: string, status: boolean): Promise<void> => {
    const response = await fetch(`${SERVER_URL}/job/${jobId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateApplied: status ? new Date().toISOString() : null }),
    });

    if (!response.ok) {
        throw new Error("Failed to update job status");
    }
}