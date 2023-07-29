# Message

**EVENT** : `receiveMessage`

**Auth required** : YES

**Data recieved**

```json
{
    "type": "notification | messages | DM",
    ...
}
```

### Only In Chat Rooms

```json
{
    "type": "notification",
    "message": "username joined the chat.",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/mel-hada.jpg",
    },
    "chatRoomId": 79
}
```

```json
{
    "type": "messages",
    "message": "SALAM",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/mel-hada.jpg",
    },
    "chatRoomId": 79
}
```

### In DM

```json
{
    "type": "DM",
    "message": {
        "message": "SLMM",
        "user": {
            "id": 1,
            "username": "mabenchi",
            "avatar": "http://localhost:3000/public/img/Screenshot 2023-07-27 12-14-51.png"
        },
        "user2": {
            "id": 2,
            "username": "mel-hada",
            "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
        },
        "createdAt": "2023-07-28T20:57:15.867Z",
        "updatedAt": "2023-07-28T20:57:15.867Z",
        "id": 105
    }
}
```

**Content**

``
    Any arriving message and if user send a message he receive it like others also
``