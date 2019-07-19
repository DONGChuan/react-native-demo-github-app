import React, {Component} from 'react';
import {DeviceInfo, SafeAreaView, StyleSheet, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

/**
 * 适配全面屏
 */
export default class SafeAreaViewPlus extends Component {

    // 接收的属性
    static propTypes = {
        ...ViewPropTypes,
        topColor: PropTypes.string,
        bottomColor: PropTypes.string,
        enablePlus: PropTypes.bool, // 启用 plus 还是使用系统自带的 SafeAreaView
        topInset: PropTypes.bool,
        bottomInset: PropTypes.bool,
    };

    // 属性默认值
    static defaultProps = {
        topColor: 'transparent',
        bottomColor: '#f8f8f8',
        enablePlus: true,
        topInset: true,
        bottomInset: false,
    };

    genSafeAreaViewPlus() {
        // children 是该容器组件内部嵌套的组件
        const {children, topColor, bottomColor, topInset, bottomInset} = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                {this.getTopArea(topColor, topInset)}
                {children}
                {this.getBottomArea(bottomColor, bottomInset)}
            </View>
        );
    }

    getTopArea(topColor, topInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !topInset ? null
            : <View style={[styles.topArea, {backgroundColor: topColor}]}/>;
    }

    getBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !bottomInset ? null
            : <View style={[styles.bottomArea, {backgroundColor: bottomColor}]}/>;
    }

    genSafeAreaView() {
        return (
            <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
                {this.props.children}
            </SafeAreaView>
        );
    }

    render() {
        return this.props.enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topArea: {
        height: 44,
    },
    bottomArea: {
        height: 34,
    }
});