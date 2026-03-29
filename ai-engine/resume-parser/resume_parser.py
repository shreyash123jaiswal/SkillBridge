import PyPDF2
import docx
import os

class ResumeParser:
    @staticmethod
    def extract_text_from_pdf(pdf_path):
        text = ""
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text()
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text

    @staticmethod
    def extract_text_from_docx(docx_path):
        text = ""
        try:
            doc = docx.Document(docx_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
        return text

    @staticmethod
    def parse_resume(file_path):
        _, ext = os.path.splitext(file_path)
        if ext.lower() == '.pdf':
            return ResumeParser.extract_text_from_pdf(file_path)
        elif ext.lower() == '.docx':
            return ResumeParser.extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

if __name__ == "__main__":
    # Test script
    # Need to have a sample file for testing
    print("ResumeParser ready.")
