'use client';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Modal } from '@/components/ui/Modal';
import html2pdf from 'html2pdf.js';

interface Student {
  id: string;
  fullName: string;
  grade: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  address: string;
  class: string;
  academicYear: string;
}

const students: Student[] = [
  {
    id: '1',
    fullName: 'John Doe',
    grade: 'Grade 1',
    dateOfBirth: '2010-05-15',
    nationality: 'American',
    gender: 'Male',
    address: '123 Main St, New York, NY, USA',
    class: 'Grade 1',
    academicYear: '2024/2025',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    grade: 'Grade 2',
    dateOfBirth: '2011-07-20',
    nationality: 'British',
    gender: 'Female',
    address: '456 Oak Ave, London, UK',
    class: 'Grade 2',
    academicYear: '2024/2025',
  },
];

const invoiceTemplates = {
  schoolFees: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">School Fees Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Term 1 School Fees</td>
            <td style="border: 1px solid #000; padding: 8px;">$2,500.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$2,500.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  canteenFees: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Canteen Fees Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Monthly Canteen Fees</td>
            <td style="border: 1px solid #000; padding: 8px;">$150.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$150.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  books: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Books Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Textbooks and Workbooks</td>
            <td style="border: 1px solid #000; padding: 8px;">$200.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$200.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  uniforms: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Uniforms Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">School Uniform Set</td>
            <td style="border: 1px solid #000; padding: 8px;">$120.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">PE Kit</td>
            <td style="border: 1px solid #000; padding: 8px;">$80.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$200.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  stationery: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Stationery Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Stationery Pack</td>
            <td style="border: 1px solid #000; padding: 8px;">$50.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$50.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  boardingHouseFees: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Boarding House Fees Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Term 1 Boarding Fees</td>
            <td style="border: 1px solid #000; padding: 8px;">$1,200.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Boarding Materials</td>
            <td style="border: 1px solid #000; padding: 8px;">$150.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$1,350.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  admissionFees: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Admission Fees Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Admission Processing Fee</td>
            <td style="border: 1px solid #000; padding: 8px;">$100.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Registration Fee</td>
            <td style="border: 1px solid #000; padding: 8px;">$250.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$350.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  mockFees: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Mock Exam Fees Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Mock Exam Registration</td>
            <td style="border: 1px solid #000; padding: 8px;">$75.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Study Materials</td>
            <td style="border: 1px solid #000; padding: 8px;">$25.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$100.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `,
  others: (student: Student) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">Miscellaneous Fees Invoice</h1>
      <p><strong>School Name:</strong> [YOUR COMPANY NAME]</p>
      <p><strong>School Address:</strong> [YOUR COMPANY ADDRESS]</p>
      <p><strong>School Number:</strong> [YOUR COMPANY NUMBER]</p>
      <p><strong>Parent/Guardian Name:</strong> ${student.fullName}</p>
      <p><strong>Address:</strong> ${student.address}</p>
      <p><strong>Email:</strong> [PARENT EMAIL]</p>
      <p><strong>Phone Number:</strong> [PARENT PHONE NUMBER]</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Excursion Fee</td>
            <td style="border: 1px solid #000; padding: 8px;">$50.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Activity Fee</td>
            <td style="border: 1px solid #000; padding: 8px;">$30.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Total Amount to be Paid</td>
            <td style="border: 1px solid #000; padding: 8px;">$80.00</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Bank Transfer:</strong> Please make payments to [YOUR COMPANY NAME] Account Number: 123456789 at BlueLeaf Bank.</p>
      <p><strong>Payment Due Date:</strong> November 14, 2050.</p>
      <p>Should you have any questions regarding this invoice, please do not hesitate to contact me at [YOUR EMAIL].</p>
    </div>
  `
};

function InvoiceGenerationPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<keyof typeof invoiceTemplates>('schoolFees');
  const [invoiceContent, setInvoiceContent] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [tempSearchName, setTempSearchName] = useState('');
  const [tempSearchClass, setTempSearchClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { authFetch } = useAuth();

  const classOptions = ["Creche", "Nursery 1", "Nursery 2", "KG 1", "KG 2", 
                       "Grade 1", "Grade 2", "Grade 3", "Grade 4", 
                       "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"];

  const invoiceTypeOptions = [
    { value: 'schoolFees', label: 'School Fees' },
    { value: 'canteenFees', label: 'Canteen Fees' },
    { value: 'books', label: 'Books' },
    { value: 'uniforms', label: 'Uniforms' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'boardingHouseFees', label: 'Boarding House Fees' },
    { value: 'admissionFees', label: 'Admission Fees' },
    { value: 'mockFees', label: 'Mock Fees' },
    { value: 'others', label: 'Others (Excursions, etc.)' }
  ];

  const filteredStudents = students.filter(student => {
    const nameMatch = student.fullName.toLowerCase().includes(searchName.toLowerCase());
    const classMatch = student.class.toLowerCase().includes(searchClass.toLowerCase());
    return nameMatch && classMatch;
  });

  // Calculate gender counts
  const totalStudents = filteredStudents.length;
  const maleCount = filteredStudents.filter(student => student.gender === 'Male').length;
  const femaleCount = filteredStudents.filter(student => student.gender === 'Female').length;

  const handleViewAll = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchName('');
      setSearchClass('');
      setTempSearchName('');
      setTempSearchClass('');
      setShowResults(true);
      setHasSearched(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (type: 'name' | 'class') => {
    setIsSearching(true);
    if (type === 'name') {
      setSearchName(tempSearchName);
    } else {
      setSearchClass(tempSearchClass);
    }
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      setHasSearched(true);
    }, 1000);
  };

  const handleCreateInvoice = (student: Student) => {
    setSelectedStudent(student);
    setInvoiceContent(invoiceTemplates[selectedInvoiceType](student));
    setIsPreviewing(true);
  };

  const handleSaveInvoice = () => {
    if (!selectedStudent) return;
    
    setIsSaving(true);
    
    const element = document.createElement('div');
    element.innerHTML = invoiceContent;

    html2pdf()
      .set({
        margin: 10,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
      .then(() => {
        setIsSaving(false);
      });
  };

  const handleSendInvoice = async () => {
    if (!selectedStudent) return;

    setIsSending(true);
    
    const element = document.createElement('div');
    element.innerHTML = invoiceContent;

    try {
      const pdfBlob = await html2pdf()
        .set({
          margin: 10,
          filename: 'invoice.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, logging: true, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .outputPdf('blob');

      const formData = new FormData();
      formData.append('file', pdfBlob, 'invoice.pdf');

      const response = await authFetch('/api/send-invoice', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send invoice');
      }

      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleEditInvoice = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const handleAddRow = () => {
    const newRow = `
      <tr>
        <td style="border: 1px solid #000; padding: 8px;" contenteditable="true">New Service</td>
        <td style="border: 1px solid #000; padding: 8px;" contenteditable="true">$0.00</td>
      </tr>
    `;
    setInvoiceContent((prevContent) => prevContent.replace(/<\/tbody>/, `${newRow}</tbody>`));
  };

  const handleAddColumn = () => {
    // Add column to header
    const newHeaderColumn = `<th style="border: 1px solid #000; padding: 8px; text-align: left;" contenteditable="true">New Column</th>`;
    
    // Add column to each row
    const newDataColumn = `<td style="border: 1px solid #000; padding: 8px;" contenteditable="true"></td>`;
    
    // Update the invoice content
    setInvoiceContent(prevContent => {
      // Add to header (between last th and closing tr)
      let updatedContent = prevContent.replace(/(<\/th>)(\s*<\/tr>)/, `$1${newHeaderColumn}$2`);
      
      // Add to each data row (between last td and closing tr)
      updatedContent = updatedContent.replace(/(<\/td>)(\s*<\/tr>)/g, `$1${newDataColumn}$2`);
      
      return updatedContent;
    });
  };

  return (
    <div className="p-5 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Generate Invoices</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-green-700">Search by Name</label>
            <div className="flex">
              <input
                type="text"
                className="w-full p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter student name"
                value={tempSearchName}
                onChange={(e) => setTempSearchName(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                onClick={() => handleSearch('name')}
                disabled={isSearching || !tempSearchName}
              >
                {isSearching ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-green-700">Search by Class</label>
            <div className="flex">
              <select
                className="w-full p-2 border border-green-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
                value={tempSearchClass}
                onChange={(e) => setTempSearchClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classOptions.map(classOption => (
                  <option key={classOption} value={classOption}>{classOption}</option>
                ))}
              </select>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                onClick={() => handleSearch('class')}
                disabled={isSearching || !tempSearchClass}
              >
                {isSearching ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full flex items-center justify-center disabled:bg-green-300 disabled:cursor-not-allowed transition-colors shadow-md"
              onClick={handleViewAll}
              disabled={isLoading || isSearching}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'View All Students'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Type Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-green-200">
        <h2 className="text-lg font-semibold mb-3 text-green-800">Select Invoice Type</h2>
        <div className="flex gap-2">
          <select
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedInvoiceType}
            onChange={(e) => setSelectedInvoiceType(e.target.value as keyof typeof invoiceTemplates)}
          >
            {invoiceTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap transition-colors shadow-md"
            onClick={() => {
              if (selectedStudent) {
                setInvoiceContent(invoiceTemplates[selectedInvoiceType](selectedStudent));
              }
            }}
          >
            Select
          </button>
        </div>
      </div>

      {!hasSearched && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Date of Birth</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nationality</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Create Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="p-4 text-center text-green-700">
                  Use the search or filter options above to view students
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {hasSearched && (
        <>
          {/* Gender Count Summary */}
          {(searchName || searchClass || filteredStudents.length > 0) ? (
            <>
              <div className="bg-green-100 p-6 rounded-lg shadow-md mb-6 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                    <h3 className="font-bold text-lg text-green-800">Total Students</h3>
                    <p className="text-2xl text-green-600">{totalStudents}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                    <h3 className="font-bold text-lg text-green-800">Male Students</h3>
                    <p className="text-2xl text-green-600">{maleCount}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200 text-center">
                    <h3 className="font-bold text-lg text-green-800">Female Students</h3>
                    <p className="text-2xl text-green-600">{femaleCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Photo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Date of Birth</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nationality</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Create Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-green-50">
                        <td className="px-4 py-3">
                          <img src={`/images/${student.id}.jpg`} alt={student.fullName} className="w-10 h-10 rounded-full" />
                        </td>
                        <td className="px-4 py-3 text-sm text-green-900">{student.fullName}</td>
                        <td className="px-4 py-3 text-sm text-green-700">{student.dateOfBirth}</td>
                        <td className="px-4 py-3 text-sm text-green-700">{student.nationality}</td>
                        <td className="px-4 py-3 text-sm text-green-700">{student.gender}</td>
                        <td className="px-4 py-3 text-sm text-green-700">{student.address}</td>
                        <td className="px-4 py-3 text-sm text-green-700">{student.class}</td>
                        <td className="px-4 py-3">
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-md"
                            onClick={() => handleCreateInvoice(student)}
                          >
                            Create Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Date of Birth</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nationality</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Create Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-green-700">
                      No students found. Try searching or viewing all students.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {isPreviewing && selectedStudent && (
        <Modal isOpen={isPreviewing} onClose={() => setIsPreviewing(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Invoice Preview - {invoiceTypeOptions.find(opt => opt.value === selectedInvoiceType)?.label}</h2>
              <button 
                onClick={() => setIsPreviewing(false)}
                className="text-green-600 hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isEditing ? (
              <div
                contentEditable
                suppressContentEditableWarning
                className="border border-green-300 p-4 rounded"
                onBlur={(e) => setInvoiceContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: invoiceContent }}
              />
            ) : (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: invoiceContent }}
              />
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => setIsPreviewing(false)}
              >
                Close
              </button>
              
              {isEditing ? (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={handleFinishEditing}
                  >
                    Finish Editing
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={handleAddRow}
                  >
                    Add Row
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={handleAddColumn}
                  >
                    Add Column
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  onClick={handleEditInvoice}
                >
                  Edit Invoice
                </button>
              )}
              
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center min-w-[120px] transition-colors shadow-md"
                onClick={handleSaveInvoice}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save as PDF'
                )}
              </button>
              
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center min-w-[120px] transition-colors shadow-md"
                onClick={handleSendInvoice}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Invoice'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function ProtectedInvoiceGenerationPage() {
  return (
    <ProtectedRoute>
      <InvoiceGenerationPage />
    </ProtectedRoute>
  );
}