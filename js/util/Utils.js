export default class Utils {

    /**
     * 检查该Item是否被收藏
     *
     * @param item
     * @param keys
     * @returns {boolean}
     */
    static checkFavorite(item, keys = []) {
        if (!keys) return false;
        for (let i = 0, len = keys.length; i < len; i++) {
            let id = item.id ? item.id : item.fullName;
            if (id.toString() === keys[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查 key 是否存在于 keys 中
     *
     * @param keyList
     * @param key
     * @returns {boolean} true 存在
     */
    static checkKeyExist(keyList, key) {
        for (let i = 0, l = keyList.length; i < l; i++) {
            if (key.toLowerCase() === keyList[i].name.toLowerCase()) return true;
        }
        return false;
    }

}