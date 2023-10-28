# Chat Room

**EVENT** : `ChatRoomList`

**Auth required** : YES

**Data recieved**

```json
{
    "type": "all | new | mylist | updated",
    "chatrooms": [
        {
            "id": 3,
            "title": "title",
            "privacy": "public | private | protected"
        }
    ]
}
```

**Content**

``
    Any chat room list when creating a new chat room, searching chat rooms, updated chat rooms
``