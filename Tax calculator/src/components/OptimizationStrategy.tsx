
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { calculateOptimalIncomeDistribution, getTaxOptimizationTips } from '../utils/taxCalculations';

interface OptimizationStrategyProps {
  income: number;
}

/**
 * Component that suggests tax optimization strategies
 */
const OptimizationStrategy: React.FC<OptimizationStrategyProps> = ({ income }) => {
  const optimizedStrategy = calculateOptimalIncomeDistribution(income);
  const tips = getTaxOptimizationTips(income);
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Optimization Strategy</CardTitle>
        <CardDescription>
          Expert recommendations based on your income level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {income >= 100000 && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Recommended Income Split</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Employment Income:</span>
                  <span className="font-medium">{formatCurrency(optimizedStrategy.salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dividend Income:</span>
                  <span className="font-medium">{formatCurrency(optimizedStrategy.dividends)}</span>
                </div>
                <div className="flex justify-between">
                  <span>RRSP Contribution:</span>
                  <span className="font-medium">{formatCurrency(optimizedStrategy.rrspContribution)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Estimated Tax Savings:</span>
                  <span className="font-bold">{formatCurrency(optimizedStrategy.taxSavings)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">Tax Optimization Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="text-sm">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationStrategy;