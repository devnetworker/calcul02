'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// Dynamically import components with SSR disabled for components that use browser APIs
const Calculator = dynamic(() => import('@/components/Calculator'), { ssr: false });
const CalculatorVisualization = dynamic(() => import('@/components/CalculatorVisualization'), { ssr: false });
const ARCamera = dynamic(() => import('@/components/ARCamera'), { ssr: false });

export function CalculatorApp() {
  const [calculatorResult, setCalculatorResult] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<string>('calculator');

  // Handle detection from AR camera
  const handleDetection = (count: number) => {
    setCalculatorResult(count.toString());
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
        AR/3D Calculator
      </h1>
      
      <Tabs defaultValue="calculator" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
          <TabsTrigger value="camera">AR Camera</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="flex justify-center">
          <Calculator onResultChange={setCalculatorResult} />
        </TabsContent>
        
        <TabsContent value="visualization">
          <CalculatorVisualization result={calculatorResult} />
        </TabsContent>
        
        <TabsContent value="camera">
          <ARCamera onDetection={handleDetection} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold">Current Result: {calculatorResult}</p>
        <p className="text-sm text-gray-500 mt-2">
          {activeTab === 'calculator' && 'Use the calculator to perform calculations'}
          {activeTab === 'visualization' && 'View your result in 3D visualization'}
          {activeTab === 'camera' && 'Use the camera to detect and count objects'}
        </p>
      </div>
    </div>
  );
} 