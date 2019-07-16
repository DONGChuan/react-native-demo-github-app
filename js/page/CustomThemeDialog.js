import React, {Component} from 'react'
import {DeviceInfo,Modal, TouchableHighlight,Platform, ScrollView, StyleSheet, Text, View} from 'react-native'
import ThemeDao from "../dao/ThemeDao";
import GlobalStyles from "../res/styles/GlobalStyles";
import ThemeFactory, {ThemeColors} from "../res/styles/ThemeFactory";
import actions from "../action";
import {connect} from "react-redux";

/**
 * 主题选择弹窗
 */
class CustomThemeDialog extends Component {

    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
    }

    /**
     * 选择主题
     *
     * @param themeKey 主题颜色对应的 key
     */
    onThemeSelect(themeKey) {
        // 关闭弹窗
        this.props.onClose();

        // 保存主题
        this.themeDao.save(ThemeColors[themeKey]);

        // 更新 state 里的主题
        this.props.onThemeChange(ThemeFactory.createTheme(ThemeColors[themeKey]));
    }

    /**
     * 渲染主题 Item
     *
     * @param themeKey 主题颜色对应的 key
     */
    renderThemeItem(themeKey) {
        return (
            <TouchableHighlight
                style={{flex: 1}}
                underlayColor='white'
                onPress={() => this.onThemeSelect(themeKey)}
            >
                <View style={[{backgroundColor: ThemeColors[themeKey]}, styles.themeItem]}>
                    <Text style={styles.themeText}>{themeKey}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 渲染主题列表
     *
     * @returns {Array}
     */
    renderThemeList() {
        const views = [];
        for (let i = 0, keys = Object.keys(ThemeColors), l = keys.length; i < l; i += 3) {
            const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
            views.push(
                <View key={i} style={{flexDirection: 'row'}}>
                    {this.renderThemeItem(key1)}
                    {this.renderThemeItem(key2)}
                    {this.renderThemeItem(key3)}
                </View>
            )
        }
        return views;
    }

    renderContentView() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => { // Android 设备上的后退按键. 必填
                    this.props.onClose()
                }}
            >
                <View style={styles.modalContainer}>
                    <ScrollView>
                        {this.renderThemeList()}
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        let view = this.props.visible ? <View style={GlobalStyles.root_container}>
            {this.renderContentView()}
        </View> : null;
        return view;
    }
}

const mapDispatchToProps = dispatch => ({
    onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
});
export default connect(null, mapDispatchToProps)(CustomThemeDialog);

const styles = StyleSheet.create({
    themeItem: {
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        margin: 10,
        marginBottom: 10 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0),
        marginTop: Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3
    },
    themeText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16
    }
});