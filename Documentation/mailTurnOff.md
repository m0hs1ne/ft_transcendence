# turn off mail OTP

Used to disable 2FA for a user by mail OTP

**URL** : `/api/2fa/mail/turn-off/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "otp": "user should enter 2FA code"
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

**Content example**

```json
{
    "message": "2FA is now disabled"
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
* **Condition** : tfaCode is already disabled

    **Content** :

    ```json
    {
        "message": "2FA is already disabled"
    }
    ```
