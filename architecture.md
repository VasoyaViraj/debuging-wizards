# NEXUS - Government-Grade Centralized Governance Platform

## ARCHITECTURE SPECIFICATION v1.0

---

##  1. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Citizen)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         │ Citizen JWT
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXUS API GATEWAY                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Citizen Authentication (Login/Register)                  │ │
│  │  • Citizen JWT Issuance & Validation                        │ │
│  │  • Service Discovery & Registry                             │ │
│  │  • Request Lifecycle Management (PENDING→ACCEPTED/REJECTED) │ │
│  │  • Service JWT Generation                                   │ │
│  │  • Request Forwarding to Departments                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────┐                                         │
│  │   NEXUS DATABASE    │                                         │
│  │   ┌─────────────┐   │                                         │
│  │   │ Users       │   │                                         │
│  │   │ Services    │   │                                         │
│  │   │ Departments │   │                                         │
│  │   │ Requests    │   │                                         │
│  │   └─────────────┘   │                                         │
│  └─────────────────────┘                                         │
└────────────────┬─────────────────┬──────────────────┬────────────┘
                 │                 │                  │
                 │ Service JWT     │ Service JWT      │ Service JWT
                 │ + Citizen JWT   │ + Citizen JWT    │ + Citizen JWT
                 │ + Request ID    │ + Request ID     │ + Request ID
                 ▼                 ▼                  ▼
┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  AGRICULTURE SERVICE │ │ HEALTHCARE       │ │  URBAN SERVICES  │
│  ┌────────────────┐  │ │  SERVICE         │ │                  │
│  │ JWT Validation │  │ │  ┌────────────┐  │ │  ┌────────────┐  │
│  │ Request Process│  │ │  │ JWT Valid. │  │ │  │ JWT Valid. │  │
│  │ Response Gen.  │  │ │  │ Process    │  │ │  │ Process    │  │
│  └────────────────┘  │ │  │ Response   │  │ │  │ Response   │  │
│  ┌────────────────┐  │ │  └────────────┘  │ │  └────────────┘  │
│  │ AGRI DB        │  │ │  ┌────────────┐  │ │  ┌────────────┐  │
│  │ - Officers     │  │ │  │ HEALTH DB  │  │ │  │ URBAN DB   │  │
│  │ - Requests     │  │ │  │ - Officers │  │ │  │ - Officers │  │
│  │ - Advisories   │  │ │  │ - Requests │  │ │  │ - Requests │  │
│  └────────────────┘  │ │  └────────────┘  │ │  └────────────┘  │
└──────────────────────┘ └──────────────────┘ └──────────────────┘

         ▲                        ▲                      ▲
         │                        │                      │
         └────────────────────────┴──────────────────────┘
                    ONLY Internal Communication
                    (No External Access)
```

---