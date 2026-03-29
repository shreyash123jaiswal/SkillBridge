import json
import os

class JobRecommender:
    def __init__(self, skills_file_path):
        self.skills_file_path = skills_file_path
        self.role_skills = self._load_role_skills()
        
    def _load_role_skills(self):
        if not os.path.exists(self.skills_file_path):
            return {}
        with open(self.skills_file_path, 'r') as f:
            return json.load(f)

    def recommend_jobs(self, user_skills):
        user_skills_set = set(skill.lower() for skill in user_skills)
        recommendations = []
        
        for role, required_skills in self.role_skills.items():
            required_skills_set = set(skill.lower() for skill in required_skills)
            
            # Intersection of skills
            matching_skills = user_skills_set.intersection(required_skills_set)
            match_count = len(matching_skills)
            total_required = len(required_skills_set)
            
            # Calculate score
            score = (match_count / total_required) * 100 if total_required > 0 else 0
            
            recommendations.append({
                "role": role,
                "match_percentage": round(score, 2),
                "matching_skills": list(matching_skills),
                "missing_skills": list(required_skills_set - user_skills_set)
            })
            
        # Sort by match percentage descending
        recommendations.sort(key=lambda x: x['match_percentage'], reverse=True)
        return recommendations

    def predict_salary(self, role, user_skills):
        # A simple dummy salary prediction based on role and skill match
        # In a real app, this would use a regression model and real market data
        base_salaries = {
            "frontend developer": 60000,
            "backend developer": 65000,
            "full stack developer": 75000,
            "data analyst": 55000,
            "machine learning engineer": 90000,
            "devops engineer": 85000
        }
        
        role = role.lower()
        base_salary = base_salaries.get(role, 50000)
        
        # Adjust based on match
        recs = self.recommend_jobs(user_skills)
        match_info = next((r for r in recs if r['role'].lower() == role), None)
        
        if match_info:
            match_percent = match_info['match_percentage']
            # Salary can range from 80% to 120% of base based on readiness
            multiplier = 0.8 + (match_percent / 100) * 0.4
            predicted_salary = base_salary * multiplier
            return {
                "base_salary": base_salary,
                "predicted_salary": round(predicted_salary, -2), # Round to nearest 100
                "currency": "USD",
                "match_percentage": match_percent
            }
        
        return {"error": "Role not found for salary prediction"}

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    skills_json_path = os.path.join(current_dir, '..', 'data', 'job_roles.json')
    recommender = JobRecommender(skills_json_path)
    
    test_skills = ["React", "JavaScript", "HTML", "CSS", "Git"]
    recs = recommender.recommend_jobs(test_skills)
    print(f"Top Recommendation: {recs[0]['role']} ({recs[0]['match_percentage']}%)")
    
    salary = recommender.predict_salary("frontend developer", test_skills)
    print(f"Salary Prediction: {salary}")
