# Installation
```sh
# Lancer le projet
docker compose up -d
```

## Migrations
```sh
# Exécuter les migrations Prisma depuis le conteneur 'server'
# (service `server` dans docker-compose.yml, working_dir=/app, le code est monté depuis ./api)
docker compose exec server npx prisma migrate dev --name
docker compose exec server npx prisma migrate dev
```

## Générer le Client prisma
```sh
docker compose exec server npx prisma generate
```