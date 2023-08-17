#!/bin/bash

# Start Supervisor service
service supervisor start

# Reread and update Supervisor configurations
supervisorctl reread
supervisorctl update

# Start Laravel workers
supervisorctl start laravel-worker:*

# Run Apache in the foreground
apache2-foreground
