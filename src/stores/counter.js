


import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    ActiveChannelData: [],
    ActiveChannelId:null,
    UserId:null
  }),
  actions:
  {
    UpdateChannelId(id)
    {
      this.ChannelId = id
      console.log("update id ", id)
    },
    async fetchChannelById() {
      try {
        this.ChannelData = await axios.get(`http://localhost:3000/api/chat-rooms/${this.ChannelId}/`, { withCredentials: true })
        console.log("This is id ", this. ActiveChannelId, " and this is res ", this. ActiveChannelData )
      } catch(error)
      {
        console.log("fetch channel by id error: ", error)
      }  
    },

  },
});