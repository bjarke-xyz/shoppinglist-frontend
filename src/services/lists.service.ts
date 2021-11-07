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
import { ApiService } from "./api.service";

class ListsService extends ApiService {
  private ws: WebSocket | null | undefined;

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

  async getDefaultList(): Promise<[DefaultList | null, ApiError | null]> {
    try {
      const refreshSuccess = await this.ensureFreshToken();
      if (!refreshSuccess) {
        return [null, { code: 401, error: "Token is expired" }];
      }
      const headers = this.authHeader;
      const resp = await axios.get<ApiResponse<DefaultList>>(
        `${API_URL}/api/v1/lists/default`,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async setDefaultList(
    list: List
  ): Promise<[DefaultList | null, ApiError | null]> {
    try {
      const refreshSuccess = await this.ensureFreshToken();
      if (!refreshSuccess) {
        return [null, { code: 401, error: "Token is expired" }];
      }
      const headers = this.authHeader;
      const resp = await axios.put<ApiResponse<DefaultList>>(
        `${API_URL}/api/v1/lists/${list.id}/default`,
        null,
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
    listId: string;
    itemId: string;
  }): Promise<[ListItem | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.post<ApiResponse<ListItem>>(
        `${API_URL}/api/v1/lists/${payload.listId}/items/${payload.itemId}`,
        null,
        { headers }
      );
      return [resp?.data?.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async updateListItem(
    payload: UpdatelistItem
  ): Promise<[ListItem | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.put<ApiResponse<ListItem>>(
        `${API_URL}/api/v1/lists/${payload.listId}/items/${payload.id}`,
        payload,
        { headers }
      );
      return [resp?.data?.data, null];
    } catch (err) {
      return [null, err?.response?.data];
    }
  }

  async removeFromList(payload: {
    listId: string;
    listItemId: string;
  }): Promise<ApiError | null> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      await axios.delete<void>(
        `${API_URL}/api/v1/lists/${payload.listId}/items/${payload.listItemId}`,
        { headers }
      );
      return null;
    } catch (err) {
      return err?.response?.data;
    }
  }

  async deleteList(listId: string): Promise<ApiError | null> {
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

  async defaultListWs(): Promise<WebSocket | Error> {
    try {
      if (this.ws && this.ws.readyState !== this.ws.CLOSED) {
        return this.ws;
      }
      await this.ensureFreshToken();
      const wsUrl = API_URL?.replace("http", "ws");
      const authHeaderEncoded = encodeURIComponent(
        this.authHeader?.Authorization ?? ""
      );
      this.ws = new WebSocket(
        `${wsUrl}/api/v1/lists/ws/default?Authorization=${authHeaderEncoded}`
      );
      return this.ws;
    } catch (err: any) {
      return err;
    }
  }
}

export default new ListsService();
