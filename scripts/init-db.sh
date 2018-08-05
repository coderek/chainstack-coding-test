db_container_id=$(docker-compose ps -q db)

docker exec -i $db_container_id psql -U cs -d chainstack < src/db/schema.sql > /dev/null 2>&1
docker exec -i $db_container_id psql -U cs -d chainstack < src/db/bootstrap.sql > /dev/null 2>&1