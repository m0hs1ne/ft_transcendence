# Send OTP to email

Send OTP to email

**URL** : `/api/2fa/mail/send-otp/`

**Method** : `POST`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "OTP sent"
}
```

## Error Response

* **Condition** : jwt token has an error

    **Code** : `401 UNAUTHORIZED`

* **Condition** : user not found

    **Content** :

    ```json
    {
        "message": "User not found"
    }
    ```
