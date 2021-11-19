# Nertivia Server

Creating Nertivia server from scratch. The current version is here: <https://github.com/supertiger1234/Nertivia-Server>

## ▶️ Development

### Docker Compose

1. Fork the repo
2. Clone the forked github repo using `git clone`
3. `docker-compose --build -d`
4. Access your server at <http://localhost>

### Plain Docker (Best for development)

Step 4,5 and 5,6 can be skipped if you are already running your own redis and cassandra server elsewhere or already running it.

1. Fork the repo
2. Clone the forked github repo using `git clone`
3. Get the redis image using `docker pull redis:6.2.6` 
4. Run redis using `docker run --name nertivia-redis -d redis:6.2.6`
5. Get the cassandra image using `docker pull cassandra:4.0.1`
6. Run redis using `docker run --name nertivia-cassandra -d cassandra:4.0.1`
7. Run the code using `npm run start:build`
