
import React from 'react';
import { Product } from '../types';
import { useEffect, useState } from 'react';

interface AdminPanelProps {
  products: Product[];
  onApprove: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (p: Product) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onApprove, onDelete, onUpdate }) => {
  const pending = products.filter(p => !p.approved);
  const token = typeof window !== 'undefined' ? localStorage.getItem('stumarto_token') : null;
  
  const [tab, setTab] = useState<'products' | 'users' | 'reviews' | 'bank' | 'coupons' | 'blogs'>('products');
  const [users, setUsers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bankDetails, setBankDetails] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!token) return;
    
    switch(tab) {
      case 'users':
        fetchUsers();
        break;
      case 'reviews':
        fetchReviews();
        break;
      case 'bank':
        fetchBankDetails();
        break;
      case 'coupons':
        fetchCoupons();
        break;
      case 'blogs':
        fetchBlogs();
        break;
    }
  }, [tab, token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data.data?.users || []);
    } catch (err) {
      console.error('Fetch users error', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setReviews(data.data?.reviews || []);
    } catch (err) {
      console.error('Fetch reviews error', err);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/bank-details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBankDetails(data.data?.banks || []);
    } catch (err) {
      console.error('Fetch bank details error', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCoupons(data.data?.coupons || []);
    } catch (err) {
      console.error('Fetch coupons error', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBlogs(data.data?.blogs || []);
    } catch (err) {
      console.error('Fetch blogs error', err);
    }
  };

  const callApprove = async (id: string) => {
    try {
      if (token) await fetch(`http://localhost:5000/api/products/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      onApprove(id);
    } catch (err) {
      console.error('Approve error', err);
    }
  };

  const callDelete = async (id: string) => {
    if (!confirm('Delete permanently?')) return;
    try {
      if (token) await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onDelete) onDelete(id);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const callEdit = async (p: Product) => {
    const name = prompt('Edit title', p.name) || p.name;
    const price = Number(prompt('Edit price', String(p.price))) || p.price;
    try {
      if (token) {
        await fetch(`http://localhost:5000/api/products/${p.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: name, price })
        });
      }
      if (onUpdate) onUpdate({ ...p, name, price } as Product);
    } catch (err) {
      console.error('Update error', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
          </svg>
        </div>
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['products', 'users', 'reviews', 'bank', 'coupons', 'blogs'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-full font-bold capitalize ${
              tab === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          {pending.length === 0 ? (
            <div className="p-20 bg-green-50 text-green-700 rounded-3xl text-center border border-green-100">
              <p className="font-bold">No pending products. Great job!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pending.map(p => (
                <div key={p.id} className="bg-white border-2 border-yellow-200 rounded-3xl p-6 space-y-4">
                  <img src={p.imageUrl} className="w-full h-40 object-cover rounded-xl" alt="" />
                  <div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">₹{p.price}</p>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => callApprove(p.id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button onClick={() => callEdit(p)} className="py-2 px-3 bg-yellow-50 text-yellow-600 rounded-xl font-bold">
                      Edit
                    </button>
                    <button onClick={() => callDelete(p.id)} className="py-2 px-3 bg-red-50 text-red-600 rounded-xl font-bold">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div>
          {users.length === 0 ? (
            <div className="p-10 bg-gray-50 rounded-2xl text-center">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">Name</th>
                    <th className="border p-3 text-left">Email</th>
                    <th className="border p-3 text-left">Role</th>
                    <th className="border p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="border p-3">{u.name}</td>
                      <td className="border p-3">{u.email}</td>
                      <td className="border p-3"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">{u.role}</span></td>
                      <td className="border p-3 flex gap-2">
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-bold">Toggle</button>
                        <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {tab === 'reviews' && (
        <div>
          <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl font-bold">
            {showForm ? 'Cancel' : 'Add Review'}
          </button>
          {showForm && (
            <div className="bg-white p-6 rounded-xl border mb-6 space-y-4">
              <input type="text" placeholder="Product ID" className="w-full p-3 border rounded-xl" />
              <input type="number" placeholder="Rating (1-5)" className="w-full p-3 border rounded-xl" />
              <textarea placeholder="Review text" className="w-full p-3 border rounded-xl h-24"></textarea>
              <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold">Add Review</button>
            </div>
          )}
          {reviews.length === 0 ? (
            <div className="p-10 bg-gray-50 rounded-2xl text-center">No reviews yet.</div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((r: any) => (
                <div key={r._id} className="bg-white p-4 rounded-xl border">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{r.userName}</p>
                      <p className="text-yellow-500">⭐ {r.rating}/5</p>
                    </div>
                    <button className="text-red-600 font-bold">Delete</button>
                  </div>
                  <p className="text-gray-600 mt-2">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bank Details Tab */}
      {tab === 'bank' && (
        <div>
          <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl font-bold">
            {showForm ? 'Cancel' : 'Add Bank Details'}
          </button>
          {showForm && (
            <div className="bg-white p-6 rounded-xl border mb-6 space-y-4">
              <input type="text" placeholder="Seller ID" className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Account Holder Name" className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Account Number" className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="IFSC Code" className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Bank Name" className="w-full p-3 border rounded-xl" />
              <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold">Add Bank Details</button>
            </div>
          )}
          <div className="grid gap-4">
            {bankDetails.map((b: any) => (
              <div key={b._id} className="bg-white p-4 rounded-xl border">
                <p className="font-bold">{b.accountHolder}</p>
                <p className="text-sm text-gray-600">{b.bankName}</p>
                <p className="text-sm text-gray-600">Account: ****{b.accountNumber?.slice(-4)}</p>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-bold">Edit</button>
                  <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {tab === 'coupons' && (
        <div>
          <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl font-bold">
            {showForm ? 'Cancel' : 'Add Coupon'}
          </button>
          {showForm && (
            <div className="bg-white p-6 rounded-xl border mb-6 space-y-4">
              <input type="text" placeholder="Coupon Code" className="w-full p-3 border rounded-xl" />
              <input type="number" placeholder="Discount %" className="w-full p-3 border rounded-xl" />
              <input type="number" placeholder="Min Purchase ₹" className="w-full p-3 border rounded-xl" />
              <input type="date" className="w-full p-3 border rounded-xl" />
              <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold">Add Coupon</button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c: any) => (
              <div key={c._id} className="bg-white p-4 rounded-xl border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{c.code}</p>
                    <p className="text-green-600 font-bold text-2xl">{c.discount}% OFF</p>
                  </div>
                  <button className="text-red-600 font-bold">Delete</button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Min: ₹{c.minPurchase}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blogs Tab */}
      {tab === 'blogs' && (
        <div>
          <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl font-bold">
            {showForm ? 'Cancel' : 'Add Blog'}
          </button>
          {showForm && (
            <div className="bg-white p-6 rounded-xl border mb-6 space-y-4">
              <input type="text" placeholder="Blog Title" className="w-full p-3 border rounded-xl" />
              <textarea placeholder="Blog content" className="w-full p-3 border rounded-xl h-32"></textarea>
              <input type="text" placeholder="Author" className="w-full p-3 border rounded-xl" />
              <input type="date" className="w-full p-3 border rounded-xl" />
              <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold">Add Blog</button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog: any) => (
              <div key={blog._id} className="bg-white p-4 rounded-xl border">
                <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{blog.content?.slice(0, 100)}...</p>
                <p className="text-xs text-gray-500 mb-3">By {blog.author} • {new Date(blog.date).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-bold">Edit</button>
                  <button className="flex-1 px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
