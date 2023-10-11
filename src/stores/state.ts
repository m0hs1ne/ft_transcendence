import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    MyId: null,
    ChannelList: [],

    ActiveChannelData: [],
    ActiveChannelId: null,
    ActiveMessageChannelId: {},
    ActiveMembersChannelId: {},

    UserFriends: {},
    ChannelInvitation: {},
  }),

  actions: {
    UserId(myId) {
      this.MyId = myId;
    },
    UpdateInvitaion(list)
    {
      this.ChannelInvitation = list
    },

    UpdateChannelId(id) {
      this.ActiveChannelId = id;
      console.log("update id ", id);
    },
    async fetchChannelById() {
      try {
        this.ActiveChannelData = await axios.get(
          `http://localhost:3000/api/chat-rooms/${this.ActiveChannelId}/`,
          { withCredentials: true },
        );
        this.MyId = this.ActiveChannelData.data.id;
        this.ActiveMembersChannelId = this.ActiveChannelData.data.members;
        this.ActiveMessageChannelId = this.ActiveChannelData.data.messages;
          console.log("ActiveMembersChannelId", this.ActiveMembersChannelId);
      } catch (error) {
        console.log("fetch channel by id error: ", error);
      }
    },

    async FetchFriend() {
      try {
        this.UserFriends = await axios.get(
          `http://localhost:3000/api/users/friends/`,
          { withCredentials: true },
        );
      } catch (error) {
        console.log("fetch friends by id error: ", error);
      }
    },

    async GfetchData() {
      this.$socket.emit("myChatRooms", {}, () => {});
      console.log(" Noting ");
      this.ChannelList = await this.$socket.on("ChatRoomList");
      console.log("This is Channel list ", this.ChannelList);
    },

    
  },
});
