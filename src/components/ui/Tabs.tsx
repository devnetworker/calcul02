'use client';

import React from 'react';
import styles from './Tabs.module.css';

type TabsProps = {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
};

type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

export const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  children, 
  className = '',
  onValueChange
}) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`${styles.tabs} ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`${styles.tabsList} ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      className={`${styles.tabsTrigger} ${isActive ? styles.active : ''} ${className}`}
      onClick={() => onValueChange(value)}
      aria-selected={isActive}
      role="tab"
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  const isActive = selectedValue === value;

  if (!isActive) return null;

  return (
    <div className={`${styles.tabsContent} ${className}`} role="tabpanel">
      {children}
    </div>
  );
}; 