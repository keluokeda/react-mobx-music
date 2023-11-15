import {CircularProgress} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {loginStatus} from "../api/MusicService";

export default function SplashPage() {

    const navigation = useNavigate()

    useEffect(() => {
        loginStatus().then((response) => {
            if (response.data.profile?.userId) {
                navigation('/main', {
                    replace: true
                })
            } else {
                navigation('/login', {
                    replace: true
                })
            }
        })
    }, [navigation])

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            <CircularProgress/>

        </div>
    )
}
