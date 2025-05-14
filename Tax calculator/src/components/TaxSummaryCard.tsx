
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { calculateTaxComponents } from '../utils/taxCalculations';

interface TaxSummaryCardProps {
  income: number;
  rrspContribution: number;
}

/**
 * Component that displays a summary of tax calculations
 */
const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({ income, rrspContribution }) => {
  const taxComponents = calculateTaxComponents(income, rrspContribution);
  
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
    <Card>
      <CardHeader>
        <CardTitle>Tax Summary (T4/RL-1)</CardTitle>
        <CardDescription>Based on your current income of {formatCurrency(income)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Box 14 (T4) / Box A (RL-1)</div>
              <div className="text-lg font-semibold">{formatCurrency(income)}</div>
              <div className="text-xs text-gray-500">Employment Income</div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Box 22 (T4) / Box E (RL-1)</div>
              <div className="text-lg font-semibold">{formatCurrency(taxComponents.federalTax + taxComponents.provincialTax)}</div>
              <div className="text-xs text-gray-500">Income Tax Deducted</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Box 16 (T4) / Box B (RL-1)</div>
              <div className="text-lg font-semibold">{formatCurrency(taxComponents.rrq)}</div>
              <div className="text-xs text-gray-500">RRQ Contribution</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Box 18 (T4) / Box C (RL-1)</div>
              <div className="text-lg font-semibold">{formatCurrency(taxComponents.ei)}</div>
              <div className="text-xs text-gray-500">EI Premium</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Box 55 (T4) / Box H (RL-1)</div>
              <div className="text-lg font-semibold">{formatCurrency(taxComponents.qpip)}</div>
              <div className="text-xs text-gray-500">QPIP Premium</div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Net Income After Tax</div>
            <div className="text-2xl font-bold">{formatCurrency(taxComponents.netIncome)}</div>
            <div className="flex justify-between text-sm">
              <span>Average Tax Rate:</span>
              <span className="font-medium">{formatPercent(taxComponents.averageTaxRate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Marginal Tax Rate:</span>
              <span className="font-medium">{formatPercent(taxComponents.marginTaxRate)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSummaryCard;