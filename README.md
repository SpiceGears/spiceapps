# SpiceHub
## The full suited management solution for tasks etc.

### Run guide
1. Clone source code
2. Download [Docker Engine and Docker Compose](https://www.docker.com)
3. Adjust envirnoment variables in `docker-compose.yml`
4. Run with
    ```
    docker compose up -d
    ```
5. Visit http://localhost:80 to access the app

## Features
- Interactive dashboard
- Project and task management with easy filtering and sorting
- Shared file system with linking into project's\
    `Current structure of them is intended for internal team use, not suitable for extra large user bases`
- Admin dashboard for user approval and role assingment
- Secure auth via login/password or Authenthicator app
