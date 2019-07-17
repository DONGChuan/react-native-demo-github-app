import Types from '../types'
import {_projectModels, doCallBack, handleData} from '../ActionUtil'
import ArrayUtil from "../../util/ArrayUtil";
import Utils from "../../util/Utils";

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

/**
 * 发起搜索
 *
 * @param inputKey 搜索key
 * @param pageSize
 * @param token 与该搜索关联的唯一token
 * @param favoriteDao
 * @param popularKeys 最热模块下的标签
 * @param callBack
 * @returns {function(*=)}
 */
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
    return dispatch => {

        // 发送搜索刷新
        dispatch({type: Types.SEARCH_REFRESH});

        // 调用 API 搜索
        fetch(genFetchUrl(inputKey)).then(response => {// 如果任务取消，则不做任何处理
            return hasCancel(token) ? null : response.json();
        }).then(responseData => {

            // 如果任务取消，则不做任何处理
            if (hasCancel(token, true)) {
                console.log('user cancel');
                return;
            }

            // 如果没有搜索结果
            if (!responseData || !responseData.items || responseData.items.length === 0) {
                // 发送搜索失败
                dispatch({
                    type: Types.SEARCH_FAIL,
                    message: `没找到关于${inputKey}的项目`
                });
                doCallBack(callBack, `没找到关于${inputKey}的项目`);
                return;
            }

            // 搜索到结果
            handleData(
                Types.SEARCH_REFRESH_SUCCESS,
                dispatch,
                "",
                {data: responseData.items},
                pageSize,
                favoriteDao,
                {
                    showBottomButton: !Utils.checkKeyExist(popularKeys, inputKey),
                    inputKey,
                });

        }).catch(e => {
            console.log(e);
            dispatch({type: Types.SEARCH_FAIL, error: e})
        })
    }
}

/**
 * 取消搜索
 *
 * @param token
 * @returns {function(*)}
 */
export function onSearchCancel(token) {
    return dispatch => {
        CANCEL_TOKENS.push(token);

        // 发送取消搜索
        dispatch({type: Types.SEARCH_CANCEL});
    }
}

/**
 * 加载更多
 *
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {function(*)}
 */
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
    return dispatch => {
        // 延迟 500ms 模拟网络请求
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }

                // 发送加载更多失败
                dispatch({
                    type: Types.SEARCH_LOAD_MORE_FAIL,
                    error: 'no more',
                    pageIndex: --pageIndex,
                })
            } else {
                // 本次载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0, max), favoriteDao, data => {
                    dispatch({
                        type: Types.SEARCH_LOAD_MORE_SUCCESS,
                        pageIndex,
                        projectModels: data,
                    })
                })
            }
        }, 500);
    }
}

/**
 * 生成 Url
 *
 * @param key
 * @returns {string}
 */
function genFetchUrl(key) {
    return API_URL + key + QUERY_STR;
}

/**
 * 检查指定 token 是否已经取消
 *
 * @param token
 * @param isRemove 是否移除该 token
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
    if (CANCEL_TOKENS.includes(token)) {

        // 如果 isRemove 为 true, 则移除
        isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);

        return true;
    }
    return false;
}