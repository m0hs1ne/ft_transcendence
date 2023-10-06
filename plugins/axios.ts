import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const defaultUrl = "<https://localhost:3000>";

  let api = axios.create({
    baseUrl: defaultUrl,
    headers: {
      common: {},
    },
  });
return {
    provide: {
      api: api,
    },
  };
});