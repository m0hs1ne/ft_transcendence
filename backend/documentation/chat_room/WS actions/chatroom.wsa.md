# Chat Room

**ACTION** : `createChatRoom`

**EVENT** : `ChatRoomList`

**EVENT TYPE** : `new`

**Auth required** : YES

**Data required**

```json
{
    "title": "string",
    "privacy": "private | public | protected"
    "password": "present a password if privacy is protected, if not this will be ignored"
}
```

**Data recieved**

```json
{
    "type": "new",
    "chatroom": {
        "id": 81,
        "title": "string",
        "owner": ownerId,
        "privacy": "protected"
    }
}
```

**Action**

``
    Create new chatroom
``

##

**ACTION** : `findAllChatRooms`

**EVENT** : `ChatRoomList`

**EVENT TYPE** : `all`

**Auth required** : YES


**Data recieved**

```json
{
    "type": "all",
    "chatrooms": [
        {
            "id": 78,
            "title": "mohim",
            "owner": 3,
            "privacy": "protected"
        },
        {
            "id": 79,
            "title": "24",
            "owner": 2,
            "privacy": "public"
        }
    ]
}
```

**Action**

``
    Returns all chat rooms except private ones
``

##

**ACTION** : `updateChatRoom`

**EVENT** : `ChatRoomList`

**EVENT TYPE** : `updated`

**Auth required** : YES

**Data required**

```json
{
    "title": "string"
    "privacy": "protected | public | private"
    "password": "present a password if privacy is protected, if not this will be ignored"
}
```
***Remark: it don't need all of them to get updated, but password should be only passed if privacy is protected else it will be ignored***

**Data recieved**

```json
{
    "type": "updated",
    "chatrooms": {
        "id": 81,
        "owner": 1,
        "privacy": "private",
        "ifProtectedPass": null,
        "updatedAt": "2023-07-28T21:11:32.638Z"
    }
}
```

**Action**

``
    Update a chatroom if the user is the owner
``

##

**ACTION** : `removeChatRoom`

**Auth required** : YES

**Data required**

```json
{
    "chatId": "number"
}
```

**Action**

``
    Delete a chatroom if the user is the owner
``