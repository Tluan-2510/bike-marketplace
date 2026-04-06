<?php

namespace Database;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Schema\Blueprint;

class Migrator
{
    public static function runMigrations(): void
    {
        echo "Running migrations...\n";

        // Create users table
        if (!DB::schema()->hasTable('users')) {
            DB::schema()->create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('phone')->nullable();
                $table->string('password');
                $table->enum('role', ['user', 'seller', 'admin'])->default('user');
                $table->string('avatar_url')->nullable();
                $table->longText('bio')->nullable();
                $table->string('address')->nullable();
                $table->boolean('is_active')->default(1);
                $table->timestamp('email_verified_at')->nullable();
                $table->timestamp('last_login_at')->nullable();
                $table->timestamps();

                $table->index('email');
                $table->index('role');
            });
            echo "✓ Created users table\n";
        } else {
            echo "✓ Users table already exists\n";
        }

        // Create password_reset_tokens table
        if (!DB::schema()->hasTable('password_reset_tokens')) {
            DB::schema()->create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();

                $table->index('email');
            });
            echo "✓ Created password_reset_tokens table\n";
        } else {
            echo "✓ Password reset tokens table already exists\n";
        }

        // Create refresh_tokens table
        if (!DB::schema()->hasTable('refresh_tokens')) {
            DB::schema()->create('refresh_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('token')->unique();
                $table->timestamp('expires_at');
                $table->timestamp('revoked_at')->nullable();
                $table->timestamps();

                $table->index('user_id');
                $table->index('token');
            });
            echo "✓ Created refresh_tokens table\n";
        } else {
            echo "✓ Refresh tokens table already exists\n";
        }

        echo "All migrations completed!\n";
    }
}
