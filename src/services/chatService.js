import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, orderBy, limit, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export const chatService = {
  // Create or get chat room between two users
  async getOrCreateChat(user1Id, user2Id) {
    try {
      // Check if chat already exists
      const existingChat = await this.getChatBetweenUsers(user1Id, user2Id);
      if (existingChat.success) {
        return existingChat;
      }

      // Create new chat
      const chatRef = doc(collection(db, "chats"));
      const chatData = {
        id: chatRef.id,
        participants: [user1Id, user2Id],
        lastMessage: {
          text: "Chat started",
          senderId: user1Id,
          timestamp: serverTimestamp()
        },
        unreadCount: {
          [user1Id]: 0,
          [user2Id]: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(chatRef, chatData);
      return { success: true, data: chatData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get chat between two users
  async getChatBetweenUsers(user1Id, user2Id) {
    try {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", user1Id)
      );

      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        if (chatData.participants.includes(user2Id)) {
          return { 
            success: true, 
            data: { 
              id: doc.id, 
              ...chatData 
            } 
          };
        }
      }

      return { success: false, error: "Chat not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all chats for a user
  async getUserChats(userId) {
    try {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", userId)
      );

      const querySnapshot = await getDocs(q);
      let chats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      chats.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis() || 0;
        const timeB = b.updatedAt?.toMillis() || 0;
        return timeB - timeA;
      });

      return { success: true, data: chats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Send message
  async sendMessage(chatId, senderId, text, type = "text") {
    try {
      // Add message to messages collection
      const messageRef = doc(collection(db, "messages"));
      const messageData = {
        chatId,
        senderId,
        text,
        type,
        timestamp: serverTimestamp(),
        read: false,
        edited: false
      };

      await setDoc(messageRef, messageData);

      // Update chat's last message and unread counts
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const otherParticipants = chatData.participants.filter(id => id !== senderId);
        
        const unreadCount = { ...chatData.unreadCount };
        otherParticipants.forEach(participantId => {
          unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
        });
        unreadCount[senderId] = 0;

        await updateDoc(chatRef, {
          lastMessage: {
            text,
            senderId,
            timestamp: serverTimestamp()
          },
          unreadCount,
          updatedAt: serverTimestamp()
        });
      }

      return { success: true, data: messageData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get messages for a chat
  async getMessages(chatId, limitCount = 50) {
    try {
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .reverse(); // Show oldest first

      return { success: true, data: messages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark messages as read
  async markMessagesRead(chatId, userId) {
    try {
      // Update unread count
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0
      });

      // Mark individual messages as read
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        where("senderId", "!=", userId),
        where("read", "==", false)
      );

      const querySnapshot = await getDocs(q);
      const batch = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(batch);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Edit message
  async editMessage(messageId, newText) {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        text: newText,
        edited: true,
        editedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete message
  async deleteMessage(messageId) {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
