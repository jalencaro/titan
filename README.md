# Titan
Implements the backend used on rooms application

## API Documentation
List all API available into the application. Due the authentication all request will demand specific properties on the reader, these header's properties will be detailed here, but any specifics will be treat inside the API.

### Status
Allow user to use the API of this application

###### Method: GET
**Route:** `/api/status`<br />
**Response:**

| Status        | Status Code   | Return          | Description 
| ------------- | ------------- | -------------   | ------------- 
| Success       | 200           | `Status`        | An object with property status equal to live

###### Definitions
>**Status:** An object that contains the status of the server
```javascript
{
	status: "live"
}
``` 

###### Contributing

 Jalencar
