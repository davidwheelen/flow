/**
 * Error Code Reference Modal
 * 
 * Modal displaying all error codes with search and category filtering.
 */

import { useState, useEffect, useMemo } from 'react';
import { X, Search, AlertCircle, ChevronRight } from 'lucide-react';
import { 
  ERROR_CODES_REFERENCE, 
  ERROR_CODE_CATEGORIES,
  searchErrorCodes,
  getErrorCodesByCategory,
  type ErrorCodeInfo 
} from '@/data/errorCodes';

interface ErrorCodeReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialErrorCode?: string;
}

export function ErrorCodeReferenceModal({ 
  isOpen, 
  onClose, 
  initialErrorCode 
}: ErrorCodeReferenceModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCode, setExpandedCode] = useState<string | null>(initialErrorCode || null);

  // Reset expanded code when initial error code changes
  useEffect(() => {
    if (initialErrorCode) {
      setExpandedCode(initialErrorCode);
      // Scroll to the error code after a brief delay
      setTimeout(() => {
        const element = document.getElementById(`error-${initialErrorCode}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [initialErrorCode, isOpen]);

  // Filter error codes
  const filteredCodes = useMemo(() => {
    let codes = ERROR_CODES_REFERENCE;

    // Apply search
    if (searchQuery.trim()) {
      codes = searchErrorCodes(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      codes = getErrorCodesByCategory(selectedCategory);
    }

    return codes;
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(30, 30, 50, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" style={{ color: '#3b82f6' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#e0e0e0' }}>
              Error Code Reference
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#a0a0a0' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 space-y-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          {/* Search */}
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
              style={{ color: '#a0a0a0' }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search error codes, descriptions, or solutions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-3 py-1.5 text-xs rounded-lg transition-all"
              style={{
                background: selectedCategory === 'all' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                borderColor: selectedCategory === 'all' ? 'rgba(59, 130, 246, 0.45)' : 'rgba(255, 255, 255, 0.2)',
                border: '1px solid',
                color: selectedCategory === 'all' ? '#93c5fd' : '#a0a0a0',
              }}
            >
              All Categories
            </button>
            {Object.values(ERROR_CODE_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-3 py-1.5 text-xs rounded-lg transition-all"
                style={{
                  background: selectedCategory === category ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: selectedCategory === category ? 'rgba(59, 130, 246, 0.45)' : 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid',
                  color: selectedCategory === category ? '#93c5fd' : '#a0a0a0',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Error Codes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#a0a0a0' }}>
              <p>No error codes found matching your search.</p>
            </div>
          ) : (
            filteredCodes.map((errorCode) => (
              <ErrorCodeItem
                key={errorCode.code}
                errorCode={errorCode}
                isExpanded={expandedCode === errorCode.code}
                onToggle={() => setExpandedCode(expandedCode === errorCode.code ? null : errorCode.code)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorCodeItemProps {
  errorCode: ErrorCodeInfo;
  isExpanded: boolean;
  onToggle: () => void;
}

function ErrorCodeItem({ errorCode, isExpanded, onToggle }: ErrorCodeItemProps) {
  return (
    <div
      id={`error-${errorCode.code}`}
      className="rounded-lg overflow-hidden transition-all"
      style={{
        background: isExpanded ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: '1px solid',
        borderColor: isExpanded ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <span 
            className="px-2 py-1 text-xs font-mono rounded"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
            }}
          >
            {errorCode.code}
          </span>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#e0e0e0' }}>
              {errorCode.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#a0a0a0' }}>
              {errorCode.category}
            </p>
          </div>
        </div>
        <ChevronRight 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          style={{ color: '#a0a0a0' }}
        />
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: '#93c5fd' }}>
              Description
            </h4>
            <p className="text-sm" style={{ color: '#d0d0d0' }}>
              {errorCode.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: '#fbbf24' }}>
              Common Causes
            </h4>
            <ul className="space-y-1">
              {errorCode.causes.map((cause, index) => (
                <li 
                  key={index}
                  className="text-sm flex items-start gap-2"
                  style={{ color: '#d0d0d0' }}
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#fbbf24' }} />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: '#22c55e' }}>
              Solutions
            </h4>
            <ul className="space-y-1">
              {errorCode.solutions.map((solution, index) => (
                <li 
                  key={index}
                  className="text-sm flex items-start gap-2"
                  style={{ color: '#d0d0d0' }}
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
