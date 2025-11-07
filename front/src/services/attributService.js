import axios from "axios";

function getAllAttributs() {
    return axios.get("http://localhost:3000/api/attributs");
}

export default {
    getAllAttributs
}