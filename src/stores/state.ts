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
    activeChatId: -1,
    ItemClicked :"",
    IndexItemClicked:""
  }),

  actions: {
    UserId(myId) {
      this.MyId = myId;
    },
    UpdateInvitaion(list) {
      this.ChannelInvitation = list;
    },

    async fetchChannelById() {
      if(this.ActiveChannelId == null)
         return
      try {
        this.ActiveChannelData = await axios.get(
          `http://10.32.120.112:3000/api/chat-rooms/${this.ActiveChannelId}/`,
          { withCredentials: true },
        );
       
        this.MyId = this.ActiveChannelData.data.id;
        this.ActiveMembersChannelId = this.ActiveChannelData.data.members;
        this.ActiveMessageChannelId = this.ActiveChannelData.data.messages;
        this.ActiveChannelTitle = this.ActiveChannelData.data.title;
        // console.log(this.ActiveChannelData.data.messages);
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
          `http://10.32.120.112:3000/api/users/friends/`,
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
          `http://10.32.120.112:3000/api/chat-rooms/DM_chatrooms`,
          { withCredentials: true },
          );
          
          this.DmChatroomsList = this.DmChatroomsList.data;
          console.log("---------------------------------------------------------->  " , this.DmChatroomsList)
      } catch (error) {
        console.log("fetch friends by id error: ", error);
      }
      console.log(this.DmChatroomsList.length)
      if(this.DmChatroomsList.length == 0)
      {
         this.ItemClicked = ""
         this.ActiveChannelId = null
      }

    },

    async RemoveChatRome() {
      const t = await axios.delete(
        `http://10.32.120.112:3000/api/chat-rooms/${this.ActiveChannelId}`,
        { withCredentials: true },
      );
      //await this.fetchDataForDmChatRooms();
    },
  
  },
});

export const SharedData = defineStore("Shard", {
  state: () => ({
    isLoggedIn: false,
    isError: false,
    isLoading: false,
    userData: {},
    friends: [],
    blocked: [],
  }),
  getters: {},
  actions: {
    async authState() {
      try {
        await axios.get("http://10.32.120.112:3000/api/auth/success/", {
          withCredentials: true,
        });
        this.isLoggedIn = true;
      } catch (error) {
        this.isLoggedIn = false;
      }
      console.log("isLoggedIN", this.isLoggedIn);
    },

    async fetchData() {
      this.isError = false;
      this.isLoading = true;
      try {
        await this.authState();
        if (this.isLoggedIn) {
          const res = await axios.get(
            "http://10.32.120.112:3000/api/users/profile/",
            {
              withCredentials: true,
            },
          );
          this.userData = res.data;
          this.friends = res.data.friends;
          this.blocked = res.data.blocked;
          console.log("userData: \n", this.userData);
          console.log("friends: \n", this.friends);
          // console.log("blocked: \n", this.blocked);
        }
      } catch (error) {
        console.log("Getting user profile error\n", error);
        this.isError = true;
      }
      this.isLoading = false;
    },
  },
});

export const GameData = defineStore("Game", {
  state: () => ({
    modeLimit: String,
    modeTitle: String,
    random: true,
  }),

  actions: {
    setMode(limit, title) {
      this.modeLimit = limit;
      this.modeTitle = title;
      this.random = true;
    },
  },
});
