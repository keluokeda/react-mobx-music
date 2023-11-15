import {observer} from "mobx-react-lite";
import {makeAutoObservable, runInAction} from "mobx";
import {checkLoginKey, createLoginQRUrl, loginStatus} from "../api/MusicService";
import {useState} from "react";
import {AppBar, Button, CircularProgress, Toolbar, Typography} from "@mui/material";
import {QRCodeSVG} from "qrcode.react";
import {toast} from "react-toastify";
import {NavigateFunction, useNavigate} from "react-router-dom";

class LoginViewModel {
    qrContent: string | undefined;
    key: string | undefined;
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.loadQrAndKey().then();
    }

    get buttonEnable() {
        return !this.loading && this.qrContent !== undefined
    }

    /**
     * 加载二维码和key
     */
    async loadQrAndKey() {
        runInAction(() => {
            this.qrContent = undefined
            this.key = undefined
        })
        try {
            const [url, key] = await createLoginQRUrl();
            runInAction(() => {
                this.key = key;
                this.qrContent = url;
            });
        } catch (e) {
            console.log(e);
            this.qrContent = undefined
            this.key = undefined
        }
    }

    /**
     * 登录
     */
    async login(navigation: NavigateFunction) {
        if (this.key === undefined) {
            return;
        }
        this.loading = true;
        try {
            const response = await checkLoginKey(this.key);
            console.log(response);


            if (response.code === 803) {
                //记录用户id
                await loginStatus()
                navigation('/main')
            } else {
                // showToastMessage(response.message);
                toast(response.message, {
                    type: 'error'
                })
            }

            runInAction(() => {
                this.loading = false;
            });
        } catch (e) {
            runInAction(() => {
                this.loading = false;
            });
            // showToastMessage('登录失败');
            toast('登录失败')
        }
    }
}

function LoginPage() {
    const [viewModel] = useState(() => new LoginViewModel())

    const navigation = useNavigate()


    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // justifyContent: "center",
            height: "100vh"
        }}>
            <AppBar position={"static"}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        扫码登录
                    </Typography>
                </Toolbar>
            </AppBar>
            {
                viewModel.qrContent === undefined ?
                    <div style={{
                        width: 200,
                        height: 200,
                        marginTop: 32,
                        marginBottom: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>

                        <CircularProgress/>

                    </div>
                    :

                    <QRCodeSVG value={viewModel.qrContent ?? ''} size={200}
                               style={{marginTop: 32, marginBottom: 32}}/>

            }

            <Button variant={'contained'}
                    onClick={() => {
                        viewModel.login(navigation).then()
                    }}
                    style={{width: 200, marginTop: 16}} disabled={!viewModel.buttonEnable}>我已扫码</Button>


            <Button variant={'outlined'}
                    onClick={() => {
                        viewModel.loadQrAndKey().then()
                    }}
                    style={{width: 200, marginTop: 16}} disabled={!viewModel.buttonEnable}>刷新二维码</Button>

            {
                viewModel.loading ?? <CircularProgress style={{marginTop: 16}}/>
            }
        </div>
    )
}

export default observer(LoginPage);
