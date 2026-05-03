import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, AlertTriangle, Upload, Eye, Trash2 } from 'lucide-react';

const Documents = () => {
  const { token } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(response.data);
      } catch (error) {
        console.error('Failed to fetch documents', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [token]);

  if (loading) return <div className="text-secondary text-center py-20">Loading documents...</div>;

  const uploadedCount = documents.filter(d => d.status === 'UPLOADED').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UPLOADED': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'MISSING': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'EXPIRED': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'UPLOADED': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'MISSING': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'EXPIRED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Document Checklist</h1>
          <p className="text-secondary text-lg">
            Manage your immigration documents. Keep them updated to stay compliant with USCIS regulations.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
            <span className="text-sm font-semibold">{uploadedCount} / {documents.length || 8} Complete</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="glass p-6 rounded-3xl hover:bg-white/[0.05] transition-all duration-300 group relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(doc.status)}`}>
                {doc.status}
              </span>
            </div>

            <h3 className="text-lg font-bold mb-1">{doc.documentType}</h3>
            <p className="text-sm text-secondary mb-6">
              {doc.expiryDate ? `Expires: ${doc.expiryDate}` : 'No expiry date required'}
            </p>

            <div className="flex items-center gap-3">
              {doc.status === 'UPLOADED' ? (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20">
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Upload className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
          </div>
          <h4 className="text-lg font-bold mb-2">Add Other Document</h4>
          <p className="text-sm text-secondary">Upload miscellaneous forms or notices</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl glass bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Pro Tip: Keep it Digital</h4>
            <p className="text-secondary leading-relaxed">
              Always keep clear, high-resolution scans of your documents. USCIS often accepts digital copies for initial filings, but having originals ready is critical for interviews or RFEs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
