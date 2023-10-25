<template>
    <div>

        <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
            <div class="bg-white rounded-lg p-6">
                <h2 class="text-xl font-bold mb-4">Member setting: </h2>
                <div>
                    <div class="mt-4">
                        <label for="dropdown" class="mr-2 text-xll"> Member Status: </label>
                        <select id="dropdown" v-model="selectedOptionStatus"
                            class="bg-white border border-gray-300 px-4 py-2 rounded">
                            <option value="normal">Normal</option>
                            <option value="banned">banned</option>
                            <option value="mute5">Mute 5 min</option>
                            <option value="mute10">Mute 10 min</option>
                        </select>
                    </div>

                    <div class="mt-4">
                        <label for="dropdown" class="mr-2 text-xll">Member role:</label>
                        <select id="dropdown" v-model="selectedOptionRole"
                            class="bg-white border border-gray-300 px-4 py-2 rounded">
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                        </select>
                    </div>
                </div>
                <button @click="closePopup"
                    class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
                <button @click="kick()" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    kick
                </button>
                <button v-if="selectedOptionRole && selectedOptionStatus != ''" @click="save()"
                    class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save
                </button>
            </div>
        </div>

    </div>
</template>
  
<script>
import { useUserStore } from '../../stores/state.ts';
export default {
    setup() {
        const userStore = useUserStore();
        return { userStore };
    },
    data() {
        return {

            selectedOptionRole: '',
            isOpend: true,
            selectedOptionStatus: '',
            OldStatus: '',
            OldRole: '',
        };
    },
    methods: {
        openPopup() {
            this.isOpend = true;
        },
        kick() {
            console.log("Kick ");
            this.$socket.emit("kickMember",
                {
                    "memberId": this.userStore.MemberRoleStatus.user.id,
                    "chatId": this.userStore.ActiveChannelId
                })
            this.closePopup()
        },

        MuteThisUser(time) {

            console.log("Time ", time)
            this.$socket.emit("updateMemberStatus",
                {
                    "memberId": this.userStore.MemberRoleStatus.user.id,
                    "chatId": this.userStore.ActiveChannelId,
                    "status": "muted",
                    "mutedFor": time
                });
            if (time) {
                console.log("I am in time condition ");
                this.$socket.on("receiveMessage", (data) => {
                    console.log("This is data In Must ", data)
                })
            }
        },
        updateStatus(status) {
            console.log("this user is banned: ", status)
            if (status == 'mute5') {
                this.MuteThisUser(5)
            }
            if (status == 'muste10') {
                this.MuteThisUser(10)
            }
            else {

                this.$socket.emit("updateMemberStatus",
                    {
                        "memberId": this.userStore.MemberRoleStatus.user.id,
                        "chatId": this.userStore.ActiveChannelId,
                        "status": status,
                    });
                console.log("I am gonne to {", status, "} this member: ");
            }
        },

        updateRole() {
            console.log("Update role ")
            console.log("Hello this is the object ", this.userStore.MemberRoleStatus, "ddd")
            this.$socket.emit("updateMemberRole",
                {
                    "memberId": this.userStore.MemberRoleStatus.user.id,
                    "chatId": this.userStore.ActiveChannelId,
                    "role": this.selectedOptionRole,
                });

        },
        closePopup() {
            this.isOpend = false;
            this.userStore.MemberRoleStatus = ''
        },
        save() {
            this.isOpend = false;
            console.log("Hello the old status ", this.OldStatus);
            console.log("Hello the new status ", this.selectedOptionStatus);

            console.log("Hello the old role ", this.OldRole);
            console.log("Hello the new role ", this.selectedOptionRole);

            if (this.selectedOptionStatus != this.OldStatus) {
                //  if (this.selectedOptionStatus == 'banned')
                //    this.updateStatus('banned');
                // else {
                this.updateStatus(this.selectedOptionStatus)
                // }
            }
            if (this.userStore.MemberRoleStatus.role != this.selectedOptionRole)
                this.updateRole()
            this.closePopup()
        },
    },

    mounted() {
        console.log("Hello this is the object ", this.userStore.MemberRoleStatus.role, this.userStore.MemberRoleStatus.userStatus)
        this.selectedOptionRole = this.OldRole = this.userStore.MemberRoleStatus.role;
        if (this.userStore.MemberRoleStatus.userStatus === 'muted') {
            console.log("I am here ")
            this.selectedOptionStatus = this.OldStatus = "mute5";
        }
        else
            this.selectedOptionStatus = this.OldStatus = this.userStore.MemberRoleStatus.userStatus
    }
};
</script>
  