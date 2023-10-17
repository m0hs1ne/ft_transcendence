# mail OTP Authenticate

Used to authenticate a user by mail OTP

**URL** : `/api/2fa/mail/authenticate/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "otp": "user should provide the 2fa code"
}
```

**Data example**

```json
{
    "otp": "123456"
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