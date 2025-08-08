import { createContext } from 'react';
import type { Job } from '@/api/types';

export interface JobContextType {
    jobList: Job[];
    setJobList: React.Dispatch<React.SetStateAction<Job[]>>;
}



export const JobContext = createContext<JobContextType | null>(null);