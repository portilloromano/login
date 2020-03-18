import jsPDF from "jspdf";
import "jspdf-autotable";

const ToPDF = (title, headers, data, filename = 'report.pdf', orientation = 'portrait') => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  // const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  let content = {
    startY: 50,
    head: headers,
    body: data
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save(filename);
}

export default ToPDF;