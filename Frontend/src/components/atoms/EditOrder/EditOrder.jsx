import React from "react";

const EditOrder = ({ isOpen, onClose, onSave, formData, setFormData }) => {
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
        <h2 className="text-xl font-semibold mb-4">Edit Order</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Delivery State</label>
            <select
              name="deliveryStatus"
              value={formData.deliveryStatus || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Cancelled">Cancelled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Delivered">Delivered</option>
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

export default EditOrder;
