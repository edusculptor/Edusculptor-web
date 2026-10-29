import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getServicePlans, agencyServices } from '../src/constants';

export interface ServiceData {
  id?: string;
  title: string;
  category?: string;
  price?: number | string;
  desc?: string;
  description?: string;
  features?: string[];
  plans?: any[];
}

export const generateServiceBrochure = (service: ServiceData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Match with complete agencyServices if available
  const fullService: any = agencyServices.find(
    s => s.id === service.id || s.title.toLowerCase().includes((service.title || '').toLowerCase())
  ) || service;

  const plans = getServicePlans(fullService);
  const serviceTitle = (fullService.title || service.title || 'Digital Service').toUpperCase();
  const serviceDesc = fullService.description || fullService.desc || service.desc || service.description || '';
  const standardFeatures = fullService.features || service.features || [];
  const refCode = `ESC-BR-${(service.id || 'SRV').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // -------------------------------- PAGE 1 --------------------------------
  // Header Banner
  doc.setFillColor(30, 58, 138); // Navy/Primary Blue [30, 58, 138]
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Accent line
  doc.setFillColor(59, 130, 246); // Light accent blue
  doc.rect(0, 43, pageWidth, 2, 'F');

  // Logo Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 10, 14, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('E', 18.5, 20.5);

  // Brand Name & Sub-badge
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('EDUSCULPTOR', 32, 17);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text('DIGITAL AGENCY & STRATEGY HUB • ENTERPRISE SOLUTIONS', 32, 22.5);

  doc.setFontSize(7.5);
  doc.text(`BROCHURE REF: ${refCode}  |  ISSUED: ${dateStr}`, 32, 27.5);

  // Document Title Banner on right
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SOLUTIONS BROCHURE', pageWidth - 14, 18, { align: 'right' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text('CONFIDENTIAL & PROPRIETARY', pageWidth - 14, 23, { align: 'right' });
  doc.text('www.edusculptor.com', pageWidth - 14, 28, { align: 'right' });

  // Hero Section on Page 1
  let currentY = 55;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('OFFICIAL SERVICE SPECIFICATION', 14, currentY);

  currentY += 7;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(serviceTitle, 14, currentY);

  currentY += 8;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const splitDesc = doc.splitTextToSize(
    serviceDesc || 'Custom-tailored modern engineering solutions built for high conversion, rock-solid security, and effortless scalability.',
    pageWidth - 28
  );
  doc.text(splitDesc, 14, currentY);
  currentY += (splitDesc.length * 5) + 6;

  // Standard Deliverables Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('CORE STANDARD DELIVERABLES INCLUDED IN ALL TIERS:', 18, currentY + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  
  const feats = standardFeatures.length > 0 
    ? standardFeatures 
    : ['High Performance Architecture', 'Responsive Multi-Device Layouts', 'Clean API Integration', 'Dedicated Quality Assurance'];

  feats.slice(0, 4).forEach((feat, idx) => {
    const colX = idx % 2 === 0 ? 18 : (pageWidth / 2) + 2;
    const rowY = currentY + 14 + (Math.floor(idx / 2) * 6);
    doc.text(`✓  ${feat}`, colX, rowY);
  });

  currentY += 34;

  // Package Blueprint Comparison Table Header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Package Comparison & Pricing Blueprint', 14, currentY);
  currentY += 3;

  // Build AutoTable for 4 Plans
  const tableData = plans.map(p => {
    const priceDisplay = p.price === 'Custom' 
      ? 'Custom Quote' 
      : `INR ${typeof p.price === 'number' ? p.price.toLocaleString() : p.price}`;
    
    const deliverablesList = (p.features || []).slice(0, 4).map((f: string) => `• ${f}`).join('\n');

    return [
      p.title || `${p.type?.toUpperCase()} PLAN`,
      p.type === 'intermediate' ? 'Standard / Recommended' : (p.type === 'custom' ? 'Enterprise Bespoke' : (p.type === 'advanced' ? 'Growth Scale' : 'Essential Launch')),
      priceDisplay,
      deliverablesList
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Package Plan', 'Target Profile', 'Investment', 'Key Deliverables & Specifications']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 4,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold', textColor: [15, 23, 42] },
      1: { cellWidth: 35 },
      2: { cellWidth: 28, fontStyle: 'bold', textColor: [37, 99, 235] },
      3: { cellWidth: 'auto' }
    },
    didDrawPage: () => {
      // Add Footer on page 1
      drawBrochureFooter(doc, 1, 2);
    }
  });

  // -------------------------------- PAGE 2 --------------------------------
  doc.addPage();

  // Secondary Header Banner
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 22, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 21, pageWidth, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EDUSCULPTOR DIGITAL AGENCY', 14, 13);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text(`${serviceTitle} — DETAILED SPECIFICATIONS & ENGAGEMENT MODEL`, pageWidth - 14, 13, { align: 'right' });

  let p2Y = 32;

  // Plan Details Grid / Sections
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('In-Depth Plan Specifications & Deliverables', 14, p2Y);
  p2Y += 7;

  plans.forEach((plan, i) => {
    const isRecommended = plan.type === 'intermediate';
    const isCustom = plan.price === 'Custom';
    const priceText = isCustom ? 'Custom Enterprise Pricing' : `INR ${plan.price?.toLocaleString()} / Project`;

    // Box Container
    doc.setFillColor(isRecommended ? 240 : 248, isRecommended ? 249 : 250, isRecommended ? 255 : 252);
    doc.setDrawColor(isRecommended ? 59 : 226, isRecommended ? 130 : 232, isRecommended ? 246 : 240);
    doc.roundedRect(14, p2Y, pageWidth - 28, 28, 2.5, 2.5, 'FD');

    // Title and Badge
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(plan.title || `${plan.type} Tier`, 18, p2Y + 6);

    if (isRecommended) {
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(18 + doc.getTextWidth(plan.title || 'Intermediate') + 4, p2Y + 2.5, 22, 4.5, 1, 1, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text('RECOMMENDED', 19 + doc.getTextWidth(plan.title || 'Intermediate') + 5, p2Y + 5.7);
    }

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(priceText, pageWidth - 18, p2Y + 6, { align: 'right' });

    // Description
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const shortDesc = doc.splitTextToSize(plan.description || 'Comprehensive architecture with complete quality delivery.', pageWidth - 36);
    doc.text(shortDesc.slice(0, 1), 18, p2Y + 11.5);

    // Deliverables row
    const featsList = (plan.features || []).slice(0, 4);
    featsList.forEach((feat: string, fIdx: number) => {
      const col = fIdx % 2 === 0 ? 18 : (pageWidth / 2);
      const row = p2Y + 17 + (Math.floor(fIdx / 2) * 4.5);
      doc.setFontSize(7);
      doc.setTextColor(30, 58, 138);
      doc.text(`• ${feat}`, col, row);
    });

    p2Y += 32;
  });

  p2Y += 2;

  // Execution Methodology & Workflow
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Our 4-Stage Delivery Methodology', 14, p2Y);
  p2Y += 6;

  const steps = [
    { num: '01', title: 'Precision Discovery', desc: 'Requirements audit, wireframes & tech stack selection' },
    { num: '02', title: 'Agile Sprint Dev', desc: 'Bi-weekly builds, continuous reviews & transparent demos' },
    { num: '03', title: 'Rigorous QA & Audit', desc: 'Speed audits, security penetration & cross-device checks' },
    { num: '04', title: 'Launch & Care SLA', desc: 'Production cutover, automated backups & post-launch care' },
  ];

  const colWidth = (pageWidth - 28 - 9) / 4;
  steps.forEach((step, idx) => {
    const boxX = 14 + (idx * (colWidth + 3));
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, p2Y, colWidth, 23, 2, 2, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(step.num, boxX + 4, p2Y + 6);

    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(step.title, boxX + 4, p2Y + 11);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const stepDesc = doc.splitTextToSize(step.desc, colWidth - 8);
    doc.text(stepDesc, boxX + 4, p2Y + 15.5);
  });

  p2Y += 28;

  // Contact & Inquiries CTA Box
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(14, p2Y, pageWidth - 28, 22, 2.5, 2.5, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Ready to Initiate Your Project?', 18, p2Y + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Schedule a 1-on-1 strategy call with our tech lead or submit your proposal request:', 18, p2Y + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(96, 165, 250);
  doc.text('Email: edusculptor@gmail.com  |  Portal: www.edusculptor.com  |  Phone: +91 98765 43210', 18, p2Y + 17.5);

  // Footer for page 2
  drawBrochureFooter(doc, 2, 2);

  // Save the PDF
  const safeFilename = `${(service.title || 'Service').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_brochure.pdf`;
  doc.save(safeFilename);
};

const drawBrochureFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('EduSculptor Digital Agency © 2026. All rights reserved. Confidential brochure blueprint.', 14, pageHeight - 7);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
};
