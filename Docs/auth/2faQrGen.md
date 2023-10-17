# Two Authentication Factor

Used for generating 2fa secret and qr code.

**URL** : `/api/2fa/generate/`

**Method** : `POST`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

![](https://i.stack.imgur.com/UmS6X.png)

## Error Response

**Condition** : If jwt token is not provided or not valid.

**Code** : `401 UNAUTHORIZED`