#!/bin/bash

echo "Starting..."
docker-compose down
#docker volume rm ft_transcendence_postgresdb
docker-compose up --build
echo "Chnger le Khliha 3la alah"