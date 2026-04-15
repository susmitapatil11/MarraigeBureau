import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy, limit, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { userService } from "./userService.js";

export const searchService = {
  // Save search filter
  async saveSearchFilter(uid, name, filters, isDefault = false) {
    try {
      const filterRef = doc(collection(db, "searchFilters"));
      const filterData = {
        uid,
        name,
        filters,
        isDefault,
        createdAt: serverTimestamp()
      };

      // If this is default, unset other default filters for this user
      if (isDefault) {
        await this.unsetDefaultFilters(uid);
      }

      await setDoc(filterRef, filterData);
      return { success: true, data: filterData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's saved search filters
  async getSavedFilters(uid) {
    try {
      const q = query(
        collection(db, "searchFilters"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const filters = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: filters };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete saved filter
  async deleteFilter(filterId) {
    try {
      await deleteDoc(doc(db, "searchFilters", filterId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Unset default filters for user
  async unsetDefaultFilters(uid) {
    try {
      const q = query(
        collection(db, "searchFilters"),
        where("uid", "==", uid),
        where("isDefault", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { isDefault: false })
      );

      await Promise.all(updatePromises);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Advanced search with multiple filters
  async advancedSearch(filters = {}) {
    try {
      let constraints = [where("showProfile", "==", true)];

      // Add filters
      if (filters.lookingFor) {
        constraints.push(where("lookingFor", "==", filters.lookingFor));
      }

      let hasAgeInequality = false;

      if (filters.ageMin !== undefined && filters.ageMin !== "") {
        constraints.push(where("age", ">=", parseInt(filters.ageMin, 10)));
        hasAgeInequality = true;
      }

      if (filters.ageMax !== undefined && filters.ageMax !== "") {
        constraints.push(where("age", "<=", parseInt(filters.ageMax, 10)));
        hasAgeInequality = true;
      }

      if (filters.religion) {
        if (Array.isArray(filters.religion)) {
          constraints.push(where("religion", "in", filters.religion));
        } else {
          constraints.push(where("religion", "==", filters.religion));
        }
      }

      if (filters.caste) {
        constraints.push(where("caste", "==", filters.caste));
      }

      if (filters.education) {
        if (Array.isArray(filters.education)) {
          constraints.push(where("education", "in", filters.education));
        } else {
          constraints.push(where("education", "==", filters.education));
        }
      }

      if (filters.profession) {
        constraints.push(where("profession", "==", filters.profession));
      }

      if (filters.location) {
        constraints.push(where("location", "==", filters.location));
      }

      if (filters.income) {
        constraints.push(where("income", "==", filters.income));
      }

      if (filters.lifestyle) {
        if (Array.isArray(filters.lifestyle)) {
          constraints.push(where("familyValues", "in", filters.lifestyle));
        } else {
          constraints.push(where("familyValues", "==", filters.lifestyle));
        }
      }

      // Add ordering
      if (hasAgeInequality) {
        constraints.push(orderBy("age"));
      }

      // Add limit
      constraints.push(limit(filters.limit || 50));

      const q = query(collection(db, "users"), ...constraints);
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

  // Get search suggestions based on user profile
  async getSearchSuggestions(uid) {
    try {
      const userProfile = await userService.getProfile(uid);
      if (!userProfile.success) {
        return { success: false, error: "User profile not found" };
      }

      const user = userProfile.data;
      const suggestions = {
        locations: [],
        religions: [],
        educations: [],
        professions: [],
        ages: []
      };

      // Get similar users to suggest preferences
      const similarUsersQuery = query(
        collection(db, "users"),
        where("lookingFor", "==", user.lookingFor === "Bride" ? "Groom" : "Bride"),
        where("location", "==", user.location),
        limit(20)
      );

      const querySnapshot = await getDocs(similarUsersQuery);
      const similarUsers = querySnapshot.docs.map(doc => doc.data());

      // Extract unique values for suggestions
      similarUsers.forEach(similarUser => {
        if (similarUser.location && !suggestions.locations.includes(similarUser.location)) {
          suggestions.locations.push(similarUser.location);
        }
        if (similarUser.religion && !suggestions.religions.includes(similarUser.religion)) {
          suggestions.religions.push(similarUser.religion);
        }
        if (similarUser.education && !suggestions.educations.includes(similarUser.education)) {
          suggestions.educations.push(similarUser.education);
        }
        if (similarUser.profession && !suggestions.professions.includes(similarUser.profession)) {
          suggestions.professions.push(similarUser.profession);
        }
      });

      // Age range suggestions
      const ages = similarUsers.map(u => u.age).filter(age => age);
      if (ages.length > 0) {
        const minAge = Math.min(...ages);
        const maxAge = Math.max(...ages);
        suggestions.ages = [minAge, maxAge];
      }

      return { success: true, data: suggestions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
