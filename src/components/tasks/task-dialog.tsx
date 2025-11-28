'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import TaskEditor from './task-editor' // TODO: Uncomment when editor is ready

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    laneId: string
}

const TaskDialog = ({ open, setOpen, laneId }: Props) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('') // JSON content from editor

    const handleSubmit = async () => {
        // TODO: Save task to DB
        console.log('Saving task:', { title, description, laneId })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>Add a new task to your board.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col gap-4 overflow-y-auto p-1">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                        <Label>Description</Label>
                        <div className="border rounded-md flex-1 min-h-[300px]">
                            {/* <TaskEditor content={description} onChange={setDescription} /> */}
                            <div className="p-4 text-muted-foreground text-sm">
                                Editor component loading...
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Task</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TaskDialog
