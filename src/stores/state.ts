import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    MyId: null,
    ChannelList: [],
    DmChatroomsList:[{}],
    ActiveChannelData: [],
    ActiveChannelId: null,
    ActiveChannelTitle:'',
    ActiveMessageChannelId: {},
    ActiveMembersChannelId: {},
    MyRoleInActiveChannelID:'',
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

    async fetchChannelById() {
      console.log("Up date the channnel")
      try {
        this.ActiveChannelData = await axios.get(
          `http://localhost:3000/api/chat-rooms/${this.ActiveChannelId}/`,
          { withCredentials: true },
        );
        this.MyId = this.ActiveChannelData.data.id;
        this.ActiveMembersChannelId = this.ActiveChannelData.data.members;
        this.ActiveMessageChannelId = this.ActiveChannelData.data.messages;
     
      } catch (error) {
        console.log("fetch channel by id error: ", error);
      }
    },

    UpdateChannelId(id,title) {
      this.ActiveChannelId = id;
      this.ActiveChannelTitle = title
      console.log("update Channel id ", id);
      // this.fetchChannelById()
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
    async fetchDataForDmChatRooms() {
        try {
          this.DmChatroomsList = await axios.get(
            `http://localhost:3000/api/chat-rooms/DM_chatrooms`,
            { withCredentials: true },
          );
        } catch (error) {
          console.log("fetch friends by id error: ", error);
        }
     console.log( "The state in ",this.DmChatroomsList)
    },
  },
});
