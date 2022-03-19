import axios from "axios";
import { API_URL } from "../utils/constants";
import { AddItem, Item } from "../types/items";
import { ApiError, ApiResponse } from "../types/API";
import { ApiService, isApiError } from "./api.service";

class ItemsService extends ApiService {
  async getItems(): Promise<[Item[] | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.get<ApiResponse<Item[]>>(
        `${API_URL}/api/v1/items`,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      if (isApiError(err)) {
        return [null, err?.response?.data];
      }
      return [null, null];
    }
  }

  async addItem(payload: AddItem): Promise<[Item | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.post<ApiResponse<Item>>(
        `${API_URL}/api/v1/items`,
        payload,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      if (isApiError(err)) {
        return [null, err?.response?.data];
      }
      return [null, null];
    }
  }

  async deleteItem(itemId: string): Promise<ApiError | null> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      await axios.delete<void>(`${API_URL}/api/v1/items/${itemId}`, {
        headers,
      });
      return null;
    } catch (err) {
      if (isApiError(err)) {
        return err?.response?.data;
      }
      return null;
    }
  }
}

export default new ItemsService();
