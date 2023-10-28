# Turn-on 2FA

Used to enable 2FA for a user

**URL** : `/api/2fa/turn-on/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "tfaCode": "user should enter 2FA code"
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

**Content example**

```json
{
    "message": "2FA is now enabled"
}
```

## Error Response

* **Condition** : jwt token has an error

    **Code** : `401 UNAUTHORIZED`

* **Condition** : tfaCode is invalid

    **Content** :

    ```json
    {
        "message": "Invalid code"
    }
    ```
* **Condition** : tfaCode is already enabled

    **Content** :

    ```json
    {
        "message": "2FA is already enabled"
    }
    ```