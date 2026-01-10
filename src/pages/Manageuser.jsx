import { useEffect, useState } from "react"
// import axios from "axios"
import { getAllUsers } from "../api/admin/manageUser";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Manageuser() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

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

  if (loading) return <p className="text-center mt-10 text-lg">Loading users...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="container mx-auto px-4 pb-12">

      {/* Page Header */}
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
        Users
      </h1>
      <p className="text-muted-foreground mb-8">Manage and view user profiles</p>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-white/60 shadow-xl rounded-2xl border border-white/40"
          >
            <Card className="rounded-2xl shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {user.username}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-gray-800 font-medium">{user.role}</p>
                </div>

                <Button
                  className="w-full bg-blue-400 rounded-xl border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => setSelectedUser(user)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Details Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[380px] bg-white rounded-2xl shadow-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedUser.username}
            </h2>

            <div className="space-y-3 text-gray-700">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || "Not Provided"}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white mt-6 rounded-xl"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
