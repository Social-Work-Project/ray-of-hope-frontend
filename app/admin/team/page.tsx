'use client';
import Image from 'next/image';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';
import { useEffect, useState, useRef, useCallback } from 'react';
import { TeamMembersModal } from '@/components/Admin/TeamMembersModal';
import { AdminService } from '@/services/adminService';
import { TeamResponse } from '@/types';
import DeleteConfirmModal from '@/components/common/DeleteDialogModal';
import { createPortal } from 'react-dom';
import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-react';

// ── Portal Actions Menu ───────────────────────────────────────────────────────
type ActionDef = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  fn: () => void;
};

function ActionsMenu({ actions }: { actions: ActionDef[] }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = actions.length * 44 + 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < menuHeight + 8
      ? rect.top + window.scrollY - menuHeight - 4
      : rect.bottom + window.scrollY + 4;
    const left = rect.right + window.scrollX - 148;
    setCoords({ top, left });
  }, [actions.length]);

  const handleOpen = () => { updatePosition(); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (
        menuRef.current   && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
        style={{ color: 'var(--gray-400)' }}
        aria-label="Actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed bg-white rounded-xl border py-1.5"
          style={{
            top: coords.top,
            left: coords.left,
            minWidth: 148,
            zIndex: 9999,
            borderColor: 'var(--gray-100)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {actions.map((a) => (
            <button
              key={a.label}
              role="menuitem"
              onClick={() => { setOpen(false); a.fn(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-all"
              style={{ color: a.color }}
              onMouseEnter={(e) => (e.currentTarget.style.background = a.bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {a.icon}
              <span className="font-medium">{a.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewMemberModal({ m, onClose }: { m: TeamResponse; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: 'var(--gray-100)' }}
        >
          <h2 className="font-bold text-base" style={{ color: 'var(--navy)', fontFamily: "'DM Sans',sans-serif" }}>
            Team Member
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
            style={{ color: 'var(--gray-400)' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <Image
              src={m.image || '/images/user.png'}
              alt={m.name}
              width={64}
              height={64}
              className="rounded-full object-cover shrink-0"
              style={{ width: 64, height: 64 }}
            />
            <div>
              <div className="font-bold text-base" style={{ color: 'var(--navy)' }}>{m.name}</div>
              <div className="text-sm" style={{ color: 'var(--gray-400)' }}>{m.designation}</div>
              <div className="mt-1.5">
                <Badge variant={m.is_active ? 'green' : 'yellow'}>
                  {m.is_active ? 'Active' : 'Draft'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ background: 'var(--gray-50)' }}>
              <div className="text-xs mb-0.5" style={{ color: 'var(--gray-400)' }}>📅 Joined</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{m.joined_date || '—'}</div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--gray-50)' }}>
              <div className="text-xs mb-0.5" style={{ color: 'var(--gray-400)' }}>💼 Designation</div>
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{m.designation || '—'}</div>
            </div>
          </div>

          {/* Bio */}
          {m.bio && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--gray-400)' }}>Bio</div>
              <p className="text-sm leading-relaxed p-3 rounded-xl" style={{ background: 'var(--gray-50)', color: 'var(--gray-600)' }}>
                {m.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mobile Member Card ────────────────────────────────────────────────────────
function MemberCard({ m, actions }: { m: TeamResponse; actions: ActionDef[] }) {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: 'var(--gray-100)', background: 'var(--gray-50)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={m.image || '/images/user.png'}
            alt={m.name}
            width={40}
            height={40}
            className="rounded-full object-cover shrink-0"
            style={{ width: 40, height: 40 }}
          />
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{m.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--gray-400)' }}>{m.designation}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={m.is_active ? 'green' : 'yellow'}>
            {m.is_active ? 'Active' : 'Draft'}
          </Badge>
          <ActionsMenu actions={actions} />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {m.joined_date && (
          <span className="text-xs" style={{ color: 'var(--gray-400)' }}>
            📅 Since {m.joined_date}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminTeamPage() {
  const [openModal, setOpenModal]       = useState(false);
  const [teams, setTeams]               = useState<TeamResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamResponse | null>(null);
  const [viewTarget, setViewTarget]     = useState<TeamResponse | null>(null);
  const [loading, setLoading]           = useState(false);

  useEffect(() => { fetchTeams(); }, []);

  const fetchTeams = async () => {
    try {
      const res = await AdminService.getAllTeams();
      setTeams(res.data.results || []);
    } catch {
      toast.error('Failed to fetch team members.');
    }
  };

  const handleClose  = () => { setOpenModal(false); setSelectedTeam(null); };
  const handleAddNew = () => { setSelectedTeam(null); setOpenModal(true); };
  const handleEdit   = (m: TeamResponse) => { setSelectedTeam(m); setOpenModal(true); };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await AdminService.deleteTeam(id);
      setTeams((prev) => prev.filter((m) => m.reference_id !== id));
      toast.success('Team member deleted!');
    } catch {
      toast.error('Failed to delete team member. Please try again.');
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleSave = async (data: FormData) => {
    try {
      if (selectedTeam) {
        await AdminService.updateTeam(selectedTeam.reference_id, data);
        toast.success('Team member updated!');
      } else {
        await AdminService.createTeam(data);
        toast.success('Team member added!');
      }
      handleClose();
      fetchTeams();
    } catch {
      toast.error('Failed to save team member. Please try again.');
    }
  };

  const buildActions = (m: TeamResponse): ActionDef[] => [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      color: 'var(--navy)',
      bg: 'var(--gray-50)',
      fn: () => setViewTarget(m),
    },
    {
      label: 'Edit',
      icon: <Pencil className="w-4 h-4" />,
      color: 'var(--sky)',
      bg: '#eff6ff',
      fn: () => handleEdit(m),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      color: '#dc2626',
      bg: '#fef2f2',
      fn: () => setDeleteTarget(m),
    },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {/* Top bar */}
          <div
            className="bg-white border-b px-4 sm:px-8 py-4 sticky top-0 z-10"
            style={{ borderColor: 'var(--gray-100)' }}
          >
            <h2
              className="font-bold text-base sm:text-lg pl-12 lg:pl-0"
              style={{ color: 'var(--navy)', fontFamily: "'DM Sans',sans-serif" }}
            >
              Team Members
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
              style={{ borderColor: 'var(--gray-100)' }}
            >
              {/* Toolbar */}
              <div
                className="px-4 sm:px-5 py-4 border-b flex items-center justify-between gap-3"
                style={{ borderColor: 'var(--gray-100)' }}
              >
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                  Governing Body ({teams.length} members)
                </h3>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all whitespace-nowrap"
                  style={{ background: 'var(--blue)' }}
                >
                  + Add Member
                </button>
              </div>

              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'var(--gray-100)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--gray-400)' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--gray-400)' }}>
                    No team members yet. Add one to get started!
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'var(--gray-50)' }}>
                          {['Member', 'Designation', 'Working Since', 'Status', 'Actions'].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                              style={{ color: 'var(--gray-400)' }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {teams.map((m) => (
                          <tr
                            key={m.reference_id}
                            className="border-t hover:bg-gray-50 transition-colors"
                            style={{ borderColor: 'var(--gray-100)' }}
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={m.image || '/images/user.png'}
                                  alt={m.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full object-cover shrink-0"
                                  style={{ width: 32, height: 32 }}
                                />
                                <span className="font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>
                                  {m.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>
                              {m.designation}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>
                              {m.joined_date}
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={m.is_active ? 'green' : 'yellow'}>
                                {m.is_active ? 'Active' : 'Draft'}
                              </Badge>
                            </td>
                            <td className="px-5 py-3">
                              <ActionsMenu actions={buildActions(m)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden p-3 space-y-3">
                    {teams.map((m) => (
                      <MemberCard key={m.reference_id} m={m} actions={buildActions(m)} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* View modal */}
      {viewTarget && (
        <ViewMemberModal m={viewTarget} onClose={() => setViewTarget(null)} />
      )}

      {/* Edit / Create modal */}
      {openModal && (
        <TeamMembersModal
          isOpen={openModal}
          onClose={handleClose}
          onSave={handleSave}
          teams={selectedTeam}
        />
      )}

      {/* Delete confirm — rendered once at root */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.reference_id)}
          title="Confirm Deletion"
          description={`Are you sure you want to remove "${deleteTarget.name}" from the team? This action cannot be undone.`}
          itemName={deleteTarget.name}
          isLoading={loading}
        />
      )}
    </AdminGuard>
  );
}