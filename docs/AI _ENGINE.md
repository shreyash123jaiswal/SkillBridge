### 1. The Core Vision
"SkillBridge is an AI-powered career guidance platform. The AI Engine is the brain of this platform. Its mission is to take a user's unstructured data—like a resume—and transform it into a data-driven career roadmap."

### 2. The Technical Solution (The Stack)
"We built the engine using Python , the industry standard for Artificial Intelligence. We integrated two powerful technologies:

- spaCy (NLP) : A professional-grade Natural Language Processing library that understands human language.
- FastAPI : A high-performance web framework that allows our AI to communicate seamlessly with the rest of the platform in real-time."
### 3. The 4-Stage AI Pipeline
"Our engine processes data through a sophisticated four-stage pipeline:"

- Stage 1: Document Intelligence (Parsing) :
  "Using resume_parser.py , we handle the 'dirty work' of extracting clean text from messy PDF and Word documents. This ensures no information is lost during the upload."
- Stage 2: Named Entity Recognition (Skill Extraction) :
  "In skill_extractor.py , we use spaCy’s PhraseMatcher . Instead of simple keyword searching, the AI understands the context to identify professional skills accurately from our job_roles.json database."
- Stage 3: Gap Analysis & Job Matching :
  "This is where the 'bridge' happens. In job_matcher.py , the engine compares the user’s current skills against industry requirements. It calculates a Match Percentage and, more importantly, identifies exactly what is missing."
- Stage 4: Predictive Recommendations :
  "Finally, we provide actionable value. The engine predicts a realistic salary range based on the user's current readiness and uses upskilling.py to recommend specific courses to bridge the identified gaps."

### Pipeline 1: Document Intelligence (The Parser)
- File : resume_parser.py
- Goal : Transform unstructured document files into clean, machine-readable text.
- How it works :
  1. Format Detection : The engine first identifies if the file is a .pdf or a .docx .
  2. Extraction :
     - For PDFs , it uses PyPDF2 to iterate through every page and pull out the text layers.
     - For Word Docs , it uses python-docx to read paragraphs and structured text.
  3. Normalization : The extracted text is often "messy" (with weird spacing or symbols). The parser cleans this text so the NLP model in the next stage doesn't get confused by formatting.
### Pipeline 2: NLP Skill Extraction (The Core)
- File : skill_extractor.py
- Goal : Understand the context of the text and identify specific professional skills.
- How it works :
  1. Tokenization : Using the spaCy library, the raw text is broken down into "tokens" (words and phrases).
  2. Phrase Matching : Instead of a simple "Ctrl+F" search, we use a PhraseMatcher . This is much faster and more accurate because it matches multi-word skills (like "Machine Learning" or "Full Stack Development") as single entities.
  3. Deduplication : It filters the results to ensure that if "React" is mentioned five times in a resume, it only counts as one skill in the final profile.
### Pipeline 3: Logic-Driven Matching (The Analyzer)
- File : job_matcher.py
- Goal : Compare the user's "Extracted Skills" against our "Role Database" ( job_roles.json ).
- How it works :
  1. Intersection Logic : It performs a mathematical set intersection between the User Skills and the Required Skills for every job role.
  2. Scoring Algorithm :
     - Match Score : (Matching Skills / Total Required Skills) * 100 .
     - Gap Analysis : It subtracts the user's skills from the target role's requirements to find the exact Missing Skills .
  3. Ranking : It sorts all job roles by the match score so the user sees their most compatible career paths first.
### Pipeline 4: Actionable Recommendations (The Advisor)
- Files : job_matcher.py and upskilling.py
- Goal : Turn the analysis into real-world value for the user.
- How it works :
  1. Salary Prediction : We use a base salary for each role and apply a multiplier based on the match percentage. If you have 100% of the skills, your predicted salary is higher than if you only have 60%.
  2. Course Mapping : For every Missing Skill identified in Pipeline 3, the UpskillingAdvisor searches its database for specific courses.
  3. Final JSON Assembly : All these insights—skills, matches, gaps, salaries, and courses—are bundled into a single JSON object and sent back via app.py .
