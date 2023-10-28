<script>
import axios from "axios";
import { ref } from 'vue'


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
                    `http://localhost:3000/api/users/profile/${props.leftID}`,
                    {
                        withCredentials: true,
                    }
                );
                const res2 = await axios.get(
                    `http://localhost:3000/api/users/profile/${props.rightID}`,
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

        return { leftData, rightData, fetchData, modes }
    },
    async mounted() {
        await this.fetchData();
    }
};
</script>


<template>
    <div class="p-2.5 md:p-5 flex items-center justify-between rounded-full  custom-box-shadow dark:bg-slate-900">
        <div class="flex items-center justify-start w-50 md:w-80 ">
            <div class="w-20 h-20 md:w-28 md:h-28 bg-gray-300 rounded-full shadow">
                <img referrerpolicy="no-referrer" :src="this.leftData.avatar" alt="Avatar"
                    class=" object-cover rounded-full w-20 h-20 md:w-28 md:h-28">
            </div>
            <p class=" font-semibold md:text-xl tracking-wide mx-2  dark:text-white overflow-ellipsis">
                {{ this.leftData.username }}
            </p>
        </div>

        <div class="flex flex-col items-center justify-center">
            <p class="font-bold text-xl dark:text-white text-center line-clamp-1">
                {{ this.modes[limit] }}
            </p>
            <hr class="w-full max-w-[100px] my-3 px-1 h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />
            <p class="font-bold text-xl dark:text-white text-center line-clamp-1">
                {{ leftScore }} : {{ rightScore }}
            </p>
        </div>

        <div class="flex items-center justify-end w-50 md:w-80 ">
            <p class=" font-semibold md:text-xl tracking-wide mx-2 dark:text-white overflow-ellipsis">
                {{ this.rightData.username }}
            </p>
            <div class="w-20 h-20 md:w-28 md:h-28 bg-gray-300 rounded-full shadow">
                <img referrerpolicy="no-referrer" :src="this.rightData.avatar" alt="Avatar"
                    class=" object-cover rounded-full w-20 h-20 md:w-28 md:h-28">
            </div>
        </div>
    </div>
</template>