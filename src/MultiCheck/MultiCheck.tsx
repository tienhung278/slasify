import './MultiCheck.css';

import React, {useEffect, useState} from 'react';
import {FC} from 'react';

export type Option = {
    label: string,
    value: string
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
type Props = {
    // the label text of the whole component
    label?: string,
    // Assume no duplicated labels or values
    // It may contain any values, so be careful for you "Select All" option
    options: Option[],
    // Always be non-negative integer.
    // The default value is 1
    // 0 is considered as 1
    // We only check [0, 1, 2, ... 10], but it should work for greater number
    columns?: number,
    // Which options should be selected.
    // - If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
    // - if not undefined, it's considered as the default value to render the component. And when it changes, it will be considered as the NEW default value to render the component again
    // - Assume no duplicated values.
    // - It may contain values not in the options.
    values?: string[]
    // if not undefined, when checked options are changed, they should be passed to outside
    // if undefined, the options can still be selected, but won't notify the outside
    onChange?: (options: Option[]) => void,
}

export const MultiCheck: FC<Props> = ({label, options, columns, values, onChange}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(values || []);

    // Update internal state if `values` prop changes
    useEffect(() => {
        setSelectedValues(values || []);
        emitSelectedOptions(values || []);
    }, [values]);

    // Handle individual checkbox change
    const handleCheckboxChange = (value: string) => {
        const newSelectedValues = selectedValues.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value];

        setSelectedValues(newSelectedValues);
        emitSelectedOptions(newSelectedValues);
    };

    // Handle Select All checkbox change
    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const allSelected = e.target.checked;
        const newSelectedValues = allSelected ? options.map(option => option.value) : [];

        setSelectedValues(newSelectedValues);
        emitSelectedOptions(newSelectedValues);
    };

    // Determine if Select All checkbox should be checked
    const isSelectAllChecked = options.every(option => selectedValues.includes(option.value));

    //Emit selected options to outside
    const emitSelectedOptions = (selectedValues: string[]) => {
        if (onChange) {
            const selectedOptions = options.filter(option => selectedValues.includes(option.value));
            onChange(selectedOptions);
        }
    }

    // Split options into columns
    const splitIntoColumns = (items: Option[], columns: number): Option[][] => {
        const result = Array.from({length: columns}, () => [] as Option[]);
        items.forEach((item, index) => {
            result[index % columns].push(item);
        });
        const maxLength = Math.max(...result.map(column => column.length));

        result.forEach(column => {
            while (column.length < maxLength) {
                column.push({label: '', value: ''});
            }
        });
        return result;
    };

    columns = columns || 1;
    const columnsData = splitIntoColumns(options, columns);

    return (
        <div>
            <div className="header">
                {label && <label>{label}</label>}
            </div>
            <div className="row">
                {columnsData.map((column, colIndex) =>
                    <div key={colIndex} className="column">
                        {colIndex === 0 && (
                            <div>
                                <input
                                    id="select-all"
                                    type="checkbox"
                                    checked={isSelectAllChecked}
                                    onChange={handleSelectAllChange}
                                />
                                <label htmlFor="select-all">Select All</label>
                            </div>
                        )}
                        {column.map(option =>
                                option.label && option.value && (
                                    <div key={option.value}>
                                        <input
                                            id={option.label}
                                            type="checkbox"
                                            value={option.value}
                                            checked={selectedValues.includes(option.value)}
                                            onChange={() => handleCheckboxChange(option.value)}
                                        />
                                        <label htmlFor={option.label}>{option.label}</label>
                                    </div>
                                )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
