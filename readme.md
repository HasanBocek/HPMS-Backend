# HOTEL MANAGEMENT SYSTEM

This projects is an API for hotel management that performs reservation, customer, employee and room management.

## Features

- Customer, employee, room and reservation management.
- Date control for room reservations.
- Reservation, customer, employee and room CRUD operations.

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose

## Setup

### Requirements

- Node.js
- MongoDB

### Steps

1. Clone the project:
   ```bash
   git clone https://github.com/HasanBocek/HPMS-Backend.git
   cd HPMS-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` file:
   ```env
   MONGODB_URI=
   SECRET=
   ```
4. Start server:
   ```bash
   npm start
   ```
5. Project will be running on `localhost:4000`

## API Documentation

### Response Structure

- **Body**
    ```json
    {
        "status": "succes / error / server error / unknown",
        "message": "success_message",
        "error":" [error_messages]",
        "data": "data"
    }
    ```

### Item Operations

#### GET `/api/item/:id`

- **Description:** List the data by ID.
- **Path Parameters:**
    - `id` (CustomID): Item ID.

- **Response Data:**
    Item Data

### Customer Operations

#### GET `/api/customer`

- **Description:** List all customers.
- **Data:**
    ```json
    [
        {
            "_id": "66f56186c7e96e81b3556d6a",
            "name": "Alva Marvin",
            "tckn": "894-64-3926",
            "address": "6077 Buddy Square Turtle Lake, ND 58575 ",
            "email": "summer.labadie@price.info",
            "gender": "Kadın",
            "phone": 12923306849,
            "nation": "US",
            "note": "",
            "reservations": [
                "8JQP",
                "GPEL",
                "3V9J",
                "FM3Q"
            ],
            "customId": "INUO",
            "__v": 24
        },
    ]
    ```

#### GET `/api/customer/{id}`

- **Description:** List the customer by ID.
- **Data:**
    Customer Data

#### POST `/api/customer`

- **Description:** Create a new customer.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "(str)",
            "tckn": "SSN-TCKN-PASSPORTNO(str)",
            "address": "(str)",
            "email": "(str)",
            "gender": "(str)",
            "phone": "(int)",
            "nation": "(str)",
            "note": "(not required)(str)"
        }
        ```
- **Response Data:**
    Customer Data

#### PUT `/api/customer/{id}`

- **Description:** Edit the customer by ID.
- **Path Parameters:**
    - `id` (CustomID): Customer ID.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "(str)",
            "tckn": "SSN-TCKN-PASSPORTNO(str)",
            "address": "(str)",
            "email": "(str)",
            "gender": "(str)",
            "phone": "(int)",
            "nation": "(str)",
            "note": "(not required)(str)"
        } 
        ```
- **Response Data:**
    Edited Customer Data

#### DELETE `/api/customer/{id}`

- **Description:** List the customer by ID.
- **Path Parameters:**
    - `id` (CustomID): Customer ID.

### Room Operations

#### GET `/api/room`

- **Description:** List all rooms.
- **Data:**
    ```json
    [
        {
            "_id": "66f56198c7e96e81b3556d7b",
            "roomType": {
                "roomName": "Room 1",
                "price": 400,
                "adults": 2,
                "childs": 0,
                "note": ""
            },
            "roomNumber": 1,
            "note": "",
            "reservations": [
                "8JQP",
                "GPEL",
                "3V9J",
                "FM3Q"
            ],
            "customId": "GVTR",
            "__v": 24
        },
    ]
    ```

#### GET `/api/room?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD`

- **Description:** List the empty rooms between the specified dates.
- **Query Parameters:**
    - `checkInDate` (Date[YYYY-MM-DD]): Checkin Date.
    - `checkOutDate` (Date[YYYY-MM-DD]): Checkout Date.
- **Data:**
    Available Rooms Data

#### GET `/api/room/{id}`

- **Description:** List the room by ID.
- **Path Parameters:**
    - `id` (CustomID): Room ID.
- **Data:**
    Room Data

#### POST `/api/room`

- **Description:** Create a new room.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "roomNumber": "(int)",
            "roomName": "(str)",
            "price": "(int)",
            "description": "(str)",
            "adults": "(int)",
            "childs": "(int)",
            "note": "(not required)(str)"
        }
        ```
- **Data:**
    Room Data

#### PUT `/api/room/{id}`

- **Description:** Edit the room by ID.
- **Path Parameters:**
    - `id` (CustomID): Room ID.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "roomNumber": "(int)",
            "roomName": "(str)",
            "price": "(int)",
            "description": "(str)",
            "adults": "(int)",
            "childs": "(int)",
            "note": "(not required)(str)"
        }
        ```
- **Data:**
    Edited Room Data

  
#### PUT `/api/room/status/{id}`

- **Description:** Edit the room status by ID.
- **Path Parameters:**
    - `id` (CustomID): Room ID.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "status": "(str)" // "Dirty", "Clean", "Cleaning", "Maintenance Required"
        }
        ```
- **Data:**
    Edited Room Data

#### DELETE `/api/room/{id}`

- **Description:** Delete the room by ID.
- **Path Parameters:**
    - `id` (CustomID): Room ID.

### Reservation Operations

#### GET `/api/reservation`

- **Description:** List all reservations.
- **Data:**
    ```json 
    [
        {
            "_id": "66f563924331f07f2f2fd27e",
            "employee": "ZS24",
            "customers": [
                "INUO"
            ],
            "rooms": [
                "GVTR"
            ],
            "checkin": "2024-10-15",
            "checkout": "2024-10-17",
            "adults": 1,
            "childs": 0,
            "price": 200,
            "note": "",
            "isPaid": true,
            "customId": "8JQP",
            "__v": 0
        },
    ]
    ```

#### GET `/api/reservation/{id}`

- **Description:** List the reservation by ID.
- **Path Parameters:**
    - `id` (CustomID): Reservation ID.
- **Data:**
    Reservation Data

#### POST `/api/reservation`

- **Description:** Create a new reservation.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "customers": "CUSTOMERID(arr)",
            "rooms": "ROOMID(arr)",
            "checkin": "(YYYY-MM-DD)(str)",
            "checkout": "(YYYY-MM-DD)(str)",
            "adults": "(int)",
            "childs": "(int)",
            "note": "(not required)(str)",
            "isPaid": "PAYMENT-STATUS(bool)"
        }
        ```
- **Data:**
    Reservation Data

#### PUT `/api/reservation/{id}`

- **Description:** Edit the reservation by ID.
- **Path Parameters:**
    - `id` (CustomID): Reservation ID.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "customers": "(arr)",
            "rooms": "(arr)",
            "checkin": "(YYYY-MM-DD)(str)",
            "checkout": "(YYYY-MM-DD)(str)",
            "adults": "(int)",
            "childs": "(int)",
            "note": "(not required)(str)",
            "isPaid": "(bool)"
        }
        ```
- **Data:**
    Edited Reservation Data
        
#### DELETE `/api/reservation/{id}`

- **Description:** Delete the reservation by ID.
- **Path Parameters:**
    - `id` (CustomID): Reservation ID.

### Employee Operations

#### GET `/api/employee`

- **Description:** List all employees.
- **Data:**
    ```json
    [
        {
            "_id": "66dcaef908e8f025fb182fc8",
            "name": "Hasan Bocek",
            "job": "Dev",
            "salary": 200,
            "jobStartDate": "2024-08-25",
            "jobDescription": "123",
            "contact": {
                "tckn": "11111111111",
                "phone": 5555555555,
                "email": "mail@mail.com",
                "address": "address",
                "_id": "66f68e7349803958ce878cd4"
            },
            "note": "",
            "dob": "2007-09-20",
            "password": "",
            "permissions": [
                "ADMINISTRATOR"
            ],
            "customId": "ZS24"
        }
    ]
    ```

#### GET `/api/employee/{id}`

- **Description:** List the employee by ID.
- **Path Parameters:**
    - `id` (CustomID): Employee ID.
- **Data:**
    Employee Data

#### POST `/api/employee`

- **Description:** Create a new employee.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "(str)",
            "job": "(str)",
            "salary": "(int)",
            "jobStartDate": "(str)",
            "jobDescription": "(str)",
            "tckn": "(str)",
            "phone": "(int)",
            "email": "(str)",
            "address": "(str)",
            "dob": "(YYYY-MM-DD)(str)",
            "password": "(str)",
            "permissions": "(arr)"
        }
        ```
- **Data:**
    Employee Data

#### PUT `/api/employee/{id}`

- **Description:** Edit the employee by ID.
- **Path Parameters:**
    - `id` (CustomID): Employee ID.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "(str)",
            "job": "(str)",
            "salary": "(int)",
            "jobStartDate": "(str)",
            "jobDescription": "(str)",
            "tckn": "(str)",
            "phone": "(int)",
            "email": "(str)",
            "address": "(str)",
            "dob": "(YYYY-MM-DD)(str)",
            "password": "(str)",
            "permissions": "(arr)"
        }
        ```
- **Data:**
    Edited Employee Data
        
#### DELETE `/api/employee/{id}`

- **Description:** Delete the employee by ID.
- **Path Parameters:**
    - `id` (CustomID): Employee ID.

### Authorization Operations

#### POST `/auth/login`

- **Description:** Login.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "email": "(str)",
            "password": "(str)"
        }
        ```

#### GET `/auth/logout`

- **Description:** Logout.
- **Response:**
    - **Status:** `200 OK`
    - **Headers:**
        - `Location: /login`

## Contributing

- **Pull Request:** If you want to make changes to the code, please send a pull request.
- **Issue:** Report bugs or development suggestions as issues.
