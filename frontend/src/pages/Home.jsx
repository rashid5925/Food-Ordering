import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Aboutus from "../components/Aboutus";
import Features from "../components/Features";
import { useEffect } from "react";
import Swal from "sweetalert2";
import API from "../axios";
import { useNavigate } from "react-router-dom";

export default function Home () {
  const navigate = useNavigate();
  useEffect(() => {
    const checkRated = async () => {
      const token = localStorage.getItem("access-token");
      if (token) {
        try {
          const response = await API.get(
            `/checkrated`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            const data = await response.data;
            if (data.rated) {
              Swal.fire({
                title: "Do you want rate your last order?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `No`,
                cancelButtonText: 'Later'
              }).then(async (result) => {
                if (result.isConfirmed) {
                  navigate('/orders');
                } else if (result.isDenied) {
                  await API.put(
                    `/cancelrating`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                }
              });
            }
          }
        } catch (error) {
        }
      }
    }
    checkRated();
  }, []);
  return(
    <>
      <Hero />
      <FeaturedProducts title={"Featured Products"} />
      <Categories />
      <Aboutus />
      <Features />
    </>
  );
}
