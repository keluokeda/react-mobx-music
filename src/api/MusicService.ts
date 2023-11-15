import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ke-music.cpolar.top/',
    withCredentials: true,
});

instance.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        timestamp: Date.now(),
    };
    return config;
});

/**
 * 检查登录状态
 */
export async function loginStatus(): Promise<LoginStatusResponse> {
    const response = await instance.get<LoginStatusResponse>('login/status');
    const data = response.data;

    const userId = data?.data?.profile?.userId;
    if (userId) {
        console.log(`user id = ${userId}`);
        setUserId(userId);
    } else {
        removeUserId()
    }
    return data;
}

/**
 * 退出登录
 */
export async function logout(): Promise<boolean> {
    await instance.get('logout');
    removeUserId();
    return true;
}

/**
 * 创建扫码登录二维码地址
 */
export async function createLoginQRUrl(): Promise<[string, string]> {
    const loginQrKeyResponse = await instance.get<LoginQrKeyResponse>(
        'login/qr/key',
    );

    const key = loginQrKeyResponse.data.data.unikey;
    const response = await instance.get<LoginQrCreateResponse>(
        'login/qr/create',
        {
            params: {
                key: key,
            },
        },
    );

    return [response.data.data.qrurl, key];
}

/**
 * 检查是否登录成功
 */
export async function checkLoginKey(key: string): Promise<CodeMessageResponse> {
    const response = await instance.get<CodeMessageResponse>('login/qr/check', {
        params: {
            key: key,
        },
    });

    return response.data;
}

/**
 * 获取当前用户的歌单
 */
export async function getCurrentUserPlaylists(): Promise<Array<Playlist>> {
    const userId = getUserId();

    if (userId === null) {
        return [];
    }
    const userPlaylistList = await instance.get<UserPlaylistList>(
        'user/playlist',
        {
            params: {
                limit: 10000,
                uid: userId,
            },
        },
    );

    return userPlaylistList.data.playlist;
}

/**
 * 获取消息列表
 */
export async function getPrivateMessageList() {
    const response = await instance.get<PrivateMessageListResponse>(
        'msg/private',
        {
            params: {
                limit: 1000,
            },
        },
    );
    return response.data.msgs;
}

/**
 * 登录状态响应
 */
export interface LoginStatusResponse {
    data: {
        profile?: {
            userId: number;
        };
    };
}

interface LoginQrKeyResponse {
    code: number;
    data: {
        unikey: string;
    };
}

interface LoginQrCreateResponse {
    code: number;
    data: {
        qrurl: string;
    };
}

export interface CodeMessageResponse {
    code: number;
    message: string;
}

export interface User {
    userId: number;
    nickname: string;
    avatarUrl: string;
    signature: string;
}

export interface PrivateMessageItem {
    lastMsgTime: number;
    lastMsg: string;
    fromUser: User;
    toUser: User;
    lastMsgId: number;
}

export interface PrivateMessageListResponse {
    msgs: PrivateMessageItem[];
}

export interface LastMessage {
    msg: string;
    type: number;
}

export interface UserPlaylistList {
    playlist: Playlist[];
}

export interface Playlist {
    creator: User;
    coverImgUrl: string;
    tags: string[];
    name: string;
    id: number;
    trackCount: number;
}

/**
 * 保存用户id
 */
function setUserId(userId: number) {
    sessionStorage.setItem('userId', userId.toString());
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function removeUserId() {
    sessionStorage.removeItem('userId');
}
