import axios from "axios";

function getAllTypes() {
    return axios.get("http://localhost:3000/api/allType");
}

export default {
    getAllTypes
}