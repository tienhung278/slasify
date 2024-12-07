import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {MultiCheck, Option} from "./MultiCheck";

const options: Option[] = [
    {label: 'aaa', value: '111',},
    {label: 'bbb', value: '222',},
    {label: 'ccc', value: '333',},
    {label: 'ddd', value: '444',},
    {label: 'eee', value: '555',},
    {label: 'fff', value: '666',},
    {label: 'ggg', value: '777',},
    {label: 'hhh', value: '888',},
    {label: 'iii', value: '999',},
]

describe('MultiCheck', () => {
    describe('initialize', () => {
        it('should render the label if label provided', () => {
            const {getByText} = render(<MultiCheck label="Test Label" options={options}/>);
            expect(getByText('Test Label')).toBeInTheDocument();
        });

        it('should render all unchecked options and select all checkboxes when columns prop is undefined', () => {
            const {getByLabelText} = render(<MultiCheck options={options}/>);
            expect(getByLabelText('Select All')).toBeInTheDocument();
            expect(getByLabelText('Select All')).not.toBeChecked();
            options.forEach(option => {
                expect(getByLabelText(option.label)).toBeInTheDocument();
                expect(getByLabelText(option.label)).not.toBeChecked();
            });
        });

        it('should render all options and select all checkboxes in a specific column', () => {
            const numOfColumns = 2;
            const {container} = render(<MultiCheck options={options} columns={numOfColumns}/>);
            const columns = container.querySelectorAll('.column');
            expect(columns.length).toBe(numOfColumns);
        });

        it('should render some options that are checked and select all checkbox is unchecked', () => {
            const values = ['111', '222', '333'];
            const checkedOptions = options.filter(it => values.includes(it.value));
            const {getByLabelText} = render(<MultiCheck options={options} values={values}/>);
            expect(getByLabelText('Select All')).not.toBeChecked();
            checkedOptions.forEach(option => {
                expect(getByLabelText(option.label)).toBeChecked();
            })
        });

        it('should render all options and select all checkboxes that are checked', () => {
            const values = ['111', '222', '333', '444', '555', '666', '777', '888', '999'];
            const {getByLabelText} = render(<MultiCheck options={options} values={values}/>);
            expect(getByLabelText('Select All')).toBeChecked();
            options.forEach(option => {
                expect(getByLabelText(option.label)).toBeChecked();
            })
        });

        it('should render all options that are unchecked', () => {
            const values = ['000'];
            const {getByLabelText} = render(<MultiCheck options={options} values={values}/>);
            options.forEach(option => {
                expect(getByLabelText(option.label)).not.toBeChecked();
            })
        });
    });

    describe('handle check event', () => {
        it('should check all options when select all checkbox is checked', () => {
            const {getByLabelText} = render(<MultiCheck options={options}/>);
            const selectAllCheckbox = getByLabelText('Select All');

            fireEvent.click(selectAllCheckbox);
            options.forEach(option => {
                expect(getByLabelText(option.label)).toBeChecked();
            })
        });

        it('should uncheck all options when select all checkbox is unchecked', () => {
            const values = ['111', '222', '333', '444', '555', '666', '777', '888', '999'];
            const {getByLabelText} = render(<MultiCheck options={options} values={values}/>);
            const selectAllCheckbox = getByLabelText('Select All');

            fireEvent.click(selectAllCheckbox);
            options.forEach(option => {
                expect(getByLabelText(option.label)).not.toBeChecked();
            })
        });

        it('should check the select all checkbox when all options are checked', () => {
            const values = ['111', '222', '333', '444', '555', '666', '777', '888'];
            const {getByLabelText} = render(<MultiCheck options={options} values={values}/>);
            const selectAllCheckbox = getByLabelText('Select All');
            const option = options.find(it => !values.includes(it.value));
            const checkbox = getByLabelText(option!.label);

            fireEvent.click(checkbox);
            expect(selectAllCheckbox).toBeChecked();
        });

        it('should uncheck the select all checkbox when any option is unchecked', () => {
            const values = ['111', '222', '333', '444', '555', '666', '777', '888', '999'];
            const {getByLabelText} = render(<MultiCheck options={options} values={values}/>);
            const selectAllCheckbox = getByLabelText('Select All');
            const checkbox = getByLabelText(options[0].label);

            fireEvent.click(checkbox);
            expect(selectAllCheckbox).not.toBeChecked();
        });

        it('should call onChange when any options checkbox changes status', () => {
            const handleChange = jest.fn();
            const {getByLabelText} = render(<MultiCheck options={options} onChange={handleChange}/>);
            const checkbox = getByLabelText(options[0].label);

            fireEvent.click(checkbox);
            expect(handleChange).toHaveBeenCalledWith([options[0]]);
        });
    })
});