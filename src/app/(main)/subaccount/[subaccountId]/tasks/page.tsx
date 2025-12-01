import React from 'react'
import TaskBoard from '@/components/tasks/task-board'
import { TaskBoard as TaskBoardType, TaskLane, Task } from '@/lib/database.types'
import { getSubAccountTeamMembers, getTaskBoardDetails } from '@/lib/queries'

type Props = {
    params: { subaccountId: string }
}

const TasksPage = async ({ params }: Props) => {
    const boardDetails = await getTaskBoardDetails(params.subaccountId)
    const teamMembers = await getSubAccountTeamMembers(params.subaccountId)

    if (!boardDetails) {
        return <div className="flex items-center justify-center w-full h-full">Error loading board</div>
    }

    return (
        <div className="h-full">
            <TaskBoard
                board={boardDetails}
                lanes={boardDetails.TaskLane}
                subAccountId={params.subaccountId}
                teamMembers={teamMembers || []}
            />
        </div>
    )
}

export default TasksPage
