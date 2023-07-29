# Notification

**EVENT** : `Notification`

**Auth required** : YES

**Type of Data recieved**


```json
{
    "type": "list | info | invitation",
    ...
}
```
#### 1/ info

```json
{
    "type": "info",
    "message": "You Got 0 new Messages"
}
```

#### 2/ invitation

```json
{
    "type": "invitation",
    "invitation": {
            "id": "261ee3a6-212c-4eca-be7a-53fe3a5512cf",
            "title": "24",
            "from": {
                "id": 2,
                "username": "mel-hada",
                "avatar": "https://cdn.intra.42.fr/users"
            }
        }
}
```


#### 3/ list

```json
{
    "type": "list",
    "notifications": [
        {
            "type": "invitation",
            "invitation": [
                {
                    "id": "261ee3a6-212c-4eca-be7a-53fe3a5512cf",
                    "title": "24",
                    "from": {
                        "id": 2,
                        "username": "mel-hada",
                        "avatar": "https://cdn.intra.42.fr/users"
                    }
                }
            ]
        },
        {
            "type": "info",
            "message": "You Got 0 new Messages"
        }
    ]
}
```


**Content**

``
    Invitations or/and new messages count
``