<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

describe('Authentication', function () {
    beforeEach(function () {
        $this->userData = [
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => 'MySecurePassword123!@#',
            'password_confirmation' => 'MySecurePassword123!@#',
        ];
    });

    describe('POST /api/auth/register', function () {
        it('can register a new user with valid data', function () {
            $response = $this->postJson('/api/auth/register', $this->userData);

            $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'authorization' => [
                        'token',
                        'type',
                        'expires_in'
                    ],
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'email_verified_at',
                        'created_at'
                    ]
                ])
                ->assertJson([
                    'user' => [
                        'name' => 'Test User',
                        'email' => 'test@gmail.com',
                    ]
                ]);

            $this->assertDatabaseHas('users', [
                'name' => 'Test User',
                'email' => 'test@gmail.com',
            ]);

            $user = User::where('email', 'test@gmail.com')->first();
            expect(Hash::check('MySecurePassword123!@#', $user->password))->toBeTrue();
        });

        it('validates required fields', function () {
            $response = $this->postJson('/api/auth/register', []);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'email', 'password']);
        });

        it('validates email format', function () {
            $this->userData['email'] = 'invalid-email';
            $response = $this->postJson('/api/auth/register', $this->userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        });

        it('validates password confirmation', function () {
            $this->userData['password_confirmation'] = 'different';
            $response = $this->postJson('/api/auth/register', $this->userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
        });

        it('validates unique email', function () {
            User::factory()->create(['email' => 'test@gmail.com']);

            $response = $this->postJson('/api/auth/register', $this->userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        });

        it('validates minimum password length', function () {
            $this->userData['password'] = '123';
            $this->userData['password_confirmation'] = '123';

            $response = $this->postJson('/api/auth/register', $this->userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
        });
    });

    describe('POST /api/auth/login', function () {
        beforeEach(function () {
            $this->user = User::factory()->create([
                'email' => 'test@gmail.com',
                'password' => 'MySecurePassword123!@#', // Let the model hash it
            ]);
        });

        it('can login with valid credentials', function () {
            $response = $this->postJson('/api/auth/login', [
                'email' => 'test@gmail.com',
                'password' => 'MySecurePassword123!@#',
            ]);

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'authorization' => [
                        'token',
                        'type',
                        'expires_in'
                    ],
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'email_verified_at',
                        'created_at'
                    ]
                ])
                ->assertJson([
                    'user' => [
                        'email' => 'test@gmail.com',
                    ]
                ]);
        });

        it('rejects invalid credentials', function () {
            $response = $this->postJson('/api/auth/login', [
                'email' => 'test@gmail.com',
                'password' => 'wrong-password',
            ]);

            $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Invalid credentials'
                ]);
        });

        it('validates required fields', function () {
            $response = $this->postJson('/api/auth/login', []);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email', 'password']);
        });

        it('validates email format', function () {
            $response = $this->postJson('/api/auth/login', [
                'email' => 'invalid-email',
                'password' => 'MySecurePassword123!@#',
            ]);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        });

        it('rate limits login attempts', function () {
            // Make 6 requests (limit is 5 per minute)
            for ($i = 0; $i < 6; $i++) {
                $response = $this->postJson('/api/auth/login', [
                    'email' => 'test@gmail.com',
                    'password' => 'wrong-password',
                ]);
            }

            $response->assertStatus(429);
        });
    });

    describe('POST /api/auth/logout', function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->token = auth()->login($this->user);
        });

        it('can logout with valid token', function () {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
            ])->postJson('/api/auth/logout');

            $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Successfully logged out'
                ]);
        });

        it('rejects logout without token', function () {
            $response = $this->postJson('/api/auth/logout');

            $response->assertStatus(401);
        });

        it('rejects logout with invalid token', function () {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer invalid-token',
            ])->postJson('/api/auth/logout');

            $response->assertStatus(401);
        });
    });

    describe('POST /api/auth/refresh', function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->token = auth()->login($this->user);
        });

        it('can refresh token with valid token', function () {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
            ])->postJson('/api/auth/refresh');

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'authorization' => [
                        'token',
                        'type',
                        'expires_in'
                    ]
                ]);

            $newToken = $response->json('authorization.token');
            expect($newToken)->not->toBe($this->token);
        });

        it('rejects refresh without token', function () {
            $response = $this->postJson('/api/auth/refresh');

            $response->assertStatus(401);
        });
    });

    describe('GET /api/auth/me', function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->token = auth()->login($this->user);
        });

        it('returns user data with valid token', function () {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
            ])->getJson('/api/auth/me');

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'email_verified_at',
                        'created_at'
                    ]
                ])
                ->assertJson([
                    'user' => [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                        'email' => $this->user->email,
                    ]
                ]);
        });

        it('rejects request without token', function () {
            $response = $this->getJson('/api/auth/me');

            $response->assertStatus(401);
        });

        it('rejects request with invalid token', function () {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer invalid-token',
            ])->getJson('/api/auth/me');

            $response->assertStatus(401);
        });
    });
});
