import axios from "axios";
import { ApiError, ApiResponse } from "../types/API";
import { AddList, List, ListItem, UpdateList } from "../types/lists";
import { API_URL } from "../utils/constants";
import { ApiService } from "./api.service";

class ListsService extends ApiService {
  async getLists(): Promise<[List[] | null, ApiError | null]> {
    try {
      const refreshSuccess = await this.ensureFreshToken();
      if (!refreshSuccess) {
        return [null, { code: 401, error: "Token is expired" }];
      }
      const headers = this.authHeader;
      const resp = await axios.get<ApiResponse<List[]>>(
        `${API_URL}/api/v1/lists`,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async addList(payload: AddList): Promise<[List | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.post<ApiResponse<List>>(
        `${API_URL}/api/v1/lists`,
        payload,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async updateList(
    payload: UpdateList
  ): Promise<[List | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.put<ApiResponse<List>>(
        `${API_URL}/api/v1/lists/${payload.id}`,
        payload,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async addToList(payload: {
    listId: number;
    itemId: number;
  }): Promise<[ListItem | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.patch<ApiResponse<ListItem>>(
        `${API_URL}/api/v1/lists/add/${payload.listId}/${payload.itemId}`,
        null,
        { headers }
      );
      return [resp?.data?.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async removeFromList(payload: {
    listId: number;
    listItemId: number;
  }): Promise<ApiError | null> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      await axios.patch<void>(
        `${API_URL}/api/v1/lists/remove/${payload.listId}/${payload.listItemId}`,
        null,
        { headers }
      );
      return null;
    } catch (err) {
      return err?.response?.data;
    }
  }

  async deleteList(listId: number): Promise<ApiError | null> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      await axios.delete<void>(`${API_URL}/api/v1/lists/${listId}`, {
        headers,
      });
      return null;
    } catch (err) {
      return err?.response?.data;
    }
  }
}

export default new ListsService();
