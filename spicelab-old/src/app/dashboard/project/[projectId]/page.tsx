"use client"

import { useState } from 'react';
import Main from "@/components/project/Main";
import { useProjectData } from '@/hooks/projectData';
import Loading from '@/components/Loading';

export default function Project({ params }: { params: { projectId: string } }) {
    const [activeTab, setActiveTab] = useState('overview');
    const { projectData, loading, error } = useProjectData(params.projectId);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    if (loading) return <Loading />;
    if (error) {
        return <div className="h-16 bg-white shadow-sm">Error</div>;
    }
    if (!projectData) return <div className="h-16 bg-white shadow-sm"></div>;

    return (
        <Main
            projectId={params.projectId}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        />
    );
}