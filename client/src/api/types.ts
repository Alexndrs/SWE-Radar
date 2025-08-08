export type Referral = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    linkedin: string;
    position: string;
    company: string;
    status: "pending" | "accepted" | "rejected";
    dateSubmitted: string;
    notes?: string;
}

export type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    datePosted: string;
    dateApplied?: string;
    link: string;
    potentialReferral: Referral[];
}