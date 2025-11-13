import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const TranscriptUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // In a real app, you would call: studentAPI.getDocuments()
      // For now, we'll simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading documents:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Please upload files smaller than 10MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, JPG, or PNG files only.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('transcript', file);
      formData.append('documentType', 'academic_transcript');
      formData.append('uploadDate', new Date().toISOString());

      // REAL API CALL to your backend
      const response = await studentAPI.uploadTranscript(formData);
      
      // Add the new document to the list
      const newDocument = {
        id: response.documentId || documents.length + 1,
        name: file.name,
        type: 'Academic Transcript',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Pending Verification',
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };

      setDocuments([newDocument, ...documents]);
      alert('Document uploaded successfully! It will be verified soon.');
      
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await studentAPI.deleteDocument(documentId);
        setDocuments(documents.filter(doc => doc.id !== documentId));
        alert('Document deleted successfully!');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div>Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        Academic Documents
      </h2>

      {/* Upload Section */}
      <div style={{
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '30px',
        textAlign: 'center',
        marginBottom: '30px',
        background: '#fafafa'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
          Upload Academic Transcripts
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Upload your academic transcripts, certificates, and other supporting documents.
          Supported formats: PDF, JPG, PNG (Max: 10MB)
        </p>
        <div>
          <input
            type="file"
            id="transcript-upload"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            disabled={uploading}
          />
          <label
            htmlFor="transcript-upload"
            className="btn btn-primary"
            style={{
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Uploaded Documents ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No documents uploaded yet. Upload your academic transcripts to get started.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Document Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Upload Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Size</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>{doc.name}</td>
                    <td style={{ padding: '12px' }}>{doc.type}</td>
                    <td style={{ padding: '12px' }}>{doc.uploadDate}</td>
                    <td style={{ padding: '12px' }}>{doc.size}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: getStatusColor(doc.status) + '20',
                        color: getStatusColor(doc.status)
                      }}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f0f9ff',
        borderRadius: '8px',
        borderLeft: '4px solid #3b82f6'
      }}>
        <h4 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Important Notes:</h4>
        <ul style={{ color: '#374151', paddingLeft: '20px' }}>
          <li>Upload clear, readable copies of your academic documents</li>
          <li>Documents will be verified by the institutions you apply to</li>
          <li>Keep original documents ready for verification when required</li>
          <li>You can upload multiple documents for different qualifications</li>
        </ul>
      </div>
    </div>
  );
};

export default TranscriptUpload;
