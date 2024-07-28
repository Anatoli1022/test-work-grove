import React, { useEffect, useState } from 'react';
import {
  generateColumns,
  generateRows,
  addRow,
  deleteRow,
  editRow,
} from '../utils/table';
import Row from './Row';
import Modal from './Modal';

const Table: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<{ title: string; cells: boolean[] }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const cols = await generateColumns();
      const rows = await generateRows(cols.length);
      setColumns(cols);
      setRows(rows);
    };

    fetchData();
  }, []);

  const handleOperationRow = ({
    index,
    operation,
  }: {
    index: number | null;
    operation: string;
  }) => {
    setRowIndex(index);
    setOperation(operation);
    setIsModalOpen(true);
  };

  const confirm = (operation: string | null) => {
    switch (operation) {
      case 'deleteRow':
        if (rowIndex !== null) {
          deleteRow(rowIndex, rows, setRows);
        }
        break;
      case 'editRow':
        if (rowIndex !== null) {
          editRow(rowIndex, rows, setRows);
        }
        break;
      case 'addRow':
        addRow({ rows, setRows, columns });
        break;
      default:
        break;
    }
    setOperation(null);
    setIsModalOpen(false);
  };

  const cancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            {columns &&
              columns.map((colum, index) => <th key={index}>{colum}</th>)}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <Row
              key={index}
              row={row}
              onDelete={() =>
                handleOperationRow({ index, operation: 'deleteRow' })
              }
              onEdit={() => handleOperationRow({ index, operation: 'editRow' })}
            />
          ))}
        </tbody>
      </table>
      <button
        onClick={() => handleOperationRow({ index: null, operation: 'addRow' })}
      >
        Добавить строку
      </button>

      {isModalOpen && (
        <Modal operation={operation} confirm={confirm} cancel={cancel} />
      )}
    </div>
  );
};

export default Table;
