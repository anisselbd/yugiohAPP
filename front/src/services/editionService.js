import axios from "axios";

function getAllEditions() {
    return axios.get("http://localhost:3000/api/editions");
}

export default {
    getAllEditions
}