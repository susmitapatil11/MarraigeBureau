import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.js";

export const connectionService = {
  // Send connection request
  async sendRequest(fromUserId, toUserId, matchScore = 0) {
    try {
      // Check if connection already exists
      const existingConnection = await this.getConnection(fromUserId, toUserId);
      if (existingConnection.success) {
        return { success: false, error: "Connection already exists" };
      }

      const connectionRef = doc(collection(db, "connections"));
      const connectionData = {
        id: connectionRef.id,
        requesterId: fromUserId,
        receiverId: toUserId,
        status: "pending",
        matchScore,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(connectionRef, connectionData);
      return { success: true, data: connectionData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get connection between two users
  async getConnection(userId1, userId2) {
    try {
      const q = query(
        collection(db, "connections"),
        where("requesterId", "in", [userId1, userId2]),
        where("receiverId", "in", [userId1, userId2])
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const connectionDoc = querySnapshot.docs[0];
        return { 
          success: true, 
          data: { 
            id: connectionDoc.id, 
            ...connectionDoc.data() 
          } 
        };
      }

      return { success: false, error: "Connection not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Accept connection request
  async acceptRequest(connectionId) {
    try {
      const connectionRef = doc(db, "connections", connectionId);
      await updateDoc(connectionRef, {
        status: "accepted",
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reject connection request
  async rejectRequest(connectionId) {
    try {
      const connectionRef = doc(db, "connections", connectionId);
      await updateDoc(connectionRef, {
        status: "rejected",
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's received requests
  async getReceivedRequests(userId) {
    try {
      const q = query(
        collection(db, "connections"),
        where("receiverId", "==", userId),
        where("status", "==", "pending")
      );

      const querySnapshot = await getDocs(q);
      let requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort locally to avoid Firebase index requirements
      requests.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      return { success: true, data: requests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's sent requests
  async getSentRequests(userId) {
    try {
      const q = query(
        collection(db, "connections"),
        where("requesterId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      let requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort locally to avoid Firebase index requirements
      requests.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      return { success: true, data: requests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's connections (accepted)
  async getUserConnections(userId) {
    try {
      const q = query(
        collection(db, "connections"),
        where("requesterId", "==", userId),
        where("status", "==", "accepted")
      );

      const q2 = query(
        collection(db, "connections"),
        where("receiverId", "==", userId),
        where("status", "==", "accepted")
      );

      const [snapshot1, snapshot2] = await Promise.all([getDocs(q), getDocs(q2)]);
      
      const connections = [
        ...snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];

      return { success: true, data: connections };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Block user
  async blockUser(userId, blockedUserId) {
    try {
      const connection = await this.getConnection(userId, blockedUserId);
      if (connection.success) {
        const connectionRef = doc(db, "connections", connection.data.id);
        await updateDoc(connectionRef, {
          status: "blocked",
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new blocked connection
        const connectionRef = doc(collection(db, "connections"));
        await setDoc(connectionRef, {
          id: connectionRef.id,
          requesterId: userId,
          receiverId: blockedUserId,
          status: "blocked",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
