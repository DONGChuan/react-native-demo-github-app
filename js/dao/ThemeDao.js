import {AsyncStorage} from 'react-native';
import {ThemeColors} from "../res/styles/ThemeFactory";
import ThemeFactory from "../res/styles/ThemeFactory";

const THEME_KEY = 'theme_key';

export default class ThemeDao {

    /**
     * 获取当前主题
     *
     * @returns {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    this.save(ThemeColors.Default);
                    result = ThemeColors.Default;
                }
                resolve(ThemeFactory.createTheme(result))
            });
        });
    }

    /**
     * 保存主题颜色
     *
     * @param themeColor 主题颜色
     */
    save(themeColor) {
        AsyncStorage.setItem(THEME_KEY, themeColor, (error => {}))
    }
}