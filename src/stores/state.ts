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
          `http://10.32.125.38:3000/api/chat-rooms/${this.ActiveChannelId}/`,
          { withCredentials: true },
        );
        console.log(this.ActiveChannelData);
        if (this.ActiveChannelData.data.result == "error") {
          console.log("errror");
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
          `http://10.32.125.38:3000/api/users/friends/`,
          { withCredentials: true },
        );
      } catch (error) {
        console.log("fetch friends by id error: ", error);
      }
    },

    // async GfetchData() {
    //   this.$socket.emit("myChatRooms", {}, () => {});
    //   console.log(" Noting ");
    //   this.ChannelList = await this.$socket.on("ChatRoomList");
    //   // console.log("This is Channel list ", this.ChannelList);
    // },

    async fetchDataForDmChatRooms() {
      try {
        this.DmChatroomsList = await axios.get(
          `http://10.32.125.38:3000/api/chat-rooms/DM_chatrooms`,
          { withCredentials: true },
        );

        this.DmChatroomsList = this.DmChatroomsList.data;
        console.log(
          "---------------------------------------------------------->  ",
          this.DmChatroomsList,
        );
      } catch (error) {
        console.log("fetch friends by id error: ", error);
      }
      console.log(this.DmChatroomsList.length);
      if (this.DmChatroomsList.length == 0) {
        this.ItemClicked = "";
        this.ActiveChannelId = null;
      }
    },

    async RemoveChatRome() {
      const t = await axios.delete(
        `http://10.32.125.38:3000/api/chat-rooms/${this.ActiveChannelId}`,
        { withCredentials: true },
      );
      //await this.fetchDataForDmChatRooms();
    },
  },
});

export const SharedData = defineStore("Shard", {
  state: () => ({
    userData: {},
    friends: [],
    blocked: [],
  }),
});

export const GameData = defineStore("Game", {
  state: () => ({
    phase: 'W',
    modeLimit: 1,
    modeTitle: 1,
    random: true,
  }),

  actions: {
    setData(limit, title, isRandom) {
      this.modeLimit = limit;
      this.modeTitle = title;
      this.random = isRandom;
      this.phase = 'W';
    },
  },
});
