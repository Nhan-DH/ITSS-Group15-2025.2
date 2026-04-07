from pathlib import Path
import PyPDF2
p = Path('Describe/Tanh_doc/Tanh_nghiệp vụ gym_ver3.pdf')
reader = PyPDF2.PdfReader(open(p, 'rb'))
with open('full_pdf_text.txt', 'w', encoding='utf-8') as out:
    for i, page in enumerate(reader.pages):
        out.write(f'---PAGE {i+1}\n')
        text = page.extract_text()
        out.write((text or '<no text>') + '\n')
