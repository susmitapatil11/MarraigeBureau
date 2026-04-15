import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { COMPATIBILITY_QUESTIONS, COMPATIBILITY_SECTIONS, hasSimilarAnswer } from "../lib/compatibilityQuestions.js";
import { notificationService } from "./notificationService.js";

export const compatibilityService = {
  // Save user's answers to the test
  async saveResponses(matchId, userId, answers) {
    try {
      const responseRef = doc(db, "testResponses", `${matchId}_${userId}`);
      
      const responseData = {
        matchId,
        userId,
        answers,
        submittedAt: serverTimestamp()
      };
      
      await setDoc(responseRef, responseData);
      
      // Check if both users have submitted
      return await this.checkAndGenerateReport(matchId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get test response for a specific user and match
  async getUserResponse(matchId, userId) {
    try {
      const responseRef = doc(db, "testResponses", `${matchId}_${userId}`);
      const docSnap = await getDoc(responseRef);
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      }
      return { success: false, error: "Not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if both users answered and generate report if needed
  async checkAndGenerateReport(matchId) {
    try {
      const q = query(
        collection(db, "testResponses"),
        where("matchId", "==", matchId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.size === 2) {
        const responses = querySnapshot.docs.map(doc => doc.data());
        const user1Resp = responses[0];
        const user2Resp = responses[1];
        
        return await this.generateAndSaveReport(matchId, user1Resp.userId, user2Resp.userId, user1Resp.answers, user2Resp.answers);
      }
      
      return { success: true, status: "waiting_for_partner" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Generate compatibility report and save to db
  async generateAndSaveReport(matchId, userId1, userId2, answers1, answers2) {
    try {
      let totalScore = 0;
      const sectionScores = Array(10).fill(0);
      
      COMPATIBILITY_QUESTIONS.forEach(q => {
        const a1 = answers1[q.id];
        const a2 = answers2[q.id];
        
        let score = 0;
        
        if (!a1 || !a2) {
           // Skip if someone missed, though UI should validate
           return;
        }

        if (q.type === "choice") {
          if (a1 === a2) score = 2;
          else if (hasSimilarAnswer(a1, a2)) score = 1;
          else score = 0;
        } else if (q.type === "scale") {
          const diff = Math.abs(parseInt(a1) - parseInt(a2));
          if (diff === 0) score = 2;
          else if (diff === 1) score = 1;
          else score = 0;
        }
        
        totalScore += score;
        sectionScores[q.section] += score;
      });
      
      const sectionPercentages = sectionScores.map(score => Math.round((score / 8) * 100));
      const overallPercentage = Math.round((totalScore / 80) * 100);
      
      let level = "Low Compatibility";
      if (overallPercentage >= 80) level = "Excellent Match";
      else if (overallPercentage >= 60) level = "Good Match";
      else if (overallPercentage >= 40) level = "Moderate Match";
      
      // Determine Strengths and Needs Attention based on section scores
      const strengths = [];
      const needsAttention = [];
      
      sectionPercentages.forEach((pct, idx) => {
        const sectionName = COMPATIBILITY_SECTIONS[idx];
        if (pct >= 75) strengths.push(sectionName);
        else if (pct <= 40) needsAttention.push(sectionName);
      });
      
      if (strengths.length === 0) strengths.push("Basic Shared Views");
      if (needsAttention.length === 0) needsAttention.push("Minor day-to-day tweaks");
      
      // System Generated Insight
      let insight = "This match requires careful navigation of your differences.";
      if (level === "Excellent Match") insight = "You both share excellent alignment across major life areas. This is a very promising foundation.";
      else if (level === "Good Match") insight = `You share strong compatibility in ${strengths[0] || 'several areas'}. However, discussing ${needsAttention[0] || 'some minor differences'} will help strengthen your relationship.`;
      else if (level === "Moderate Match") insight = `There is potential here, but significant communication is needed regarding ${needsAttention[0] || 'key differing values'}.`;
      
      const reportData = {
        matchId,
        participants: [userId1, userId2],
        scores: {
          overall: overallPercentage,
          level,
          sections: sectionPercentages
        },
        strengths,
        needsAttention,
        insight,
        createdAt: serverTimestamp()
      };
      
      const reportRef = doc(db, "compatibilityReports", matchId);
      await setDoc(reportRef, reportData);
      
      try {
        await notificationService.createNotification(
          userId1, 
          "match", 
          "Compatibility Report Ready!", 
          `Your compatibility report with a recent connection is generated. Score: ${overallPercentage}%`, 
          { matchId }
        );
        await notificationService.createNotification(
          userId2, 
          "match", 
          "Compatibility Report Ready!", 
          `Your compatibility report with a recent connection is generated. Score: ${overallPercentage}%`, 
          { matchId }
        );
      } catch (e) {
        console.error("Failed to generate notifications", e);
      }
      
      return { success: true, status: "report_generated", data: reportData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get compatibility report
  async getReport(matchId) {
    try {
      const reportRef = doc(db, "compatibilityReports", matchId);
      const docSnap = await getDoc(reportRef);
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      }
      return { success: false, error: "Report not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
