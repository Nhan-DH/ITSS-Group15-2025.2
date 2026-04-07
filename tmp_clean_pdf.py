from pathlib import Path
import re
s = Path('full_pdf_text.txt').read_text(encoding='utf-8')
clean = re.sub(r'\s+', ' ', s).strip()
clean = clean.replace('---PAGE', '\n---PAGE')
Path('full_pdf_text_clean.txt').write_text(clean, encoding='utf-8')
print('done')
