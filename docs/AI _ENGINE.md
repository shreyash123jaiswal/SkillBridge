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
