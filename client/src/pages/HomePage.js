import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepages.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      
      if (Array.isArray(data?.products)) {
        setProducts([...products, ...data?.products]);
      } else {
        console.log("Invalid product data", data?.products);
      }
      
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };


  useEffect(() => {
    //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);

      if (Array.isArray(data?.products)) {
        setProducts([...products, ...data?.products]);
      } else {
        console.log("Invalid product data", data?.products);
      }

      // setProducts(data?.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

    if (!checked.length || !radio.length) { 
      getAllProducts();
  }}, [checked.length, radio.length]);


// //get filterd product
//   const filterProduct = async () => {
//     try {
//       const { data } = await axios.post("/api/v1/product/product-filters", {
//         checked,
//         radio,
//       });
//       setProducts(data?.products);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (checked.length || radio.length) filterProduct();
//   }, [checked, radio, filterProduct]);
  useEffect(() => {
    const filterProduct = async () => {
      try {
        const { data } = await axios.post("/api/v1/product/product-filters", {
          checked,
          radio,
        });

        setProducts(data?.products);
        
        // Log the names of the products
        if (data?.products) {
          data.products.forEach(product => {
            console.log(product.name); // This will log the name of each product
          });
        }
        console.log("Filter Products API Response:", data);

      } catch (error) {
        console.log(error);
      }
    };

    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]); // No need to add `filterProduct` to the dependency array


  
  return (
    <Layout title={"ALL Products - Best offers "}>
      {/* banner image */}
      <img
        src="/images/Virtual.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
          {/* <button
          className="btn btn-danger"
          onClick={() => {
            setChecked([]); // Reset categories filter
            setRadio([]);    // Reset price filter
            //getAllProducts(); // Re-fetch all products without filters
          }}
>
              RESET FILTERS
            </button> */}
            <button
  className="btn btn-danger"
  onClick={async () => {
    setChecked([]);
    setRadio([]);
    try {
      const { data } = await axios.get(`/api/v1/product/product-list/1`);
      setProducts(data?.products || []);
      setPage(1); // Reset the page to 1
    } catch (error) {
      console.log("Error resetting filters:", error);
    }
  }}
>
  RESET FILTERS
</button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div data-testid={`product-${p._id}`} className="card m-2" key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                  <h5 data-testid={`product-name-${p._id}`} className="card-title">{p.name || "No name available"}</h5>
                    <h5 className="card-title card-price">
                      {typeof p.price === 'number'
                        ? p.price.toLocaleString("en-US", { style: "currency", currency: "USD" })
                        : "No price"}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;