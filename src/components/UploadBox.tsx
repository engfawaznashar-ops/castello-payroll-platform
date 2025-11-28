'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react'
import { DataCard } from './DataCard'
import { Button } from './ui/button'
import { parseCSV } from '@/lib/csv-parser'
import type { UploadResult } from '@/types'

interface UploadBoxProps {
  onUploadComplete?: (result: UploadResult) => void
}

export function UploadBox({ onUploadComplete }: UploadBoxProps) {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsProcessing(true)
    setUploadResult(null)

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Parse CSV
      const result = await parseCSV(file)
      setUploadResult(result)
      
      if (onUploadComplete) {
        onUploadComplete(result)
      }
    } catch (error) {
      setUploadResult({
        success: false,
        fileName: file.name,
        rowCount: 0,
        validRows: 0,
        errors: [{
          row: 0,
          field: 'file',
          message: 'فشل في معالجة الملف',
        }],
        warnings: [],
        data: [],
      })
    } finally {
      setIsProcessing(false)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  })

  const resetUpload = () => {
    setUploadResult(null)
  }

  return (
    <div className="space-y-6">
      <DataCard>
        <div
          {...getRootProps()}
          className={`
            border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
            transition-all duration-300
            ${isDragActive 
              ? 'border-castello-gold-500 bg-castello-gold-50' 
              : 'border-gray-300 hover:border-castello-gold-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-6 rounded-full transition-all
              ${isDragActive 
                ? 'bg-castello-gold-100 scale-110' 
                : 'bg-gray-100'
              }
            `}>
              <Upload className={`w-12 h-12 ${isDragActive ? 'text-castello-gold-600' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isDragActive ? 'أفلت الملف هنا' : 'اسحب وأفلت ملف الرواتب'}
              </h3>
              <p className="text-gray-600 mb-4">
                أو انقر لتحديد ملف من جهازك
              </p>
              <p className="text-sm text-gray-500">
                الملفات المدعومة: CSV, XLS, XLSX
              </p>
            </div>
            
            <Button variant="gold" size="lg" type="button">
              اختر ملف
            </Button>
          </div>
        </div>
      </DataCard>

      {/* Processing State */}
      {isProcessing && (
        <DataCard>
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 border-4 border-castello-gold-200 border-t-castello-gold-600 rounded-full animate-spin" />
            <div>
              <p className="font-bold text-gray-900">جاري معالجة الملف...</p>
              <p className="text-sm text-gray-600">يرجى الانتظار</p>
            </div>
          </div>
        </DataCard>
      )}

      {/* Upload Result */}
      {uploadResult && !isProcessing && (
        <DataCard>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${uploadResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {uploadResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <File className="w-5 h-5" />
                    {uploadResult.fileName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {uploadResult.rowCount} صف • {uploadResult.validRows} صحيح
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={resetUpload}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Success Summary */}
            {uploadResult.success && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-green-800 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  تم تحليل الملف بنجاح!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  جميع البيانات صحيحة وجاهزة للمعالجة
                </p>
              </div>
            )}

            {/* Errors */}
            {uploadResult.errors.length > 0 && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-800 font-semibold flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  أخطاء ({uploadResult.errors.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {uploadResult.errors.slice(0, 5).map((error, idx) => (
                    <div key={idx} className="text-sm text-red-700">
                      <span className="font-mono bg-red-100 px-2 py-1 rounded">صف {error.row}</span>
                      {' '}- {error.message}
                    </div>
                  ))}
                  {uploadResult.errors.length > 5 && (
                    <p className="text-sm text-red-600">
                      و {uploadResult.errors.length - 5} أخطاء أخرى...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Warnings */}
            {uploadResult.warnings.length > 0 && (
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <p className="text-yellow-800 font-semibold flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  تحذيرات ({uploadResult.warnings.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {uploadResult.warnings.slice(0, 3).map((warning, idx) => (
                    <div key={idx} className="text-sm text-yellow-700">
                      <span className="font-mono bg-yellow-100 px-2 py-1 rounded">صف {warning.row}</span>
                      {' '}- {warning.message}
                    </div>
                  ))}
                  {uploadResult.warnings.length > 3 && (
                    <p className="text-sm text-yellow-600">
                      و {uploadResult.warnings.length - 3} تحذيرات أخرى...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {uploadResult.success && (
              <div className="flex gap-3 pt-4">
                <Button variant="gold" className="flex-1">
                  معالجة البيانات
                </Button>
                <Button variant="outline" onClick={resetUpload}>
                  رفع ملف آخر
                </Button>
              </div>
            )}
          </div>
        </DataCard>
      )}
    </div>
  )
}


