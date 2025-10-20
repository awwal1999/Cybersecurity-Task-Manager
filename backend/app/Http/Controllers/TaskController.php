<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

class TaskController extends Controller
{
    use AuthorizesRequests;
    /**
     * @OA\Get(
     *     path="/api/tasks",
     *     summary="Get paginated list of tasks",
     *     description="Retrieve a paginated list of tasks for the authenticated user with optional filtering and search",
     *     operationId="getTasks",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter tasks by status",
     *         required=false,
     *         @OA\Schema(type="string", enum={"open", "closed"})
     *     ),
     *     @OA\Parameter(
     *         name="due_date",
     *         in="query",
     *         description="Filter tasks by due date",
     *         required=false,
     *         @OA\Schema(type="string", enum={"today", "this_week", "overdue"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search tasks by title or description",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", minimum=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Task")),
     *             @OA\Property(property="links", type="object"),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::where('user_id', Auth::id())
            ->latest();

        // Apply filters
        if ($request->has('status')) {
            $query->status($request->status);
        }

        if ($request->has('due_date')) {
            $query->dueDate($request->due_date);
        }

        if ($request->has('search')) {
            $query->search($request->search);
        }

        $tasks = $query->paginate(15);

        return TaskResource::collection($tasks)->response();
    }

    /**
     * @OA\Post(
     *     path="/api/tasks",
     *     summary="Create a new task",
     *     description="Create a new task for the authenticated user",
     *     operationId="createTask",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title"},
     *             @OA\Property(property="title", type="string", maxLength=255, example="Review security policies"),
     *             @OA\Property(property="description", type="string", example="Review and update company security policies"),
     *             @OA\Property(property="status", type="string", enum={"open", "closed"}, example="open"),
     *             @OA\Property(property="due_date", type="string", format="date", example="2024-12-31")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Task created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
            'completed_at' => null,
        ]);

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    /**
     * @OA\Get(
     *     path="/api/tasks/{id}",
     *     summary="Get a specific task",
     *     description="Retrieve a specific task by ID for the authenticated user",
     *     operationId="getTask",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        return (new TaskResource($task))->response();
    }

    /**
     * @OA\Put(
     *     path="/api/tasks/{id}",
     *     summary="Update a task",
     *     description="Update a specific task for the authenticated user",
     *     operationId="updateTask",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", maxLength=255, example="Updated task title"),
     *             @OA\Property(property="description", type="string", example="Updated task description"),
     *             @OA\Property(property="status", type="string", enum={"open", "closed"}, example="closed"),
     *             @OA\Property(property="due_date", type="string", format="date", example="2024-12-31")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return (new TaskResource($task))->response();
    }

    /**
     * @OA\Delete(
     *     path="/api/tasks/{id}",
     *     summary="Delete a task",
     *     description="Soft delete a specific task for the authenticated user",
     *     operationId="deleteTask",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=204, description="Task deleted successfully"),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * @OA\Patch(
     *     path="/api/tasks/{id}/complete",
     *     summary="Mark task as complete",
     *     description="Mark a specific task as completed for the authenticated user",
     *     operationId="markTaskComplete",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task marked as complete",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function markComplete(Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task->markAsCompleted();

        return (new TaskResource($task))->response();
    }

    /**
     * @OA\Patch(
     *     path="/api/tasks/{id}/reopen",
     *     summary="Reopen a task",
     *     description="Reopen a completed task for the authenticated user",
     *     operationId="reopenTask",
     *     tags={"Tasks"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Task ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task reopened successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Task not found"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function reopen(Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task->reopen();

        return (new TaskResource($task))->response();
    }
}
