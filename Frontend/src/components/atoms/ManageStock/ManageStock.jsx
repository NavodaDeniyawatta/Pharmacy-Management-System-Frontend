import React from "react";

const ManageStock = ({
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
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[600px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Stock" : "Create New Stock"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Medicine Code</label>
            <input
              type="text"
              name="medicineCode"
              value={formData ? formData.medicineCode : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Medicine Name</label>
            <input
              type="text"
              name="medicineName"
              value={formData ? formData.medicineName : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Medicine Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imageFile: e.target.files[0],
                }))
              }
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
            {formData?.imageFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.imageFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Minimum Item Count
            </label>
            <input
              type="number"
              name="minimumCount"
              value={formData ? formData.minimumCount : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Cuttrnt Item Count
            </label>
            <input
              type="number"
              name="currentCount"
              value={formData ? formData.currentCount : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={formData ? formData.buyPrice : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sale Price</label>
            <input
              type="number"
              name="salePrice"
              value={formData ? formData.salePrice : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Current State</label>
            <select
              name="status"
              value={formData ? formData.status : ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
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

export default ManageStock;
