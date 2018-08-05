chainstack_image=$(docker images --format "{{.Repository}}" | grep -w chainstack)
if [ -z $chainstack_image ]; then
    docker build -t chainstack .
fi

docker-compose down
docker-compose up -d db

db_container_id=$(docker-compose ps -q db)
while [ -z $db_container_id ]
do
    echo "Waiting db to be up"
    sleep 1
    db_container_id=$(docker-compose ps -q db)
done

sleep 2
docker exec -i $db_container_id psql -U cs -d chainstack < src/db/schema.sql > /dev/null 2>&1
docker exec -i $db_container_id psql -U cs -d chainstack < src/db/bootstrap.sql > /dev/null 2>&1

docker-compose up -d server
server_id=$(docker-compose ps -q server)

while [ -z $server_id ]
do
    echo "Waiting server to be up"
    sleep 1
    server_id=$(docker-compose ps -q server)
done

echo "Server is running at http://0.0.0.0:3001 now"