from resume_parser.resume_parser import ResumeParser
from skill_extraction.skill_extractor import SkillExtractor
from job_matching.job_matcher import JobRecommender
import os

# Initialize paths
current_dir = os.path.dirname(os.path.abspath(__file__))
skills_json_path = os.path.join(current_dir, 'data', 'job_roles.json')

# Step 1: Initialize components
extractor = SkillExtractor(skills_json_path)
recommender = JobRecommender(skills_json_path)

# Step 2: Sample resume text (as in Step 6)
resume_text = "I am a software engineer skilled in Python, JavaScript, React, and SQL."

# Step 3: Extract skills from the parsed resume
# Note: Using our more advanced extractor instead of the basic one in the plan
extracted_skills = extractor.extract_skills(resume_text)
print(f"Extracted Skills: {extracted_skills}")

# Step 4: Match the skills to job roles
matched_jobs = recommender.recommend_jobs(extracted_skills)

print("\nMatched Jobs (Role, Match %):")
for job in matched_jobs:
    print(f"- {job['role']}: {job['match_percentage']}%")

# Step 5: Salary Prediction for the top match
if matched_jobs:
    top_job = matched_jobs[0]['role']
    salary_info = recommender.predict_salary(top_job, extracted_skills)
    print(f"\nPredicted Salary for {top_job}: {salary_info['predicted_salary']} {salary_info['currency']}")
