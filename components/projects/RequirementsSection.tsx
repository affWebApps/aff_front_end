"use client";
import { useState } from "react";
import { Check, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import {
  useCreateRequirement,
  useUpdateRequirement,
  useDeleteRequirement,
  useApproveRequirement,
} from "@/hooks/useProjects";
import { ProjectRequirement } from "@/services/projectService";

type KVPair = { key: string; value: string };

function pairsFromContent(content: Record<string, string> | null): KVPair[] {
  if (!content || Object.keys(content).length === 0) return [{ key: "", value: "" }];
  return Object.entries(content).map(([key, value]) => ({ key, value }));
}

function contentFromPairs(pairs: KVPair[]): Record<string, string> {
  return pairs.reduce<Record<string, string>>((acc, { key, value }) => {
    if (key.trim()) acc[key.trim()] = value;
    return acc;
  }, {});
}

function KVEditor({
  pairs,
  onChange,
}: {
  pairs: KVPair[];
  onChange: (pairs: KVPair[]) => void;
}) {
  const update = (i: number, field: "key" | "value", val: string) => {
    const next = pairs.map((p, idx) => (idx === i ? { ...p, [field]: val } : p));
    onChange(next);
  };
  const add = () => onChange([...pairs, { key: "", value: "" }]);
  const remove = (i: number) => {
    const next = pairs.filter((_, idx) => idx !== i);
    onChange(next.length ? next : [{ key: "", value: "" }]);
  };

  return (
    <div className="space-y-2">
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Field"
            value={p.key}
            onChange={(e) => update(i, "key", e.target.value)}
            className="w-1/3 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="text"
            placeholder="Value"
            value={p.value}
            onChange={(e) => update(i, "value", e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors mt-1"
      >
        <Plus size={12} /> Add field
      </button>
    </div>
  );
}

interface Props {
  projectId: string;
  requirements: ProjectRequirement[];
  isOwner: boolean;
  isAssignedTailor: boolean;
  canEdit: boolean;
}

export function RequirementsSection({
  projectId,
  requirements,
  isOwner,
  isAssignedTailor,
  canEdit,
}: Props) {
  const { mutate: create, isPending: creating } = useCreateRequirement(projectId);
  const { mutate: update, isPending: updating } = useUpdateRequirement(projectId);
  const { mutate: deleteReq } = useDeleteRequirement(projectId);
  const { mutate: approve } = useApproveRequirement(projectId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPairs, setEditPairs] = useState<KVPair[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPairs, setNewPairs] = useState<KVPair[]>([{ key: "", value: "" }]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startEdit = (req: ProjectRequirement) => {
    setEditingId(req.id);
    setEditPairs(pairsFromContent(req.content));
    setShowAdd(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPairs([]);
  };

  const saveEdit = (reqId: string) => {
    update(
      { reqId, payload: { content: contentFromPairs(editPairs) } },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const saveNew = () => {
    create(
      { content: contentFromPairs(newPairs) },
      {
        onSuccess: () => {
          setShowAdd(false);
          setNewPairs([{ key: "", value: "" }]);
        },
      }
    );
  };

  const canApprove = isOwner || isAssignedTailor;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          Requirements
        </h2>
        {canEdit && !showAdd && (
          <button
            onClick={() => { setShowAdd(true); setEditingId(null); }}
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      {/* Add new requirement */}
      {showAdd && (
        <div className="mb-3 border border-dashed border-amber-300 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-600 mb-2">New requirement</p>
          <KVEditor pairs={newPairs} onChange={setNewPairs} />
          <div className="flex gap-2 mt-3">
            <button
              onClick={saveNew}
              disabled={creating}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors disabled:opacity-40"
            >
              <Save size={11} /> {creating ? "Adding…" : "Add"}
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewPairs([{ key: "", value: "" }]); }}
              className="flex items-center gap-1 text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {requirements.map((req) => {
          const entries = Object.entries(req.content ?? {}).filter(([, v]) => v);
          const isEditing = editingId === req.id;

          return (
            <li key={req.id} className="border border-gray-100 rounded-lg p-3 text-sm">
              {isEditing ? (
                <>
                  <KVEditor pairs={editPairs} onChange={setEditPairs} />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => saveEdit(req.id)}
                      disabled={updating}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors disabled:opacity-40"
                    >
                      <Save size={11} /> {updating ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <X size={11} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {entries.length > 0 ? (
                    <dl className="space-y-1">
                      {entries.map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <dt className="text-gray-400 shrink-0 capitalize">{k}:</dt>
                          <dd className="text-gray-700">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <span className="text-gray-400 text-xs">No content</span>
                  )}

                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span className={req.designer_approved ? "text-green-600" : ""}>
                        Designer {req.designer_approved ? "✓" : "pending"}
                      </span>
                      <span className={req.tailor_approved ? "text-green-600" : ""}>
                        Tailor {req.tailor_approved ? "✓" : "pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {canApprove && (() => {
                        const myApproval = isOwner
                          ? req.designer_approved
                          : req.tailor_approved;
                        return (
                          <button
                            onClick={() =>
                              myApproval
                                ? update({
                                    reqId: req.id,
                                    payload: isOwner
                                      ? { designerApproved: false }
                                      : { tailorApproved: false },
                                  })
                                : approve(req.id)
                            }
                            title={myApproval ? "Unapprove" : "Approve"}
                            className={`p-1 rounded transition-colors ${
                              myApproval
                                ? "text-green-600 bg-green-50 hover:bg-green-100"
                                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <Check size={13} />
                          </button>
                        );
                      })()}
                      {canEdit && (
                        <>
                          <button
                            onClick={() => startEdit(req)}
                            title="Edit"
                            className="p-1 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirmDeleteId === req.id) {
                                deleteReq(req.id);
                                setConfirmDeleteId(null);
                              } else {
                                setConfirmDeleteId(req.id);
                              }
                            }}
                            title={confirmDeleteId === req.id ? "Confirm delete?" : "Delete"}
                            className={`p-1 rounded transition-colors text-xs ${
                              confirmDeleteId === req.id
                                ? "bg-red-100 text-red-600"
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                            onBlur={() => setConfirmDeleteId(null)}
                          >
                            {confirmDeleteId === req.id ? "Delete?" : <Trash2 size={13} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </li>
          );
        })}

        {requirements.length === 0 && !showAdd && (
          <p className="text-sm text-gray-400">No requirements yet.</p>
        )}
      </ul>

    </div>
  );
}
