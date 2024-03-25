DB_IP=$(docker container inspect db-dev | grep -Po "(?<=\"IPAddress\": \")[0-9].*[0-9]")
mysql -u root -p -P 3306 -h $DB_IP -D blindtest-db
