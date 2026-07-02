import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../api";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
} from "lucide-react";

const CreateProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    description: "",
    image: "",
    category: "",
  });
  const [updateId, setUpdateId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/product/get-product`);
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching products");
    }
  };

  // Fetch all categories
  const getAllCategories = async () => {
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
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
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
      // Validate discounted price
      if (formData.discountedPrice) {
        const price = Number(formData.price);
        const discountedPrice = Number(formData.discountedPrice);

        if (discountedPrice >= price) {
          toast.error("Discounted price must be less than regular price");
          return;
        }

        // Calculate discount percentage
        const discountPercentage = Math.round(
          ((price - discountedPrice) / price) * 100
        );

        // Optional: Validate maximum discount
        if (discountPercentage > 90) {
          toast.error("Maximum discount cannot exceed 90%");
          return;
        }
      }

      if (updateId) {
        const { data } = await axios.put(
          `${API_URL}/api/product/update-product/${updateId}`,
          formData
        );
        if (data.success) {
          toast.success("Product updated successfully");
          setUpdateId(null);
        }
      } else {
        const { data } = await axios.post(
          `${API_URL}/api/product/create-product`,
          formData
        );
        if (data.success) {
          toast.success("Product created successfully");
        }
      }
      resetForm();
      setIsModalOpen(false);
      getAllProducts();
    } catch (error) {
      console.log(error);
      toast.error(
        updateId ? "Error updating product" : "Error creating product"
      );
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmed) {
        const { data } = await axios.delete(
          `${API_URL}/api/product/delete-product/${id}`
        );
        if (data.success) {
          toast.success("Product deleted successfully");
          getAllProducts();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      description: product.description,
      image: product.image,
      category: product.category,
    });
    setImagePreview(product.image);
    setUpdateId(product._id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      discountedPrice: "",
      description: "",
      image: "",
      category: "",
    });
    setImagePreview("");
    setUpdateId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
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
                    <Package className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black text-white mb-2">
                      Create Product
                    </h1>
                    <p className="text-xl text-slate-400">
                      Add new products to inventory
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="group relative px-6 py-4 bg-indigo-600 border-2 border-indigo-600 hover:bg-transparent text-white font-bold overflow-hidden flex items-center gap-3 w-fit"
                >
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Add Product</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
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
                  <Package className="w-5 h-5 text-indigo-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Total Products
                  </p>
                </div>
                <p className="text-4xl font-black text-white">
                  {products.length}
                </p>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-5 h-5 text-cyan-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Filtered
                  </p>
                </div>
                <p className="text-4xl font-black text-white">
                  {filteredProducts.length}
                </p>
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-5 h-5 text-amber-400" />
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Categories
                  </p>
                </div>
                <p className="text-4xl font-black text-white">
                  {categories.length}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="border-2 border-slate-800 bg-slate-900 p-16 text-center">
                <Package className="w-24 h-24 mx-auto mb-6 text-slate-700" />
                <h3 className="text-2xl font-black text-white mb-4">
                  {searchTerm ? "No Products Found" : "No Products Yet"}
                </h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Start by adding your first product"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      resetForm();
                      setIsModalOpen(true);
                    }}
                    className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Add First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-slate-900 border-2 border-slate-800 hover:border-indigo-600 transition-all"
                  >
                    <div className="aspect-square overflow-hidden border-b-2 border-slate-800 bg-slate-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-white mb-3 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                            Price
                          </p>
                          <p className="text-2xl font-black text-white">
                            ₹{product.price}
                          </p>
                        </div>
                        {product.discountedPrice && (
                          <div className="px-3 py-1 bg-emerald-500/10 border-2 border-emerald-500">
                            <p className="text-xs font-black text-emerald-400">
                              {Math.round(
                                ((product.price - product.discountedPrice) /
                                  product.price) *
                                  100
                              )}
                              % OFF
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 pt-4 border-t-2 border-slate-800">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 p-3 border-2 border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 p-3 border-2 border-red-500 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-800/60 bg-[#0f172a] sticky top-0 z-20 rounded-t-2xl shrink-0">
                <h3 className="text-2xl font-black text-white">
                  {updateId ? "Update Product" : "Create Product"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Regular Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        className="w-full pl-12 pr-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Discounted Price (₹){" "}
                      <span className="text-slate-500 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="discountedPrice"
                        className="w-full pl-12 pr-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 text-white placeholder-slate-500 font-medium outline-none transition-colors resize-none"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Product Image
                  </label>
                  <div className="space-y-4">
                    {(imagePreview || formData.image) && (
                      <div className="w-full h-48 border-2 border-slate-800 bg-slate-800 overflow-hidden">
                        <img
                          src={imagePreview || formData.image}
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
                            ? "border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "border-indigo-600 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white cursor-pointer"
                        } font-bold transition-all flex items-center justify-center gap-2`}
                      >
                        <Upload className="w-5 h-5" />
                        {isUploading
                          ? "Uploading..."
                          : formData.image
                          ? "Change Image"
                          : "Upload Image"}
                      </label>
                      {imagePreview && !isUploading && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData((prev) => ({ ...prev, image: "" }));
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
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 focus:border-indigo-600 text-white font-medium outline-none transition-colors"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                </form>
              </div>
              <div className="p-6 border-t border-slate-800/60 bg-[#0f172a] sticky bottom-0 z-20 flex gap-4 rounded-b-2xl shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-700/50 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800 text-slate-300 hover:text-white font-bold transition-all duration-300"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="productForm"
                  className={`flex-1 px-6 py-3 rounded-xl border font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isUploading
                      ? "border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "border-indigo-500/50 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] text-white"
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Uploading...</span>
                    </>
                  ) : updateId ? (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Update Product</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateProduct;
