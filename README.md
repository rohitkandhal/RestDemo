###Rest API demo using nodejs

A simple REST API to perform CRUD operation on a simple object

###Usage
 1. Start mongodb in terminal '$mongod'
 2. Run app $npm start
 
###Object structure
Product:
	id (_integer_): Unique product identifier
	name (_string_): Product name
	price (_number_): Product price
	
###CRUD Operations
 1. Create 
 POST
 localhost:3000/products/
 One product inserted with each request
 
 If ID or name is missing
 HTTP Status: 400 Bad Request
 {
    "status": "failed",
    "data": {
        "name": "A product name is required."
    }
}
 2. Read:
 	a. GET ALL:
	 	http://localhost:3000/products/
		Output
		{
    "status": "success",
    "data": []
}
 3. Update
 Single document update are supported
 Selective field update supported
 
 4. Delete 
 
 ###Application architecture
 
 1. Exceptions should be handled by generic app error handler.
 2. Get command should return data. PUT POST DELETE should return the request status.
 
 ###Mongo notes
 db.products.drop() - delete product collection (or table) from database