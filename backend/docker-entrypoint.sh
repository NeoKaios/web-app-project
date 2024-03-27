echo "Waiting for DB to start..."
dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 20s

echo "DB ready, starting app !"
npx nodemon src/index.ts
