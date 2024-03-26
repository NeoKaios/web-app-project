if [ -f .env ]
then
  export $(cat .env | grep -v ^# | xargs)
fi
DB_IP=$(docker container inspect db-dev | grep -Po "(?<=\"IPAddress\": \")[0-9].*[0-9]")
mysql -u root -p$MYSQL_ROOT_PASSWORD -P $DB_PORT -h $DB_IP -D $MYSQL_DATABASE
