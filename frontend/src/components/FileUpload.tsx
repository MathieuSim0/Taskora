import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

interface FileUploadProps {
  taskId: string;
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ taskId, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not allowed. Supported: images, PDF, Word, Excel, text files.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size exceeds 10MB limit.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setUploadProgress(0);

    try {
      await axios.post(`http://localhost:3000/api/tasks/${taskId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('File uploaded successfully!');
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="w-12 h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-teal-500 bg-teal-50'
            : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept={allowedTypes.join(',')}
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragging ? 'bg-teal-100' : 'bg-slate-100'
          }`}>
            <svg className={`w-8 h-8 ${isDragging ? 'text-teal-600' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-slate-900 font-medium mb-1">
              {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-slate-600">
              Images, PDF, Word, Excel, Text files (max 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="card border-l-4 border-teal-500">
          <div className="flex items-start gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="flex-shrink-0">
                {getFileIcon(selectedFile.type)}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 mb-1 truncate">{selectedFile.name}</h4>
              <p className="text-sm text-slate-600">{formatFileSize(selectedFile.size)}</p>
              
              {/* Progress Bar */}
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Uploading...</span>
                    <span className="text-sm font-medium text-teal-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {!uploading && (
              <button
                onClick={handleCancel}
                className="flex-shrink-0 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Upload Button */}
          {!uploading && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpload}
                className="btn btn-primary flex-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
