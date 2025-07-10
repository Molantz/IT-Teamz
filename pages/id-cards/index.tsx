import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function IdCardsPage() {
  const [cards, setCards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employee_id: '', card_number: '', issue_date: '', status: 'active' });
  const [editing, setEditing] = useState<any>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  async function fetchEmployees() {
    const res = await fetch('/api/employees');
    setEmployees(await res.json());
  }
  async function fetchCards() {
    const res = await fetch('/api/id-cards');
    setCards(await res.json());
  }

  useEffect(() => { fetchEmployees(); fetchCards(); }, []);

  // Filter cards based on search and filters
  const filteredCards = cards.filter((card: any) => {
    const matchesSearch = !searchTerm || 
      card.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.card_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || card.status === statusFilter;
    
    const matchesDateFrom = !dateFrom || card.issue_date >= dateFrom;
    const matchesDateTo = !dateTo || card.issue_date <= dateTo;
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (editing) {
      setEditing(null);
    } else {
      await fetch('/api/id-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ employee_id: '', card_number: '', issue_date: '', status: 'active' });
    fetchCards();
  }

  function handleSelectCard(cardId: number) {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  }

  function handleSelectAll() {
    if (selectedCards.length === filteredCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredCards.map((card: any) => card.id));
    }
  }

  async function handleBatchPrint() {
    selectedCards.forEach(cardId => {
      window.open(`/id-cards/${cardId}`, '_blank');
    });
  }

  async function handleBatchExport() {
    const selectedCardData = cards.filter((card: any) => selectedCards.includes(card.id));
    const csv = [
      ['Card Number', 'Employee', 'Department', 'Issue Date', 'Status'].join(','),
      ...selectedCardData.map((card: any) => 
        [card.card_number, card.employee_name, card.department, card.issue_date, card.status].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'id-cards-export.csv';
    a.click();
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h1>Employee ID Cards</h1>
      
      {/* Search and Filters */}
      <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>Search & Filters</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            placeholder="Search by name, card number, department..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minWidth: 200 }}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="lost">Lost</option>
            <option value="expired">Expired</option>
          </select>
          <input 
            type="date" 
            placeholder="From Date" 
            value={dateFrom} 
            onChange={e => setDateFrom(e.target.value)}
          />
          <input 
            type="date" 
            placeholder="To Date" 
            value={dateTo} 
            onChange={e => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Batch Actions */}
      {selectedCards.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, background: '#e3f2fd', borderRadius: 8 }}>
          <strong>{selectedCards.length} cards selected</strong>
          <button onClick={handleBatchPrint} style={{ marginLeft: 12 }}>Print Selected</button>
          <button onClick={handleBatchExport} style={{ marginLeft: 8 }}>Export Selected</button>
        </div>
      )}

      {/* Add Card Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <select required value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}>
          <option value=''>Select Employee</option>
          {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <input required placeholder="Card Number" value={form.card_number} onChange={e => setForm(f => ({ ...f, card_number: e.target.value }))} />
        <input required placeholder="Issue Date" type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} />
        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
          <option value="active">Active</option>
          <option value="lost">Lost</option>
          <option value="expired">Expired</option>
        </select>
        <button type="submit">Add ID Card</button>
      </form>

      {/* Cards Table */}
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectedCards.length === filteredCards.length} onChange={handleSelectAll} /></th>
            <th>Card Number</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Issue Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.map((c: any) => (
            <tr key={c.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedCards.includes(c.id)}
                  onChange={() => handleSelectCard(c.id)}
                />
              </td>
              <td>{c.card_number}</td>
              <td>{c.employee_name}</td>
              <td>{c.department}</td>
              <td>{c.issue_date}</td>
              <td>{c.status}</td>
              <td>
                <Link href={`/id-cards/${c.id}`}><button>View/Print</button></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        Showing {filteredCards.length} of {cards.length} cards
      </div>
    </div>
  );
} 