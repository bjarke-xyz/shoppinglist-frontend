import axios from "axios";
import { ApiError, ApiResponse } from "../types/API";
import {
  AddList,
  DefaultList,
  List,
  ListItem,
  UpdateList,
  UpdatelistItem,
} from "../types/lists";
import { API_URL } from "../utils/constants";
import { ApiService, isApiError } from "./api.service";

class ListsService extends ApiService {
  async getLists(): Promise<[List[] | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.get<ApiResponse<List[]>>(
        `${API_URL}/api/v1/lists`,
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

  async getDefaultList(): Promise<[DefaultList | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.get<ApiResponse<DefaultList>>(
        `${API_URL}/api/v1/lists/default`,
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

  async setDefaultList(
    list: List
  ): Promise<[DefaultList | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.put<ApiResponse<DefaultList>>(
        `${API_URL}/api/v1/lists/${list.id}/default`,
        null,
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

  async addList(payload: AddList): Promise<[List | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.post<ApiResponse<List>>(
        `${API_URL}/api/v1/lists`,
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

  async updateList(
    payload: UpdateList
  ): Promise<[List | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.put<ApiResponse<List>>(
        `${API_URL}/api/v1/lists/${payload.id}`,
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

  async addToList(payload: {
    listId: string;
    itemId: string;
  }): Promise<[ListItem | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.post<ApiResponse<ListItem>>(
        `${API_URL}/api/v1/lists/${payload.listId}/items/${payload.itemId}`,
        null,
        { headers }
      );
      return [resp?.data?.data, null];
    } catch (err) {
      if (isApiError(err)) {
        return [null, err?.response?.data];
      }
      return [null, null];
    }
  }

  async updateListItem(
    payload: UpdatelistItem
  ): Promise<[ListItem | null, ApiError | null]> {
    try {
      const headers = this.authHeader;
      const resp = await axios.put<ApiResponse<ListItem>>(
        `${API_URL}/api/v1/lists/${payload.listId}/items/${payload.id}`,
        payload,
        { headers }
      );
      return [resp?.data?.data, null];
    } catch (err) {
      if (isApiError(err)) {
        return [null, err?.response?.data];
      }
      return [null, null];
    }
  }

  async removeFromList(payload: {
    listId: string;
    listItemId: string;
  }): Promise<ApiError | null> {
    try {
      const headers = this.authHeader;
      await axios.delete<void>(
        `${API_URL}/api/v1/lists/${payload.listId}/items/${payload.listItemId}`,
        { headers }
      );
      return null;
    } catch (err) {
      if (isApiError(err)) {
        return err?.response?.data;
      }
      return null;
    }
  }

  async deleteList(listId: string): Promise<ApiError | null> {
    try {
      const headers = this.authHeader;
      await axios.delete<void>(`${API_URL}/api/v1/lists/${listId}`, {
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

export default new ListsService();
