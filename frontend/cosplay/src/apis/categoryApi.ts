import type { CategoryModel } from "../model/CategoryModel";
import axiosClient from "./axiosClient";

export const getAllCategories = async (): Promise<CategoryModel[]> => {
    const response = await axiosClient.get("/categories");
    return response.data;
}