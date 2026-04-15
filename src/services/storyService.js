import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, orderBy, limit, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export const storyService = {
  // Create success story
  async createStory(storyData) {
    try {
      const storyRef = doc(collection(db, "stories"));
      const story = {
        id: storyRef.id,
        coupleName: storyData.coupleName,
        location: storyData.location,
        preview: storyData.preview,
        fullStory: storyData.fullStory,
        weddingDate: storyData.weddingDate || null,
        images: storyData.images || [],
        featured: storyData.featured || false,
        createdAt: serverTimestamp()
      };

      await setDoc(storyRef, story);
      return { success: true, data: story };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all stories
  async getStories(limitCount = 10, featured = false) {
    try {
      let q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
      
      if (featured) {
        q = query(q, where("featured", "==", true));
      }
      
      q = query(q, limit(limitCount));

      const querySnapshot = await getDocs(q);
      const stories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: stories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get story by ID
  async getStory(storyId) {
    try {
      const storyRef = doc(db, "stories", storyId);
      const storyDoc = await getDoc(storyRef);
      
      if (storyDoc.exists()) {
        return { 
          success: true, 
          data: { 
            id: storyDoc.id, 
            ...storyDoc.data() 
          } 
        };
      }
      
      return { success: false, error: "Story not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update story
  async updateStory(storyId, updates) {
    try {
      const storyRef = doc(db, "stories", storyId);
      await updateDoc(storyRef, updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete story
  async deleteStory(storyId) {
    try {
      await deleteDoc(doc(db, "stories", storyId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Feature/unfeature story
  async featureStory(storyId, featured = true) {
    try {
      const storyRef = doc(db, "stories", storyId);
      await updateDoc(storyRef, { featured });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
