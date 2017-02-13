# Rooms ![Travis Status](https://travis.ibm.com/breaking-bug/rooms.svg?token=56BqYShvaLLncMxTYbog&branch=master)
Implements the backend used on rooms application

## API Documentation
List all API available into the application. Due the authentication all request will demand specific properties on the reader, these header's properties will be detailed here, but any specifics will be treat inside the API.

## Default Behaviors

#### Headers (`Default` for APIs)

| Name          | Type          | Value            
| ------------- | ------------- | -------------
| Content-Type  | `String`      | application/json
| x-authtoken   | `String`      | `<Token>`
| x-timezone    | `String`      | `<Timezone>`



#### Error
All routes except those in __Exceptions__ section will need to attempt the needs specified into the interceptor. Below follow the list of default errors:

Code          | Output        | Message             | Description
------------- | ------------- | -------------       | ------------- 
403           | `Object`      | "TOKEN_NOT_PRESENT" | Means there is not x-authtoken on the headers of the request 
403           | `Object`      | "SESSION_NOT_FOUND" | Means there is no session for the token sent on the headers  

#### Exceptions
APIs bypass the interceptor requirements

Route          | Description
-------------  | -------------
`/api/status`  | Used to keep the VPN alive
`/api/login`   | Used to login into the application


###### Definitions
>**Token:** The token is generated randomically on the backend and sent back to the front where should be stored to be sent over all requests.<br />
>**Timezone:** The timezone is retrieved from the user's device and sent to the server to treat the different timezones.<br />
>**Object:** Contains error treated by the backend
```javascript
{
	name: <String>,
	message: <String>, //Column Message of table above
	stack: <String>
}
```

___________________________

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

__________________________

### Login
Allow user to use the API of this application

###### Method: POST
**Route:** `/api/login`<br />
**Body:** `Credentials`<br />
**Response:**

| Status        | Status Code   | Return          | Description 
| ------------- | ------------- | -------------   | ------------- 
| Success       | 200           | `Session`       | Return the session stored on the database 
| Error         | 400           | MISSING_PARAMS  | Means the deviceId param is missing 
| Error         | 401           | Unauthorized    | Incorrect/empty `username` or `password` <br />`username` is not member of Bluepages 

###### Definitions
>**Credentials:** Store the credentials of the user for authentication. See below:
>```javascript
{
	username: <String>,
	password: <String>,
	deviceId: <String>
}
```
>**Session:** Contains the user and session information. See below:
>```javascript
{
  "uid": <String>,
  "name": <String>,
  "email": <String>,
  "token": <String>,
  "country": <String>,
  "locality": <String> //Can or cannot exists since it depends from unified profile.
}
```

__________________________

### Logout
Forces the application to ignore the session of the user

###### Method: DELETE
**Route:** `/api/login`<br />
**Header:** `Default`<br />
**Response:**

| Status        | Status Code   | Return        | Description 
| ------------- | ------------- | ------------- | ------------- 
| Success       | 200           | N/A           | Change the property `isValid` of the session to `false` 

__________________________

### Sites
Allow the application to retrieve a list of sites for a specific country

###### Method: GET
**Route:** `/api/country/:country/site`<br />
**Params:** `country` *(e.g.: 631)*<br />
**Headers:** `Default`<br />
**Response:**

| Status         | Code          | Output               | Description 
| -------------  | ------------- | -------------        | -------------  
| Success        | 200           | `Sites`              | Return an array of objects with the list of sites of the country 

###### Definitions
>**Sites:** Contains the list of sites that belongs to the requested country. See below:
```javascript
[
	{
		_id: <String>,
		name: <String>,
		country: <String>,
		timezone: <String>
	}
]
```

__________________________

### Rooms
Allow the application to retrieve a list of rooms for a specific site or country

#### By Site
Returns all rooms based on the site ID

###### Method: GET
**Route:** `/api/country/:country/site/:site/room`<br />
**Params:** `country` *(e.g.: 631)*<br />
**Params:** `site` *(e.g.: x33728k23861w93030)*<br />
**Headers:** `Default`
**Response:**

| Status        | Code          | Output        | Description 
| ------------- | ------------- | ------------- | -------------  
| Success       | 200           | `Rooms`       | Return an array of objects that list all rooms of the site 

#### By Country
Returns all rooms based on the country number

###### Method: GET
**Route:** `/api/country/:country/room`
**Params:** `country` (e.g.: 631)
**Headers:** `Default`
**Response:**

| Status        | Code          | Output        | Description  
| ------------- | ------------- | ------------- | -------------  
| Success       | 200           | `Rooms`       | Return an array of objects that list all rooms of the country 

#### Search
Returns all rooms based on the country number

###### Method: GET
**Route:** `/api/country/:country/site/:site/room/search`
**Params:** `country` *(e.g.: 631)*<br />
**Params:** `site` *(e.g.: x33728k23861w93030)*<br />
**Query:** `seats` *(e.g.: 12)* _[Optional]_ <br />
**Query:** `starttime` *(e.g.: 2017-02-09T10:00:00.113Z)* <br />
**Query:** `endtime` *(e.g.: 2017-02-09T10:30:00.113Z)* <br />
**Headers:** `Default`<br />
**Response:**

| Status        | Code          | Output                | Description  
| ------------- | ------------- | --------------------- | -------------  
| Success       | 200           | `Rooms`               | Return an array of objects that list all rooms of the country 
| Error         | 400           | MISSING_STARTTIME     | When the query param `starttime` isn't member of url
| Error         | 400           | MISSING_ENDTIME       | When the query param `endtime` isn't member of url 
| Error         | 400           | INVALID_DATE_INTERVAL | When the `starttime` is lower than `endtime`


###### Definitions
>**Rooms:** Contains the list of sites that belongs to the requested country. See below:
```javascript
[
	{
		_id: <String>,
		name: <String>,
		building: <String>,
		floor: <Number>,
		seats: <Number>,
		site: <String>
	}
]
```

_____________________________

### Reservations
Allow the application to retrieve a list of Reservations

#### List (`active=true`)
Will list all active reservations

###### Method: GET
**Route:** `/api/reservation`<br />
**Headers:** `Default`<br />
**Response:**

| Status        | Code          | Output          | Description 
| ------------- | ------------- | -------------   | -------------  
| Success       | 200           | `Reservations`  | Return an array of objects that list all rooms of the site 


#### Create
Will create a new reservation into the application

###### Method: POST
**Route:** `/api/reservation`<br />
**Headers:** `Default`<br />
**Body:** `Reservation`<br />
**Response:**

| Status        | Code          | Output              | Description 
| ------------- | ------------- | -------------       | -------------  
| Success       | 201           | `{ _id: <String> }` | N/A


#### Cancel
Change the property `active` of the reservation from `true` to `false`. Will search only for active reservations.

###### Method: DELETE
**Route:** `/api/reservation/:reservation`<br />
**Headers:** `Default`<br />
**Params:** `reservation` * (e.g.: 589b1c58daaa7bcf4216491a)<br />
**Response:**

| Status        | Code          | Output               | Description 
| ------------- | ------------- | -------------        | -------------  
| Success       | 200           | None                 | N/A
| Error         | 404           | Not Found            | If user try to cancel a document already cancelled or the reservation does not exists.

###### Definitions
>**Reservations:** Contains the list of reservations. See below:
```javascript
[
	{
		_id: <String>,
		duration: <Number>, //seconds
		room: <String>,
		date: <String>,
		modified: <String>,
		active: <Boolean>
	}
]
```

>**Reservation:** The JSON with the properties to create a new reservation
```javascript
{
	roomId: <String>, //The id of the room that is being reserved
	date: <Date>, //Start date for the reservation
	duration: <Number> //The duration in seconds for the reservation
}
```
