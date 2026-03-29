from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import os
import shutil
import tempfile
import json
from resume_parser.resume_parser import ResumeParser
from skill_extraction.skill_extractor import SkillExtractor
from job_matching.job_matcher import JobRecommender
from utils.upskilling import UpskillingAdvisor

app = FastAPI()

# Initialize components
current_dir = os.path.dirname(os.path.abspath(__file__))
skills_json_path = os.path.join(current_dir, 'data', 'job_roles.json')
extractor = SkillExtractor(skills_json_path)
recommender = JobRecommender(skills_json_path)
advisor = UpskillingAdvisor()

class SkillResponse(BaseModel):
    skills: List[str]

@app.post("/extract-skills-from-text/", response_model=SkillResponse)
async def extract_skills_from_text(text: str):
    skills = extractor.extract_skills(text)
    return {"skills": skills}

@app.post("/parse-resume/", response_model=SkillResponse)
async def parse_resume(file: UploadFile = File(...)):
    # Create a temporary file to store the uploaded resume
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
        
    try:
        # Parse text from resume
        text = ResumeParser.parse_resume(tmp_path)
        # Extract skills from text
        skills = extractor.extract_skills(text)
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        # Cleanup temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

class SkillGapRequest(BaseModel):
    user_skills: List[str]
    target_role: str

class SkillGapResponse(BaseModel):
    required_skills: List[str]
    missing_skills: List[str]
    match_percentage: float

@app.post("/analyze-skill-gap/", response_model=SkillGapResponse)
async def analyze_skill_gap(request: SkillGapRequest):
    # Load role skills
    with open(skills_json_path, 'r') as f:
        role_skills_data = json.load(f)
    
    target_role = request.target_role.lower()
    if target_role not in role_skills_data:
        raise HTTPException(status_code=404, detail="Target role not found")
        
    required_skills = role_skills_data[target_role]
    user_skills_normalized = [s.lower() for s in request.user_skills]
    
    missing_skills = [s for s in required_skills if s.lower() not in user_skills_normalized]
    match_percentage = (len(required_skills) - len(missing_skills)) / len(required_skills) * 100 if required_skills else 0
    
    return {
        "required_skills": required_skills,
        "missing_skills": missing_skills,
        "match_percentage": round(match_percentage, 2)
    }

class JobRecommendation(BaseModel):
    role: str
    match_percentage: float
    matching_skills: List[str]
    missing_skills: List[str]

class SalaryPrediction(BaseModel):
    base_salary: float
    predicted_salary: float
    currency: str
    match_percentage: float

@app.post("/recommend-jobs/", response_model=List[JobRecommendation])
async def recommend_jobs(user_skills: List[str]):
    recommendations = recommender.recommend_jobs(user_skills)
    return recommendations

@app.post("/predict-salary/", response_model=SalaryPrediction)
async def predict_salary(role: str, user_skills: List[str]):
    salary = recommender.predict_salary(role, user_skills)
    if "error" in salary:
        raise HTTPException(status_code=404, detail=salary["error"])
    return salary

@app.post("/recommend-courses/")
async def recommend_courses(missing_skills: List[str]):
    return advisor.recommend_courses(missing_skills)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
