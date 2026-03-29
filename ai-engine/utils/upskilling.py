import json
import os

class UpskillingAdvisor:
    def __init__(self, courses_file_path=None):
        self.courses_file_path = courses_file_path
        # Hardcoded sample courses for now
        self.course_database = {
            "HTML": [{"title": "HTML for Beginners", "platform": "Coursera", "duration": "5h"}, {"title": "Advanced HTML5", "platform": "Udemy", "duration": "10h"}],
            "CSS": [{"title": "CSS Layouts", "platform": "FreeCodeCamp", "duration": "8h"}, {"title": "Tailwind CSS Mastery", "platform": "YouTube", "duration": "4h"}],
            "JavaScript": [{"title": "JS Algorithms", "platform": "LeetCode", "duration": "20h"}, {"title": "Modern JavaScript ES6", "platform": "Udemy", "duration": "12h"}],
            "React": [{"title": "React - The Complete Guide", "platform": "Udemy", "duration": "40h"}, {"title": "Frontend Development with React", "platform": "edX", "duration": "30h"}],
            "Node.js": [{"title": "Backend with Node.js", "platform": "Pluralsight", "duration": "15h"}],
            "Python": [{"title": "Python for Data Science", "platform": "DataCamp", "duration": "25h"}],
            "Machine Learning": [{"title": "ML Specialization", "platform": "Coursera", "duration": "60h"}],
            "Docker": [{"title": "Docker for DevOps", "platform": "Docker Desktop", "duration": "6h"}]
        }

    def recommend_courses(self, missing_skills):
        recommendations = {}
        for skill in missing_skills:
            skill_upper = skill # Keep original case or normalize? Let's try matching
            found = False
            for db_skill in self.course_database:
                if db_skill.lower() == skill.lower():
                    recommendations[skill] = self.course_database[db_skill]
                    found = True
                    break
            if not found:
                recommendations[skill] = [{"title": f"Search for {skill} courses", "platform": "Web", "duration": "Unknown"}]
        return recommendations

if __name__ == "__main__":
    advisor = UpskillingAdvisor()
    recs = advisor.recommend_courses(["React", "Docker"])
    print(f"Recommendations: {recs}")
