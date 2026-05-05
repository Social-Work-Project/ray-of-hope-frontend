'use client';
import Image from 'next/image';

import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import AdminGuard from '@/components/Admin/AdminGuard';
import { useEffect, useState } from 'react';
import { TeamMembersModal } from '@/components/Admin/TeamMembersModal';
import { AdminService } from '@/services/adminService';
import { TeamResponse } from '@/types';
import DeleteConfirmModal from '@/components/common/DeleteDialogModal';


export default function AdminTeamPage() {
    const [openModal, setOpenModal] = useState(false);
     const [teams, setTeams] = useState<TeamResponse[]>([]);
      const [selectedTeam, setSelectedTeam] =
        useState<any | null>(null);
      const [selectedTeamId, setSelectedTeamId] =
        useState<string>("");
      const [loading, setLoading] = useState(false);
      const [showDeleteModal, setShowDeleteModal] = useState(false);
    
      useEffect(() => {
        fetchTeams();
      }, []);
    
      const fetchTeams = async () => {
        try {
          const res = await AdminService.getAllTeams();
          setTeams(res.data.results || []);
        } catch (err) {
          console.log(err);
        }
      };
    
      const handleClose = () => {
        setOpenModal(false);
        setSelectedTeam(null);
      };
    
      const handleDelete = async (id: string) => {
        setLoading(true);
        try {
          await AdminService.deleteTeam(id);
          setTeams(teams.filter((e) => e.reference_id !== id));
          toast.success("Team Member Deleted!");
        } catch (error) {
          toast.error("Failed to delete team member. Please try again.");
        } finally {
          setLoading(false);
          setShowDeleteModal(false);
          setSelectedTeamId("");
        }
      };
    
      const handleAddNew = () => {
        setSelectedTeam(null);
        setOpenModal(true);
      };
    
      const handleEdit = (team: TeamResponse) => {
        setSelectedTeam(team);
        setOpenModal(true);
      };
    
      const handleSave = async (data: FormData) => {
        try {
          if (selectedTeam) {
            await AdminService.updateTeam(
              selectedTeam.reference_id,
              data,
            );
            toast.success("Team Member Updated!");
          } else {
            await AdminService.createTeam(data);
            toast.success("Team Member Added!");
          }
          handleClose();
          fetchTeams();
        } catch (error) {
          toast.error("Failed to save event. Please try again.");
        }
      };
  
  
  
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div className="bg-white border-b px-8 py-4 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Team Members</h2>
          </div>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--gray-100)' }}>
              <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--gray-100)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Governing Body ({teams.length} members)</h3>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer bg-(--blue) hover:bg-blue-800/80 transition-all"
                  >
                  + Add Member
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      {['Member', 'Designation', 'Working Since',  'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ color: 'var(--gray-400)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map(m => (
                      <tr key={m.reference_id} className="border-t hover:bg-gray-50 transition-colors"
                        style={{ borderColor: 'var(--gray-100)' }}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Image src={m.image || "/images/user.png"} alt={m.name} width={32} height={32}
                              className="rounded-full object-cover shrink-0"
                              style={{ width: 32, height: 32 }} />
                            <span className="font-medium whitespace-nowrap" style={{ color: 'var(--text)' }}>{m.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{m.designation}</td>
                        <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--gray-600)' }}>{m.joined_date}</td>
                        
                        <td className="px-5 py-3"><Badge variant={m.is_active ? "green" : "yellow"}>{m.is_active? "Active" : "Draft"}</Badge></td>
                        <td className="px-5 py-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50 cursor-pointer"
                            style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTeamId(m.reference_id)
                              setShowDeleteModal(true)
                            }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-red-50 cursor-pointer"
                            style={{ borderColor: '#f87171', color: '#dc2626' }}>
                            Delete
                          </button>

                          <DeleteConfirmModal
                              isOpen={showDeleteModal}
                              onClose={() => setShowDeleteModal(false)}
                              onConfirm={() =>
                                handleDelete(selectedTeamId)
                              }
                              title="Confirm Deletion"
                              description={`Are you sure you want to delete "${teams.find(m => m.reference_id === selectedTeamId)?.name}" from Team Members List? This action cannot be undone.`}
                              isLoading={loading}
                            />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {openModal && <TeamMembersModal isOpen={openModal} onClose={() => setOpenModal(false)} onSave={handleSave} teams={selectedTeam} />}
        </main>
      </div>
    </AdminGuard>
  );
}
