import pytest
import os
import sys

# Add the parent directory to sys.path to allow importing from other modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from job_matching.job_matcher import JobRecommender

@pytest.fixture
def recommender():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    skills_json_path = os.path.join(current_dir, '..', 'data', 'job_roles.json')
    return JobRecommender(skills_json_path)

def test_recommend_jobs_high_match(recommender):
    user_skills = ["React", "JavaScript", "HTML", "CSS", "Git"]
    recs = recommender.recommend_jobs(user_skills)
    
    # Frontend developer should be a high match
    frontend_rec = next(r for r in recs if r['role'].lower() == "frontend developer")
    assert frontend_rec['match_percentage'] > 50
    assert "React" in frontend_rec['matching_skills']

def test_predict_salary_valid_role(recommender):
    user_skills = ["React", "JavaScript", "HTML", "CSS", "Git"]
    salary_info = recommender.predict_salary("frontend developer", user_skills)
    
    assert "predicted_salary" in salary_info
    assert salary_info["currency"] == "USD"
    assert salary_info["predicted_salary"] > 0

def test_predict_salary_invalid_role(recommender):
    user_skills = ["React"]
    salary_info = recommender.predict_salary("Rocket Scientist", user_skills)
    
    assert "error" in salary_info
    assert salary_info["error"] == "Role not found for salary prediction"
