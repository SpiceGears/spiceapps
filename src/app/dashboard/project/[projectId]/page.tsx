"use client"
import Overview from '../../../../components/project/Overview';
import List from '../../../../components/project/List';
import { useProjectData } from '../../../../hooks/projectData';

export default function Project({ params }: { params: { projectId: string } }){
    const { projectData, loading, error } = useProjectData(params.projectId);
    console.log(localStorage.getItem('atok'));

    if (loading) return <div className="h-16 bg-white shadow-sm"></div>;
    if (error) {
        return <div className="h-16 bg-white shadow-sm">Error</div>;
    }
    if (!projectData) return <div className="h-16 bg-white shadow-sm"></div>;

    return(
        <List />
    )
}