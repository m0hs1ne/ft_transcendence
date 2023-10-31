# Turn on 2FA by sending a code to the user's email

Used to enable 2FA for a user by mail OTP

**URL** : `/api/2fa/mail/turn-on/`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "otp": "user should enter OTP code"
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