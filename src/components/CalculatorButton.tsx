'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThree } from '@react-three/fiber';
import styles from './CalculatorButton.module.css';

type ButtonType = 'default' | 'operator' | 'function';

type CalculatorButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  type?: ButtonType;
};

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  children, 
  onClick, 
  type = 'default' 
}) => {
  // Button variants based on type
  const getButtonClass = () => {
    switch (type) {
      case 'operator':
        return styles.operatorButton;
      case 'function':
        return styles.functionButton;
      default:
        return styles.defaultButton;
    }
  };

  return (
    <motion.button
      className={`${styles.button} ${getButtonClass()}`}
      onClick={onClick}
      whileTap={{ scale: 0.95, y: 4 }}
      whileHover={{ scale: 1.05, y: -2 }}
      initial={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15
      }}
    >
      <div className={styles.buttonFace}>
        {children}
      </div>
      <div className={styles.buttonShadow}></div>
    </motion.button>
  );
};

export default CalculatorButton; 