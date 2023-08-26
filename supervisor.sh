#!/bin/bash

# Start Supervisor service in the background
service supervisor start

# Give Supervisor some time to initialize
sleep 2

# Reread and update Supervisor configurations
supervisorctl reread
supervisorctl update

# Start Laravel workers
supervisorctl start laravel-worker:*

# Start Apache in the foreground
apache2-foreground
