# Postaway Microservices Architecture

A scalable microservice-based social posting platform with Kubernetes, Docker, and API Gateway.

## Microservices

| Service | Port | Purpose |
|:--------|:-----|:--------|
| Auth Service | 5000 | User Authentication (Login/Register) |
| Post Service | 5001 | Creating and Managing Posts |
| User Service | 5002 | Managing User Profiles |

## Local Development

```bash
docker-compose up --build

## Structure of singleRepo microservice

postawayAPI/                <-- Root folder (NO npm init here)
│
├── auth-service/           <-- Microservice: Authentication
│   ├── src/                <-- Source code
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js          <-- Express app entry point
│   ├── .env                <-- Environment variables (service specific)
│   ├── Dockerfile          <-- Dockerfile for this service
│   ├── package.json        <-- npm init done here
│   └── README.md
│
├── post-service/           <-- Microservice: Posts handling
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── user-service/           <-- Microservice: User management
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── gateway/                <-- API Gateway (routes traffic to microservices)
│   ├── src/
│   │   ├── routes/
│   │   └── app.js
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── k8s/                    <-- Kubernetes YAML files (manifests)
│   ├── auth-deployment.yaml
│   ├── post-deployment.yaml
│   ├── user-deployment.yaml
│   ├── gateway-deployment.yaml
│   ├── services/
│   │   ├── auth-service.yaml
│   │   ├── post-service.yaml
│   │   ├── user-service.yaml
│   │   └── gateway-service.yaml
│   └── ingress.yaml (optional)
│
├── prometheus/             <-- Monitoring configs
│   ├── prometheus.yml
│   ├── alert-rules.yml
│   └── ...
│
├── istio/                  <-- Istio configs (advanced networking)
│   ├── gateway.yaml
│   ├── virtualservice.yaml
│   ├── destinationrule.yaml
│   └── ...
│
├── docker-compose.yml      <-- Optional: Local docker setup for all services
├── README.md               <-- Documentation about the project
└── .gitignore              <-- Git ignore file
