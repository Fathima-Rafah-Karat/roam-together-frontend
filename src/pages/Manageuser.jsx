import { useEffect, useState } from "react";
import { getAllUsers } from "../api/admin/manageUser";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Manageuser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading users...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto px-4 pb-12">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">Users</h1>
      <p className="text-muted-foreground mb-8">
        Manage and view user profiles
      </p>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    View
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-[380px]"
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedUser.username}
            </h2>

            <div className="space-y-2">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || "Not Provided"}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Button
              className="w-full mt-6 bg-red-500 hover:bg-red-600"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
