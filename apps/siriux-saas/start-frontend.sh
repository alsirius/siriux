#!/bin/bash

echo "Starting Siriux SaaS Frontend..."
cd frontend
npm install
echo "Frontend starting on port 3000..."
./scripts/build-prod.sh
npm start
