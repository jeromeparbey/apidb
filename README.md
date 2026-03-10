Cahier des charges – Backend API Utilisateur et Authentification
1 Objectif

Développer un backend modulaire, scalable, optimiser , sécurisé et testable pour gérer :

Utilisateurs (CRUD)

Authentification (login, register, OTP, reset password)

Logging et tracking des actions

Services externes : email (OTP, reset password), JWT, cache Redis

Architecture basée sur Clean Architecture + DDD et Next.js App Router.

2 Technologies 

Langage : TypeScript

Framework : Next.js (App Router)

ORM : Prisma + PostgreSQL

Cache  : Redis

Email : NodeMailer 

Auth : JWT + bcrypt

Testing : Jest / Vitest

Logging : ConsoleLogger 

3 Base de données (Prisma + PostgreSQL)
Modèles principaux

User

id: uuid, name, email (unique), password (hash), role (USER/ADMIN)

2FA : twoFactorEnabled, twoFactorSecret

Relations : OTP, ResetPassword, ActivityLog

Otp

id: uuid, code, status (PENDING/USED/EXPIRED)

Expiration : expiresAt

ResetPassword

id: uuid, token, status (PENDING/USED/EXPIRED)

Expiration : expiresAt

ActivityLog

action, meta, userId?

Index sur createdAt pour requêtes rapides

Optimisations DB

Index sur : userId + expiresAt (Otp / ResetPassword), userId + createdAt (ActivityLog)

UUID  pour scalabilité 

Enum pour Role et Status pour sécurité et validation

Relations correctement définies pour Prisma

4 Architecture Clean / DDD
Arborescence Modules
src/
├─ app/api/              # Routes Next.js (HTTP Layer)
├─ modules/
│  ├─ users/
│  │  ├─ domain/          # Entités + Repository Interface
│  │  ├─ application/     # UseCases + DTO + Validators
│  │  └─ infrastructure/  # Prisma repository + Controllers
│  └─ auth/
│     ├─ domain/
│     ├─ application/
│     └─ infrastructure/
├─ providers/              # Services globaux (Hash, JWT, Logger, Response, Mail, OTP)
├─ middlewares/            # Auth, error handling, validation
├─ lib/                    # PrismaClient, Redis client, helpers
└─ config/                 # Variables d'environnement

5 Services globaux et Providers

Service	Fonction 
HashProvider	Hacher lles mot de passe avant stockage
JwtProvider	Création et vérification JWT	Expiration configurable
Logger	Logging uniforme	Interface ILogger, injecté partout
Response	Standardisation réponses API	Payload uniforme {succeed,message,data}, testable
Mail	NodeMailer pour OTP / Reset	SMTP via env, async, scalable
OtpProvider	Génération OTP	Aléatoire, expiration, stockage DB + cache


6 Flux typique – Création Utilisateur

Route API reçoit requête POST /users

Controller récupère body et appelle CreateUserUseCase

UseCase :

Validate DTO (prévenir injections/erreurs)

Vérifie email unique

Hash password via HashProvider

Crée User entity

Sauvegarde via IUserRepository (Prisma)

Stocke dans Redis cache pour lecture rapide

Retourne réponse standardisée via ResponseProvider



7 Sécurité et Optimisations

Passwords hashés avec bcrypt

JWT sécurisé avec secret + expiration

Redis cache pour : lecture fréquente, OTP, tokens temporaires

Validation côté backend (DTO + validation des données)

Index DB pour lectures rapides (OTP, ActivityLog)

Séparation UseCase / Repository / Controller pour tests unitaires

Logging des actions critiques dans ActivityLog + console/log service



8 DTO et Validators

Chaque UseCase possède son DTO et validator

Permet : validation avant DB / hash / envoi email

Optimise performances et sécurité

 
 
 
 TEST ET SCALABILITER

Unitaires : UseCases + Providers

Integration : Repositories + Controllers

Stress/Load : Redis pour OTP et cache, PostgreSQL indexes

Scalable : UUID pour PK, Redis pour cache et queue, DB partition possible