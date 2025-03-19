import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { analyzeTransaction } from '../services/anomalyDetection';
import { FiAlertTriangle, FiCheck, FiLoader } from 'react-icons/fi';

interface TransactionAnalysisPanelProps {
  transaction: Transaction;
}

const TransactionAnalysisPanel: React.FC<TransactionAnalysisPanelProps> = ({ transaction }) => {
  const [loading, setLoading] = useState(true);
  const [risks, setRisks] = useState<string[]>([]);
  
  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setLoading(true);
        const analysisResults = await analyzeTransaction(transaction);
        setRisks(analysisResults);
      } catch (error) {
        console.error('Error analyzing transaction:', error);
      } finally {
        setLoading(false);
      }
    };
    
    performAnalysis();
  }, [transaction]);
  
  if (loading) {
    return (
      <div className="bg-gray-800/60 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-center text-blue-400">
          <FiLoader className="animate-spin mr-2" />
          <span>Analyzing transaction patterns...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800/60 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium text-white mb-3">Risk Analysis</h3>
      
      {risks.length === 0 ? (
        <div className="flex items-center text-green-400">
          <FiCheck className="mr-2" />
          <span>No unusual patterns detected</span>
        </div>
      ) : (
        <div>
          <div className="flex items-center text-yellow-400 mb-2">
            <FiAlertTriangle className="mr-2" />
            <span>Potential risks detected:</span>
          </div>
          <ul className="list-disc pl-5 text-gray-300 space-y-1">
            {risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransactionAnalysisPanel; 