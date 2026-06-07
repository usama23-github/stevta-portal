DEVELOPMENT
// Remove Containers + Volumes
docker compose down -v

// Remove Old Images
docker system prune -a -f

// Rebuild Fresh
docker compose build --no-cache

// Start Project
docker compose up

// background mode
docker compose up -d

// Generate Prisma Client
docker exec -it stevta_backend npx prisma generate

🚀 STEP 7 — Run Migration
docker exec -it stevta_backend npx prisma migrate dev --name init

STAGING
docker compose -f docker-compose.staging.yml up --build

PRODUCTION
docker compose -f docker-compose.prod.yml up --build -d

⚠️ IMPORTANT FOR PRISMA
When running migrations:
Development
NODE_ENV=development npx prisma migrate dev

Production
NODE_ENV=production npx prisma migrate deploy