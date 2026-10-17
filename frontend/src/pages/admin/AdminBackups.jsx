import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { adminBackupApi } from '../../services/adminApi';
import Button from '../../components/ui/Button';

const AdminBackups = () => {
  const [file, setFile] = useState(null);
  const [wipeExisting, setWipeExisting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const { data: collections } = useQuery({
    queryKey: ['backup-collections'],
    queryFn: () => adminBackupApi.listCollections(),
    select: (res) => res.data.data.collections,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await adminBackupApi.exportBackup();
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `wakriti-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Backup downloaded successfully');
    } catch {
      toast.error('Could not export backup');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestore = async () => {
    if (!file) {
      toast.error('Please select a backup JSON file');
      return;
    }
    setIsRestoring(true);
    try {
      const fd = new FormData();
      fd.append('backup', file);
      fd.append('wipeExisting', wipeExisting);
      const { data } = await adminBackupApi.restoreBackup(fd);
      toast.success('Backup restored successfully');
      console.log('Restore results:', data.data.results);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not restore backup');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="px-6 py-8">
      <Helmet><title>Database Backup & Restore</title></Helmet>
      <h1 className="font-display text-2xl font-bold text-bamboo-800">Database Backup & Restore</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-bamboo-800">Export Backup</h2>
          <p className="mt-2 text-sm text-bamboo-500">
            Download a full JSON snapshot of core collections: {collections?.join(', ')}.
          </p>
          <Button onClick={handleExport} isLoading={isExporting} className="mt-4">
            <FiDownload size={14} className="mr-1.5" /> Download Backup
          </Button>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-bamboo-800">Restore Backup</h2>
          <p className="mt-2 text-sm text-bamboo-500">
            Upload a previously exported JSON backup file to restore data.
          </p>
          <input type="file" accept="application/json" onChange={(e) => setFile(e.target.files[0])} className="mt-3 text-sm" />
          <label className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <input type="checkbox" checked={wipeExisting} onChange={(e) => setWipeExisting(e.target.checked)} />
            Wipe existing data before restoring (destructive)
          </label>
          <Button onClick={handleRestore} isLoading={isRestoring} variant="danger" className="mt-4">
            <FiUpload size={14} className="mr-1.5" /> Restore Backup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBackups;
