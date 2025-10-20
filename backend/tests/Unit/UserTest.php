<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

describe('User Model', function () {
    it('can create a user', function () {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        expect($user->name)->toBe('John Doe');
        expect($user->email)->toBe('john@example.com');
        expect($user->id)->not->toBeNull();
    });

    it('has many tasks', function () {
        $user = User::factory()->create();
        $task1 = $user->tasks()->create([
            'title' => 'Task 1',
            'description' => 'Description 1',
            'priority' => 'high',
        ]);
        $task2 = $user->tasks()->create([
            'title' => 'Task 2',
            'description' => 'Description 2',
            'priority' => 'low',
        ]);

        expect($user->tasks)->toHaveCount(2);
        expect($user->tasks->pluck('title')->toArray())->toContain('Task 1', 'Task 2');
    });

    it('hides password from serialization', function () {
        $user = User::factory()->create();
        $userArray = $user->toArray();

        expect($userArray)->not->toHaveKey('password');
    });

    it('casts email_verified_at to datetime', function () {
        $user = User::factory()->create();

        expect($user->email_verified_at)->toBeInstanceOf(\Carbon\Carbon::class);
    });

    it('has fillable attributes', function () {
        $user = new User();
        $fillable = $user->getFillable();

        expect($fillable)->toContain('name', 'email', 'password');
    });
});
