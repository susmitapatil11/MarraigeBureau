import { doc, getDoc, setDoc, updateDoc, serverTimestamp, query, where, getDocs, limit, orderBy, collection } from "firebase/firestore";
import { db } from "../firebase.js";

// User Profile Services
export const userService = {
  // Create or update user profile
  async createProfile(uid, userData) {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      
      const profileData = {
        uid,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileCompletion: this.calculateProfileCompletion(userData),
        isVerified: false,
        isPremium: false,
        showProfile: true,
        allowMessages: true,
        lastActive: serverTimestamp()
      };

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          ...profileData,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, profileData);
      }
      
      return { success: true, data: profileData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user profile by UID
  async getProfile(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: "User not found" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  async updateProfile(uid, updates) {
    try {
      const userRef = doc(db, "users", uid);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp()
      };

      // Recalculate profile completion if relevant fields are updated
      if (this.hasProfileCompletionFields(updates)) {
        const currentProfile = await this.getProfile(uid);
        if (currentProfile.success) {
          const updatedProfile = { ...currentProfile.data, ...updates };
          updateData.profileCompletion = this.calculateProfileCompletion(updatedProfile);
        }
      }

      await updateDoc(userRef, updateData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search users with filters
  async searchUsers(filters = {}) {
    try {
      let q = query(collection(db, "users"), where("showProfile", "==", true));
      
      // Apply filters
      if (filters.lookingFor) {
        q = query(q, where("lookingFor", "==", filters.lookingFor));
      }
      
      if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
        // Note: Firestore doesn't support range queries on multiple fields
        // You might need to use separate queries or adjust the schema
        q = query(q, where("age", ">=", filters.ageMin));
        q = query(q, where("age", "<=", filters.ageMax));
      }
      
      if (filters.religion) {
        q = query(q, where("religion", "==", filters.religion));
      }
      
      if (filters.education) {
        q = query(q, where("education", "==", filters.education));
      }
      
      if (filters.location) {
        q = query(q, where("location", "==", filters.location));
      }
      
      // Add ordering and limit
      q = query(q, orderBy("lastActive", "desc"), limit(50));
      
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user recommendations based on preferences
  async getRecommendations(uid, limit = 20) {
    try {
      const userResult = await this.getProfile(uid);
      if (!userResult.success) {
        return { success: false, error: "User not found" };
      }

      const user = userResult.data;
      const filters = {
        lookingFor: user.lookingFor === "Bride" ? "Groom" : "Bride",
        ageMin: user.partnerPreferences?.ageMin || 18,
        ageMax: user.partnerPreferences?.ageMax || 100,
        religion: user.partnerPreferences?.religion !== "Any" ? user.partnerPreferences.religion : undefined,
        education: user.partnerPreferences?.education !== "Any" ? user.partnerPreferences.education : undefined,
        location: user.partnerPreferences?.location
      };

      return await this.searchUsers(filters);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Calculate profile completion percentage
  calculateProfileCompletion(userData) {
    const requiredFields = [
      'fullName', 'email', 'phone', 'age', 'height', 'maritalStatus',
      'motherTongue', 'location', 'religion', 'education', 'profession',
      'familyType', 'familyValues', 'diet', 'aboutMe'
    ];
    
    const optionalFields = [
      'caste', 'gotra', 'manglik', 'workingWith', 'income',
      'fatherOccupation', 'motherOccupation', 'familyStatus',
      'smoking', 'drinking', 'hobbies', 'photoUrl'
    ];
    
    let completedFields = 0;
    let totalWeight = 0;
    
    // Required fields carry more weight
    requiredFields.forEach(field => {
      totalWeight += 2;
      if (userData[field] && userData[field] !== '') {
        completedFields += 2;
      }
    });
    
    // Optional fields carry less weight
    optionalFields.forEach(field => {
      totalWeight += 1;
      if (userData[field] && userData[field] !== '') {
        completedFields += 1;
      }
    });
    
    return Math.round((completedFields / totalWeight) * 100);
  },

  // Check if updates affect profile completion
  hasProfileCompletionFields(updates) {
    const relevantFields = [
      'age', 'height', 'maritalStatus', 'motherTongue', 'location',
      'religion', 'education', 'profession', 'familyType', 'familyValues',
      'diet', 'aboutMe', 'caste', 'gotra', 'manglik', 'workingWith',
      'income', 'fatherOccupation', 'motherOccupation', 'familyStatus',
      'smoking', 'drinking', 'hobbies', 'photoUrl'
    ];
    
    return relevantFields.some(field => field in updates);
  },

  // Update last active timestamp
  async updateLastActive(uid) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        lastActive: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
