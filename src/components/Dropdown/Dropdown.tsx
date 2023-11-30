import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Dropdown.module.scss';
import useClickOutside from "../../hooks/useClickOutside";
import ReactDOM from 'react-dom';

type DropdownOptionsProps = {
  isOpen: boolean;
  options: string[]; // Assuming options are strings for this example
  handleOptionClick: (option: string) => void;
  portalRoot: Element | null; // Define portalRoot as Element or null
};

const DropdownOptions: React.FC<DropdownOptionsProps> = ({ isOpen, options, handleOptionClick, portalRoot }) => {
  if (!isOpen || !portalRoot) return null;

  return ReactDOM.createPortal(
    <div className={styles.options}>
      {options.map((option, index) => (
        <div key={index} className={styles.option} onClick={() => handleOptionClick(option)}>
          {option}
        </div>
      ))}
    </div>,
    portalRoot
  );
};

type DropdownProps = {
	options: string[];
	value: string;
  	handleSelect: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ options, handleSelect, value }) => {
  const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState(value);
	//const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
	  setSelectedValue(value);
  }, [options, value]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = useCallback(
    (option: string) => {
      	setSelectedValue(option);
		  handleSelect(option);
		  setIsOpen(false);
    },
    [handleSelect]
	);
	const dropdownRef  = useClickOutside(() => setIsOpen(false));
	const portalRoot = document.getElementById('dropdown-portal-root'); // Define a portal root

  return (
    <div className={styles['dropdown-container']} ref={dropdownRef}>
      <div className={styles['selected-value']} onClick={toggleDropdown}>
        <span>{selectedValue}</span>
        <span className="chevron">&#9662;</span>
		  </div>
		<div id="dropdown-portal-root"></div>
		<DropdownOptions
			isOpen={isOpen}
			options={options}
			handleOptionClick={handleOptionClick}
			portalRoot={portalRoot}
		/>
    </div>
  );
};

export default Dropdown;
