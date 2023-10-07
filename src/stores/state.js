


import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    MyId:null,
    ActiveChannelData: [],
    ActiveChannelId:null,
    ActiveMessageChannelId:{},
    ActiveMembersChannelId:{},
    UserId:null,
    UserFriends:{}
  }),
  actions:
  {
    UserId(myId)
    {
      this.MyId = myId;
    },
    UpdateChannelId(id)
    {
      this.ActiveChannelId = id
      console.log("update id ", id)
    },
    async fetchChannelById() {
      try {
        this.ActiveChannelData = await axios.get(`http://localhost:3000/api/chat-rooms/${this.ActiveChannelId}/`, { withCredentials: true })
        this.ActiveMembersChannelId = this.ActiveChannelData.data.members;
        this.ActiveMessageChannelId = this.ActiveChannelData.data.messages;
      } catch(error)
      {
        console.log("fetch channel by id error: ", error)
      }  
    },

    async FetchFriend() {
      try {
        this.UserFriends = await axios.get(`http://localhost:3000/api/users/friends/`, { withCredentials: true })
    
      } catch(error)
      {
        console.log("fetch friends by id error: ", error)
      }  
    },


  },
});