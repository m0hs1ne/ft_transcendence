import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    MyId: null,
    ChannelList: [],
    DmChatroomsList: [],
    ActiveChannelData: [],
    ActiveChannelId: null,
    ActiveChannelTitle: "",
    ActiveMessageChannelId: {},
    ActiveMembersChannelId: {},
    MyRoleInActiveChannelID: "",
    UserFriends: {},
    ChannelInvitation: {},
    Action: "",
    MemberRoleStatus: "",
    error: "",
    ActiveId: {},
    Opponent: {},
    creatchallenge: false,
    UserStatus: "",
    viewMode: "List",
    screenWidth: 1000,
    ItemClicked: "",
    IndexItemClicked: "",
    invitations : []
  }),

  actions: {
    UserId(myId) {
      this.MyId = myId;
    },
    UpdateInvitaion(list) {
      this.ChannelInvitation = list;
    },

    async fetchChannelById() {
      if (this.ActiveChannelId == null || this.ActiveChannelId == -1) return;
      try {
        this.ActiveChannelData = await axios.get(
          `http://localhost:3000/api/chat-rooms/${this.ActiveChannelId}/`,
          { withCredentials: true }
        );
        //console.log(this.ActiveChannelData);
        if (this.ActiveChannelData.data.result == "error") {
          //console.log("errror");
        } else {
          this.MyId = this.ActiveChannelData.data.id;
          this.ActiveMembersChannelId = this.ActiveChannelData.data.members;
          this.ActiveMessageChannelId = this.ActiveChannelData.data.messages;
          this.ActiveChannelTitle = this.ActiveChannelData.data.title;
        }
        //console.log(this.ActiveChannelData.data.messages);
      } catch (error) {
        console.log("fetch channel by id error: ", error);
      }
    },

    UpdateChannelId(id, title) {
      if (title) {
        this.ActiveChannelId = id;
        this.ActiveChannelTitle = title;
      }
    },

    async FetchFriend() {
      try {
        this.UserFriends = await axios.get(
          `http://localhost:3000/api/users/friends/`,
          { withCredentials: true }
        );
      } catch (error) {
        console.log("fetch friends by id error: ", error);
      }
    },

    // async GfetchData() {
    //   this.$socket.emit("myChatRooms", {}, () => {});
    //   //console.log(" Noting ");
    //   this.ChannelList = await this.$socket.on("ChatRoomList");
    //   //console.log("This is Channel list ", this.ChannelList);
    // },

    async fetchDataForDmChatRooms() {
      try {
        let DM_chatrooms = await axios.get(
          `http://localhost:3000/api/chat-rooms/DM_chatrooms`,
          { withCredentials: true }
        );
        
        this.DmChatroomsList = DM_chatrooms.data.result;
        this.invitations = DM_chatrooms.data.invitations;

        //console.log(  this.invitations ," ---------------------------------------------------------->  ", DM_chatrooms);
        
      } catch (error) {
        //console.log("fetch friends by id error: ", error);
      }
      //console.log(this.DmChatroomsList.length);
      if (this.DmChatroomsList.length == 0) {
        this.ItemClicked = "";
        this.ActiveChannelId = null;
      }
    },

    async RemoveChatRome() {
      const t = await axios.delete(
        `http://localhost:3000/api/chat-rooms/${this.ActiveChannelId}`,
        { withCredentials: true }
      );
      //await this.fetchDataForDmChatRooms();
    },
  },
});

export const SharedData = defineStore("Shard", {
  state: () => ({
    userData: null,
    friends: [],
    blocked: [],
    blockedBy: [],
  }),
  actions: {
    setUserData(newData) {
      this.userData = newData;
      this.friends = newData.friends;
      this.blocked = newData.blocked;
      this.blockedBy = newData.blockedBy;
    },

    async updateData() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/users/profile/",
          {
            withCredentials: true,
          }
        );
        //console.log("updateData res: ", res);
        this.setUserData(res.data);
      } catch (error) {
        console.log("updateData error\n", error);
      }
    },
  },
});

export const GameData = defineStore("Game", {
  state: () => ({
    phase: "W",
    modeLimit: '1',
    modeTitle: '1',
    random: true,
  }),

  actions: {
    setData(limit, title, isRandom) {
      this.modeLimit = limit;
      this.modeTitle = title;
      this.random = isRandom;
      this.phase = "W";
    },
  },
});
