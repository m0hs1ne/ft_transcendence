# User

Fetch and update user data.

## Get My blocked


**URL** : `/api/users/blocked/`

**Method** : `GET`

**Auth required** : YES

**Data to send**

```json
{}
```

**Data recieved**

```json
{
    "username": "username",
    "blocked": [
        {
            "id": 3,
            "username": "username",
            "avatar": "https://cdn.intra.42.fr/users/login"
        }
    ]
}
```

## Success Response

**Code** : `200 OK`

**Content**

```
    user info plus his array of blocked object information
```

## Error Response

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
## Add to My blocked

**URL** : `/api/users/blocked/`

**Method** : `POST`

**Auth required** : YES

**Data to send**

```json
{
    "id": "to_block_id"
}
```

**Data recieved**

```json
{
    "message" : "User was added to your blocked list"
}
```

## Success Response

**Code** : `200 OK`


## Error Response

**Condition** : Id not found in database

**Code** : `404 Not Found`

**On Error Content** :

```json
{
    "message": "Invalid code"
}
```

## Delete from My blocked

**URL** : `/api/users/blocked/:id`

**Method** : `DELETE`

**Auth required** : YES

**Data to send**

```json
{}
```

**Data recieved**

```json
{
    "message" : "id was removed from your blocked"
}
```

## Success Response

**Code** : `200 OK`


