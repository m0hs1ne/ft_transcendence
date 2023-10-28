<template>
    <div>
        <div v-if="isOpend" class="fixed top-4 right-4 bg-blue-300 text-white px-4 py-2 rounded-lg shadow-lg">

            <h2 class="text-xl font-bold mb-4 from-neutral-600 "> {{ this.strings }}</h2>
            <!-- <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                La
            </button> -->
            <button @click="SaveChannel" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ah
            </button>

        </div>
    </div>
</template>
    
<script>
import { useUserStore, GameData } from '../../stores/state.ts';
export default {
    setup() {
        const userStore = useUserStore();
        const gameData = GameData();
        return { userStore, gameData };
    },
    data() {
        return {
            ChannelName: '',
            isOpend: false,
            strings: '',
            isChanllenge: false,
            message: {},
        };
    },
    methods: {
        async SaveChannel() {
            console.log("  ", this.message)
            this.$GameSocket.emit('Chall', {
                oponentId: this.message.invitation.to.id,
                challId: this.message.invitation.from.id,
                type: 'opp',
                mode: this.message.invitation.mode,
            })

            this.isOpend = false;
            this.userStore.Opponent = {};
            this.userStore.creatchallenge = false;
            this.gameData.random = false;
            this.$router.push('/play');
        },

        closePopup() {
            this.isOpend = false;
            this.userStore.Opponent = '';
            if (this.message.invitation.to) {
                this.$GameSocket.emit('Chall', {
                    oponentId: this.message.invitation.to.id,
                    challId: this.message.invitation.from.id,
                    type: 'refuse',
                    mode: this.message.invitation.mode,
                })
            }
            this.userStore.Opponent = {};
            this.userStore.creatchallenge = false;
        },
        showToast() {
            setTimeout(() => {
                this.hideToast();
            }, 5000);
        },
        hideToast() {
            this.isOpend = false;
            console.log(this.message)
            if (this.message.invitation.to) {
                this.$GameSocket.emit('Chall', {

                    oponentId: this.message.invitation.to.id,
                    challId: this.message.invitation.from.id,
                    type: 'refuse',
                    mode: this.message.invitation.mode,
                })
            }
            this.userStore.Opponent = {};
            this.userStore.creatchallenge = false;
        },
    },
    mounted() {
        this.$socket.on("Notification", (messages) => {
            this.message = messages
            console.log('Notification popinv dddddd ', messages.invitation)
            if (messages.type == 'challenge') {
                console.log(messages)
                this.strings = `${messages.invitation.to.username} Challend you 👊.`;
                this.isOpend = true;
                this.showToast();
            }
            // console.log(" This is friends: befor ", this.friends)
        });
    },
};
</script>