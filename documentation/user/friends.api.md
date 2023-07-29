# User

Fetch and update user data.

## Get My Friends


**URL** : `/api/users/friends/`

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
    "friends": [
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
    user info plus his array of friends object information
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
## Add to My Friends

**URL** : `/api/users/friends/`

**Method** : `POST`

**Auth required** : YES

**Data to send**

```json
{
    "id": "friend_id"
}
```

**Data recieved**

```json
{
    "message" : "User was added to your friends"
}
```

## Success Response

**Code** : `200 OK`


## Error Response

**Condition** : Blocked by the user

**Code** : `406 Not Acceptable`

**Condition** : Id not found in database

**Code** : `404 Not Found`

**On Error Content** :

```json
{
    "message": "Invalid code"
}
```

## Delete from My Friends

**URL** : `/api/users/friends/:id`

**Method** : `DELETE`

**Auth required** : YES

**Data to send**

```json
{}
```

**Data recieved**

```json
{
    "message" : "id was removed from your friends"
}
```

## Success Response

**Code** : `200 OK`


