<?php

namespace App;

use Closure;
use Exception;

class Container
{
    private array $bindings = [];
    private array $instances = [];

    public function bind(string $abstract, Closure|string $concrete = null): void
    {
        if ($concrete === null) {
            $concrete = $abstract;
        }

        $this->bindings[$abstract] = $concrete;
    }

    public function singleton(string $abstract, Closure|string $concrete = null): void
    {
        $this->bind($abstract, $concrete);
    }

    public function instance(string $abstract, $instance): void
    {
        $this->instances[$abstract] = $instance;
    }

    public function make(string $abstract)
    {
        if (isset($this->instances[$abstract])) {
            return $this->instances[$abstract];
        }

        if (!isset($this->bindings[$abstract])) {
            throw new Exception("No binding found for [$abstract]");
        }

        $concrete = $this->bindings[$abstract];

        if ($concrete instanceof Closure) {
            return $concrete($this);
        }

        return new $concrete();
    }

    public function get(string $abstract)
    {
        return $this->make($abstract);
    }
}
