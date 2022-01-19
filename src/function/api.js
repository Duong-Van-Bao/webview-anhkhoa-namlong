import { postMethod } from "@/constants/services";

const submit_data = {
  async post (path, body) {
    try {
       return await postMethod(path, body)
    } catch (e) {
      console.log(e)
    }
  },
}

export default submit_data
