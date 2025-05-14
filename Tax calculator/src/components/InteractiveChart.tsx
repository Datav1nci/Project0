
import React, { useState, useEffect } from 'react';
import { 
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { calculateTaxComponents } from '../utils/taxCalculations';

interface InteractiveChartProps {
  income: number;
  onIncomeChange: (newIncome: number) => void;
  rrspContribution: number;
}

/**
 * Interactive chart component that visualizes income and tax data
 * and allows users to change income by dragging
 */
const InteractiveChart: React.FC<InteractiveChartProps> = ({ income, onIncomeChange, rrspContribution }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [taxData, setTaxData] = useState<ReturnType<typeof calculateTaxComponents>>();
  
  // Update tax calculations when income or RRSP changes
  useEffect(() => {
    setTaxData(calculateTaxComponents(income, rrspContribution));
  }, [income, rrspContribution]);
  
  // Handler for mouse/touch dragging
  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    let clientX: number;
    
    if ('clientX' in event) {
      clientX = event.clientX; // Mouse event
    } else {
      clientX = event.touches[0].clientX; // Touch event
    }
    
    // Calculate new income based on drag position
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    const width = rect.width;
    const relativePosition = Math.max(0, Math.min(1, (clientX - rect.left) / width));
    
    // Scale to income between 0 and 300,000
    const newIncome = Math.round(relativePosition * 300000);
    onIncomeChange(newIncome);
  };
  
  // Generate data for the tax breakdown pie chart
  const generatePieData = () => {
    if (!taxData) return [];
    
    return [
      { name: 'Take Home', value: taxData.netIncome, color: '#9b87f5' },
      { name: 'Federal Tax', value: taxData.federalTax, color: '#F97316' },
      { name: 'Provincial Tax', value: taxData.provincialTax, color: '#0EA5E9' },
      { name: 'RRQ', value: taxData.rrq, color: '#6E59A5' },
      { name: 'EI', value: taxData.ei, color: '#8B5CF6' },
      { name: 'QPIP', value: taxData.qpip, color: '#D946EF' }
    ];
  };
  
  // Generate historical income tax data for line chart
  const generateLineData = () => {
    const dataPoints = [];
    const step = income > 100000 ? 20000 : 10000;
    
    for (let i = 0; i <= income + step; i += step) {
      const taxComponents = calculateTaxComponents(i, i * (rrspContribution / income));
      dataPoints.push({
        income: i,
        takeHome: taxComponents.netIncome,
        tax: i - taxComponents.netIncome
      });
    }
    
    return dataPoints;
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage values
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-CA', { 
      style: 'percent', 
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="w-full space-y-6">
      {/* Income slider */}
      <div 
        className="h-12 bg-gradient-to-r from-purple-100 to-purple-600 rounded-lg cursor-ew-resize relative"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleDrag}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleDrag}
      >
        <div 
          className="absolute h-full bg-purple-300 bg-opacity-40"
          style={{ width: `${(income / 300000) * 100}%` }}
        />
        <div 
          className="absolute top-0 h-full flex items-center justify-center text-white font-semibold"
          style={{ left: `${Math.max(0, Math.min(100, (income / 300000) * 100 - 5))}%` }}
        >
          <div className="bg-purple-800 rounded-full px-3 py-1 text-sm">
            {formatCurrency(income)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax Breakdown Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">Tax Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generatePieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${formatPercent(percent)}`}
                >
                  {generatePieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Income vs. Tax Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">Income vs. Tax</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={generateLineData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="income" 
                  tickFormatter={formatCurrency}
                />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="takeHome" 
                  stroke="#9b87f5" 
                  name="Take Home" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="tax" 
                  stroke="#F97316" 
                  name="Total Tax" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChart;