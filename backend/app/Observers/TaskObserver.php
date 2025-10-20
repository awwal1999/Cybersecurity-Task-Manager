<?php

namespace App\Observers;

use App\Models\Task;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        $task->recordActivity('Task created');
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        // Check if status changed
        if ($task->isDirty('status')) {
            $oldStatus = $task->getOriginal('status');
            $newStatus = $task->status;

            $task->recordActivity(
                "Task status changed from {$oldStatus} to {$newStatus->value}"
            );
        }

        // Check if title or description changed
        if ($task->isDirty(['title', 'description'])) {
            $changes = [];

            if ($task->isDirty('title')) {
                $changes[] = 'title';
            }

            if ($task->isDirty('description')) {
                $changes[] = 'description';
            }

            $task->recordActivity(
                'Task updated: ' . implode(', ', $changes) . ' modified'
            );
        }
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        $task->recordActivity('Task deleted');
    }

    /**
     * Handle the Task "restored" event.
     */
    public function restored(Task $task): void
    {
        $task->recordActivity('Task restored');
    }

    /**
     * Handle the Task "force deleted" event.
     */
    public function forceDeleted(Task $task): void
    {
        //
    }
}
