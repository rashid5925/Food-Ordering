import { PhotoIcon } from "@heroicons/react/24/solid";
import Title from "../components/Title";
import { Grid, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Input from "../components/Input";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import API from "../axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const [inputs, setInputs] = useState({
    title: "",
    price: "",
    decription: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const imageRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
            const responseProduct = await API.get(`/admin/product/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (responseProduct.status === 200) {
                const data = await responseProduct.data;
                setInputs({
                    title: data.title,
                    price: data.price,
                    decription: data.decription,
                    category: data.category,
                    image: data.image,
                })
                setLoading(false);
              }
          const responseCategories = await API.get("/admin/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (responseCategories.status === 200) {
            const data = await responseCategories.data;
            setCategories(data);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getOrder();
  }, []);
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "price") {
      if (!isNaN(value)) {
        setInputs({ ...inputs, [name]: value });
      }
    } else if (e.target.files && e.target.files[0]) {
      e.preventDefault();
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setInputs({ ...inputs, image: reader.result });
      };
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };
  const handleDrag = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.readAsDataURL(e.dataTransfer.files[0]);
    reader.onloadend = () => {
      setInputs({ ...inputs, image: reader.result });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    if (
      inputs.title !== "" &&
      inputs.price !== "" &&
      inputs.decription !== "" &&
      inputs.category !== "" &&
      inputs.image !== ""
    ) {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const response = await API.put(`/admin/updateproduct/${id}`, inputs, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            Swal.fire({
              title: "Successful!",
              text: "Updated Successfully!",
              icon: "success",
            });
            setInputs({
              title: "",
              price: "",
              decription: "",
              category: "",
              image: "",
            });
            navigate('/admin/products');
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Error updating product!",
            icon: "error",
          });
          console.log(error);
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Please login first!",
          icon: "error",
        });
      }
    }
    setUploading(false);
  };
  return (
    <Grid item md={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        {uploading ? (
          <div className="flex h-screen flex-col justify-center items-center">
            <Loader />
            <p className="mt-2">Updating Product</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <Title>Edit Product</Title>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full text-lg">
                    <Input
                      title="Title"
                      id="title"
                      placeholder="Title"
                      py="py-2"
                      icon={
                        <AddIcon fontSize="small" className="text-gray-400" />
                      }
                      input={inputs.title}
                      setInput={handleInputs}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      title="Price"
                      id="price"
                      placeholder="Price"
                      py="py-2"
                      icon={
                        <AddIcon fontSize="small" className="text-gray-400" />
                      }
                      input={inputs.price}
                      setInput={handleInputs}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="categories"
                      className="block text-sm font-medium leading-6 text-gray-900 mt-4"
                    >
                      Category
                    </label>
                    <div className="mt-1">
                      {loading ? (
                        <Loader />
                      ) : (
                        <select
                          id="category"
                          name="category"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          onChange={handleInputs}
                        >
                          {categories.map((category) => (
                            <option key={category._id} selected={category.name == inputs.category}>{category.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="decription"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="decription"
                        name="decription"
                        rows={3}
                        onChange={handleInputs}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={inputs.decription}
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Product Image
                    </label>
                    <div
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                    >
                      <div className="text-center">
                        {inputs.image ? (
                          <img
                            className="w-96"
                            src={inputs.image}
                            alt="product image"
                          />
                        ) : (
                          <PhotoIcon
                            className="mx-auto h-12 w-12 text-gray-300"
                            aria-hidden="true"
                          />
                        )}
                        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative me-1 mb-1 cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <button
                              type="button"
                              onClick={() => imageRef.current.click()}
                            >
                              Product Image
                            </button>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              ref={imageRef}
                              accept="image/*"
                              className="sr-only"
                              onChange={handleInputs}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update Product
              </button>
            </div>
          </form>
        )}
      </Paper>
    </Grid>
  );
}
