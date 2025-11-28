import React from 'react'
import TaskBoard from '@/components/tasks/task-board'
import { db } from '@/lib/db'
import { TaskBoard as TaskBoardType, TaskLane, Task } from '@/lib/database.types'

type Props = {
    params: { agencyId: string }
}

const TasksPage = async ({ params }: Props) => {
    // TODO: Fetch real data from DB
    // const boards = await db.taskBoard.findMany(...)

    // Mock data for now
    const mockBoard: TaskBoardType = {
        id: 'board-1',
        name: 'Agency Tasks',
        agencyId: params.agencyId,
        subAccountId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    const mockLanes: (TaskLane & { Task: Task[] })[] = [
        {
            id: 'lane-1',
            name: 'To Do',
            boardId: 'board-1',
            order: 0,
            color: '#ef4444',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Task: [
                {
                    id: 'task-1',
                    title: 'Review new client proposal',
                    description: 'Check the pricing and terms.',
                    laneId: 'lane-1',
                    order: 0,
                    assignedUserId: null,
                    dueDate: new Date().toISOString(),
                    tags: ['Urgent', 'Client'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ]
        },
        {
            id: 'lane-2',
            name: 'In Progress',
            boardId: 'board-1',
            order: 1,
            color: '#f59e0b',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Task: []
        },
        {
            id: 'lane-3',
            name: 'Done',
            boardId: 'board-1',
            order: 2,
            color: '#10b981',
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
                agencyId={params.agencyId}
            />
        </div>
    )
}

export default TasksPage
