import React from 'react'
import { db } from '@/lib/db'
import { getAgencyTaskBoardDetails, getAgencyTeamMembers } from '@/lib/queries'
import CalendarClient from './client'

type Props = {
    params: { agencyId: string }
}

const CalendarPage = async ({ params }: Props) => {
    // Fetch agency and tasks
    // We can reuse getAgencyTaskBoardDetails to get all tasks
    // This function returns the board, lanes, and tasks within lanes
    const taskBoard = await getAgencyTaskBoardDetails(params.agencyId)
    const teamMembers = await getAgencyTeamMembers(params.agencyId)

    if (!taskBoard) {
        return <div className="text-muted-foreground p-4">No task board found for this agency.</div>
    }

    // Flatten the tasks from all lanes into a single array passed to client
    // getAgencyTaskBoardDetails returns { ...board, TaskLane: [ { ..., Task: [...] } ] }
    const tasks = taskBoard.TaskLane.flatMap(lane => lane.Task || [])

    return (
        <div className="h-full relative w-full bg-muted/40 p-4">
            <CalendarClient
                agencyId={params.agencyId}
                tasks={tasks} // Pass tasks to client
                teamMembers={teamMembers || []}
            />
        </div>
    )
}

export default CalendarPage
