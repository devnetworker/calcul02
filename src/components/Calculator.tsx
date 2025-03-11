'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import styles from './Calculator.module.css';

type CalculatorProps = {
  onResultChange?: (result: string) => void;
};

const Calculator: React.FC<CalculatorProps> = ({ onResultChange }) => {
  const [display, setDisplay] = useState<string>('0');
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [hasVibration, setHasVibration] = useState(false);

  useEffect(() => {
    // Check if vibration API is available
    setHasVibration(typeof navigator !== 'undefined' && 'vibrate' in navigator);
    
    if (onResultChange) {
      onResultChange(display);
    }
  }, [display, onResultChange]);

  // Function to provide haptic feedback if available
  const triggerHapticFeedback = () => {
    if (hasVibration) {
      navigator.vibrate(20); // 20ms vibration
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setCurrentValue('0');
    setOperator(null);
    setWaitingForOperand(false);
    triggerHapticFeedback();
  };

  const clearEntry = () => {
    setDisplay('0');
    setCurrentValue('0');
    triggerHapticFeedback();
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setCurrentValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
      setCurrentValue(display === '0' ? digit : display + digit);
    }
    triggerHapticFeedback();
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setCurrentValue('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setCurrentValue(currentValue + '.');
    }
    triggerHapticFeedback();
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(currentValue);

    if (operator && !waitingForOperand) {
      const currentValueNum = parseFloat(currentValue);
      let newValue: number;

      switch (operator) {
        case '+':
          newValue = memory + currentValueNum;
          break;
        case '-':
          newValue = memory - currentValueNum;
          break;
        case '×':
          newValue = memory * currentValueNum;
          break;
        case '÷':
          newValue = memory / currentValueNum;
          break;
        default:
          newValue = currentValueNum;
      }

      setDisplay(String(newValue));
      setMemory(newValue);
    } else {
      setMemory(inputValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
    triggerHapticFeedback();
  };

  const handleEquals = () => {
    if (!operator) return;

    performOperation('=');
    setOperator(null);
  };

  const handlePercentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
    setCurrentValue(String(value));
    triggerHapticFeedback();
  };

  const toggleSign = () => {
    const value = parseFloat(display) * -1;
    setDisplay(String(value));
    setCurrentValue(String(value));
    triggerHapticFeedback();
  };

  return (
    <motion.div 
      className={styles.calculator}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CalculatorDisplay value={display} />
      
      <div className={styles.buttonGrid}>
        <CalculatorButton onClick={clearAll} type="function">AC</CalculatorButton>
        <CalculatorButton onClick={clearEntry} type="function">CE</CalculatorButton>
        <CalculatorButton onClick={handlePercentage} type="function">%</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('÷')} type="operator">÷</CalculatorButton>
        
        <CalculatorButton onClick={() => inputDigit('7')}>7</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('8')}>8</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('9')}>9</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('×')} type="operator">×</CalculatorButton>
        
        <CalculatorButton onClick={() => inputDigit('4')}>4</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('5')}>5</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('6')}>6</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('-')} type="operator">-</CalculatorButton>
        
        <CalculatorButton onClick={() => inputDigit('1')}>1</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('2')}>2</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('3')}>3</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('+')} type="operator">+</CalculatorButton>
        
        <CalculatorButton onClick={toggleSign} type="function">±</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('0')}>0</CalculatorButton>
        <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
        <CalculatorButton onClick={handleEquals} type="operator">=</CalculatorButton>
      </div>
    </motion.div>
  );
};

export default Calculator; 