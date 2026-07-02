import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import { Plus, Edit2, Trash2, Upload, X, Layers, Search, Image as ImageIcon } from "lucide-react";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const getallCategory = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/category/get-category`);
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "flytium");
      formData.append("cloud_name", "dhkpwi9ga");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhkpwi9ga/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImage(data.secure_url);
      setImagePreview(data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error("Please upload an image");
        return;
      }

      if (updateId) {
        const { data } = await axios.put(
          `${API_URL}/api/category/update-category/${updateId}`,
          { name, image }
        );
        if (data.success) {
          toast.success("Category updated successfully");
          setUpdateId(null);
        }
      } else {
        const { data } = await axios.post(
          `${API_URL}/api/category/create-category`,
          { name, image }
        );
        if (data.success) {
          toast.success("Category created successfully");
        }
      }
      setName("");
      setImage("");
      setImagePreview("");
      setIsModalOpen(false);
      getallCategory();
    } catch (error) {
      console.log(error);
      toast.error(
        updateId ? "Error updating category" : "Error creating category"
      );
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmed) return;

      const { data } = await axios.delete(
        `${API_URL}/api/category/delete-category/${id}`
      );
      if (data.success) {
        toast.success("Category deleted successfully", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        getallCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting category");
    }
  };

  const handleEditClick = (cat) => {
    setName(cat.name);
    setImage(cat.image);
    setImagePreview(cat.image);
    setUpdateId(cat._id);
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getallCategory();
  }, []);

  return (
    <Layout
      title={"Manage Categories"}
      description={"Create, Update, and Delete Categories"}
    >
      <div className="min-h-screen bg-slate-950">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/5 bg-slate-900 border-r-2 border-slate-800">
            <AdminMenu />
          </div>

          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-12 pb-8 border-b-2 border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 border-2 border-indigo-600 bg-indigo-600/10">
                    <Layers className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black text-white mb-2">Categories</h1>
                    <p className="text-xl text-slate-400">Manage product categories</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setName("");
                    setImage("");
                    setImagePreview("");
                    setUpdateId(null);
                    setIsModalOpen(true);
                  }}
                  className="group relative px-6 py-4 bg-indigo-600 border-2 border-indigo-600 hover:bg-transparent text-white font-bold overflow-hidden flex items-center gap-3 w-fit"
                >
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Add Category</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-900 border-2 border-slate-800 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 border-2 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Categories</p>
                </div>
                <p className="text-4xl font-black text-white">{categories.length}</p>
              </div>
              
              <div className="bg-slate-900 border-2 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-5 h-5 text-cyan-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Filtered Results</p>
                </div>
                <p className="text-4xl font-black text-white">{filteredCategories.length}</p>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">With Images</p>
                </div>
                <p className="text-4xl font-black text-white">
                  {categories.filter(c => c.image).length}
                </p>
              </div>
            </div>

            {/* Categories Table */}
            {filteredCategories.length === 0 ? (
              <div className="border-2 border-slate-800 bg-slate-900 p-16 text-center">
                <Layers className="w-24 h-24 mx-auto mb-6 text-slate-700" />
                <h3 className="text-2xl font-black text-white mb-4">
                  {searchTerm ? 'No Categories Found' : 'No Categories Yet'}
                </h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'Start by creating your first product category'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      setName("");
                      setImage("");
                      setImagePreview("");
                      setUpdateId(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Create First Category
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border-2 border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-800 border-b-2 border-slate-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                          Image
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                          Category Name
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-800">
                      {filteredCategories.map((cat) => (
                        <tr
                          key={cat._id}
                          className="hover:bg-slate-800/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="w-16 h-16 border-2 border-slate-700 bg-slate-800 overflow-hidden">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">
                              {cat.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleEditClick(cat)}
                                className="p-3 border-2 border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white transition-all group/btn"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat._id)}
                                className="p-3 border-2 border-red-500 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all group/btn"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col max-h-[90vh]">
            
            {/* Sticky Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800/60 bg-[#0f172a] sticky top-0 z-20 rounded-t-2xl shrink-0">
              <h2 className="text-2xl font-black text-white">
                {updateId ? "Update Category" : "Create Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Category Image
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="w-full h-48 border-2 border-slate-800 bg-slate-800 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex-1 px-4 py-3 border-2 ${
                        isUploading 
                          ? 'border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'border-indigo-600 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white cursor-pointer'
                      } font-bold transition-all flex items-center justify-center gap-2`}
                    >
                      <Upload className="w-5 h-5" />
                      {isUploading ? 'Uploading...' : image ? "Change Image" : "Upload Image"}
                    </label>
                    {imagePreview && !isUploading && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImage("");
                        }}
                        className="px-4 py-3 border-2 border-red-500 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              </form>
            </div>
            
            {/* Sticky Footer */}
            <div className="p-6 border-t border-slate-800/60 bg-[#0f172a] sticky bottom-0 z-20 flex gap-4 rounded-b-2xl shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-700/50 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800 text-slate-300 hover:text-white font-bold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="categoryForm"
                disabled={isUploading || !image}
                className={`flex-1 px-6 py-3 rounded-xl border font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isUploading || !image
                    ? 'border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'border-indigo-500/50 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] text-white'
                }`}
              >
                {updateId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateCategory;
