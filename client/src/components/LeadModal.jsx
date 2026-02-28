import { useEffect, useState } from 'react';
import api from '../services/api';
import { X, Send, MessageSquare } from 'lucide-react';

const LeadModal = ({ lead, onClose }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lead) fetchNotes();
    }, [lead]);

    const fetchNotes = async () => {
        try {
            const res = await api.get(`/admin/leads/${lead.id}/notes`);
            setNotes(res.data);
        } catch (err) {
            console.error("Error fetching notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            await api.post(`/admin/leads/${lead.id}/notes`, { content: newNote });
            setNewNote('');
            fetchNotes(); // Refresh the list
        } catch (err) {
            alert("Failed to add note");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                {/* Pinned Info */}
                <section className="lead-info-section">
                    <h2>{lead.name}</h2>
                    <p><strong>Email:</strong> {lead.email}</p>
                    <p><strong>Phone:</strong> {lead.phone || 'N/A'}</p>
                </section>

                {/* Form at the Top */}
                <form onSubmit={handleAddNote} className="note-form">
                    <textarea
                        placeholder="New follow-up note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        required
                    />
                    <button type="submit" className="add-note-btn">
                        <Send size={16} /> Save Note
                    </button>
                </form>

                <section className="notes-section">
                    <div className="notes-list">
                        {loading ? <p>Loading...</p> :
                            notes.map(note => (
                                <div key={note.id} className="note-item">
                                    <p className="note-text">{note.content}</p>
                                    <span className="note-meta">{new Date(note.created_at).toLocaleString()}</span>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LeadModal;