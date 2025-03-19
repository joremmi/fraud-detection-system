import { jsPDF } from 'jspdf';

export const exportToCSV = async () => {
  try {
    const response = await fetch('/api/reports/export/csv');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fraud-report.csv';
    a.click();
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};

export const exportToPDF = async () => {
  try {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.text('Fraud Analysis Report', 20, 20);
    
    // Save the PDF
    doc.save('fraud-report.pdf');
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
}; 