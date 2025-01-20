'use client' //React components that rely on browser-specific APIs (e.g., useState, useEffect, useRef, event handlers like onClick) need to be executed in the browser. 'use client' tells Next.js that the component should not be pre-rendered on the server.
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaSearch, FaFilter, FaInbox, FaCog, FaUserCircle } from 'react-icons/fa';
import { MdGroup } from 'react-icons/md';
import SidePanel from './SidePanel';
import Header from './Header';
import Footer from './Footer';



interface Group {
  id: number;
  group_name: string;
  project: string;
  labels: string[];
  members: number;
  last_active: string;
}

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
};

const GroupTable: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    async function fetchGroups() {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Error fetching groups:', error);
      } else {
        const uniqueGroups = Array.from(
          new Map(data.map((group) => [group.group_name, group])).values()
        );
        setGroups(uniqueGroups || []);
        if (uniqueGroups && uniqueGroups.length > 0) {
          setSelectedGroup(uniqueGroups[0]);
        }
      }
    }

    fetchGroups();
  }, []);

  const handleRowClick = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allRowIds = new Set(groups.map((group) => group.id));
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedSelectedRows = new Set(selectedRows);
    if (updatedSelectedRows.has(id)) {
      updatedSelectedRows.delete(id);
    } else {
      updatedSelectedRows.add(id);
    }
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedRows.size === groups.length);
  };

  return (
    <>
      <Header />
      <div className="flex-1 flex h-screen">
        <div className="overflow-y-auto flex-1">
          <div className="flex justify-between items-center bg-gray-100 p-2">
            <div className="flex items-center">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="border rounded py-1 px-2 text-sm"
              />
              <button className="ml-2 border rounded py-1 px-2 flex items-center text-gray-500 text-sm">
                <FaFilter className="mr-1" /> Filter
              </button>
            </div>
            <div className="flex items-center">
              <button className="bg-green-500 text-white rounded py-1 px-3 mr-2 flex items-center text-sm">
                <FaInbox className="mr-1" /> Bulk message
              </button>
              <button className="border rounded py-1 px-3 flex items-center text-gray-500 text-sm">
                <FaCog className="mr-1" /> Group Actions
              </button>
            </div>
          </div>
          <table className="min-w-full bg-white text-sm px-4">
            <thead className="border-b-2 border-t-2 border-gray-100">
              <tr>
                <th className="text-left w-[5%]">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-left w-[40%]">Group Name</th>
                <th className="text-left w-[20%]">Project</th>
                <th className="text-left w-[20%]">Labels</th>
                <th className="text-left w-[10%]">Members</th>
                <th className="text-left w-[10%]">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr
                  key={group.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(group)}
                >
                  <td className="py-2 w-[5%]">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(group.id)}
                      onChange={() => handleCheckboxChange(group.id)}
                    />
                  </td>
                  <td className="py-2 w-[40%] flex items-center space-x-2 ">  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"><MdGroup className="text-gray-500 w-5 h-5" /></div><span>{group.group_name}</span></td>
                  <td
                    className={`py-2 w-[20%] ${
                      group.project.toLowerCase() === 'client'
                        ? 'text-orange-500'
                        : ''
                    } ${
                      group.project.toLowerCase() === 'demo'
                        ? 'text-purple-500'
                        : ''
                    }`}
                  >
                    #{group.project}
                  </td>
                  <td className="py-2 w-[20%] flex gap-2">
                    {group.labels.slice(0, 2).map((label, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          label.toLowerCase() === 'high'
                            ? 'bg-white border-2 border-gray-100 text-red-500'
                            : label.toLowerCase() === 'pilot'
                            ? 'bg-white border-2 border-gray-100 text-purple-500'
                            : label.toLowerCase() === 'priority'
                            ? 'bg-white border-2 border-gray-100 text-green-500'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                    {group.labels.length > 2 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                        +{group.labels.length - 2}
                      </span>
                    )}
                  </td>
                  <td className="py-2 w-[10%]">{group.members}</td>
                  <td className="py-2 w-[10%]">
                    {getRelativeTime(group.last_active)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Footer/>
        </div>
        {selectedGroup && <SidePanel group={selectedGroup} />}        
      </div>
    </>
  );
};

export default GroupTable;
