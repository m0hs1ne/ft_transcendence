# User

Fetch and update user data.

## Get My profile 


**URL** : `/api/users/profile/`

**Method** : `GET`

**Auth required** : YES

**Data to send**

```json
{}
```

**Data recieved**

```json
{
    "id": 0
    "username": "username",
    "wins": 0,
    "losses": null,
    "is2fa": false,
    "avatar": "http://localhost:3000/public/img/image.jpeg",
    "friends": [
        {
            "id": 3,
            "username": "username",
            "wins": 0,
            "losses": null,
            "avatar": "https://cdn.intra.42.fr/users/id/login"
        }
    ],
    "blocked": [
        {
            "id": 2,
            "username": "username",
            "wins": 0,
            "losses": null,
            "avatar": "https://cdn.intra.42.fr/users/id/login"
        },
        {
            "id": 5,
            "username": "username",
            "wins": 0,
            "losses": null,
            "avatar": "https://cdn.intra.42.fr/users/id/login"
        }
    ],
    "achievements": [
        {
            "title": "title",
            "image": "http://localhost:3000/public/img/image.jpeg"
        }
    ]
}
```

### Success Response

**Code** : `200 OK`

**Content**

```
    users information
```

### Error Response

**Condition** : Invalid jwt token

**Code** : `401 UNAUTHORIZED`

**Condition** : tfaCode is invalid

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "message": "Invalid code"
}
```

## Get Others profile

**URL** : `/api/users/profile/:id`

**Method** : `GET`

**Auth required** : YES

**Data to send**

```json
{}
```

**Data recieved**

```json
{
    "id": 0
    "username": "username",
    "wins": 0,
    "losses": null,
    "avatar": "http://localhost:3000/public/img/image.jpeg",
    "friends": [
        {
            "id": 3,
            "username": "username",
            "wins": 0,
            "losses": null,
            "avatar": "https://cdn.intra.42.fr/users/id/login"
        }
    ],
    "achievements": [
        {
            "title": "title",
            "image": "http://localhost:3000/public/img/image.jpeg"
        }
    ]
}
```

### Success Response

**Code** : `200 OK`

**Content**

```
    will return a user information
```

### Error Response

**Condition** : Invalid jwt token

**Code** : `401 UNAUTHORIZED`

**Condition** : tfaCode is invalid

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "message": "Invalid code"
}
```

## Update My Profile 

**URL** : `/api/users/profile/update/`

**Method** : `PATCH`

**Auth required** : YES

**Data to send**

```json
{
    "username": "username",
}
```

**Data recieved**

```json
{
    "id": 0,
    "username": "username",
    "wins": 0,
    "losses": null,
    "is2fa": false,
    "avatar": "http://localhost:3000/public/img/image.jpeg"
}
```

### Success Response

**Code** : `200 OK`

**Content**

```
    updated object information
```

### Error Response

**Condition** : Invalid jwt token

**Code** : `401 UNAUTHORIZED`

**Condition** : tfaCode is invalid

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "message": "Invalid code"
}
```

## Update My Avatar 

**URL** : `/api/users/upload_avatar/`

**Method** : `POST`

**Auth required** : YES

**Data to send**

```form-data
to upload file
```

**Data recieved**

```json
{
      "statusCode": 200,
      "data": "file.path",
}
```

### Success Response

**Code** : `200 OK`

**Content**

```
    updated object information
```

### Error Response

**Condition** : Invalid file extension

**Code** : `400 Bad Request`

**Content** :

```
{
    "message": "Validation failed (expected type is .(png|jpeg|jpg))",
    "error": "Bad Request",
    "statusCode": 400
}
```

**Condition** : Large File

**Code** : `400 Bad Request`

**Content** :

```json
{
    "message": "Validation failed (expected size is less than SIZE)",
    "error": "Bad Request",
    "statusCode": 400
}
```
