import React from 'react'
import TaskBoard from '@/components/tasks/task-board'
import { db } from '@/lib/db'
import { TaskBoard as TaskBoardType, TaskLane, Task } from '@/lib/database.types'
import { getAgencyTaskBoardDetails, getAgencyTeamMembers, getAgencyTeams } from '@/lib/queries'

type Props = {
    params: { agencyId: string }
}

const TasksPage = async ({ params }: Props) => {
    const boardDetails = await getAgencyTaskBoardDetails(params.agencyId)
    const teamMembers = await getAgencyTeamMembers(params.agencyId)
    const teams = await getAgencyTeams(params.agencyId)

    if (!boardDetails) {
        return <div className="flex items-center justify-center w-full h-full">Error loading board</div>
    }

    return (
        <div className="h-[calc(100vh-96px)] flex-1 flex flex-col relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <TaskBoard
                board={boardDetails}
                lanes={boardDetails.TaskLane}
                agencyId={params.agencyId}
                teamMembers={teamMembers || []}
                teams={teams}
            />
        </div>
    )
}


export default TasksPage

// Force rebuild

// Force rebuild
