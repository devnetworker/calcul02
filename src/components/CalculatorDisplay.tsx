'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './CalculatorDisplay.module.css';

type CalculatorDisplayProps = {
  value: string;
};

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value }) => {
  // Format the display value to add commas for thousands
  const formatValue = (val: string): string => {
    // Handle decimal numbers
    if (val.includes('.')) {
      const [intPart, decPart] = val.split('.');
      return `${formatValue(intPart)}.${decPart}`;
    }
    
    // Add commas for thousands
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const displayValue = formatValue(value);

  return (
    <motion.div 
      className={styles.display}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.displayInner}>
        <motion.div 
          key={value} // Re-animate when value changes
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={styles.value}
        >
          {displayValue}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CalculatorDisplay; 