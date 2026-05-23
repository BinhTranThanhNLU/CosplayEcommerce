import type { ProductPageResponse } from "../responsemodel/ProductPageResponse";
import type { Product } from "../types/ProductDetailType";
import axiosClient from "./axiosClient";

export type ProductQueryParams = {
    keyword?: string;
    type?: string;
    categoryId?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sortBy?: string;
    sortDir?: string;
    page?: number;
    size?: number;
};

export const getAllProducts = async (
    params: ProductQueryParams = {},
): Promise<ProductPageResponse> => {
    const response = await axiosClient.get("/products", { params });
    return response.data;
}

export const getProductById = async (id: number): Promise<Product> => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
};
