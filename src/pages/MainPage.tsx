import {makeAutoObservable, runInAction} from "mobx";
import React, {useEffect, useState} from "react";
import {getCurrentUserPlaylists, Playlist} from "../api/MusicService";
import {AppBar, Box, List, ListItem, Toolbar, Typography} from "@mui/material";

function MainPage() {

    const [viewModel] = useState(() => new MainViewModel());

    useEffect(() => {
        viewModel.loadUserPlaylist().then();
    }, [viewModel]);

    return <Box height={'100vh'} display={'flex'} flexDirection={'column'}>

        <AppBar position={'relative'}>
            <Toolbar>

                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    首页
                </Typography>
            </Toolbar>
        </AppBar>

        <List style={{flex: 1,}}>
            {
                viewModel.playlists.map((item) => {
                    return <ListItem key={item.id}>{item.name}</ListItem>
                })
            }
        </List>
    </Box>
}

class MainViewModel {

    playlists: Array<Playlist> = []


    constructor() {
        makeAutoObservable(this)
    }

    async loadUserPlaylist() {
        const list = await getCurrentUserPlaylists()
        runInAction(() => {
            this.playlists = list
        })
    }
}

export default MainPage;
