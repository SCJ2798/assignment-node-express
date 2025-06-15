# Assignment ( Node Js & Express )

This is a RESTful API built with **Node.js**, **Express**, and **Sequelize ORM**. The API supports user authentication (signup & login) and basic CRUD operations for product management.


## Features
```
✅ User Sign Up
✅ User Login (with JWT Authentication)
✅ Product Create, Read, Update, Delete (CRUD)
✅ Password hashing using bcrypt
✅ Sequelize ORM for database management
```

## Tech Stack

**Backend:** Node.js, Express.js  
**Database:** MySQL   
**ORM:** Sequelize  
**Authentication:** JWT, bcrypt  
**Environment Config:** dotenv


## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SCJ2798/assignment-node-express.git
cd assignment-node-express
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a .env file in the root directory:
```
PORT=2000
DB_USER_NAME=test-user
DB_USER_PASSWORD=test-a
DB_NAME=test-db
DB_PORT=566
DB_HOST=test-host
DB_DIALECT=mysql
USER_PASSWORD_SALT=12
USER_JWT_TOKEN_SECRET_KEY=123RTY
USER_JWT_TOKEN_EXPIRED_TIME=3600

```

### 4. Setup the Database
```
npx sequelize db:create
npx sequelize db:migrate
```
### 5. Run the Server
```
npm start
```

## API Endpoints
#### Auth Routes
```
| Method | Endpoint         | Description       |
| ------ | -----------      | ----------------- |
| POST   | /api/auth/signup | User Registration |
| POST   | /api/auth/login  | User Login        |
```

#### Product Routes (Protected)
```
| Method | Endpoint             | Description          |
| ------ | ------------------   | -------------------- |
| GET    | /api/products        | Get all products     |
| GET    | /api/products/\:uuid | Get a product by ID  |
| POST   | /api/products        | Create a new product |
| PUT    | /api/products/\:uuid | Update a product     |
| DELETE | /api/products/\:uuid | Delete a product     |

⚠️ All product routes require a valid JWT token in the Authorization header:
Authorization: Bearer <your-token>

```


## Folder Structure
```
├── common
│   ├── enum.js
├── controllers
│   ├── auth_controller.js
│   └── produc_controller.js
├── error
│   ├── http_response_error.js
├── models
│   ├── index.js
│   ├── user.js
│   └── product.js
├── routes
│   ├── index.js
├── middleware
│   └── auth_middleware.js
├── migrations
├── config
│   └── config.json
├── .env
├── app.js
├── package.json
└── README.md
└── Dockerfile
```
## Scripts
```
    npm start – Start the server

    npm run dev – Start with nodemon

    npx sequelize db:migrate – Run migrations

    npx sequelize db:create – Create DB (if not exists)
```
### License

This project is licensed under the MIT License.