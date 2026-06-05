import { useLayoutEffect } from "react"

import Layout from "./Layout"
import api from "./api/client"
import { login } from "./api/user"

const App = () => {
    useLayoutEffect(() => {
        login("s1z@gmail.com", "Zxcvb123er_").then(data => {
            console.log("Login successful:", data);
        })

        api.get("/auth/protected").then(res => {
            console.log("Protected data:", res.data);
        }).catch(err => {
            console.log("Error fetching protected data:", err.response);
        })
    })

    return (
        <Layout />
    )
}

export default App
