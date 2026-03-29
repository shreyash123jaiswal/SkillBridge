# AI Engine

This directory contains the AI and NLP logic for SkillBridge.

## Features
- Resume parsing (NLP)
- Skill extraction
- Job matching algorithm
- Salary prediction

## Folder Structure
- `resume-parser/`: Logic for parsing resume files (PDF/DOCX).
- `skill-extraction/`: NLP logic for extracting skills from text.
- `job-matching/`: Algorithms for matching user skills to job roles.
- `utils/`: Helper scripts like upskilling advice.
- `data/`: Mock data for testing (roles, skills, resumes).
- `tests/`: Unit tests for AI components.

## Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate # Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Download spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. Run the demo integration script:
   ```bash
   python main.py
   ```

5. Start the API for platform integration:
   ```bash
   uvicorn app:app --reload
   ```

## Endpoints
- `POST /extract-skills-from-text/`: Extract skills from raw text.
- `POST /parse-resume/`: Upload PDF/DOCX to extract skills.
- `POST /analyze-skill-gap/`: Compare user skills with a target role.
- `POST /recommend-jobs/`: Get a list of matching job roles based on skills.
- `POST /predict-salary/`: Predict salary based on role and skill match.
- `POST /recommend-courses/`: Get course recommendations for missing skills.
