import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../Config File/config';
import { Search, Printer, Save } from 'lucide-react';
import  Sidebar  from '../components/Sidebar'; // re-use your existing sidebar
import dayjs from 'dayjs';

/* ---------------- Modal to add an expense ---------------- */
const AddExpenseModal = ({ close, refresh }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { date: dayjs().format('YYYY-MM-DD'), status: 'Paid' },
  });

  const onSubmit = async (data) => {
    data.amount = +data.amount;
    try {
      await axios.post(`${API_BASE_URL}/api/expenses`, data);
      refresh();
      reset();
      close();
    } catch (e) {
      alert('Failed to add expense');
    }
  };

  const input = 'border p-2 rounded w-full';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-[40rem] space-y-6">
        <h2 className="text-xl font-semibold">Add Expense</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Date</label>
              <input type="date" {...register('date')} className={input} required />
            </div>
            <div>
              <label className="text-sm">Category</label>
              <input {...register('category')} className={input} required />
            </div>
            <div>
              <label className="text-sm">Sub Category</label>
              <input {...register('subCategory')} className={input} />
            </div>
            <div>
              <label className="text-sm">Amount (₹)</label>
              <input type="number" step="0.01" {...register('amount')} className={input} required />
            </div>
          </div>

          <div>
            <label className="text-sm">Description</label>
            <textarea {...register('description')} className={`${input} h-24`} />
          </div>

          <div>
            <label className="text-sm block mb-1">Status</label>
            <label className="mr-6">
              <input type="radio" value="Paid"   {...register('status')} defaultChecked />{' '}
              <span className="text-green-600 font-medium">Paid</span>
            </label>
            <label>
              <input type="radio" value="Unpaid" {...register('status')} />{' '}
              <span className="text-red-500 font-medium">Unpaid</span>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={close} className="px-4 py-2 border rounded">
              Discard
            </button>
            <button className="bg-green-700 text-white px-6 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- Main page ---------------- */
const LIMIT = 10;
export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [paidTotal, setPaidTotal] = useState(0);
  const [unpaidTotal, setUnpaidTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/expenses`, {
      params: { search, from, to, page, limit: LIMIT },
    });
    setExpenses(data.items);
    setTotal(data.total);
    setPaidTotal(data.paidTotal);
    setUnpaidTotal(data.unpaidTotal);
    setGrandTotal(data.grandTotal);
  };

  useEffect(() => {
    fetchData();
  }, [search, from, to, page]);

  const pages = Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => i + 1);

  const cell = 'px-3 py-2 whitespace-nowrap';

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        {/* Filters row */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="border p-2 rounded" />
            <span className="self-center">to</span>
            <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="border p-2 rounded" />
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search…" className="border pl-8 pr-3 py-2 rounded w-full" />
          </div>

          <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">
            + Add Expense
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-green-700">
              <tr>{['Sl. no.','Date','Category','Sub Category','Description','Amount','Status'].map(h => <th key={h} className={cell}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {expenses.map((e, idx) => (
                <tr key={e._id} className="border-b">
                  <td className={cell}>{(page - 1) * LIMIT + idx + 1}</td>
                  <td className={cell}>{dayjs(e.date).format('DD/MM/YYYY')}</td>
                  <td className={cell}>{e.category}</td>
                  <td className={cell}>{e.subCategory}</td>
                  <td className={cell}>{e.description?.slice(0, 30)}…</td>
                  <td className={cell}>₹ {e.amount.toLocaleString()}</td>
                  <td className={`${cell} font-semibold ${e.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                    {e.status}
                  </td>
                </tr>
              ))}
              {!expenses.length && <tr><td colSpan={7} className="text-center py-6 text-gray-400">No expenses</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Totals row */}
        <div className="bg-white shadow rounded p-4 mt-4 flex gap-8 font-medium">
          <span>Paid Amount: <span className="text-green-700">₹ {paidTotal.toLocaleString()}</span></span>
          <span>Unpaid Amount: <span className="text-red-500">₹ {unpaidTotal.toLocaleString()}</span></span>
          <span>Total Amount: <span className="text-emerald-700">₹ {grandTotal.toLocaleString()}</span></span>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-4 mt-6">
          <button className="border px-6 py-2 rounded flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
          <button className="bg-green-700 text-white px-8 py-2 rounded flex items-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>

        {showModal && <AddExpenseModal close={() => setShowModal(false)} refresh={fetchData} />}
      </main>
    </div>
  );
}
