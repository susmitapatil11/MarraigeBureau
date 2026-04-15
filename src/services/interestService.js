import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase.js";

export const interestService = {
  // Send interest to a user
  async sendInterest(fromUserId, toUserId, message = "") {
    try {
      // Check if interest already exists
      const existingInterest = await this.getInterest(fromUserId, toUserId);
      if (existingInterest.success) {
        return { success: false, error: "Interest already sent" };
      }

      const interestRef = doc(collection(db, "interests"));
      const interestData = {
        id: interestRef.id,
        fromUserId,
        toUserId,
        status: "pending",
        message,
        createdAt: serverTimestamp(),
        respondedAt: null
      };

      await setDoc(interestRef, interestData);
      return { success: true, data: interestData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get interest between two users
  async getInterest(fromUserId, toUserId) {
    try {
      const q = query(
        collection(db, "interests"),
        where("fromUserId", "==", fromUserId),
        where("toUserId", "==", toUserId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const interestDoc = querySnapshot.docs[0];
        return { 
          success: true, 
          data: { 
            id: interestDoc.id, 
            ...interestDoc.data() 
          } 
        };
      }

      return { success: false, error: "Interest not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Accept interest
  async acceptInterest(interestId) {
    try {
      const interestRef = doc(db, "interests", interestId);
      await updateDoc(interestRef, {
        status: "accepted",
        respondedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reject interest
  async rejectInterest(interestId) {
    try {
      const interestRef = doc(db, "interests", interestId);
      await updateDoc(interestRef, {
        status: "rejected",
        respondedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get received interests
  async getReceivedInterests(userId) {
    try {
      const q = query(
        collection(db, "interests"),
        where("toUserId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const interests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: interests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get sent interests
  async getSentInterests(userId) {
    try {
      const q = query(
        collection(db, "interests"),
        where("fromUserId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const interests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: interests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get mutual interests (both users sent interest to each other)
  async getMutualInterests(userId) {
    try {
      const sentQ = query(
        collection(db, "interests"),
        where("fromUserId", "==", userId),
        where("status", "==", "accepted")
      );

      const receivedQ = query(
        collection(db, "interests"),
        where("toUserId", "==", userId),
        where("status", "==", "accepted")
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([getDocs(sentQ), getDocs(receivedSnapshot)]);
      
      const sentInterests = sentSnapshot.docs.map(doc => doc.data());
      const receivedInterests = receivedSnapshot.docs.map(doc => doc.data());

      // Find mutual interests
      const mutualInterests = sentInterests.filter(sent => 
        receivedInterests.some(received => 
          sent.toUserId === received.fromUserId
        )
      );

      return { success: true, data: mutualInterests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
