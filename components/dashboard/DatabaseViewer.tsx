
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    CubeIcon, 
    TableCellsIcon,
    ArrowLeftIcon,
    ArrowPathIcon
} from '../Icons';

interface TableMeta {
    name: string;
    rows: number;
    columns: number;
    size: string;
}

const DatabaseViewer: React.FC = () => {
    const [view, setView] = useState<'list' | 'table'>('list');
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [tableData, setTableData] = useState<any[]>([]);
    const [tableStats, setTableStats] = useState<TableMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (view === 'list') {
            fetchTableStats();
        }
    }, [view]);

    const fetchTableStats = async () => {
        setLoading(true);
        try {
            // TODO: Use Supabase API to list tables
            // For now, show the main tables from the schema
            setTableStats([
                { name: 'profiles', rows: 0, columns: 6, size: '~16 KB' },
                { name: 'services', rows: 6, columns: 8, size: '~4 KB' },
                { name: 'user_services', rows: 0, columns: 5, size: '~8 KB' },
                { name: 'tickets', rows: 0, columns: 7, size: '~8 KB' },
                { name: 'ticket_messages', rows: 0, columns: 5, size: '~8 KB' },
                { name: 'transactions', rows: 0, columns: 6, size: '~8 KB' },
            ]);
        } catch (e) {
             setTableStats([]);
        }
        setLoading(false);
    };

    const handleSelectTable = async (tableName: string) => {
        setSelectedTable(tableName);
        setLoading(true);
        setView('table');
        setError(null);

        try {
            // TODO: Query actual data from Supabase
            // For now, show empty table with structure
            setError(`Table viewer for '${tableName}' - Use Supabase Table Editor to view data`);
            setTableData([]);
        } catch (err: any) {
            setError(err.message);
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTables = tableStats.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (view === 'table') {
        const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

        return (
            <div className="flex flex-col h-[calc(100vh-10rem)] bg-dark-bg text-white rounded-lg overflow-hidden font-sans">
                {/* Table Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-dark-surface">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <TableCellsIcon className="w-5 h-5 text-green-500" />
                            <span className="font-mono text-sm font-semibold">{selectedTable}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-700 mx-2"></div>
                        <span className="text-xs text-slate-500">Showing top 50 rows</span>
                    </div>
                    <div className="flex gap-2">
                         <button onClick={() => handleSelectTable(selectedTable)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button className="bg-green-700 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                            Insert row
                        </button>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="flex-1 overflow-auto bg-dark-bg relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                            Loading data...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-red-400 font-mono text-sm">{error}</div>
                    ) : tableData.length === 0 ? (
                        <div className="p-8 text-slate-500 text-sm font-mono">Table is empty.</div>
                    ) : (
                        <table className="min-w-full border-collapse text-left text-xs font-mono">
                            <thead className="sticky top-0 bg-dark-surface z-10 shadow-sm">
                                <tr>
                                    <th className="w-10 border-b border-r border-slate-800 p-2 text-center text-slate-500 bg-slate-900">#</th>
                                    {columns.map(col => (
                                        <th key={col} className="border-b border-r border-slate-800 p-2 font-normal text-slate-400 whitespace-nowrap min-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary/70 text-[10px]">TXT</span>
                                                {col}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {tableData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors group">
                                        <td className="border-r border-slate-800 p-2 text-center text-slate-600 bg-dark-bg group-hover:bg-slate-900/50">{idx + 1}</td>
                                        {columns.map(col => {
                                            const val = row[col];
                                            let displayVal = val;
                                            if (val === null) displayVal = <span className="text-slate-600">NULL</span>;
                                            else if (typeof val === 'object') displayVal = JSON.stringify(val);
                                            else if (typeof val === 'boolean') displayVal = val ? 'TRUE' : 'FALSE';

                                            return (
                                                <td key={`${idx}-${col}`} className="border-r border-slate-800 p-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] text-slate-300">
                                                    {displayVal}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="bg-dark-bg text-white rounded-lg overflow-hidden min-h-[600px]">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold mb-6">Database Tables</h1>
                
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-3 py-1.5">
                         <span className="text-slate-400 text-xs">schema</span>
                         <span className="font-mono text-sm">public</span>
                         <svg className="w-4 h-4 text-slate-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    
                    <div className="flex-1 max-w-md relative">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search for a table" 
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 pl-9 py-1.5 text-sm focus:outline-none focus:border-green-600 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="bg-green-700 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                        <PlusIcon className="w-3 h-3" />
                        New table
                    </button>
                </div>
            </div>

            {/* Table List */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                             <th className="px-6 py-3 w-12"></th>
                             <th className="px-6 py-3">Name</th>
                             <th className="px-6 py-3">Description</th>
                             <th className="px-6 py-3 text-right">Rows (Estimated)</th>
                             <th className="px-6 py-3 text-right">Size (Estimated)</th>
                             <th className="px-6 py-3 text-center">Realtime Enabled</th>
                             <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                             <tr><td colSpan={7} className="text-center py-12 text-slate-500">Loading tables...</td></tr>
                        ) : filteredTables.length > 0 ? filteredTables.map(table => (
                            <tr 
                                key={table.name} 
                                className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                                onClick={() => handleSelectTable(table.name)}
                            >
                                <td className="px-6 py-4 pl-8">
                                    <CubeIcon className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                </td>
                                <td className="px-6 py-4 font-mono text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                                    {table.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    No description
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300 text-right font-mono">
                                    {table.rows}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300 text-right font-mono">
                                    {table.size}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <svg className="w-5 h-5 text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs border border-slate-600 rounded px-2 py-0.5 text-slate-400">{table.columns} columns</span>
                                        <button className="text-slate-400 hover:text-white">
                                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                             <tr><td colSpan={7} className="text-center py-12 text-slate-500">No tables found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DatabaseViewer;
