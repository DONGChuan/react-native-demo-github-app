import React, {Component} from 'react';
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import {NavigationActions} from "react-navigation";
import {connect} from "react-redux";
import BackPressComponent from "../common/BackPressComponent";
import CustomThemeDialog from '../page/CustomThemeDialog';
import actions from "../action";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";

type Props = {};

/**
 * 应用首页
 */
class HomePage extends Component<Props> {

    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: this.onBackPress});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 处理 Android 中的物理返回键
     * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
     * @returns {boolean}
     */
    onBackPress = () => {
        const {dispatch, nav} = this.props;
        //if (nav.index === 0) {
        if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    /**
     * 渲染自定义主题弹窗
     */
    renderCustomThemeDialog() {
        return (
            <CustomThemeDialog
                visible={this.props.customThemeViewVisible}
                {...this.props}
                onClose={() => this.props.onShowCustomThemeView(false)}
            />
        )
    }

    render() {
        const theme = this.props.theme;
        NavigationUtil.navigation = this.props.navigation;
        return (
            <SafeAreaViewPlus topColor={theme.themeColor}>
                <DynamicTabNavigator/>
                {this.renderCustomThemeDialog()}
            </SafeAreaViewPlus>
        )
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible,
    theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);