<?php

namespace App\Models;

use App\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $user_id
 */
class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'completed_at',
        'user_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'due_date' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the activities for the task.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(TaskActivity::class);
    }

    /**
     * Scope a query to only include tasks with a specific status.
     */
    public function scopeStatus(Builder $query, string $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope a query to only include open tasks.
     */
    public function scopeOpen(Builder $query): void
    {
        $query->where('status', TaskStatus::OPEN);
    }

    /**
     * Scope a query to only include closed tasks.
     */
    public function scopeClosed(Builder $query): void
    {
        $query->where('status', TaskStatus::CLOSED);
    }

    /**
     * Scope a query to filter tasks by due date.
     */
    public function scopeDueDate(Builder $query, string $filter): void
    {
        $today = now()->startOfDay();

        match ($filter) {
            'today' => $query->whereDate('due_date', $today),
            'this_week' => $query->whereBetween('due_date', [
                $today,
                $today->copy()->endOfWeek()
            ]),
            'overdue' => $query->where('due_date', '<', $today)
                ->where('status', TaskStatus::OPEN),
            default => $query,
        };
    }

    /**
     * Scope a query to search tasks by title or description.
     */
    public function scopeSearch(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to only include tasks for a specific user.
     */
    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    /**
     * Check if the task is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === TaskStatus::CLOSED;
    }

    /**
     * Check if the task is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->due_date &&
               $this->due_date->isPast() &&
               $this->status === TaskStatus::OPEN;
    }

    /**
     * Mark the task as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => TaskStatus::CLOSED,
            'completed_at' => now(),
        ]);
    }

    /**
     * Reopen the task.
     */
    public function reopen(): void
    {
        $this->update([
            'status' => TaskStatus::OPEN,
            'completed_at' => null,
        ]);
    }

    /**
     * Record an activity for this task.
     */
    public function recordActivity(string $description): TaskActivity
    {
        return $this->activities()->create([
            'description' => $description,
        ]);
    }
}
