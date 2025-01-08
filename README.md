# SpiceLab Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).  
The backend for this project is built with ASP.NET Core and can be found at [SpiceAPI](https://github.com/spicegears/spiceapi).

## Getting Started

### 1. Running the Frontend (Next.js)

1. Clone the repository:
   ```bash
   git clone https://github.com/spicegears/spicelab.git
   cd spicelab-frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. Run the development server:
    ```bash
    sudo npm run dev -- -p 80
    # or
    sudo yarn dev -p 80
    # or
    sudo pnpm dev -- -p 80
    ```

4. Open http://localhost in your browser to see the result.

### 2. Running the Backend (ASP.NET Core)

1. Clone the repository:
    ```bash
    git clone https://github.com/spicegears/spiceapi.git
    cd spiceapi
    ```

2. Ensure you have the .NET SDK installed.

3. Run the API on port 8080:
    ```bash
    dotnet run --urls http://localhost:8080
    ```
   
### 3. Open http://localhost in your browser to access the app.