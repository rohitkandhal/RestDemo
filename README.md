###Rest API demo using node.js, mongodb

A simple REST API to perform CRUD operations on a simple object (**Product**) using [JSend](https://labs.omniti.com/labs/jsend/wiki/WikiStart) JSON API specifications.

###Run instruction (on terminal)
 1. Install required packages, _if needed_, `$ npm install`
 2. Start mongo database: `$ mongod`
 3. Run app: `$ npm start` - starts **node.js** app server.
 4. Use [PostMan Rest Client](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm) to send REST calls to app server.
 
###Object Schema
```
Product:
	id    : (integer, required) Unique Product id
	name  : (string, required) Product name
	price : (number, optional) Product price
```

###CRUD Operations
 1. Create a new product using POST ([localhost:3000/products/]())  
	**Request**
	
	```
	POST /products/ HTTP/1.1
	Host: localhost:3000
	Content-Type: application/x-www-form-urlencoded
	
	id=3&name=Lumia&price=699
	```
	**Response**
	```
	// HTTP Status: 200 OK
	{
	  "status": "success",
	  "data": {
	      "message": "1 product created successfully."
	  }
	}
	```
	a. Only **one product** insert with each request  
	b. If `ID` or `name` is missing in post data:
	```
	// HTTP Status: 400 Bad Request
	{
	  "status": "failed",
	  "data": {
	      "name": "A product name is required."
	  }
	}
	```
	c. For bad POST request url e.g. [localhost:3000/products/**abcd**]()
	```
	// HTTP Status: 404 Not Found
	{
	  "status": "error",
	  "message": "Page Not Found",
	}
	```
	
 2. Read using GET  
  a. GET ALL ([localhost:3000/products/]())  
	**Request**
	```
	GET /products/ HTTP/1.1
	```
	**Response**
	```
	// HTTP Status: 200 OK
	{
	    "status": "success",
	    "data": {
	        "product": [
	            {"id": 1, "name": "Microsoft", "price": 100},
	            {"id": 3, "name": "Lumia", "price": 699}
	        ]
	    }
	}
	```
	b. GET ([localhost:3000/products/**:productId**]())  
	**Request**
	```
	GET /products/3 HTTP/1.1
	```
	**Response**
	```
	// HTTP Status: 200 OK
	{
	    "status": "success",
	    "data": {
	        "product": [
	            {"id": 3, "name": "Lumia", "price": 699}
	        ]
	    }
	}
	```
   * For bad request like `GET /products/asdfa HTTP/1.1`, Response is `// HTTP Status: 400 Bad Request`
 3. Update using PUT ([localhost:3000/products/**:productId**]())  
	**Request**
	```
	PUT /products/2 HTTP/1.1
	Host: localhost:3000
	Cache-Control: no-cache
	Content-Type: application/x-www-form-urlencoded
	
	name=Microsoft+Surface
	```
	**Response**
	```
	// HTTP Status: 200 OK
	{
	  "status": "success",
	  "data": {
	      "message": "1 product updated."
	  }
	}
	```
  a. Only Single product updates are supported.  
  b. Selective field update supported.  
  c. Update on non-existing documents are rejected.  
  d. Update request with nothing to update doesn't do anything.  
  
 4. Delete ([localhost:3000/products/**:productId**]())  
 	**Request**

	```
	DELETE /products/2 HTTP/1.1
	```
	**Response**
	```
	{
		"status": "success",
		"data": {
		    "message": "1 product deleted."
		}
	}
	```
	Delete All records is implemented but commented, being an un-safe operation. Request:
	```
	DELETE /products/ HTTP/1.1
	```
	
 5. Error: All application exceptions are handled by app generic handler and returns `Error Status`and `Message`. `Stack trace` is included while running in development environment
 
###Frameworks used
 1. node.js
 2. npm
 3. mongodb
 4. mongoose
 5. express
