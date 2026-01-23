'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TaskLane, Task } from '@/lib/types'

export const upsertTaskLane = async (lane: Partial<TaskLane>) => {
    const supabase = createClient()
    if (!lane.boardId) return { error: 'Board ID is required' }

    const { data, error } = await supabase
        .from('TaskLane')
        .upsert(lane)
        .select()
        .single()

    if (error) {
        console.error('Error upserting lane:', error)
        return { error: error.message }
    }

    // Fetch board to get IDs for revalidation
    const { data: board } = await supabase
        .from('TaskBoard')
        .select('subAccountId, agencyId')
        .eq('id', lane.boardId)
        .single()

    if (board?.subAccountId) {
        revalidatePath(`/subaccount/${board.subAccountId}/tasks`)
    } else if (board?.agencyId) {
        revalidatePath(`/agency/${board.agencyId}/tasks`)
    }

    return { data }
}

export const deleteTaskLane = async (laneId: string) => {
    const supabase = createClient()

    // Get boardId before deleting to revalidate
    const { data: lane } = await supabase.from('TaskLane').select('boardId').eq('id', laneId).single()

    const { error } = await supabase.from('TaskLane').delete().eq('id', laneId)

    if (error) {
        console.error('Error deleting lane:', error)
        return { error: error.message }
    }

    if (lane?.boardId) {
        const { data: board } = await supabase.from('TaskBoard').select('subAccountId, agencyId').eq('id', lane.boardId).single()
        if (board?.subAccountId) {
            revalidatePath(`/subaccount/${board.subAccountId}/tasks`)
        } else if (board?.agencyId) {
            revalidatePath(`/agency/${board.agencyId}/tasks`)
        }
    }

    return { data: 'Deleted' }
}

export const upsertTask = async (task: Partial<Task> & { assignees?: string[] }) => {
    const supabase = createClient()
    if (!task.laneId) return { error: 'Lane ID is required' }

    // Separate assignees from task data
    const { assignees, ...taskData } = task

    const { data, error } = await supabase
        .from('Task')
        .upsert(taskData)
        .select()
        .single()

    if (error) {
        console.error('Error upserting task:', error)
        return { error: error.message }
    }

    // Handle assignees if provided
    if (assignees && data) {
        // Delete existing assignees
        const { error: deleteError } = await supabase
            .from('TaskAssignee')
            .delete()
            .eq('taskId', data.id)

        if (deleteError) {
            console.error('Error deleting task assignees:', deleteError)
        }

        // Insert new assignees
        if (assignees.length > 0) {
            const assigneesData = assignees.map(userId => ({
                taskId: data.id,
                userId: userId,
            }))

            const { error: insertError } = await supabase
                .from('TaskAssignee')
                .insert(assigneesData)

            if (insertError) {
                console.error('Error inserting task assignees:', insertError)
            }
        }
    }

    // Get IDs for revalidation
    const { data: lane } = await supabase.from('TaskLane').select('boardId').eq('id', task.laneId).single()
    if (lane?.boardId) {
        const { data: board } = await supabase.from('TaskBoard').select('subAccountId, agencyId').eq('id', lane.boardId).single()
        if (board?.subAccountId) {
            revalidatePath(`/subaccount/${board.subAccountId}/tasks`)
        } else if (board?.agencyId) {
            revalidatePath(`/agency/${board.agencyId}/tasks`)
        }
    }

    return { data }
}

export const deleteTask = async (taskId: string) => {
    const supabase = createClient()

    // Get info for revalidation
    const { data: task } = await supabase.from('Task').select('laneId').eq('id', taskId).single()

    const { error } = await supabase.from('Task').delete().eq('id', taskId)

    if (error) {
        console.error('Error deleting task:', error)
        return { error: error.message }
    }

    if (task?.laneId) {
        const { data: lane } = await supabase.from('TaskLane').select('boardId').eq('id', task.laneId).single()
        if (lane?.boardId) {
            const { data: board } = await supabase.from('TaskBoard').select('subAccountId, agencyId').eq('id', lane.boardId).single()
            if (board?.subAccountId) {
                revalidatePath(`/subaccount/${board.subAccountId}/tasks`)
            } else if (board?.agencyId) {
                revalidatePath(`/agency/${board.agencyId}/tasks`)
            }
        }
    }

    return { data: 'Deleted' }
}

export const updateLaneOrder = async (lanes: TaskLane[]) => {
    const supabase = createClient()
    try {
        const updates = lanes.map((lane) =>
            supabase.from('TaskLane').update({ order: lane.order }).eq('id', lane.id)
        )

        await Promise.all(updates)
        return { data: 'Updated' }
    } catch (error) {
        console.error('Error updating lane order:', error)
        return { error: 'Error updating lane order' }
    }
}

export const updateTaskOrder = async (tasks: Task[]) => {
    const supabase = createClient()
    try {
        const updates = tasks.map((task) =>
            supabase
                .from('Task')
                .update({ order: task.order, laneId: task.laneId })
                .eq('id', task.id)
        )

        await Promise.all(updates)
        return { data: 'Updated' }
    } catch (error) {
        console.error('Error updating task order:', error)
        return { error: 'Error updating task order' }
    }
}
