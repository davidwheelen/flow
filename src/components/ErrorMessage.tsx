/**
 * ErrorMessage Component
 * 
 * Reusable component for displaying error messages with clickable error codes.
 */

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  errorCode?: string;
  onErrorCodeClick?: (code: string) => void;
}

/**
 * Parse error message to extract error code
 * Supports formats: "ERR-1234: message" or just "message"
 */
function parseErrorMessage(message: string): { code: string | null; cleanMessage: string } {
  const errorCodePattern = /^(ERR-\d{4}):?\s*/i;
  const match = message.match(errorCodePattern);
  
  if (match) {
    return {
      code: match[1].toUpperCase(),
      cleanMessage: message.slice(match[0].length),
    };
  }
  
  return {
    code: null,
    cleanMessage: message,
  };
}

export function ErrorMessage({ message, errorCode: providedErrorCode, onErrorCodeClick }: ErrorMessageProps) {
  // Try to extract error code from message if not provided
  const { code: extractedCode, cleanMessage } = parseErrorMessage(message);
  const errorCode = providedErrorCode || extractedCode;

  return (
    <div 
      className="flex items-start gap-3 p-4 rounded-lg"
      style={{ 
        background: 'rgba(239, 68, 68, 0.15)',
        borderLeft: '3px solid #ef4444',
      }}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
      <div className="flex-1">
        <p className="text-sm" style={{ color: '#fca5a5' }}>
          {cleanMessage}
        </p>
        {errorCode && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onErrorCodeClick?.(errorCode)}
              className="text-xs font-medium px-2 py-1 rounded transition-all hover:bg-red-500/20"
              style={{ 
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              Error {errorCode}
            </button>
            {onErrorCodeClick && (
              <span className="text-xs" style={{ color: '#a0a0a0' }}>
                Click for details
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
