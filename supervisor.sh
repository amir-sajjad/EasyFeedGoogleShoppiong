#!/bin/bash
supervisorctl reread
supervisorctl update
supervisorctl start laravel-worker:*
supervisorctl restart laravel-worker:*
