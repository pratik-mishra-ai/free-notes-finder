// Builds a tiny valid one-page PDF so sample notes can be viewed and downloaded.
function makePdf(title, lines) {
  const esc = (s) => s.replace(/[\\()]/g, '\\$&');
  let content = `BT /F1 20 Tf 60 740 Td (${esc(title)}) Tj ET\n`;
  lines.forEach((l, i) => {
    content += `BT /F1 12 Tf 60 ${700 - i * 24} Td (${esc(l)}) Tj ET\n`;
  });
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return { pdfData: `data:application/pdf;base64,${btoa(pdf)}`, fileSize: pdf.length };
}

const RAW = [
  ['Java OOP Concepts Cheat Sheet', 'Java', 'Object-Oriented Programming', 3, 'Aarav Sharma', '2026-09-28', 'Classes, inheritance, polymorphism, abstraction and encapsulation with short examples.',
    ['1. Class and object: a class is a blueprint, an object is an instance.', '2. Inheritance: a subclass reuses a superclass using extends.', '3. Polymorphism: overloading (compile time), overriding (runtime).', '4. Abstraction: abstract classes and interfaces.', '5. Encapsulation: private fields with getters and setters.']],
  ['Binary Trees and Traversals', 'DSA', 'Trees', 3, 'Meera Iyer', '2026-10-02', 'Inorder, preorder, postorder and level-order traversals with time complexity.',
    ['Inorder: left, root, right.', 'Preorder: root, left, right.', 'Postorder: left, right, root.', 'Level order: use a queue, visit level by level.', 'All traversals run in O(n) time.']],
  ['SQL Joins and Normalization', 'DBMS', 'SQL and Normal Forms', 4, 'Rohan Verma', '2026-10-05', 'INNER, LEFT, RIGHT and FULL joins, plus 1NF to BCNF explained simply.',
    ['INNER JOIN: rows that match in both tables.', 'LEFT JOIN: all left rows, matches from the right.', '1NF: atomic values.', '2NF: no partial dependency.', '3NF: no transitive dependency.']],
  ['CPU Scheduling Algorithms', 'Operating Systems', 'Process Scheduling', 4, 'Sneha Kulkarni', '2026-10-08', 'FCFS, SJF, Round Robin and Priority scheduling with Gantt chart steps.',
    ['FCFS: first come, first served.', 'SJF: shortest burst time first.', 'Round Robin: fixed time quantum per process.', 'Priority: highest priority runs first.', 'Waiting time = turnaround time - burst time.']],
  ['OSI Model Quick Revision', 'Computer Networks', 'OSI and TCP/IP', 5, 'Imran Khan', '2026-10-10', 'All seven OSI layers with protocols and devices, mapped to TCP/IP.',
    ['Physical, Data Link, Network, Transport, Session, Presentation, Application.', 'Network layer: IP, routers.', 'Transport layer: TCP, UDP.', 'Data Link layer: Ethernet, switches.']],
  ['HTML, CSS and Flexbox Basics', 'Web Development', 'Frontend Fundamentals', 2, 'Priya Nair', '2026-10-12', 'Semantic HTML, the box model and a visual guide to Flexbox properties.',
    ['Use semantic tags: header, nav, main, section, footer.', 'Box model: content, padding, border, margin.', 'Flexbox: display flex, justify-content, align-items.', 'Use media queries for responsive layouts.']],
  ['Matrices and Determinants', 'Mathematics', 'Linear Algebra', 1, 'Karan Mehta', '2026-10-13', 'Matrix operations, determinant rules and the inverse of a 2x2 matrix.',
    ['det(AB) = det(A) x det(B).', 'Swapping two rows changes the sign of the determinant.', 'Inverse of 2x2: (1/det) x [d -b; -c a].', 'A matrix is invertible only if det is not 0.']],
];

export function getSampleNotes() {
  return RAW.map(([title, subject, topic, semester, uploader, date, description, lines], i) => {
    const { pdfData, fileSize } = makePdf(title, lines);
    return {
      id: `sample-${i + 1}`,
      title, subject, topic, semester, uploader, description,
      uploadedAt: `${date}T10:00:00.000Z`,
      fileName: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.pdf`,
      fileSize, pdfData,
      ownerId: 'sample',
      isSample: true,
    };
  });
}
