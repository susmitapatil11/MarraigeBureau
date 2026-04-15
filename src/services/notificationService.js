import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.js";

export const notificationService = {
  // Create notification
  async createNotification(uid, type, title, message, data = {}) {
    try {
      const notificationRef = doc(collection(db, "notifications"));
      const notificationData = {
        uid,
        type, // "interest", "message", "match", "profile_view", "connection_accepted"
        title,
        message,
        data,
        read: false,
        createdAt: serverTimestamp()
      };

      await setDoc(notificationRef, notificationData);
      return { success: true, data: notificationData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user notifications
  async getUserNotifications(uid, limitCount = 20) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark all notifications as read for user
  async markAllAsRead(uid) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("uid", "==", uid),
        where("read", "==", false)
      );

      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(updatePromises);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get unread count
  async getUnreadCount(uid) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("uid", "==", uid),
        where("read", "==", false)
      );

      const querySnapshot = await getDocs(q);
      return { success: true, data: querySnapshot.size };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
