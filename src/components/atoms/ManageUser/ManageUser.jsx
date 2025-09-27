import React from "react";

const ManageUser = ({
  isEdit = false,
  isOpen,
  onClose,
  onSave,
  formData = {},
  setFormData,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/15 bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit User" : "Create New User"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData ? formData.name : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData ? formData.email : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData ? formData.birthday : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData ? formData.address : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tele"
              name="telephone"
              value={formData ? formData.telephone : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">User Type</label>
            <select
              value={formData ? formData.userType : ""}
              onChange={handleChange}
              name="userType"
              className="w-full border rounded-md px-3 py-2 mt-1"
            >
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Moderator">Moderator</option>
              <option value="NewUser">New User</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-400 rounded text-white hover:bg-red-300 hover:text-black transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400 hover:text-black transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageUser;
