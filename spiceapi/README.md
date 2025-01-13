# SpiceAPI

SpiceAPI is a RESTful API for SpiceLab built with ASP.NET Core. It provides all necessary functionality for the app to work, such as token-based auth system and task-based project management. 

## Features

- CRUD operations for data
- Authentication and authorization
- Swagger for API documentation
- Entity Framework Core for database interactions

## Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- For all deployments, PostgreSQL is recommended. 

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/SpiceAPI.git
    cd SpiceAPI
    ```

2. Restore the dependencies:
    ```sh
    dotnet restore
    ```

3. Optional: Set necessary environment variables for Postgres database driver.

4. Run the application:
    ```sh
    dotnet run
    ```

### Usage

- When in Debug deployment, access the API documentation at `http://localhost:5000/swagger`.

