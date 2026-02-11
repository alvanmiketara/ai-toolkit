import Loading from './Loading';
import classNames from 'classnames';

export interface TableColumn {
  title: string;
  key: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
}

interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  isLoading: boolean;
  theadClassName?: string;
  onRefresh?: () => void;
}

export default function UniversalTable({
  columns,
  rows,
  isLoading,
  theadClassName,
  onRefresh = () => {},
}: TableProps) {
  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-sm overflow-hidden transition-all duration-300 hover:border-zinc-700">
      {isLoading ? (
        <div className="p-12 flex justify-center items-center">
          <Loading />
        </div>
      ) : rows.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <p className="text-zinc-500 font-medium text-sm">No items found</p>
          <button
            onClick={() => onRefresh()}
            className="px-4 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
          >
            Refresh List
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700">
          <table className="w-full text-sm text-left text-zinc-300">
            <thead className={classNames('text-xs uppercase font-semibold text-zinc-500 bg-zinc-900/50 border-b border-zinc-800', theadClassName)}>
              <tr>
                {columns.map(column => (
                  <th key={column.key} className="px-6 py-4 whitespace-nowrap font-medium tracking-wide">
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {rows?.map((row, index) => {
                return (
                  <tr
                    key={index}
                    className="group bg-transparent hover:bg-zinc-800/30 transition-colors duration-150"
                  >
                    {columns.map(column => (
                      <td key={column.key} className={classNames('px-6 py-4 align-middle', column.className)}>
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
