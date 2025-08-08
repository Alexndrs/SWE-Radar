import React, { useState } from 'react';
import { JobContext } from './jobContext';
import type { Job } from '@/api/types';

interface Props {
    children: React.ReactNode;
}

export const ConvProvider: React.FC<Props> = ({ children }) => {
    const [jobList, setJobList] = useState<Job[]>([]);

    return (
        <JobContext.Provider value={{ jobList, setJobList }}>
            {children}
        </JobContext.Provider>
    );
};
