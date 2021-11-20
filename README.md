# Nertivia Server

Creating Nertivia server from scratch. The current version is here: <https://github.com/supertiger1234/Nertivia-Server>

## ▶️ Development

### Docker Compose

1. Fork the repo
2. Clone the forked GitHub repo using `git clone`
3. `docker-compose --build -d`
4. Access your server at <http://localhost>

### Plain Docker (Best for development)

Step 4,5 and 5,6 can be skipped if you are already running your Redis and PostgreSQL server elsewhere or already running it.

1. Fork the repo
2. Clone the forked GitHub repo using `git clone`
3. Get the Redis image using `docker pull redis:6.2.6` 
4. Run Redis using `docker run --name nertivia-redis -d redis:6.2.6`
5. Get the PostgreSQL image using `docker pull postgres:14.1`
6. Run PostgreSQL using `docker run --name nertivia-postgres -d postgres:14.1`
7. Run `npm run knex:migrate:latest` to get the latest database migrations
8. Run the code using `npm run start:build`
