import React from 'react'
import TaskBoard from '@/components/tasks/task-board'
import { TaskBoard as TaskBoardType, TaskLane, Task } from '@/lib/database.types'

type Props = {
    params: { subaccountId: string }
}

const TasksPage = async ({ params }: Props) => {
    // Mock data for now
    const mockBoard: TaskBoardType = {
        id: 'board-sub-1',
        name: 'Subaccount Tasks',
        agencyId: null,
        subAccountId: params.subaccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    const mockLanes: (TaskLane & { Task: Task[] })[] = [
        {
            id: 'lane-sub-1',
            name: 'Backlog',
            boardId: 'board-sub-1',
            order: 0,
            color: '#6366f1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Task: []
        },
        {
            id: 'lane-sub-2',
            name: 'Active',
            boardId: 'board-sub-1',
            order: 1,
            color: '#ec4899',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Task: []
        }
    ]

    return (
        <div className="h-full">
            <TaskBoard
                board={mockBoard}
                lanes={mockLanes}
                subAccountId={params.subaccountId}
            />
        </div>
    )
}

export default TasksPage
