import spacy
from spacy.matcher import PhraseMatcher
import json
import os

class SkillExtractor:
    def __init__(self, skills_file_path=None):
        self.nlp = spacy.load("en_core_web_sm")
        self.matcher = PhraseMatcher(self.nlp.vocab)
        self.skills_list = []
        
        if skills_file_path:
            self.load_skills_from_json(skills_file_path)
            
    def load_skills_from_json(self, file_path):
        if not os.path.exists(file_path):
            print(f"Skills file not found: {file_path}")
            return
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            # Flatten all skills into a unique list
            all_skills = set()
            for role, skills in data.items():
                for skill in skills:
                    all_skills.add(skill)
            
            self.skills_list = list(all_skills)
            patterns = [self.nlp.make_doc(skill) for skill in self.skills_list]
            self.matcher.add("SKILL", patterns)

    def extract_skills(self, text):
        doc = self.nlp(text)
        matches = self.matcher(doc)
        
        extracted_skills = set()
        for match_id, start, end in matches:
            span = doc[start:end]
            extracted_skills.add(span.text)
            
        return list(extracted_skills)

if __name__ == "__main__":
    # Test script
    # Path to job_roles.json (relative to this script's location)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    skills_json_path = os.path.join(current_dir, '..', 'data', 'job_roles.json')
    
    extractor = SkillExtractor(skills_json_path)
    test_text = "I am a frontend developer with experience in React, JavaScript, and CSS. I also know a bit of Python and Machine Learning."
    
    found_skills = extractor.extract_skills(test_text)
    print(f"Extracted Skills: {found_skills}")
