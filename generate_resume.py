import json
import os

from fpdf import FPDF, XPos, YPos

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'assets', 'data', 'resume.json')
OUTPUT_DIR = os.path.join(BASE_DIR, 'assets', 'docs')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'Jason-Rae-Resume.pdf')

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Colors
PRIMARY_COLOR = (10, 25, 47)    # #0a191f (Dark Navy)
ACCENT_COLOR = (100, 255, 218)  # #64ffda (Electric Blue - adapted for print readability)
TEXT_COLOR = (50, 50, 50)       # Dark Gray for body text
HEADER_TEXT_COLOR = (255, 255, 255)

class PDF(FPDF):
    def header(self):
        # We will handle the header manually on the first page
        pass

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def section_title(self, title):
        self.ln(5)
        self.set_font('helvetica', 'B', 12)
        self.set_text_color(*PRIMARY_COLOR)
        self.cell(0, 8, title.upper(), border='B', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        self.ln(2)

    def chapter_body(self, body):
        self.set_font('helvetica', '', 10)
        self.set_text_color(*TEXT_COLOR)
        self.multi_cell(0, 5, body)
        self.ln()

    def date_location(self, date_str, location_str):
        self.set_font('helvetica', 'I', 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, f"{date_str} | {location_str}", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='R')

def create_resume():
    # Load Data
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Sanitize data for Latin-1
    def sanitize(obj):
        if isinstance(obj, str):
            return obj.replace('€', 'EUR').replace('–', '-').replace('—', '-').replace('“', '"').replace('”', '"').replace("’", "'")
        elif isinstance(obj, list):
            return [sanitize(item) for item in obj]
        elif isinstance(obj, dict):
            return {key: sanitize(value) for key, value in obj.items()}
        return obj

    data = sanitize(data)

    pdf = PDF()
    pdf.add_page()
    
    # --- Header Section (Custom design) ---
    pdf.set_fill_color(*PRIMARY_COLOR)
    pdf.rect(0, 0, 210, 40, 'F')
    
    # Name
    pdf.set_y(10)
    pdf.set_font('helvetica', 'B', 24)
    pdf.set_text_color(*HEADER_TEXT_COLOR)
    pdf.cell(0, 10, data['personalInfo']['name'], new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    
    # Title
    pdf.set_font('helvetica', '', 14)
    pdf.cell(0, 8, data['personalInfo']['title'], new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    
    # Contact Info
    pdf.set_font('helvetica', '', 9)
    contact_parts = [
        data['personalInfo']['email'],
        data['personalInfo']['location'],
        data['personalInfo']['website'],
        "linkedin.com/in/jason-c-rae"
    ]
    contact_str = "  |  ".join(contact_parts)
    pdf.cell(0, 8, contact_str, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    
    pdf.set_y(45) # Reset Y below header

    # --- Professional Summary ---
    pdf.section_title("Professional Summary")
    pdf.chapter_body(data['personalInfo']['summary'])

    # --- Experience ---
    pdf.section_title("Professional Experience")
    
    for job in data['experience']:
        # Title (Left) + Date (Right)
        pdf.set_font('helvetica', 'B', 11)
        pdf.set_text_color(*PRIMARY_COLOR)
        
        # Title - consume part of width
        pdf.cell(120, 6, job['title'])
        
        # Date & Location - consume rest, align right
        pdf.set_font('helvetica', 'I', 9)
        pdf.set_text_color(0, 0, 0)
        end_date = job['endDate'] if job['endDate'] else "Present"
        date_str = f"{job['startDate']} - {end_date} | {job['location']}"
        pdf.cell(0, 6, date_str, align='R', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        # Company Name
        pdf.set_font('helvetica', 'B', 10)
        pdf.set_text_color(80, 80, 80)
        pdf.cell(0, 5, job['company'], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        # Description
        pdf.ln(1)
        pdf.set_font('helvetica', '', 10)
        pdf.set_text_color(*TEXT_COLOR)
        pdf.set_x(10) # Ensure X is at margin
        pdf.multi_cell(0, 5, job['description'])
        
        # Achievements
        pdf.ln(1)
        for achievement in job['achievements']:
            pdf.set_font('helvetica', '', 10)
            pdf.set_x(10) 
            pdf.multi_cell(0, 5, "- " + achievement['text'])
        
        pdf.ln(3)

    # --- Skills & Stack ---
    pdf.section_title("Technical Skills & Daily Stack")
    
    # Helper for skill rows
    def add_skill_row(label, skills_list):
        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(40, 6, label, align='L')
        pdf.set_font('helvetica', '', 10)
        skills_text = ", ".join([item['name'] for item in skills_list])
        # Explicit width: Page(210) - Margin(20) - Label(40) = 150
        pdf.multi_cell(150, 6, skills_text)

    # AI/ML
    add_skill_row("AI & ML:", data['skills']['ai_ml']['items'])
    
    # Data Engineering
    add_skill_row("Data Engineering:", data['skills']['data_engineering']['items'])
    
    # Visualization
    add_skill_row("Visualization:", data['skills']['visualization']['items'])

    # --- Education ---
    pdf.section_title("Education")
    
    for edu in data['education']:
        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(120, 5, f"{edu['degree']} - {edu['institution']}")
        pdf.set_font('helvetica', 'I', 9)
        pdf.cell(0, 5, f"{edu['year']} | {edu['location']}", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='R')
        
    # --- Certifications ---
    pdf.ln(3)
    pdf.section_title("Certifications")
    cert_list = []
    for cert in data['certifications']:
        cert_list.append(f"{cert['name']} ({cert['year']})")
    
    pdf.set_font('helvetica', '', 10)
    pdf.multi_cell(0, 5, ", ".join(cert_list))

    # Output
    pdf.output(OUTPUT_FILE)
    print(f"Resume generated at: {OUTPUT_FILE}")

if __name__ == "__main__":
    create_resume()
