# Notes App - Dockerized CI Pipeline using GitHub Actions

A containerized **Notes Application** built with **Node.js**, **Express.js**, and **MySQL**, automated using **GitHub Actions** for Continuous Integration (CI). The application is containerized with Docker and the Docker image is automatically built, tested, and pushed to Docker Hub whenever changes are pushed to the `main` branch.

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Docker
- Docker Hub
- GitHub Actions
- Git & GitHub

---

## 📂 Project Structure

```
notes-app-compose/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── source files
│
├── docker-compose.yml
│
└── .github/
    └── workflows/
        └── ci.yml
```

---

#  CI Pipeline Workflow

The GitHub Actions workflow automatically performs the following tasks:

1. Checkout the source code
2. Setup Node.js
3. Create `.env` file using GitHub Secrets
4. Install project dependencies
5. Run unit tests
6. Login to Docker Hub
7. Build Docker Image
8. Run Docker Container
9. Verify the application is running
10. Push Docker Image to Docker Hub

---

#  Workflow Architecture

```
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions Trigger
    │
    ▼
Checkout Repository
    │
    ▼
Setup Node.js
    │
    ▼
Create .env
    │
    ▼
Install Dependencies
    │
    ▼
Run Unit Tests
    │
    ▼
Build Docker Image
    │
    ▼
Run Docker Container
    │
    ▼
Verify Container
    │
    ▼
Push Image to Docker Hub
```

---

# GitHub Secrets

The following secrets are configured in the repository.

| Secret Name | Description |
|--------------|-------------|
| DOCKER_USERNAME | Docker Hub Username |
| DOCKER_PASSWORD | Docker Hub Access Token |
| DB_HOST | MySQL Host |
| DB_USER | MySQL Username |
| DB_PASSWORD | MySQL Password |
| DB_NAME | Database Name |
| DB_PORT | Database Port |
| PORT | Application Port |

---

#  Build Docker Image

```bash
docker build -t notes-backend .
```

---

#  Run Docker Container

```bash
docker run -d \
--name notes-app \
-p 3000:3000 \
--env-file .env \
notes-backend
```

---

#  Push Image to Docker Hub

```bash
docker tag notes-backend <dockerhub-username>/notes-backend:latest

docker push <dockerhub-username>/notes-backend:latest
```

---

#  GitHub Actions

The workflow is automatically triggered on every push to the **main** branch.

```yaml
on:
  push:
    branches:
      - main
```

---

#  Features

- Dockerized Node.js Application
- MySQL Database Integration
- Environment Variable Management
- GitHub Actions CI Pipeline
- Automated Docker Image Build
- Automated Container Validation
- Automated Docker Hub Push
- Versioned Docker Images using Git Commit SHA

---

#  GitHub Actions Output

The workflow verifies:

- Repository Checkout
- Dependency Installation
- Docker Image Build
- Container Startup
- Application Health Check
- Docker Hub Image Push

---

# 👩‍💻 Author

**Madhuri Chennupati**

### Connect with me

- GitHub: https://github.com/<your-github-username>
- LinkedIn: https://linkedin.com/in/<your-linkedin-profile>

---

⭐ If you found this project useful, don't forget to Star the repository!
