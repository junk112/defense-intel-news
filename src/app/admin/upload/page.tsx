'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X, 
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
  url?: string;
}

interface ExistingArticle {
  filename: string;
  slug: string;
  url: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [existingArticles, setExistingArticles] = useState<ExistingArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 既存記事の取得
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      setExistingArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter(file => file.name.endsWith('.html'))
      .map(file => ({
        file,
        status: 'pending' as const
      }));
    
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
        .filter(file => file.name.endsWith('.html'))
        .map(file => ({
          file,
          status: 'pending' as const
        }));
      
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (fileItem: UploadedFile, index: number) => {
    // 状態を更新（アップロード中）
    setFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, status: 'uploading' } : item
    ));

    const formData = new FormData();
    formData.append('file', fileItem.file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setFiles(prev => prev.map((item, i) => 
          i === index 
            ? { 
                ...item, 
                status: 'success', 
                message: data.message,
                url: data.data.url
              } 
            : item
        ));
        // 成功後、記事一覧を更新
        await fetchArticles();
      } else {
        setFiles(prev => prev.map((item, i) => 
          i === index 
            ? { 
                ...item, 
                status: 'error', 
                message: data.error || 'アップロードに失敗しました'
              } 
            : item
        ));
      }
    } catch (error) {
      setFiles(prev => prev.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              status: 'error', 
              message: 'ネットワークエラーが発生しました'
            } 
          : item
      ));
    }
  };

  const uploadAllFiles = async () => {
    setIsLoading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await uploadFile(files[i], i);
      }
    }
    
    setIsLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Upload className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">記事アップロード</h1>
                <p className="text-sm text-gray-600">HTML Article Upload</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                ホーム
              </Link>
              <Link href="/articles" className="text-gray-700 hover:text-blue-600 font-medium">
                記事一覧
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* アップロードエリア */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">新規記事アップロード</h2>
          
          {/* ドラッグ&ドロップエリア */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              HTMLファイルをドラッグ&ドロップ
            </p>
            <p className="text-sm text-gray-600 mb-4">
              または
            </p>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              ファイルを選択
              <input
                type="file"
                multiple
                accept=".html"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-4">
              ファイル名形式: YYYY-MM-DD-slug.html（例: 2025-08-24-my-article.html）
            </p>
          </div>

          {/* アップロード待機ファイル */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  アップロード待機中 ({files.filter(f => f.status === 'pending').length}件)
                </h3>
                {files.some(f => f.status === 'pending') && (
                  <button
                    onClick={uploadAllFiles}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        アップロード中...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        すべてアップロード
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {files.map((fileItem, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      fileItem.status === 'success' 
                        ? 'bg-green-50 border-green-200'
                        : fileItem.status === 'error'
                        ? 'bg-red-50 border-red-200'
                        : fileItem.status === 'uploading'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {fileItem.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : fileItem.status === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      ) : fileItem.status === 'uploading' ? (
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      ) : (
                        <File className="h-5 w-5 text-gray-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {fileItem.file.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(fileItem.file.size)}
                          {fileItem.message && ` • ${fileItem.message}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileItem.status === 'success' && fileItem.url && (
                        <Link
                          href={fileItem.url}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      {fileItem.status === 'pending' && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 既存記事一覧 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              アップロード済み記事 ({existingArticles.length}件)
            </h2>
            <button
              onClick={fetchArticles}
              className="inline-flex items-center px-3 py-1 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {existingArticles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              まだ記事がアップロードされていません
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      ファイル名
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      サイズ
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      更新日時
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {existingArticles.map((article, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {article.filename}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatFileSize(article.size)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(article.modifiedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            href={article.url}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700"
                            title="記事を表示"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}