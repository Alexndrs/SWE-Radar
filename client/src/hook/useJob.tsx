import { useContext } from 'react';
import { JobContext } from '@/context/jobContext';

export function useConversation() {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJob must be used within a JobProvider');
    }
    return context;
}