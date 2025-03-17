# WhereIsIt - Server Side

## Project Overview 🚀

**WhereIsIt** is a platform that facilitates the process of reconnecting lost items with their rightful owners. The platform enables users to report lost items, search through found items, and efficiently communicate with others to recover what’s been misplaced. The server-side code is responsible for handling requests related to lost and found items, including CRUD operations for item data.

## Key Features 🌟

- **GET**: Retrieve all lost and found items.
- **POST**: Add new lost or found items.
- **PUT**: Update item information.
- **DELETE**: Remove items from the list.
- **Error Handling**: Proper error messages for failed requests.
- **Authentication**: Secure routes for authorized actions (login and management).

## Technologies Used 🛠️

- **Node.js**: JavaScript runtime for building server-side logic.
- **Express.js**: Framework for routing and handling HTTP requests.
- **MongoDB**: NoSQL database for storing lost and found items.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB, enabling easy database interaction.
- **Cors**: Middleware for handling Cross-Origin Resource Sharing.
- **Dotenv**: Manages environment variables for security and configuration.
- **Axios**: Used in the frontend for HTTP requests, facilitating communication with the server.

## API Endpoints 📡

### **1. Get All Lost and Found Items**
- **Endpoint**: `GET /api/items`
- **Description**: Fetch a list of all the reported lost and found items.
- **Response**:
  - `200 OK`: A list of items in JSON format.
  - `500 Internal Server Error`: If there is a problem with the server.

### **2. Add a New Item (Lost or Found)**
- **Endpoint**: `POST /api/items`
- **Description**: Add a new item to the list of lost or found items.
- **Request Body**:
  - `name` (string): Name of the item.
  - `description` (string): A brief description of the item.
  - `category` (string): The category (lost or found).
  - `location` (string): The location where the item was lost or found.
  - `date` (string): Date the item was lost or found.
- **Response**:
  - `201 Created`: The item was successfully added.
  - `400 Bad Request`: If the request body is incomplete or invalid.
  - `500 Internal Server Error`: If there's an issue with the server.

### **3. Update an Item**
- **Endpoint**: `PUT /api/items/:id`
- **Description**: Update an existing lost or found item.
- **Request Body**:
  - Same as the request body for adding a new item.
- **Response**:
  - `200 OK`: The item was successfully updated.
  - `404 Not Found`: If the item with the provided ID does not exist.
  - `500 Internal Server Error`: If there's an issue with the server.

### **4. Delete an Item**
- **Endpoint**: `DELETE /api/items/:id`
- **Description**: Delete a lost or found item.
- **Response**:
  - `200 OK`: The item was successfully deleted.
  - `404 Not Found`: If the item with the provided ID does not exist.
  - `500 Internal Server Error`: If there's an issue with the server.

## Setup and Installation 🛠️

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/where-it-is-server.git
   cd where-it-is-server
