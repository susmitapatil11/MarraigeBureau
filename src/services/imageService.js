import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export const imageService = {
  // Save image metadata to Firestore
  async saveImage(uid, imageData) {
    try {
      const imageRef = doc(collection(db, "images"));
      const imageDoc = {
        uid,
        url: imageData.url,
        publicId: imageData.publicId || null,
        width: imageData.width || null,
        height: imageData.height || null,
        bytes: imageData.bytes || null,
        format: imageData.format || null,
        type: imageData.type || "gallery", // "profile" or "gallery"
        createdAt: serverTimestamp()
      };
      
      await setDoc(imageRef, imageDoc);
      return { success: true, data: { id: imageRef.id, ...imageDoc } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user images
  async getUserImages(uid, type = null) {
    try {
      let q = query(collection(db, "images"), where("uid", "==", uid));
      
      if (type) {
        q = query(q, where("type", "==", type));
      }
      
      const querySnapshot = await getDocs(q);
      const images = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: images };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete image
  async deleteImage(imageId) {
    try {
      await deleteDoc(doc(db, "images", imageId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get profile image
  async getProfileImage(uid) {
    try {
      const q = query(
        collection(db, "images"), 
        where("uid", "==", uid), 
        where("type", "==", "profile"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const imageDoc = querySnapshot.docs[0];
        return { 
          success: true, 
          data: { 
            id: imageDoc.id, 
            ...imageDoc.data() 
          } 
        };
      }
      
      return { success: false, error: "No profile image found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
