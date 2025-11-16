export type SuiteCRMTokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export type SuiteCRMListResponse<T> = {
  data: Array<{
    id: string;
    type: string;
    attributes: T;
  }>;
  meta?: {
    total?: number;
    next?: number | null;
  };
};

export type SuiteCRMRecordResponse<T> = {
  data: {
    id: string;
    type: string;
    attributes: T;
  };
};

export type SuiteCRMError = {
  status: number;
  detail: string;
};
