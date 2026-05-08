import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const ScoreModal = ({ isOpen, onClose, student, type, onSubmit, selectedPeople, setSelectedPeople }) => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("token")

  const isPositive = type == "positive";

  const getRules = async () => {
    try {
      const res = await axios.get(
        `https://pdp-system-backend-1.onrender.com/api/v1/rules?sign=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        },
      );
      setRules(res.data.data || []);

    } catch {
      console.log("error rules");
    }
  };

  useEffect(() => {
    if (isOpen) getRules();
  }, [type, isOpen]);

  const handleSubmit = () => {
    if (!selectedRule) return alert("Qoidani tanlang");
    if (reason.length < 10) return alert("Kamida 10 belgi yozing");

    const data = {
      studentId: student.id,
      ruleId: selectedRule._id,
      reason,
    };

    setSelectedPeople(data);
    setSelectedRule(null);
    setReason("");

    onClose();
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {isPositive ? "Bonus berish" : "Jarima berish"}
          </h2>
          <X onClick={onClose} className="cursor-pointer text-gray-400" />
        </div>

        {/* STUDENT */}
        <p>
          O'quvchi: <b>{student?.name}</b>
        </p>

        {/* RULES */}
        <div>
          <p className="font-semibold mb-3">Qoidani tanlang</p>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {rules.map((rule) => {
              const isSelected = selectedRule?._id === rule._id;

              return (
                <div
                  key={rule._id}
                  onClick={() => setSelectedRule(rule)}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all flex justify-between items-start ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* RADIO DOT */}
                    <div className="mt-1">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-indigo-500" : "border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* TEXT */}
                    <div>
                      <p className="font-semibold">{rule.title}</p>
                      <p className="text-sm text-gray-500">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  {/* SCORE BADGE */}
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isPositive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isPositive ? `+${rule.pointValue}` : rule.pointValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REASON */}
        <div>
          <p className="font-semibold mb-2">Sabab (kamida 10 belgi)</p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Batafsil sabab yozing..."
            className="w-full h-28 p-4 rounded-2xl bg-gray-100 outline-none resize-none"
          />

          <p className="text-sm text-gray-400 mt-1">
            {reason.length} / 10 belgi
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gray-200 font-semibold"
          >
            Bekor qilish
          </button>

          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-2xl text-white font-semibold ${
              isPositive ? "bg-green-600" : "bg-red-600"
            }`}
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
