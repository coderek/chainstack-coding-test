chainstack_image=$(docker images --format "{{.Repository}}" | grep -w chainstack)
if [ -z $chainstack_image ]; then
    docker build -t chainstack .
fi

docker-compose down
docker-compose up -d test_db
test_db_container_id=$(docker-compose ps -q test_db)

while [ -z $test_db_container_id ]
do
    echo "Waiting test_db to be up"
    sleep 1
    test_db_container_id=$(docker-compose ps -q test_db)
done

sleep 2

echo "test db container id $test_db_container_id"
docker exec -i $test_db_container_id psql -U cs -d chainstack < src/db/schema.sql > /dev/null 2>&1
docker exec -i $test_db_container_id psql -U cs -d chainstack < src/db/bootstrap.sql > /dev/null 2>&1

docker-compose up -d test_server
test_server_id=$(docker-compose ps -q test_server)

while [ -z $test_server_id ]
do
    echo "Waiting test_server to be up"
    sleep 1
    test_server_id=$(docker-compose ps -q test_db)
done

docker-compose run test