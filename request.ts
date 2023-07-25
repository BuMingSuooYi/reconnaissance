import { app, isTokenWillExpire } from "./utils";
import { apis } from "./apis";
import { SK_LOGIN_INFO } from "./constants";
import { Toast } from "./wx";


/**
 * 自动获取access token
 */
export const getAccessToken = async (): Promise<string> => {
    //缓存判断
    const globalLoginInfo: LocalLoginInfo = app.globalData.loginInfo;
    if (globalLoginInfo) {
        if (!isTokenWillExpire(globalLoginInfo.expires_at)) {
            return globalLoginInfo.access_token;
        }
    }
    //本地存储
    const localLoginInfo = wx.getStorageSync<LocalLoginInfo>(SK_LOGIN_INFO);
    let shouldLogin = false;
    if (!localLoginInfo) {
        //需要登录
        shouldLogin = true;
    } else if (isTokenWillExpire(localLoginInfo.expires_at)) {
        //需要登录(重新登录)
        shouldLogin = true;
    }
    if (!shouldLogin) {
        app.globalData.loginInfo = localLoginInfo;
        return localLoginInfo.access_token;
    } else {
        const loginInfo: LoginInfo = await wxLogin();
        const expiresAt = loginInfo.expires_in * 1000 + Date.now();
        const _localLoginInfo: LocalLoginInfo = {
            ...loginInfo,
            expires_at: expiresAt,
        }
        wx.setStorageSync(SK_LOGIN_INFO, _localLoginInfo);
        app.globalData.loginInfo = _localLoginInfo;
        return _localLoginInfo.access_token;
    }
}

const commonErrorHandler = (res: any) => {
    if (res.statusCode === 403) {
        Toast.show("不允许访问");
    } else if (res.statusCode === 500) {
        Toast.show("出现异常");
    } else if (res.statusCode === 401) {
        Toast.show("未授权");
    } else if (res.statusCode === 400) {
        Toast.show("参数有误");
    }
}

const commonExceptionHandler = (errMsg: string) => {
    console.log(errMsg);
}

const forceResultHandler = (res: any) => {
    if (res.code === 0) {
        if ("redirect" === res.data.msg) {
            if ("web" === res.data.data.type) {
                wx.navigateTo({
                    url: "/page/webview/index?url=" + encodeURIComponent(res.data.data.url)
                });
            } else {
                wx.navigateTo({
                    url: res.data.data.url
                });
            }
        }
    }
}

const resetLoginInfo = () => {
    //@ts-ignore
    app.globalData.loginInfo = undefined;
    wx.removeStorageSync("SK_LOGIN_INFO");
}


export const request = {

    post: async <T = any>(api: string, data?: { [key: string]: any }, options?: { errorHandler: (res: any) => void }): Promise<T> => {
        const accessToken = await getAccessToken();
        return new Promise((resolve) => {
            wx.request({
                url: api,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json', // 默认值
                    'Authorization': accessToken,
                    'Client-App-Key': "hfms[mini-program]",
                    "Platform": "mini-program",
                    "Scope": "wechat",
                },
                data,
                success: async (res: any) => {

                    if (res.statusCode === 401) {
                        resetLoginInfo();
                        const res = await request.post(api, data, options);
                        if (res) {
                            resolve(res);
                        }
                    } else {
                        if (!options?.errorHandler) {
                            commonErrorHandler(res.data);
                        } else {
                            options.errorHandler(res.data);
                        }
                        resolve(res.data);
                        forceResultHandler(res.data);
                    }
                },
                fail: (e) => {
                    commonExceptionHandler(e.errMsg);
                }
            });
        });
    },

    get: async <T = any>(api: string, data?: { [key: string]: any }, options?: {
        errorHandler?: (res: any) => void,
        headers?: any
    }): Promise<T> => {
        const accessToken = await getAccessToken();
        return new Promise((resolve) => {
            wx.request({
                url: api,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json', // 默认值
                    'Authorization': accessToken,
                    'Client-App-Key': "hfms[mini-program]",
                    "Platform": "mini-program",
                    "Scope": "wechat",
                    ...(options?.headers || {})
                },
                data,
                success: async (res: any) => {
                    if (res.statusCode === 401) {
                        resetLoginInfo();
                        const res = await request.get(api, data, options);
                        if (res) {
                            resolve(res);
                        }
                    } else {
                        if (!options?.errorHandler) {
                            commonErrorHandler(res.data);
                        } else {
                            options.errorHandler && options.errorHandler(res.data);
                        }
                        resolve(res.data);
                        forceResultHandler(res.data);

                    }
                },
                fail: (e) => {
                    commonExceptionHandler(e.errMsg);
                }
            });
        });
    },

    put: async <T = any>(api: string, data?: { [key: string]: any }, options?: {
        errorHandler?: (res: any) => void,
        headers?: any
    }): Promise<T> => {
        const accessToken = await getAccessToken();
        return new Promise((resolve) => {
            wx.request({
                url: api,
                method: 'PUT',
                header: {
                    'Content-Type': 'application/json', // 默认值
                    'Authorization': accessToken,
                    'Client-App-Key': "hfms[mini-program]",
                    "Platform": "mini-program",
                    "Scope": "wechat",
                },
                data,
                success: async (res: any) => {

                    if (res.statusCode === 401) {
                        resetLoginInfo();
                        const res = await request.put(api, data, options);
                        if (res) {
                            resolve(res);
                        }
                    } else {
                        commonErrorHandler(res.data);
                        resolve(res.data);
                    }
                },
                fail: (e) => {
                    commonExceptionHandler(e.errMsg);
                }
            });
        });
    },

    delete: async <T = any>(api: string, data?: { [key: string]: any }, options?: {
        errorHandler?: (res: any) => void,
        headers?: any
    }): Promise<T> => {
        const accessToken = await getAccessToken();
        return new Promise((resolve) => {
            wx.request({
                url: api,
                method: 'DELETE',
                header: {
                    'Content-Type': 'application/json', // 默认值
                    'Authorization': accessToken,
                    'Client-App-Key': "hfms[mini-program]",
                    "Platform": "mini-program",
                    "Scope": "wechat",
                },
                data,
                success: async (res: any) => {

                    if (res.statusCode === 401) {
                        resetLoginInfo();
                        const res = await request.delete(api, data, options);
                        if (res) {
                            resolve(res);
                        }
                    } else {
                        commonErrorHandler(res.data);
                        resolve(res.data);
                    }
                },
                fail: (e) => {
                    commonExceptionHandler(e.errMsg);
                }
            });
        });
    },
    download: async <T = any>(api: string): Promise<T> => {
        const accessToken = await getAccessToken();
        return new Promise((resolve) => {
            wx.downloadFile({
                url: api,
                header: {
                    'Authorization': accessToken,
                    'Client-App-Key': "hfms[mini-program]",
                    "Platform": "mini-program",
                    "Scope": "wechat",
                },
                success: async (res: any) => {

                    if (res.statusCode === 401) {
                        resetLoginInfo();
                        const res = await request.download(api);
                        if (res) {
                            resolve(res);
                        }
                    } else {
                        resolve(res);
                    }
                },
                fail: (e) => {
                    commonExceptionHandler(e.errMsg);
                }
            });
        });
    },

    upload: async (api: string, wxFilePath: string) => {
        const accessToken = await getAccessToken();
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: api, //apis.extends.fileUpload + "/" + token,
                filePath: wxFilePath,

                name: 'file',
                header: {
                    Authorization: accessToken,
                    'Client-App-Key': "hfms[mini-program]",
                    "Platform": "mini-program",
                    "Scope": "wechat",
                },
                formData: {
                    wxFilePath: wxFilePath,

                },  
                success: (res) => {
                    resolve(JSON.parse(res.data));
                },
                fail: (e) => {
                    reject(e);
                }
            })
        })
    },


    ezviz: (api: string, param: { [key: string]: any }, ezvizAccessToken: string) => {
        return new Promise((resolve, reject) => {
            wx.request({
                url: api, //仅为示例，并非真实的接口地址
                method: 'POST',
                data: {
                    accessToken: ezvizAccessToken,
                    ...param,
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded' // 默认值
                },
                success(res) {
                    resolve(res);
                },
                fail: function (e) {
                    reject(e);
                }
            })
        });
    }
}



/**
 * 微信登录
 */
const wxLogin = (): Promise<LoginInfo> => {
    return new Promise((resolve, reject) => {
        Toast.loading("正在登录...");
        wx.login({
            fail: reject,
            success: ((loginRes) => {
                wx.getUserInfo({
                    fail: reject,
                    success: (userRes => {
                        wx.request({
                            url: apis.loginWx,
                            method: 'POST',
                            header: {
                                'Content-Type': 'application/json', // 默认值
                            },
                            data: {
                                js_code: loginRes.code,
                                encryptedData: userRes.encryptedData,
                                iv: userRes.iv,
                                signature: userRes.signature,
                                userInfo: userRes.userInfo,
                                wxoa_openId: app.globalData.wxoaOpenId,
                            },
                            success: (res: any) => {
                                if ("access_token" in res.data) {
                                    Toast.show("登陆成功！");
                                    resolve(res.data as LoginInfo);
                                } else {
                                    Toast.show('登陆失败：' + (res.msg || res.message))
                                    reject(res.msg || res.message);
                                }
                            },
                            fail: (e) => {
                                Toast.show('登陆失败：' + (e.errMsg))
                                reject(e.errMsg);
                            },
                        });
                    })
                })
            })
        })
    });
}