# Career Pivot Module

## 📌 Overview

The Career Pivot module is a core component of SkillBridge that enables users to evaluate their readiness for a target role and receive actionable guidance for transitioning into that role.

It analyzes a user's current skill set, compares it against industry-relevant requirements, identifies skill gaps, and generates a structured learning roadmap.

---

## 🚀 Key Features

### 1. Skill Gap Detection

Identifies missing skills required for a selected target role by comparing user skills with predefined role requirements.

---

### 2. Weighted Readiness Score

Unlike basic systems, this module uses **weighted skill analysis**, where each skill contributes differently based on its importance.

#### 📊 Formula:

```
Readiness (%) = (Matched Skill Weight / Total Skill Weight) × 100
```

This ensures critical skills (e.g., React, JavaScript) have a higher impact than basic skills (e.g., HTML, CSS).

---

### 3. Difficulty Classification

Based on the readiness score, the system categorizes the transition difficulty:

- **Easy** → Readiness ≥ 60%
- **Medium** → 30% ≤ Readiness < 60%
- **Hard** → Readiness < 30%

---

### 4. Job Match Score

Provides a job compatibility score (similar to industry platforms like LinkedIn), helping users understand how closely they match a role.

---

### 5. Matched & Missing Skills Insight

The module returns:

- ✅ Matched skills (user already has)
- ❌ Missing skills (needs improvement)

This provides a clear comparison of the user's profile vs industry expectations.

---

### 6. Personalized Learning Roadmap

Generates a structured roadmap for missing skills with:

- 📚 Learning resource suggestions
- 🔴 Priority level (High / Medium)
- 📈 Skill level (Beginner / Intermediate / Advanced)
- ⏱ Estimated learning time

---

## 🧠 Architecture

```
Frontend → Backend API → Career Pivot Service → Response → Frontend UI
```

### Core Components:

- `skillGapAnalyzer.js` → Identifies missing skills
- `readinessCalculator.js` → Computes weighted readiness
- `pivotService.js` → Combines logic and generates final output
- `roadmapGenerator.js` → Creates learning roadmap

---

## 📥 Input Format

```json
{
  "userSkills": ["HTML", "CSS"],
  "targetRole": "frontend developer"
}
```

---

## 📤 Output Format

```json
{
  "targetRole": "frontend developer",
  "missingSkills": ["JavaScript", "React", "Git"],
  "matchedSkillsList": ["HTML", "CSS"],
  "readiness": "16.67",
  "difficulty": "Hard",
  "jobMatchScore": "16.67",
  "roadmap": [
    {
      "skill": "React",
      "resource": "Learn React...",
      "priority": "High",
      "level": "Intermediate",
      "estimatedTime": "4-6 weeks"
    }
  ]
}
```

---

## ⚙️ Technologies Used

- JavaScript (Node.js)
- Modular architecture (service-based design)
- JSON-based role-skill dataset

---

## 🎯 Impact

The Career Pivot module transforms career guidance from static advice into a **data-driven, actionable system** by:

- Providing realistic readiness evaluation
- Highlighting critical skill gaps
- Delivering structured and prioritized learning paths

---

## 🏆 Highlights

- Weighted skill-based evaluation (industry-like approach)
- Personalized and actionable recommendations
- Scalable design for multiple roles and domains
- Seamless integration with backend APIs

---
