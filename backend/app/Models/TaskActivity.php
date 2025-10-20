<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskActivity extends Model
{
    /** @use HasFactory<\Database\Factories\TaskActivityFactory> */
    use HasFactory;

    protected $fillable = [
        'task_id',
        'description',
    ];

    /**
     * Get the task that owns the activity.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Format the activity description for display.
     */
    public function getFormattedDescriptionAttribute(): string
    {
        return $this->description;
    }
}
