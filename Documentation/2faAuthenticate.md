# 2FA Authentication

Used to authenticate a user with 2FA by giving him a jwt token.

**URL** : `/api/2fa/authenticate/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "tfaCode": "user should provide the 2fa code"
}
```

**Data example**

```json
{
    "tfaCode": "123456"
}
```

## Success Response

**Code** : `200 OK`

**Content**

```
    will return a user if the 2fa code is correct
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
