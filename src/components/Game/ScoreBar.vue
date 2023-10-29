<script >
import axios from "axios";
import { SharedData } from './../../stores/state.ts';
import { ref } from 'vue';


export default {
    props:
    {
        leftID: '',
        rightID: '',
        rightScore: Number,
        leftScore: Number,
        limit: '',
    },
    setup(props) {
        const state = SharedData();
        const leftData = ref({});
        const rightData = ref({});
        const modes = {
            '20': 'Classic',
            '14': 'Rapid',
            '3': 'Blitz',
            '1': 'Bullet',
        };

        const fetchData = async () => {

            // Get user profile data
            try {
                console.log("==> ", props.leftID, props.rightID);
                const res1 = await axios.get(
                    `http://10.32.125.38:3000/api/users/profile/${props.leftID}`,
                    {
                        withCredentials: true,
                    }
                );
                const res2 = await axios.get(
                    `http://10.32.125.38:3000/api/users/profile/${props.rightID}`,
                    {
                        withCredentials: true,
                    }
                );

                leftData.value = res1.data;
                rightData.value = res2.data;
            } catch (error) {
                console.log("Getting user profile error\n", error);
            }
        };

        return { leftData, rightData, fetchData, modes, state }
    },
    async mounted() {
        await this.fetchData();
    }
};
</script>


<template>
    <div class="p-2.5 flex items-center justify-between rounded-full custom-box-shadow dark:bg-slate-900">
        <div class="flex items-center justify-start w-50 md:w-60 ">
            <div class="w-16 h-16 md:w-24 md:h-24 bg-gray-300 rounded-full shadow">
                <img referrerpolicy="no-referrer" :src="this.leftData.avatar" alt="Avatar"
                    class=" aspect-square object-cover rounded-full w-16 h-16 md:w-24 md:h-24">
            </div>
            <p class=" font-semibold tracking-wide mx-2  dark:text-white overflow-ellipsis line-clamp-1">
                {{ this.leftData.username }}
            </p>
        </div>

        <div class="flex flex-col items-center justify-center px-1">
            <p class="font-bold  md:text-xl dark:text-white text-center line-clamp-1">
                {{ this.modes[limit] }}
            </p>
            <hr class="w-full max-w-[100px] my-1 px-1 h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />
            <p class="font-bold text-xl dark:text-white text-center line-clamp-1">
                {{ leftScore }} : {{ rightScore }}
            </p>
        </div>

        <div class="flex items-center justify-end w-50 md:w-60 ">
            <p class=" font-semibold tracking-wide mx-2 dark:text-white overflow-ellipsis line-clamp-1">
                {{ this.rightData.username }}
            </p>
            <div class="w-16 h-16 md:w-24 md:h-24 bg-gray-300 rounded-full shadow">
                <img referrerpolicy="no-referrer" :src="this.rightData.avatar" alt="Avatar"
                    class=" aspect-square object-cover rounded-full w-16 h-16 md:w-24 md:h-24">
            </div>
        </div>
    </div>
</template>