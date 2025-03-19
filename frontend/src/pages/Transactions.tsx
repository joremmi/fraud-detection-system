import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.tsx';
import Card from '../components/ui/Card.tsx'
import { Transaction } from '../types'; // Import the shared type
import { 
  FiFilter, FiSearch, FiChevronLeft, FiChevronRight, 
  FiDownload, FiRefreshCw, FiCalendar, FiX
} from 'react-icons/fi';
import TransactionDetailsModal from '../components/TransactionDetailsModal';

// Generate mock transactions for development
function generateMockTransactions(count: number = 10): Transaction[] {
  const statuses: ('approved' | 'suspicious' | 'blocked')[] = ['approved', 'suspicious', 'blocked'];
  const locations = ['New York', 'London', 'Tokyo', 'Singapore', 'Paris'];
  const result: Transaction[] = [];
  
  for (let i = 1; i <= count; i++) {
    result.push({
      id: `TX-${10000 + i}`,
      amount: Math.round(Math.random() * 1000 + 100),
      date: new Date().toISOString(),
      description: 'Transaction description',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      riskScore: Math.random(),
      userId: `USR-${1000 + i}`,
      userName: `User ${i}`,
      location: locations[Math.floor(Math.random() * locations.length)]
    });
  }
  
  return result;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '7d',
    minAmount: '',
    maxAmount: '',
    riskLevel: 'all',
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Safe pagination calculations
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalCount);

  // Enhanced filtering logic
  const filterTransactions = (data: Transaction[]) => {
    return data.filter(tx => {
      // Apply search term
      if (searchTerm && !tx.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !tx.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(tx.userName && tx.userName.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Apply status filter
      if (filters.status !== 'all' && tx.status !== filters.status) {
        return false;
      }
      
      // Apply risk level filter
      if (filters.riskLevel !== 'all') {
        const score = tx.riskScore ?? 0;
        if (filters.riskLevel === 'high' && score <= 0.7) return false;
        if (filters.riskLevel === 'medium' && (score <= 0.4 || score > 0.7)) return false;
        if (filters.riskLevel === 'low' && score > 0.4) return false;
      }
      
      // Apply amount filters
      if (filters.minAmount && tx.amount < parseFloat(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && tx.amount > parseFloat(filters.maxAmount)) {
        return false;
      }
      
      // Apply date filter
      if (filters.dateRange !== '7d') {
        const txDate = new Date(tx.date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filters.dateRange === '1d' && daysDiff > 1) return false;
        if (filters.dateRange === '30d' && daysDiff > 30) return false;
        if (filters.dateRange === '90d' && daysDiff > 90) return false;
      }
      
      return true;
    });
  };

  useEffect(() => {
    setLoading(true);
    
    // Generate base mock data - more than we need to allow for filtering
    const mockData = generateMockTransactions(50); // Generate 50 transactions
    
    // Apply all filters
    const filteredData = filterTransactions(mockData);
    
    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortBy === 'risk') {
        const riskA = a.riskScore ?? 0;
        const riskB = b.riskScore ?? 0;
        return sortOrder === 'asc' ? riskA - riskB : riskB - riskA;
      }
      return 0;
    });
    
    // Apply pagination
    const paginatedData = sortedData.slice((currentPage - 1) * 10, currentPage * 10);
    
    setTransactions(paginatedData);
    setTotalCount(filteredData.length);
    setTotalPages(Math.max(1, Math.ceil(filteredData.length / 10)));
    setLoading(false);
  }, [currentPage, sortBy, sortOrder, searchTerm, filters]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      dateRange: '7d',
      minAmount: '',
      maxAmount: '',
      riskLevel: 'all',
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRiskLevelClass = (score: number | undefined) => {
    if (!score) return 'text-green-400';
    if (score > 0.7) return 'text-red-400';
    if (score > 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLevelText = (score: number | undefined) => {
    if (!score) return 'Low';
    if (score > 0.7) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  };

  // Add advanced search and filtering capabilities
  const filterByRiskLevel = (transaction: Transaction, level: string) => {
    if (level === 'high') return transaction.riskScore && transaction.riskScore > 0.7;
    if (level === 'medium') return transaction.riskScore && transaction.riskScore > 0.4 && transaction.riskScore <= 0.7;
    if (level === 'low') return transaction.riskScore && transaction.riskScore <= 0.4;
    return true;
  };

  // Add a transaction details component
  const TransactionDetailsModal = ({ transaction, onClose, onUpdate }: { transaction: Transaction, onClose: () => void, onUpdate: (updatedTransaction: Transaction) => void }) => {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-xl font-bold text-white mb-4">Transaction Details</h2>
          {/* Transaction details content */}
          <button 
            onClick={onClose}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Add this function to handle transaction updates from the modal
  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx)
    );
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const mockData = generateMockTransactions();
                setTransactions(mockData);
                setTotalPages(5);
                setTotalCount(50);
                setLoading(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center text-sm"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
            <button 
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md flex items-center text-sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white py-2 pl-10 pr-3 rounded-l-md w-full border border-gray-700"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            >
              Search
            </button>
          </form>
        </div>
        
        {filterOpen && (
          <Card className="bg-gray-900/60 border border-gray-800/50 mb-6 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white">Filters</h2>
              <button 
                onClick={() => setFilterOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="bg-gray-800 text-white py-2 px-3 rounded w-full border border-gray-700"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="suspicious">Suspicious</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="bg-gray-800 text-white py-2 px-3 rounded w-full border border-gray-700"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Risk Level</label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                  className="bg-gray-800 text-white py-2 px-3 rounded w-full border border-gray-700"
                >
                  <option value="all">All Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Min Amount</label>
                <input
                  type="number"
                  placeholder="Min amount"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  className="bg-gray-800 text-white py-2 px-3 rounded w-full border border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Max Amount</label>
                <input
                  type="number"
                  placeholder="Max amount"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  className="bg-gray-800 text-white py-2 px-3 rounded w-full border border-gray-700"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={resetFilters}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Apply Filters
              </button>
            </div>
          </Card>
        )}
        
        <Card className="bg-gray-900/60 border border-gray-800/50">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-blue-400 flex items-center">
                <FiRefreshCw className="animate-spin mr-2" />
                <p>Loading transactions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-400">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-400">No transactions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-3 font-medium text-gray-400">ID</th>
                      <th className="pb-3 font-medium text-gray-400">Date</th>
                      <th className="pb-3 font-medium text-gray-400">Amount</th>
                      <th className="pb-3 font-medium text-gray-400">User</th>
                      <th className="pb-3 font-medium text-gray-400">Location</th>
                      <th className="pb-3 font-medium text-gray-400">Risk</th>
                      <th className="pb-3 font-medium text-gray-400">Status</th>
                      <th className="pb-3 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="py-3 text-gray-300">{tx.id}</td>
                        <td className="py-3 text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="py-3 text-white font-medium">{formatCurrency(tx.amount)}</td>
                        <td className="py-3 text-gray-300">{tx.userName}</td>
                        <td className="py-3 text-gray-300">{tx.location}</td>
                        <td className="py-3">
                          <span className={`${getRiskLevelClass(tx.riskScore)}`}>
                            {getRiskLevelText(tx.riskScore)} ({(tx.riskScore ?? 0).toFixed(2)})
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'approved' 
                              ? 'bg-green-900/40 text-green-300' 
                              : tx.status === 'suspicious'
                                ? 'bg-red-900/40 text-red-300'
                                : 'bg-gray-700/40 text-gray-300'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => setSelectedTransaction(tx)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* CRITICAL: Use safe pagination calculations */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-gray-400 text-sm">
                  {totalCount > 0 ? 
                    `Showing ${startItem} to ${endItem} of ${totalCount} transactions` : 
                    'No transactions found'}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <FiChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .reduce((acc, page, i, filtered) => {
                      if (i > 0 && filtered[i-1] !== page - 1) {
                        acc.push(<span key={`ellipsis-${page}`} className="px-3 py-1 text-gray-500">...</span>);
                      }
                      acc.push(
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          } px-3 py-1 rounded-md`}
                        >
                          {page}
                        </button>
                      );
                      return acc;
                    }, [] as React.ReactNode[])
                  }
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
        {selectedTransaction && (
          <TransactionDetailsModal 
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onUpdate={handleTransactionUpdate}
          />
        )}
      </main>
    </div>
  );
};

export default Transactions;
