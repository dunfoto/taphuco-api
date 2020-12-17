const { firebaseCloudMessage } = require("../common/firebase")

const NotificationModel = require("../models/notification")

/**
 *
 * @param {CreateAndSendNotification} param0
 */
const createAndSend = async ({
    data,
    notification,
    isAll = false,
    tokenList,
}) => {
    if (isAll && tokenList && tokenList.length) {
        data.isAll = true
    }

    tokenList.forEach((token) => {
        if (!notification.notification.click_action) {
            notification.notification.click_action = "FLUTTER_NOTIFICATION_CLICK"
        }
        if (!notification.android.notification.chanel_id) {
            notification.android.notification.chanel_id = "channel_android_default"
        }
        notification.registration_ids = token
        firebaseCloudMessage(notification)
    })
    await NotificationModel.create(data)
}

module.exports = {
    createAndSend,
}

/**
 * @typedef CreateAndSendNotification
 * @property {NotificationData} data
 * @property {FirebaseNotification} notification
 * @property {boolean} isAll
 * @property {string[]} tokenList
 */

/**
 * @typedef NotificationData
 * @property {string} title
 * @property {string} description
 * @property {string} content
 * @property {boolean} readed
 * @property {string} user
 * @property {string} product
 */

/**
 * @typedef FirebaseNotification
 * @property {string} registration_ids,
 * @property {FirebaseNotificationNotification} notification
 * @property {FirebaseNotificationData} data
 * @property {FirebaseNotificationAndroid} android
 */

/**
 * @typedef FirebaseNotificationNotification
 * @property {string} title
 * @property {string} body
 * @property {string} sound
 * @property {string} click_action
 */

/**
 * @typedef FirebaseNotificationData
 * @property {"product" | "user"} type
 * @property {string} id
 */

/**
 * @typedef FirebaseNotificationAndroid
 * @property {{chanel_id: string}} notification
 */
