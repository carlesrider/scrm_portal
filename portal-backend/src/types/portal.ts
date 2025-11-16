export type PortalUser = {
  contact_id: string;
  contact_name: string;
  contact_email?: string | null;
  username: string;
};

export type PortalJWT = PortalUser & {
  iat: number;
  exp: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
