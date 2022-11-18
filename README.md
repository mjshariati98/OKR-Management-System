# OKR Management System
This application helps an organization to keep teams' OKRs in a long-term centralized way, and every team can define, change, and specify the state and progress of its OKR.

This has been done as the Web Programming course project.

## Design Architecture
The system comprises of following parts:
- Backend (Node.js)
- Frontend (React)
- Database (PostgreSQL)
- Cache (Redis)
- Load Balancer (Nginx)

## Features
- User management dashboard

![user-managemetn-dashboard](https://github.com/mjshariati98/OKR-Management-System/blob/main/assets/user-management-dashboard.png)
- Team management dashboard

![team-managemetn-dashboard](https://github.com/mjshariati98/OKR-Management-System/blob/main/assets/team-management-dashboard.png)
- User authentication implemented by JWT Token
- OKR management dashboard with the ability to add, remove, or change Rounds, OKRs, Objectives, and Key/Results

![okrs-and-rounds-dashboard](https://github.com/mjshariati98/OKR-Management-System/blob/main/assets/okrs-and-rounds-dashboard.png)
- Ability to specify each Key/Result's progress and show the progress for Objectives and OKRs

![objectives-krs-dashboard](https://github.com/mjshariati98/OKR-Management-System/blob/main/assets/objectives-krs-dashboard.png)
- Show each team's progress state by column charts relative to past OKRs or other organization teams' OKRs

![past-okrs](https://github.com/mjshariati98/OKR-Management-System/blob/main/assets/past-okrs.png)
![all-teams](https://github.com/mjshariati98/OKR-Management-System/blob/main/assets/all-teams.png)


## How to run
Everything is dockerized! Just run the following command, and the website will be up at `127.0.0.1:80`:
```
docker-compose up
```
