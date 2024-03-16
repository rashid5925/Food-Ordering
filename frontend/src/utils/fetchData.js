import { useEffect, useState } from "react"
import API from "../axios";

export const getData = (urlPath) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(urlPath);
                const data = await response.data;
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setError(true);
            }
        }
        fetchData();
    },[])
    return [products, loading, error];
}
