# Login

Used to collect a Token for a registered User.

**URL** : `/api/auth/42/login/` `/api/auth/google/login`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "access_token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

## Error Response

**Code** : `401 UNAUTHORIZED`