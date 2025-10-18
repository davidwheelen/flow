import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { testConnection } from '@/services/peplinkApi';
import { ApiConfig } from '@/types/incontrol.types';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ApiConfig) => void;
  initialConfig?: ApiConfig;
}

function SettingsModal({ isOpen, onClose, onSave, initialConfig }: SettingsModalProps) {
  const [config, setConfig] = useState<ApiConfig>(
    initialConfig || {
      baseUrl: import.meta.env.VITE_IC_API_URL || 'https://api.ic.peplink.com/api',
      clientId: import.meta.env.VITE_IC_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_IC_CLIENT_SECRET || '',
      useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
    }
  );

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const success = await testConnection(config);
      setTestResult({
        success,
        message: success
          ? 'Connection successful!'
          : 'Connection failed. Please check your credentials.',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>API Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={config.useMockData}
                onChange={(e) => setConfig({ ...config, useMockData: e.target.checked })}
                className={styles.checkbox}
              />
              Use Mock Data (for development/demo)
            </label>
          </div>

          {!config.useMockData && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>API Base URL</label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  className={styles.input}
                  placeholder="https://api.ic.peplink.com/api"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Client ID</label>
                <input
                  type="text"
                  value={config.clientId}
                  onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                  className={styles.input}
                  placeholder="Your client ID"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Client Secret</label>
                <input
                  type="password"
                  value={config.clientSecret}
                  onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                  className={styles.input}
                  placeholder="Your client secret"
                />
              </div>

              <button
                onClick={handleTest}
                disabled={testing || !config.clientId || !config.clientSecret}
                className={styles.testButton}
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>

              {testResult && (
                <div className={testResult.success ? styles.successMessage : styles.errorMessage}>
                  {testResult.success ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
