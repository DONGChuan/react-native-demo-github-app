import Types from '../../action/types';

const defaultState = {
    showText: '搜索',
    items: [],
    isLoading: false,
    projectModels: [],//要显示的数据
    hideLoadingMore: true,//默认隐藏加载更多
    showBottomButton: false,
};

/**
 * 搜索 action
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        // 搜索刷新
        case Types.SEARCH_REFRESH:
            return {
                ...state,
                isLoading: true,
                hideLoadingMore: true,
                showBottomButton: false,
                showText:'取消',
            };
        // 搜索成功
        case Types.SEARCH_REFRESH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModels: action.projectModels,
                pageIndex: action.pageIndex,
                showText: '搜索',
                inputKey: action.inputKey
            };
        // 搜索失败
        case Types.SEARCH_FAIL:
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        // 搜索取消
        case Types.SEARCH_CANCEL:
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        // 上拉加载更多成功
        case Types.SEARCH_LOAD_MORE_SUCCESS:
            return {
                ...state,
                projectModels: action.projectModels,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
            };
        // 上拉加载更多失败
        case Types.SEARCH_LOAD_MORE_FAIL:
            return {
                ...state,
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state;
    }

}