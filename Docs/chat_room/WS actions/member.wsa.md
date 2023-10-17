# Chat Room member

**ACTION** : `updateMemberRole`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `notification`

**Auth required** : YES

**Data required**

```json
{
    "memberId": number,
    "chatId": number,
    "role": "admin | member"
}
```

**Data recieved**

```json
{
    "type": "notification",
    "message": "mabenchi is an admin now.",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
    },
    "chatRoomId": 79
}
```

**Action**

``
    The owner or admin can change the role of a member in chat, give him high priviledge from member to admin or the opposite 
``

##

**ACTION** : `updateMemberStatus`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `notification`

**Auth required** : YES

**Data required**

```json
{
    "memberId": number,
    "chatId": number,
    "status": "normal | banned | muted"
    "mutedFor": number im minutes
}
```

**Data recieved**

```json
{
    "type": "notification",
    "message": "mabenchi is muted.",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
    },
    "chatRoomId": 79
}
```

**Action**

``
    The owner or admin can change the status of a member in chat, mute him for `` mutedFor `` minutes or ban him from the chat so he cannot join anymore 
``

##

**ACTION** : `kickMember`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `notification`

**Auth required** : YES

**Data required**

```json
{
    "memberId": number,
    "chatId": number
}
```

**Data recieved**

```json
{
    "type": "notification",
    "message": "mabenchi left the chat.",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
    },
    "chatRoomId": 79
}
```

**Action**

``
    The owner or admin can kick a member from chat. The admin cannot kick owner
``

##

**ACTION** : `enterChat`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `notification`

**Auth required** : YES

**Data required**

```json
{
    "chatId": number,
    "password": string if chat is protected
}
```

**Data recieved**

```json
{
    "type": "notification",
    "message": "mabenchi joined the chat.",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
    },
    "chatRoomId": 79
}
```

**Action**

``
    The user can enter a chat if public or protected, in case of protected he should present a password 
``

##

**ACTION** : `sendMessage`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `message`

**Auth required** : YES

**Data required**

```json
{
    "chatId": number,
    "message": string 
}
```

**Data recieved**

```json
{
    "type": "message",
    "message": "Hi",
    "from": {
        "id": 1,
        "username": "mabenchi",
        "avatar": "http://localhost:3000/public/img/Screenshot from 2023-07-27 12-14-51.png"
    },
    "chatRoomId": 79
}
```

**Action**

``
    Send a message in a chatroom if user is a member and not banned or muted
``

##

**ACTION** : `getChatMessages`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `ChatMessages`

**Auth required** : YES

**Data required**

```json
{
    "chatId": number
}
```

**Data recieved**

```json
{
    "type": "ChatMessages",
    "chatId": 79,
    "messages": [
        {
            "id": 102,
            "chatroomId": 79,
            "type": "message",
            "message": "wa gha hadro m3ana",
            "createdAt": "2023-07-28T20:54:45.567Z",
            "updatedAt": "2023-07-28T20:54:45.567Z",
            "user": {
                "id": 1,
                "username": "mabenchi",
                "avatar": "http://localhost:3000/public/img/Screenshot from 2023-07-27 12-14-51.png"
            }
        },
        {
            "id": 106,
            "chatroomId": 79,
            "type": "notification",
            "message": "mabenchi is an admin now.",
            "createdAt": "2023-07-28T21:25:02.051Z",
            "updatedAt": "2023-07-28T21:25:02.051Z",
            "user": {
                "id": 2,
                "username": "mel-hada",
                "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
            }
        },
        {
            "id": 107,
            "chatroomId": 79,
            "type": "notification",
            "message": "mabenchi is muted.",
            "createdAt": "2023-07-28T21:31:06.399Z",
            "updatedAt": "2023-07-28T21:31:06.399Z",
            "user": {
                "id": 2,
                "username": "mel-hada",
                "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
            }
        },
        {
            "id": 108,
            "chatroomId": 79,
            "type": "message",
            "message": "Slm",
            "createdAt": "2023-07-28T21:36:02.965Z",
            "updatedAt": "2023-07-28T21:36:02.965Z",
            "user": {
                "id": 1,
                "username": "mabenchi",
                "avatar": "http://localhost:3000/public/img/Screenshot from 2023-07-27 12-14-51.png"
            }
        },
        {
            "id": 120,
            "chatroomId": 79,
            "type": "notification",
            "message": "mabenchi joined the chat.",
            "createdAt": "2023-07-29T12:36:13.173Z",
            "updatedAt": "2023-07-29T12:36:13.173Z",
            "user": {
                "id": 2,
                "username": "mel-hada",
                "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
            }
        }
    ]
}
```

**Action**

``
    Get messages of a given chat id
``

##

**ACTION** : `sendDM`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `DM`

**Auth required** : YES

**Data required**

```json
{
    "toId": number,
    "message": string 
}
```

**Data recieved**

```json
{
    "type": "DM",
    "message": {
        "message": "Hi",
        "user": {
            "id": 1,
            "username": "mabenchi",
            "avatar": "http://localhost:3000/public/img/Screenshot from 2023-07-27 12-14-51.png"
        },
        "user2": {
            "id": 2,
            "username": "mel-hada",
            "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
        },
        "createdAt": "2023-07-29T14:03:17.988Z",
        "updatedAt": "2023-07-29T14:03:17.988Z",
        "type": null,
        "id": 127
    }
}
```

**Action**

``
    Send a message to a user if user is not blocked by each other
``

##

**ACTION** : `getDMMessages`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `DMmessages`

**Auth required** : YES

**Data required**

```json
{
    "userId": number,
}
```

**Data recieved**

```json
{
    "type": "DMMessages",
    "user": 2,
    "messages": [
        {
            "id": 105,
            "message": "SLMM",
            "createdAt": "2023-07-28T20:57:15.867Z",
            "updatedAt": "2023-07-28T20:57:15.867Z",
            "user": {
                "id": 1,
                "username": "mabenchi",
                "avatar": "http://localhost:3000/public/img/Screenshot from 2023-07-27 12-14-51.png"
            }
        }
    ]
}
```

**Action**

``
    The user get his DM messages with another user.
``


##

**ACTION** : `sendInvite`

**EVENT** : `Notification`

**EVENT TYPE** : `invitation`

**Auth required** : YES

**Data required**

```json
{
    "toId": number,
    "chatId": number
}
```

**Data recieved**

```json
{
    "type": "invitation",
    "invitation": {
        "id": "77b3e03a-c890-4d16-a876-b147a691fbfc",
        "title": "24",
        "from": {
            "id": 2,
            "username": "mel-hada",
            "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
        }
    }
}
```

**Action**

``
    The user get his DM messages with another user.
``

##

**ACTION** : `acceptInvite`

**EVENT** : `receiveMessage`

**EVENT TYPE** : `notification`

**Auth required** : YES

**Data required**

```json
{
    "id": "77b3e03a-c890-4d16-a876-b147a691fbfc"
}
```

**Data recieved**

```json
{
    "type": "notification",
    "message": "mabenchi joined the chat.",
    "from": {
        "id": 2,
        "username": "mel-hada",
        "avatar": "https://cdn.intra.42.fr/users/1d016c99c614156e08de853b9f3ba0d8/mel-hada.jpg"
    },
    "chatRoomId": 79
}
```

**Action**

``
    The user get his DM messages with another user.
``
