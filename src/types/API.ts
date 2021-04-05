export interface ApiError {
  code: number;
  error: string;
}

export interface ApiResponse<T> {
  data: T;
}
