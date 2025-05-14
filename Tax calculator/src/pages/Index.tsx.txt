
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Calculator, 
  DollarSign,
  ChartBar,
  Info 
} from 'lucide-react';

import InteractiveChart from '../components/InteractiveChart';
import TaxSummaryCard from '../components/TaxSummaryCard';
import OptimizationStrategy from '../components/OptimizationStrategy';
import { calculateRRSPRoom } from '../utils/taxCalculations';

const Index = () => {
  const [income, setIncome] = useState(70000);
  const [rrspContribution, setRrspContribution] = useState(0);
  
  // Handler for income changes from various sources
  const handleIncomeChange = (newIncome: number) => {
    setIncome(newIncome);
    // Adjust RRSP contribution proportionally if it exceeds the new limit
    const maxRRSP = calculateRRSPRoom(newIncome);
    if (rrspContribution > maxRRSP) {
      setRrspContribution(maxRRSP);
    }
  };
  
  // Handler for income input field
  const handleIncomeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncome = Number(e.target.value);
    if (!isNaN(newIncome) && newIncome >= 0) {
      handleIncomeChange(newIncome);
    }
  };
  
  // Handler for RRSP contribution changes
  const handleRRSPChange = (newValue: number[]) => {
    const maxRRSP = calculateRRSPRoom(income);
    setRrspContribution(Math.min(newValue[0], maxRRSP));
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Fiscal Wizard Calculator Pro</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Annual Employment Income</h2>
            <InteractiveChart 
              income={income} 
              onIncomeChange={handleIncomeChange} 
              rrspContribution={rrspContribution}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="income">Income (Drag chart or enter directly)</Label>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <Input 
                          id="income"
                          type="number" 
                          value={income} 
                          onChange={handleIncomeInput}
                          className="w-full" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="rrsp">RRSP Contribution</Label>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(rrspContribution)} / {formatCurrency(calculateRRSPRoom(income))}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Slider
                          id="rrsp"
                          defaultValue={[0]}
                          value={[rrspContribution]}
                          max={calculateRRSPRoom(income)}
                          step={100}
                          onValueChange={handleRRSPChange}
                          className="my-4"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-center bg-purple-50 p-4 rounded-lg">
              <div className="text-center">
                <ChartBar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500 mb-1">T4 Box 14 / RL-1 Box A</div>
                <div className="text-2xl font-bold">{formatCurrency(income)}</div>
                <div className="text-sm text-gray-500 mt-2">Adjust using the chart above</div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="summary">Tax Summary</TabsTrigger>
              <TabsTrigger value="optimization">Tax Optimization</TabsTrigger>
              <TabsTrigger value="info">Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-0">
              <TaxSummaryCard income={income} rrspContribution={rrspContribution} />
            </TabsContent>
            
            <TabsContent value="optimization" className="mt-0">
              <OptimizationStrategy income={income} />
            </TabsContent>
            
            <TabsContent value="info" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">About T4 and RL-1 Forms</h3>
                        <p className="text-sm text-gray-600">
                          T4 slips are issued by employers to report employment income and deductions to the 
                          Canada Revenue Agency. RL-1 is the Quebec provincial equivalent used for Quebec 
                          provincial tax reporting.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">RRSP Contributions</h3>
                        <p className="text-sm text-gray-600">
                          RRSP contributions reduce your taxable income and help you save for retirement.
                          The maximum contribution limit is 18% of your previous year's earned income, 
                          up to an annual maximum ($30,780 for 2023).
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Taxation Disclaimer</h3>
                        <p className="text-sm text-gray-600">
                          This calculator provides estimates based on current tax rules for single individuals 
                          with no dependents. Actual tax amounts may vary based on your specific situation. 
                          Always consult a qualified tax professional for personalized advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;