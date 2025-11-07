import axios from "axios";

function getAllRaretes() {
    return axios.get("http://localhost:3000/api/raretes");
}

export default {
    getAllRaretes
}