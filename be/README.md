# Backend (be) – City Library Archives API

Node.js (Express 5) + MySQL + MongoDB hybrid backend.

## Backend / Database setup

1. **Copy environment file**
   - Copy `be/.env.example` to `be/.env`.
   - Set `DB_PASSWORD` (and any other vars if not using defaults).  
     If using the provided Docker Compose, MySQL root password is `root` and database is `library`.

2. **Start MySQL and MongoDB**
   - **Option A (Docker):** From the repo root run:
     ```bash
     docker-compose up -d
     ```
     This starts MySQL on port 3306 and MongoDB on port 27017.
   - **Option B:** Install and run MySQL 8 and MongoDB 7 locally.

3. **Initialize MySQL schema**
   - Run the init script to create the `library` database, tables, and stored procedures:
     ```bash
     mysql -u root -p < be/sql/init.sql
     ```
     If using Docker:
     ```bash
     docker exec -i $(docker ps -qf "ancestor=mysql:8") mysql -u root -proot < be/sql/init.sql
     ```
     (Or use the container name instead of the filter.)

4. **Run the backend**
   - From `be/`:
     ```bash
     npm install
     npm run dev
     ```
   - Confirm health: `GET http://localhost:5000/api/health` should return `mysql: "connected"` and `mongodb: "connected"`.

## API overview

- **Auth:** `POST /api/auth/login/member`, `POST /api/auth/login/staff`
- **Catalog:** `GET /api/catalog`, `GET /api/catalog/:id`
- **Telemetry:** `POST /api/log`
- **Circulation:** `POST /api/borrow`, `POST /api/return`
- **Members:** `POST /api/members/register`
- **Fines:** `GET /api/fines/unpaid`, `PUT /api/fines/settle/:fine_id`
- **Ingest:** `POST /api/books/ingest`

See route files in `be/src/routes/` for request/response shapes.
