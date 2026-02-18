from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import io
from datetime import datetime

def generate_pdf_report(incidents_data: list):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    story = []
    
    # Title
    title_style = styles['Title']
    story.append(Paragraph("ResQ Sentinel - Damage Assessment Report", title_style))
    story.append(Spacer(1, 12))
    
    # Meta Info
    normal_style = styles['Normal']
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    story.append(Paragraph(f"Sector: Downtown Los Angeles (Zone 7)", normal_style))
    story.append(Spacer(1, 24))
    
    # Table Data
    data = [['ID', 'Type', 'Severity', 'Coordinates']]
    for inc in incidents_data:
        data.append([
            inc.get('id', 'N/A'),
            inc.get('type', 'Unknown'),
            inc.get('severity', 'LOW'),
            f"{inc.get('coordinates', {}).get('lat', 0):.4f}, {inc.get('coordinates', {}).get('lng', 0):.4f}"
        ])
        
    # Table Style
    t = Table(data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(t)
    story.append(Spacer(1, 24))
    
    # Disclaimer
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey)
    story.append(Paragraph("CONFIDENTIAL - FOR AUTHORIZED PERSONNEL ONLY", footer_style))
    
    doc.build(story)
    buffer.seek(0)
    return buffer
