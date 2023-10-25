<template>
    <div>
        <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
            <div class="bg-white rounded-lg p-6">
                <h2 class="text-xl font-bold mb-4">Create Challange:</h2>
                <div>
                    <div class="mt-4">
                        <label for="dropdown" class="mr-2">Chose the mode of Game:</label>
                        <select v-model="selectedOption"
                            class="bg-white border border-gray-300 px-4 py-2 rounded">
                            <option value="20">Classic</option>
                            <option value="14">Rapid</option>
                            <option value="3">Blitz</option>
                            <option value="1">Bullet</option>
                        </select>
                    </div>
                </div>
                <button @click="closePopup"
                    class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
                <button @click="SaveChannel"
                    class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Send Invite
                </button>
            </div>
        </div>

    </div>
</template>
    
<script>
import { useUserStore , GameData} from '../../stores/state.ts';
export default {
    setup() {
        const userStore = useUserStore();
        const gameData = GameData();
        return { userStore, gameData };
    },
    data() {
        return {
            ChannelName: '',
            selectedOption: 'classic',
            password: '',
            isOpend: false,
            message: false
        };
    },
    methods: {
        openPopup() {
            this.isOpend = true;
        },

        async SaveChannel() {
            console.log(" this.userStore.Opponent ", this.userStore.Opponent)
            this.$socket.emit("sendChallenge",
                {
                    toId: (this.userStore.Opponent.id),
                    mode: this.selectedOption,
                }, () => { });


            this.$GameSocket.emit('Chall',
                {
                    oponentId: this.userStore.Opponent.id,
                    challId: this.userStore.MyId,
                    type: "challenger",
                    mode: this.selectedOption,
                })
            this.$GameSocket.on("start", (data) => {
                console.log("start a sahbi", data)
                this.gameData.random = false;
                this.$router.push('/play');
            })
            
            this.isOpend = false;
            this.userStore.creatchallenge = false;
        },

        closePopup() {
            this.isOpend = false;
            this.userStore.Opponent = {};
            this.userStore.creatchallenge = false;
        },
    },
    mounted() {
        this.isOpend = true;



    },
};
</script>
    